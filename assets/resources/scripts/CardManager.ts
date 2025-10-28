const { regClass, property } = Laya;
import { BaseMonsterCard } from "./BaseMonsterCard";
import { CardConfig } from "./CardConfig";
import { GameMainManager } from "./GameMainManager";

/**
 * 卡片管理器
 * 负责管理所有卡片的生成、使用和状态，以及卡牌合成功能
 */
@regClass()
export class CardManager extends Laya.Script {

    @property(String)
    public text: string = "";

    @property(Number)
    public playerMana: number = 10; // 玩家法力值

    @property(Number)
    public maxMana: number = 10; // 最大法力值

    @property(Number)
    public cardCooldown: number = 1000; // 卡牌冷却时间（毫秒）

    // 卡片相关
    private activeCards: any[] = [];                    // 当前激活的卡片
    private cardBox: Laya.HBox = null;                 // 卡牌容器
    private currentLevel: number = 1;                   // 当前关卡
    private isCardCooldown: boolean = false;           // 是否在冷却中
    private availablePlayerCards: string[] = [];       // 当前关卡可用的玩家卡牌类型

    // 卡牌拖拽相关
    private draggedCard: any = null;                   // 当前被拖拽的卡牌
    private dragStartX: number = 0;                    // 拖拽开始的X坐标
    private dragStartTime: number = 0;                 // 拖拽开始的时间
    private isDragging: boolean = false;               // 是否正在拖拽
    private longPressDelay: number = 300;              // 长按延迟（毫秒）
    private originalZIndex: number = 0;                // 卡片原始zIndex

    onAwake(): void {
        console.log("=== CardManager 初始化 ===");
        this.cardBox = this.owner as Laya.HBox;
        this.initializeLevel(this.currentLevel);
    }

    onEnable(): void {
        console.log("CardManager 启用");
        this.setupCardEvents();
    }

    /**
     * 初始化关卡
     */
    private initializeLevel(level: number): void {
        console.log(`初始化关卡 ${level}`);

        // 获取关卡配置
        const levelConfig = CardConfig.getLevelConfig(level);
        if (!levelConfig) {
            console.error(`未找到关卡 ${level} 的配置`);
            return;
        }

        // 验证关卡配置
        const validation = CardConfig.validateLevelConfig(level);
        if (!validation.valid) {
            console.error(`关卡 ${level} 配置无效:`, validation.errors);
            return;
        }

        // 设置当前关卡可用==卡牌
        this.availablePlayerCards = [...levelConfig.playerCards];

        // 更新冷却时间
        this.cardCooldown = levelConfig.cooldownTime;

        console.log(`关卡 ${level} 可用卡牌:`, this.availablePlayerCards);
        console.log(`关卡 ${level} 冷却时间: ${this.cardCooldown}ms`);

        // 清空现有卡牌
        this.clearAllCards();

        // 生成初始卡牌（使用配置中的maxCards）
        this.generateInitialCards(levelConfig.maxCards);
    }

    /**
     * 清空所有卡牌
     */
    private clearAllCards(): void {
        // 销毁现有卡牌
        for (const card of this.activeCards) {
            if (card && card.owner) {
                card.owner.destroy();
            }
        }
        this.activeCards = [];

        // 清空CardBox中的所有子节点
        this.cardBox.removeChildren();
        console.log("已清空所有卡牌");
    }

    /**
     * 生成初始卡牌
     */
    private generateInitialCards(maxCards: number = 4): void {
        console.log(`生成初始${maxCards}张卡牌`);
        for (let i = 0; i < maxCards; i++) {
            this.generateRandomCard();
        }
    }

    /**
     * 生成随机卡牌
     */
    private generateRandomCard(): void {
        // 检查游戏是否结束
        const gameManager = GameMainManager.getInstance();
        if (gameManager && gameManager.isGameEnded()) {
            console.log("游戏已结束，停止生成卡牌");
            return;
        }

        if (this.availablePlayerCards.length === 0) {
            console.error("没有可用的卡牌类型");
            return;
        }

        // 从可用卡牌中随机选择一种类型
        const randomIndex = Math.floor(Math.random() * this.availablePlayerCards.length);
        const cardType = this.availablePlayerCards[randomIndex];

        this.createCard(cardType);
    }

    /**
     * 创建指定类型的卡牌
     */
    private createCard(cardType: string): void {
        const cardConfig = CardConfig.getCardConfig(cardType);
        if (!cardConfig) {
            console.error(`未找到卡牌类型 ${cardType} 的配置`);
            return;
        }

        console.log(`创建 ${cardType} 卡牌`);

        // 加载卡牌预制体
        Laya.loader.load(cardConfig.prefabPath).then(() => {
            const prefab = Laya.loader.getRes(cardConfig.prefabPath);
            if (!prefab) {
                console.error(`无法加载卡牌预制体: ${cardConfig.prefabPath}`);
                return;
            }

            // 实例化卡牌
            const cardSprite = Laya.Pool.getItemByCreateFun(cardType, prefab.create, prefab) as Laya.Sprite;
            cardSprite.name = `${cardType}_Card_${Date.now()}`;
            console.log(`${cardType} 精灵创建成功，名称: ${cardSprite.name}`);

            // 获取卡牌组件（预制体已挂载脚本）
            // 遍历所有组件，找到继承自BaseMonsterCard的组件
            let cardComponent: BaseMonsterCard | null = null;
            const components = cardSprite.components;
            for (let i = 0; i < components.length; i++) {
                if (components[i] instanceof BaseMonsterCard) {
                    cardComponent = components[i] as BaseMonsterCard;
                    break;
                }
            }

            if (cardComponent) {
                // 设置基础属性
                cardComponent.cardName = `${cardType}卡片`;
                cardComponent.isPlayerCard = true;
                cardComponent.manaCost = cardConfig.manaCost;
                cardComponent.monsterLevel = cardConfig.level;
                console.log(`${cardType} 组件属性设置完成`);
            }

            if (cardComponent) {
                this.activeCards.push(cardComponent);
                this.cardBox.addChild(cardSprite);

                // 确保卡牌可点击
                cardSprite.mouseEnabled = true;
                cardComponent.onCardUsedCallback = (card: any) => this.onCardUsed(card);

                // 添加拖拽事件
                cardSprite.on(Laya.Event.MOUSE_DOWN, this, this.onCardMouseDown, [cardComponent]);

                console.log(`${cardType} 卡牌创建成功，激活卡牌总数: ${this.activeCards.length}`);
            } else {
                console.error(`${cardType} 组件创建失败`);
            }
        }).catch((error) => {
            console.error(`加载 ${cardType} 卡牌预制体失败:`, error);
        });
    }

    /**
     * 设置卡片事件
     */
    private setupCardEvents(): void {
        // 卡片事件在createCard中设置
        console.log("卡片事件设置完成");
    }

    /**
     * 卡牌鼠标按下事件
     */
    private onCardMouseDown(card: any): void {
        this.draggedCard = card;
        this.dragStartX = (card.owner as Laya.Sprite).x;
        this.dragStartTime = Date.now();

        // 添加鼠标移动和释放事件
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onCardMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onCardMouseUp);
    }

    /**
     * 卡牌鼠标移动事件
     */
    private onCardMouseMove(): void {
        if (!this.draggedCard) return;

        const currentTime = Date.now();
        const elapsedTime = currentTime - this.dragStartTime;

        // 检查是否满足长按条件
        if (elapsedTime >= this.longPressDelay && !this.isDragging) {
            this.isDragging = true;
            console.log("开始拖拽卡牌");
            
            // 提升卡片的zIndex至最高
            const cardSprite = this.draggedCard.owner as Laya.Sprite;
            this.originalZIndex = cardSprite.zOrder;
            cardSprite.zOrder = 99;
        }

        // 如果正在拖拽，更新卡牌位置（只允许左右移动）
        if (this.isDragging) {
            const cardSprite = this.draggedCard.owner as Laya.Sprite;
            const deltaX = Laya.stage.mouseX - this.dragStartX;
            cardSprite.x = this.dragStartX + deltaX;
        }
    }

    /**
     * 卡牌鼠标释放事件
     */
    private onCardMouseUp(): void {
        if (!this.draggedCard) return;

        // 移除事件监听
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onCardMouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onCardMouseUp);

        // 如果正在拖拽，检查是否可以合成
        if (this.isDragging) {
            this.checkAndMergeCard(this.draggedCard);
        } else {
            // 恢复卡片的zIndex（即使没有拖拽，也要确保zIndex恢复）
            this.restoreCardZIndex(this.draggedCard);
        }

        // 重置拖拽状态
        this.isDragging = false;
        this.draggedCard = null;
    }

    /**
     * 恢复卡片的原始zIndex
     */
    private restoreCardZIndex(card: any): void {
        if (card && card.owner) {
            const cardSprite = card.owner as Laya.Sprite;
            cardSprite.zOrder = this.originalZIndex;
        }
    }

    /**
     * 检查并合成卡牌
     */
    private checkAndMergeCard(draggedCard: any): void {
        // 查找与被拖拽卡牌重合的其他卡牌
        const mergeTargetCard = this.findOverlapCard(draggedCard);

        if (!mergeTargetCard) {
            // 没有找到重合的卡牌，恢复原位
            console.log("没有找到重合的卡牌，恢复原位");
            this.resetCardPosition(draggedCard);
            this.restoreCardZIndex(draggedCard);
            return;
        }

        // 检查两张卡牌是否相同且都是1级
        if (!this.canMergeCards(draggedCard, mergeTargetCard)) {
            console.log("卡牌无法合成，恢复原位");
            this.resetCardPosition(draggedCard);
            this.restoreCardZIndex(draggedCard);
            return;
        }

        // 执行合成
        console.log(`合成卡牌: ${draggedCard.cardName} + ${mergeTargetCard.cardName}`);
        this.mergeCards(draggedCard, mergeTargetCard);
        
        // 生成新卡牌
        this.generateRandomCard();
    }

    /**
     * 查找与被拖拽卡牌重合的其他卡牌
     */
    private findOverlapCard(draggedCard: any): any {
        const draggedSprite = draggedCard.owner as Laya.Sprite;
        const draggedBounds = draggedSprite.getBounds();

        for (const card of this.activeCards) {
            if (card === draggedCard || !card.owner) continue;

            const cardSprite = card.owner as Laya.Sprite;
            const cardBounds = cardSprite.getBounds();

            // 检查是否重合
            if (this.checkBoundsOverlap(draggedBounds, cardBounds)) {
                return card;
            }
        }

        return null;
    }

    /**
     * 检查两个矩形是否重合
     */
    private checkBoundsOverlap(bounds1: any, bounds2: any): boolean {
        return !(bounds1.x + bounds1.width < bounds2.x ||
                 bounds2.x + bounds2.width < bounds1.x ||
                 bounds1.y + bounds1.height < bounds2.y ||
                 bounds2.y + bounds2.height < bounds1.y);
    }

    /**
     * 检查两张卡牌是否可以合成
     * 条件：相同类型且都是1级
     */
    private canMergeCards(card1: any, card2: any): boolean {
        // 检查卡牌类型是否相同
        if (card1.cardName !== card2.cardName) {
            console.log(`卡牌类型不同: ${card1.cardName} vs ${card2.cardName}`);
            return false;
        }

        // 检查两张卡牌是否都是1级
        if (card1.monsterLevel !== 1 || card2.monsterLevel !== 1) {
            console.log(`卡牌等级不符: ${card1.monsterLevel} vs ${card2.monsterLevel}`);
            return false;
        }

        return true;
    }

    /**
     * 合成两张卡牌
     * 被覆盖的卡牌升级为2级，被拖拽的卡牌移除
     */
    private mergeCards(draggedCard: any, targetCard: any): void {
        // 升级目标卡牌为2级
        targetCard.monsterLevel = 2;
        console.log(`${targetCard.cardName} 升级为2级`);

        // 销毁被拖拽的卡牌
        this.destroyCard(draggedCard);
    }

    /**
     * 恢复卡牌原位
     */
    private resetCardPosition(card: any): void {
        const cardSprite = card.owner as Laya.Sprite;
        // 使用Tween动画恢复到原位
        Laya.Tween.to(cardSprite, { x: this.dragStartX }, 200, Laya.Ease.quadOut);
    }

    /**
     * 卡片使用回调
     */
    public onCardUsed(card: any): void {
        console.log(`CardManager: ${card.cardName} 被使用`);

        // 通过GameMainManager扣除魔法值
        const gameManager = GameMainManager.getInstance();
        if (gameManager) {
            // 检查游戏是否结束
            if (gameManager.isGameEnded()) {
                console.log("游戏已结束，无法使用卡牌");
                return;
            }

            const success = gameManager.consumeMana(card.manaCost);
            if (!success) {
                console.log("魔法值不足，无法使用卡牌");
                return; // 魔法值不足，不执行后续操作
            }
        } else {
            console.warn("未找到GameMainManager，跳过魔法值检查");
        }

        // 销毁使用的卡牌
        this.destroyCard(card);

        // 开始冷却
        this.startCardCooldown();

        // 触发UI更新
        this.updateUI();
    }

    /**
     * 销毁卡牌
     */
    private destroyCard(card: any): void {
        // 从激活卡牌列表中移除
        const index = this.activeCards.indexOf(card);
        if (index > -1) {
            this.activeCards.splice(index, 1);
        }

        // 销毁卡牌精灵
        if (card.owner) {
            card.owner.destroy();
            console.log(`卡牌 ${card.cardName} 已销毁`);
        }
    }

    /**
     * 开始卡牌冷却
     */
    private startCardCooldown(): void {
        if (this.isCardCooldown) return;

        this.isCardCooldown = true;
        console.log(`开始卡牌冷却，时长: ${this.cardCooldown}ms`);

        // 禁用所有卡牌点击
        this.setAllCardsEnabled(false);

        // 冷却结束后生成新卡牌
        Laya.timer.once(this.cardCooldown, this, () => {
            this.isCardCooldown = false;
            this.generateRandomCard(); // 生成一张新卡牌
            this.setAllCardsEnabled(true); // 重新启用卡牌点击
            console.log("卡牌冷却结束，生成新卡牌");
        });
    }

    /**
     * 设置所有卡牌的启用状态
     */
    private setAllCardsEnabled(enabled: boolean): void {
        for (const card of this.activeCards) {
            if (card && card.setEnabled) {
                card.setEnabled(enabled);
            }
        }
    }

    /**
     * 更新UI显示
     */
    private updateUI(): void {
        // 这里可以更新法力值显示、卡片状态等
        console.log(`UI更新: 法力值 ${this.playerMana}/${this.maxMana}`);
    }

    /**
     * 获取所有卡片信息
     */
    public getAllCardsInfo(): any[] {
        return this.activeCards.map(card => card.getCardInfo());
    }

    /**
     * 根据名称获取卡片
     */
    public getCardByName(name: string): any {
        return this.activeCards.find(card => card.cardName === name);
    }

    /**
     * 检查是否可以使用卡片
     */
    public canUseCard(card: any): boolean {
        return !this.isCardCooldown && this.playerMana >= card.manaCost && card.isUsable;
    }

    /**
     * 恢复法力值
     */
    public restoreMana(amount: number): void {
        this.playerMana = Math.min(this.maxMana, this.playerMana + amount);
        console.log(`恢复法力值 ${amount}，当前: ${this.playerMana}/${this.maxMana}`);
        this.updateUI();
    }

    /**
     * 获取玩家法力值
     */
    public getPlayerMana(): number {
        return this.playerMana;
    }

    /**
     * 设置玩家法力值
     */
    public setPlayerMana(mana: number): void {
        this.playerMana = Math.max(0, Math.min(this.maxMana, mana));
        this.updateUI();
    }

    /**
     * 设置当前关卡
     */
    public setCurrentLevel(level: number): void {
        this.currentLevel = level;
        this.initializeLevel(level);
    }

    /**
     * 获取当前激活卡牌数量
     */
    public getActiveCardCount(): number {
        return this.activeCards.length;
    }

    /**
     * 是否在冷却中
     */
    public isInCooldown(): boolean {
        return this.isCardCooldown;
    }

    onDestroy(): void {
        console.log("CardManager 销毁");
        // 清理所有卡片
        this.clearAllCards();
    }
}
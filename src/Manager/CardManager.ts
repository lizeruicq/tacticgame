const { regClass, property } = Laya;
import { BaseMonsterCard } from "../Cards/BaseMonsterCard";
import { CardConfig } from "../Cards/CardConfig";
import { GameMainManager } from "./GameMainManager";
import { MonsterManager } from "./MonsterManager";

/**
 * 卡片管理器
 * 负责管理所有卡片的生成、使用和状态，以及卡牌合成功能
 */
@regClass()
export class CardManager extends Laya.Script {

    @property(String)
    public text: string = "";

    @property(Number)
    public playerMana: number = 0; // 玩家法力值

    @property(Number)
    public maxMana: number = 10; // 最大法力值

    @property(Number)
    public cardCooldown: number = 2000; // 卡牌冷却时间（毫秒）


    // 卡片相关
    private activeCards: any[] = [];                    // 当前激活的卡片
    private cardBox: Laya.HBox = null;                 // 卡牌容器
    private currentLevel: number = 0;                   // 当前关卡
    private isCardCooldown: boolean = false;           // 是否在冷却中
    private availablePlayerCards: string[] = [];       // 当前关卡可用的玩家卡牌类型

    // 卡牌拖拽相关
    private draggedCard: any = null;                   // 当前被拖拽的卡牌
    private dragStartX: number = 0;                    // 拖拽开始的世界坐标X
    private dragStartY: number = 0;                    // 拖拽开始的世界坐标Y
    private dragStartLocalX: number = 0;               // 拖拽开始的本地坐标X（用于恢复）
    private dragStartLocalY: number = 0;               // 拖拽开始的本地坐标Y（用于恢复）
    private dragStartTime: number = 0;                 // 拖拽开始的时间
    private isDragging: boolean = false;               // 是否正在拖拽
    private longPressDelay: number = 50;              // 长按延迟（毫秒）
    private originalZIndex: number = 0;                // 卡片原始zIndex
    private onLongPressCallback: () => void = null;    // 长按回调函数

    private gameManager: GameMainManager = null;
    onAwake(): void {
        console.log("=== CardManager 初始化 ===");
        this.cardBox = this.owner as Laya.HBox;
        this.currentLevel = parseInt(Laya.LocalStorage.getItem("selectedLevel"));
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
        this.gameManager = GameMainManager.getInstance();


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
        
        if (this.gameManager && this.gameManager.isGameEnded()) {
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

                // 设置卡牌初始透明度为0，用于渐显动画
                cardSprite.alpha = 0;
                this.cardBox.addChild(cardSprite);

                // 确保卡牌可点击
                cardSprite.mouseEnabled = true;
                cardComponent.onCardUsedCallback = (card: any) => this.onCardUsed(card);

                // 添加拖拽事件
                cardSprite.on(Laya.Event.MOUSE_DOWN, this, this.onCardMouseDown, [cardComponent]);

                // 播放卡牌生成动画（渐显）
                this.playCardGenerateAnimation(cardSprite);

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
        // 检查卡牌是否在冷却中，如果在冷却中则不处理
        if (this.isCardCooldown) {
            console.log("卡牌在冷却中，无法拖拽");
            return;
        }

        this.draggedCard = card;
        const cardSprite = card.owner as Laya.Sprite;
        // 保存卡片的本地坐标（用于恢复）
        this.dragStartLocalX = cardSprite.x;
        this.dragStartLocalY = cardSprite.y;
        // 获取卡片的世界坐标（相对于舞台）
        const worldPos = cardSprite.localToGlobal(new Laya.Point(0, 0));
        this.dragStartX = worldPos.x;
        this.dragStartY = worldPos.y;
        this.dragStartTime = Date.now();

        // 定义长按回调函数
        this.onLongPressCallback = () => {
            if (this.draggedCard && !this.isDragging) {
                this.gameManager.showHint("拖拽放置或者合成高级卡牌");
                const cardSprite = this.draggedCard.owner as Laya.Sprite;
                cardSprite.y = -30;
                // 显示spawnArea（透明度改为0.7）
                const spawnArea = this.gameManager.getSpawnArea();
                if (spawnArea) {
                     spawnArea.alpha = 1;
                 }
            }
        };

        // 在longPressDelay时间后显示提示
        Laya.timer.once(this.longPressDelay, this, this.onLongPressCallback);

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
            // 提升卡片的zIndex至最高
            const cardSprite = this.draggedCard.owner as Laya.Sprite;
            this.originalZIndex = cardSprite.zOrder;
            cardSprite.zOrder = 99;
            this.isDragging = true;
        }

        // 如果正在拖拽，更新卡牌位置（允许任意方向移动）
        if (this.isDragging) {
            const cardSprite = this.draggedCard.owner as Laya.Sprite;
            // 计算鼠标相对于拖拽开始位置的位移（世界坐标）
            const deltaX = Laya.stage.mouseX - this.dragStartX;
            const deltaY = Laya.stage.mouseY - this.dragStartY;
            // 计算卡牌应该移动到的世界坐标
            const newWorldX = this.dragStartX + deltaX - cardSprite.width /2;
            const newWorldY = this.dragStartY + deltaY - cardSprite.height /2;
            // 将世界坐标转换为本地坐标
            const parent = cardSprite.parent as Laya.Sprite;
            const localPos = parent.globalToLocal(new Laya.Point(newWorldX, newWorldY));
            cardSprite.x = localPos.x;
            cardSprite.y = localPos.y;
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

        // 清除长按定时器（只清除长按回调，不清除冷却定时器）
        if (this.onLongPressCallback) {
            Laya.timer.clear(this, this.onLongPressCallback);
            this.resetCardPosition(this.draggedCard);
            this.onLongPressCallback = null;
        }
         const spawnArea = this.gameManager.getSpawnArea();
            if (spawnArea) {
                spawnArea.alpha = 0;
            }

        // 如果正在拖拽，检查是否可以合成
        if (this.isDragging) {
            this.checkAndMergeCard(this.draggedCard);
            // 隐藏spawnArea（透明度改为0）
           
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
     * 检查并合成卡牌或生成怪物
     */
    private checkAndMergeCard(draggedCard: any): void {
        const cardSprite = draggedCard.owner as Laya.Sprite;
        const isInSpawnArea = this.isPositionInSpawnArea(cardSprite);
        this.playerMana = this.gameManager.getPlayerMana();
        // 如果卡牌在spawnArea范围内，生成怪物
        if (isInSpawnArea) {

             // 检查魔法值
            if (this.playerMana < draggedCard.manaCost) {
                this.gameManager.showHint("魔法值不足，无法生成怪物");
                this.resetCardPosition(draggedCard);
                    return;
                }
            else {
                this.spawnMonsterFromCard(draggedCard, cardSprite);
                this.restoreCardZIndex(draggedCard);
                return;
            }

            
        }

        // 如果不在spawnArea范围内，检查是否可以合成
        const mergeTargetCard = this.findOverlapCard(draggedCard);

        if (!mergeTargetCard) {
            // 没有找到重合的卡牌，恢复原位
            this.gameManager.showHint("释放位置不在生成区域，且未找到可合成的卡牌");
            this.resetCardPosition(draggedCard);
            this.restoreCardZIndex(draggedCard);
            return;
        }

        // 检查两张卡牌是否相同且都是1级
        if (!this.canMergeCards(draggedCard, mergeTargetCard)) {
            this.resetCardPosition(draggedCard);
            this.restoreCardZIndex(draggedCard);
            return;
        }

        if (this.playerMana < 1) {
            this.gameManager.showHint("需要至少1点法力合成卡牌");
            this.resetCardPosition(draggedCard);
            this.restoreCardZIndex(draggedCard);
            return;
        }

        // 执行合成
        this.mergeCards(draggedCard, mergeTargetCard);
        this.startCardCooldown();
    }

    /**
     * 从卡牌生成怪物
     */
    private spawnMonsterFromCard(draggedCard: any, cardSprite: Laya.Sprite): void {
        const monsterType = draggedCard.getMonsterType();
        const position = 
        { 
            x: cardSprite.localToGlobal(new Laya.Point(0, 0)).x  + cardSprite.width / 2, 
            y: cardSprite.localToGlobal(new Laya.Point(0, 0)).y + cardSprite.height / 2
         };

       
        // 消耗魔法值
        this.gameManager.consumeMana(draggedCard.manaCost);

        // 通过MonsterManager创建怪物
        const monsterManager = MonsterManager.getInstance();
        if (monsterManager) {
            monsterManager.createMonster(monsterType, true, position, draggedCard.monsterLevel)
                .then((monsterSprite: any) => {
                    if (monsterSprite) {
                        const battleField = this.gameManager.getBattleField();
                        battleField.addChild(monsterSprite);  
                    }
                });
        }
        this.playCardUseAnimation(draggedCard);
        // 销毁卡牌
        // this.destroyCard(draggedCard);

        // 启动冷却时间
        this.startCardCooldown();
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
     * 检查卡牌释放位置是否在spawnArea范围内
     */
    private isPositionInSpawnArea(cardSprite: Laya.Sprite): boolean {
        const spawnArea = this.gameManager.getSpawnArea();
        if (!spawnArea) return false;

        // 获取卡牌的世界坐标中心点
        const cardWorldPos = cardSprite.localToGlobal(new Laya.Point(cardSprite.width / 2, cardSprite.height / 2));
        const cardCenterX = cardWorldPos.x;
        const cardCenterY = cardWorldPos.y;

        // 获取spawnArea的世界坐标
        // spawnArea的锚点为(0.5, 0.5)，所以中心点就是(x, y)
        const areaWorldPos = spawnArea.localToGlobal(new Laya.Point(spawnArea.width / 2 , spawnArea.height / 2 ));
        const areaCenterX = areaWorldPos.x;
        const areaCenterY = areaWorldPos.y;
        const areaWidth = spawnArea.width;
        const areaHeight = spawnArea.height;

        // 计算spawnArea的实际边界（世界坐标）
        const areaLeft = areaCenterX - areaWidth / 2;
        const areaRight = areaCenterX + areaWidth / 2;
        const areaTop = areaCenterY - areaHeight / 2;
        const areaBottom = areaCenterY + areaHeight / 2;

        // 检查卡牌中心是否在spawnArea范围内
        return cardCenterX >= areaLeft && cardCenterX <= areaRight &&
               cardCenterY >= areaTop && cardCenterY <= areaBottom;
    }

    /**
     * 检查两张卡牌是否可以合成
     * 条件：相同类型且都是1级
     */
    private canMergeCards(card1: any, card2: any): boolean {
        // 检查卡牌类型是否相同
        if (card1.cardName !== card2.cardName) {
            this.gameManager.showHint(`卡牌类型不同`);
            return false;
        }

        // 检查两张卡牌是否都是1级
        if (card1.monsterLevel !== 1 || card2.monsterLevel !== 1) {
            this.gameManager.showHint(`卡牌等级不一致`);
            return false;
        }

        return true;
    }

    /**
     * 合成两张卡牌
     * 被覆盖的卡牌升级为2级，被拖拽的卡牌移除
     */
    private mergeCards(draggedCard: any, targetCard: any): void {
        this.gameManager.consumeMana(1);
        // 升级目标卡牌为2级
        targetCard.monsterLevel = 2;

        // 更新卡片标签
        if (targetCard.updateCardLabels) {
            targetCard.updateCardLabels();
        }

        // 更新LV2节点可见性
        if (targetCard.updateLv2Visibility) {
            targetCard.updateLv2Visibility();
        }

        // 播放合成动画（放大再缩小）
        this.playCardMergeAnimation(targetCard);

        // 销毁被拖拽的卡牌
        this.destroyCard(draggedCard);
        this.gameManager.showHint("合成成功，消耗1点魔法值")
    }

    /**
     * 恢复卡牌原位
     */
    private resetCardPosition(card: any): void {
        const cardSprite = card.owner as Laya.Sprite;
        // 使用Tween动画恢复到原位（使用本地坐标）
        Laya.Tween.to(cardSprite, { x: this.dragStartLocalX, y: this.dragStartLocalY }, 200, Laya.Ease.quadOut);
    }

    /**
     * 卡片使用回调
     */
    public onCardUsed(card: any): void {
        // 通过GameMainManager扣除魔法值
        // const gameManager = GameMainManager.getInstance();
        if (this.gameManager) {
            // 检查游戏是否结束
            if (this.gameManager.isGameEnded()) {
                console.log("游戏已结束，无法使用卡牌");
                return;
            }

            const success = this.gameManager.consumeMana(card.manaCost);
            if (!success) {
                this.gameManager.showHint("魔法值不足，无法使用卡牌");
                return; // 魔法值不足，不执行后续操作
            }
        } else {
            console.warn("未找到GameMainManager，跳过魔法值检查");
        }

        // 播放卡片使用动画（向上移动+渐隐）
        this.playCardUseAnimation(card);

        // 开始冷却
        this.startCardCooldown();

        // 触发UI更新
        this.updateUI();
    }

    /**
     * 销毁卡牌（带补位动画）
     */
    private destroyCard(card: any): void {
        // 记录销毁前所有卡牌的位置
        const positionsBefore = this.recordCardPositions();

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

        // 延迟一帧，让HBox重新排列卡牌
        Laya.timer.frameOnce(1, this, () => {
            this.animateCardPositions(positionsBefore);
        });
    }

    /**
     * 记录所有卡牌的当前位置
     */
    private recordCardPositions(): Map<any, { x: number; y: number }> {
        const positions = new Map();
        for (const card of this.activeCards) {
            if (card && card.owner) {
                const sprite = card.owner as Laya.Sprite;
                positions.set(card, { x: sprite.x, y: sprite.y });
            }
        }
        return positions;
    }

    /**
     * 为卡牌添加补位动画
     */
    private animateCardPositions(positionsBefore: Map<any, { x: number; y: number }>): void {
        for (const card of this.activeCards) {
            if (!card || !card.owner) continue;

            const sprite = card.owner as Laya.Sprite;
            const oldPos = positionsBefore.get(card);
            const newPos = { x: sprite.x, y: sprite.y };

            // 如果卡牌位置改变，播放移动动画
            if (oldPos && (oldPos.x !== newPos.x || oldPos.y !== newPos.y)) {
                // 先设置到旧位置
                sprite.x = oldPos.x;
                sprite.y = oldPos.y;

                // 然后用Tween动画移动到新位置
                Laya.Tween.to(sprite, { x: newPos.x, y: newPos.y }, 300, Laya.Ease.quadOut);
            }
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

    // /**
    //  * 获取所有卡片信息
    //  */
    // public getAllCardsInfo(): any[] {
    //     return this.activeCards.map(card => card.getCardInfo());
    // }

    // /**
    //  * 根据名称获取卡片
    //  */
    // public getCardByName(name: string): any {
    //     return this.activeCards.find(card => card.cardName === name);
    // }

    // /**
    //  * 检查是否可以使用卡片
    //  */
    // public canUseCard(card: any): boolean {
    //     return !this.isCardCooldown && this.playerMana >= card.manaCost && card.isUsable;
    // }

    // /**
    //  * 恢复法力值
    //  */
    // public restoreMana(amount: number): void {
    //     this.playerMana = Math.min(this.maxMana, this.playerMana + amount);
    //     console.log(`恢复法力值 ${amount}，当前: ${this.playerMana}/${this.maxMana}`);
    //     this.updateUI();
    // }

    /**
     * 获取玩家法力值
     */
    public getPlayerMana(): number {
        return this.playerMana;
    }

    // /**
    //  * 设置玩家法力值
    //  */
    // public setPlayerMana(mana: number): void {
    //     this.playerMana = Math.max(0, Math.min(this.maxMana, mana));
    //     this.updateUI();
    // }

    // /**
    //  * 设置当前关卡
    //  */
    // public setCurrentLevel(level: number): void {
    //     this.currentLevel = level;
    //     this.initializeLevel(level);
    // }

    // /**
    //  * 获取当前激活卡牌数量
    //  */
    // public getActiveCardCount(): number {
    //     return this.activeCards.length;
    // }

    // /**
    //  * 是否在冷却中
    //  */
    // public isInCooldown(): boolean {
    //     return this.isCardCooldown;
    // }

    /**
     * 播放卡片生成动画（渐显）
     */
    private playCardGenerateAnimation(cardSprite: Laya.Sprite): void {
        // 从透明度0渐显到1，持续300ms
        Laya.Tween.to(cardSprite, { alpha: 1 }, 300, Laya.Ease.quadOut);
    }

    /**
     * 播放卡片使用动画（向上移动+渐隐）
     */
    private playCardUseAnimation(card: any): void {
        const cardSprite = card.owner as Laya.Sprite;
        if (!cardSprite) return;

        // 获取卡片当前位置
        const startY = cardSprite.y;

        // 向上移动100像素，同时渐隐，持续400ms
        Laya.Tween.to(cardSprite, {
            y: startY - 100,
            alpha: 0
        }, 400, Laya.Ease.quadIn, Laya.Handler.create(this, () => {
            // 动画完成后销毁卡片
            this.destroyCard(card);
        }));
    }

    /**
     * 播放卡片合成动画（放大再缩小）
     */
    private playCardMergeAnimation(card: any): void {
        const cardSprite = card.owner as Laya.Sprite;
        if (!cardSprite) return;

        // 获取卡片当前的缩放值
        const originalScaleX = cardSprite.scaleX;
        const originalScaleY = cardSprite.scaleY;

        // 第一阶段：放大到1.3倍，持续200ms
        Laya.Tween.to(cardSprite, {
            scaleX: originalScaleX * 1.3,
            scaleY: originalScaleY * 1.3
        }, 200, Laya.Ease.backOut, Laya.Handler.create(this, () => {
            // 第二阶段：缩小回原来的尺寸，持续200ms
            Laya.Tween.to(cardSprite, {
                scaleX: originalScaleX,
                scaleY: originalScaleY
            }, 200, Laya.Ease.backIn);
        }));
    }

    onDisable(): void {
        // // console.log("CardManager 禁用");
        // 清理所有卡片
        this.clearAllCards();

        // 清理所有定时器
        Laya.timer.clearAll(this);

        // 移除鼠标事件监听
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onCardMouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onCardMouseUp);
    }
}
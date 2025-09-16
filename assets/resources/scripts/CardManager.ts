const { regClass, property } = Laya;
import { RockCard } from "./RockCard";

/**
 * 卡片管理器
 * 负责管理所有卡片的生成、使用和状态
 */
@regClass()
export class CardManager extends Laya.Script {

    @property(String)
    public text: string = "";

    @property(Number)
    public playerMana: number = 10; // 玩家法力值

    @property(Number)
    public maxMana: number = 10; // 最大法力值

    // 卡片列表
    private cards: any[] = [];
    private spawnedSprites: Laya.Sprite[] = []; // 已生成的精灵列表

    onAwake(): void {
        console.log("=== CardManager 初始化 ===");
        this.initializeCards();
    }

    onEnable(): void {
        console.log("CardManager 启用");
        this.setupCardEvents();
    }

    /**
     * 初始化卡片
     */
    private initializeCards(): void {
        // 获取所有子节点卡片
        const cardBox = this.owner as Laya.HBox;

        for (let i = 0; i < cardBox.numChildren; i++) {
            const cardNode = cardBox.getChildAt(i);
            console.log(`发现卡片节点: ${cardNode.name}`);

            // 为Rock卡片添加RockCard组件
            if (cardNode.name === "card" || cardNode.name.includes("rock")) {
                const rockCard = cardNode.addComponent(RockCard);
                rockCard.cardName = `Rock卡片_${i + 1}`;
                rockCard.rockLevel = 1;
                rockCard.isPlayerCard = true;

                this.cards.push(rockCard);
                console.log(`添加了 ${rockCard.cardName} 组件`);
            }
        }

        console.log(`总共初始化了 ${this.cards.length} 张卡片`);
    }

    /**
     * 设置卡片事件
     */
    private setupCardEvents(): void {
        // 这里可以设置全局卡片事件监听
        console.log("卡片事件设置完成");
    }

    /**
     * 卡片使用回调
     */
    public onCardUsed(card: any): void {
        console.log(`CardManager: ${card.cardName} 被使用`);

        // 扣除法力值
        this.playerMana = Math.max(0, this.playerMana - card.manaCost);
        console.log(`剩余法力值: ${this.playerMana}/${this.maxMana}`);

        // 记录生成的精灵（如果有的话）
        // 这里可以添加更多的卡片使用后处理逻辑

        // 触发UI更新
        this.updateUI();
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
        return this.cards.map(card => card.getCardInfo());
    }

    /**
     * 根据名称获取卡片
     */
    public getCardByName(name: string): any {
        return this.cards.find(card => card.cardName === name);
    }

    /**
     * 检查是否可以使用卡片
     */
    public canUseCard(card: any): boolean {
        return this.playerMana >= card.manaCost && card.isUsable;
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

    onDestroy(): void {
        console.log("CardManager 销毁");
        // 清理所有卡片
        this.cards = [];
        this.spawnedSprites = [];
    }
}
const { regClass, property } = Laya;
import { BaseMonsterCard } from "./BaseMonsterCard";

/**
 * Goblin卡片脚本
 * 继承自BaseMonsterCard，实现Goblin特有的属性和行为
 */
@regClass()
export class GoblinCard extends BaseMonsterCard {

    constructor() {
        super();
        // 设置Goblin卡片的默认属性
        this.cardName = "Goblin卡片";
        this.manaCost = 3;
        this.monsterPrefabPath = "res://fd485021-de92-48d9-83d4-8e3384fed8cf";
    }

    // ========== 实现抽象方法 ==========

    /**
     * 生成怪物（实现父类抽象方法）
     */
    protected spawnMonster(): void {
        console.log(`开始生成 ${this.cardName} 预制体`);

        // 计算生成位置
        const spawnPosition = this.calculateSpawnPosition();

        // 使用父类方法创建怪物
        this.createMonsterWithManager(this.getMonsterType(), spawnPosition);
    }

    /**
     * 获取怪物类型名称（实现父类抽象方法）
     */
    public getMonsterType(): string {
        return "Goblin";
    }

    // ========== Goblin特有方法 ==========

    /**
     * 设置等级
     */
    public setLevel(level: number): void {
        this.monsterLevel = level;
    }

    /**
     * 获取等级
     */
    public getLevel(): number {
        return this.monsterLevel;
    }

    /**
     * 重写获取卡片信息，添加Goblin特有信息
     */
    public getCardInfo(): any {
        const baseInfo = super.getCardInfo();
        return {
            ...baseInfo,
            goblinLevel: this.monsterLevel
        };
    }

}


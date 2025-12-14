const { regClass, property } = Laya;
import { BaseMonsterCard } from "./BaseMonsterCard";

/**
 * Troll卡片脚本
 * 继承自BaseMonsterCard，实现Troll特有的属性和行为
 */
@regClass()
export class TrollCard extends BaseMonsterCard {

    constructor() {
        super();
        // 设置Troll卡片的默认属性
        this.cardName = "Troll卡片";
        this.manaCost = 3;
        this.monsterPrefabPath = "res://ae5e0b05-ba36-47fa-992c-0f0fa3adeb53";
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
        return "Troll";
    }

    // ========== Troll特有方法 ==========

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
     * 重写获取卡片信息，添加Troll特有信息
     */
    public getCardInfo(): any {
        const baseInfo = super.getCardInfo();
        return {
            ...baseInfo,
            trollLevel: this.monsterLevel
        };
    }

}


const { regClass, property } = Laya;
import { BaseMonsterCard } from "./BaseMonsterCard";

/**
 * Sailor卡片脚本
 * 继承自BaseMonsterCard，实现Sailor特有的属性和行为
 */
@regClass()
export class SailorCard extends BaseMonsterCard {

    constructor() {
        super();
        // 设置Sailor卡片的默认属性
        this.cardName = "Sailor卡片";
        this.manaCost = 3;
        this.monsterPrefabPath = "res://1ebf4fd9-638e-4505-b654-f801deba9f73";
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
        return "Sailor";
    }

    // ========== Sailor特有方法 ==========

    /**
     * 设置等级
     */
    public setLevel(level: number): void {
        this.monsterLevel = level;
    }
}


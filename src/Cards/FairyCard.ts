const { regClass, property } = Laya;
import { BaseMonsterCard } from "./BaseMonsterCard";

/**
 * Fairy卡片脚本
 * 继承自BaseMonsterCard，实现Fairy特有的属性和行为
 */
@regClass()
export class FairyCard extends BaseMonsterCard {

    constructor() {
        super();
        // 设置Fairy卡片的默认属性
        this.cardName = "Fairy卡片";
        this.manaCost = 3;
        this.monsterPrefabPath = "res://3ba5f627-8b63-4f9f-9f10-4651a5728d01";
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
        return "Fairy";
    }

    // ========== Fairy特有方法 ==========

    /**
     * 设置等级
     */
    public setLevel(level: number): void {
        this.monsterLevel = level;
    }
}


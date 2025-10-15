const { regClass, property } = Laya;
import { BaseMonsterCard } from "./BaseMonsterCard";

/**
 * Rock卡片脚本
 * 继承自BaseMonsterCard，实现Rock特有的属性和行为
 */
@regClass()
export class RockCard extends BaseMonsterCard {

    @property(Number)
    public rockLevel: number = 1; // Rock等级

    constructor() {
        super();
        // 设置Rock卡片的默认属性
        this.cardName = "Rock卡片";
        this.manaCost = 3;
        this.monsterPrefabPath = "prefabs/monster/Rock.lh";
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
        return "Rock";
    }

    // ========== Rock特有方法 ==========

    /**
     * 设置Rock等级
     */
    public setRockLevel(level: number): void {
        this.rockLevel = level;
        this.monsterLevel = level; // 同步到父类属性
    }

    /**
     * 获取Rock等级
     */
    public getRockLevel(): number {
        return this.rockLevel;
    }

    /**
     * 重写获取卡片信息，添加Rock特有信息
     */
    public getCardInfo(): any {
        const baseInfo = super.getCardInfo();
        return {
            ...baseInfo,
            rockLevel: this.rockLevel
        };
    }

}

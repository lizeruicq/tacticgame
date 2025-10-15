const { regClass, property } = Laya;
import { BaseMonsterCard } from "./BaseMonsterCard";

/**
 * Pastor卡片脚本
 * 继承自BaseMonsterCard，实现Pastor特有的属性和行为
 */
@regClass()
export class PastorCard extends BaseMonsterCard {

    @property(Number)
    public pastorLevel: number = 1; // Pastor等级

    constructor() {
        super();
        // 设置Pastor卡片的默认属性
        this.cardName = "Pastor卡片";
        this.manaCost = 2; // 治疗型单位，法力消耗较低
        this.monsterPrefabPath = "prefabs/monster/Pastor.lh";
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
        return "Pastor";
    }

    // ========== Pastor特有方法 ==========

    /**
     * 设置Pastor等级
     */
    public setPastorLevel(level: number): void {
        this.pastorLevel = level;
        this.monsterLevel = level; // 同步到父类属性
    }

    /**
     * 获取Pastor等级
     */
    public getPastorLevel(): number {
        return this.pastorLevel;
    }

    /**
     * 重写获取卡片信息，添加Pastor特有信息
     */
    public getCardInfo(): any {
        const baseInfo = super.getCardInfo();
        return {
            ...baseInfo,
            pastorLevel: this.pastorLevel
        };
    }

}

const { regClass, property } = Laya;
import { BaseMonsterCard } from "./BaseMonsterCard";

/**
 * Wizard卡片脚本
 * 继承自BaseMonsterCard，实现Wizard特有的属性和行为
 */
@regClass()
export class WizardCard extends BaseMonsterCard {

    constructor() {
        super();
        // 设置Wizard卡片的默认属性
        this.cardName = "Wizard卡片";
        this.manaCost = 2; // 比Rock稍高
        this.monsterPrefabPath = "prefabs/monster/Wizard.lh";
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
        return "Wizard";
    }

    // ========== Wizard特有方法 ==========

    /**
     * 设置Wizard等级
     */
    public setLevel(level: number): void {
        this.monsterLevel = level;
    }

    /**
     * 获取Wizard等级
     */
    public getLevel(): number {
        return this.monsterLevel;
    }

    /**
     * 重写获取卡片信息，添加Wizard特有信息
     */
    public getCardInfo(): any {
        const baseInfo = super.getCardInfo();
        return {
            ...baseInfo,
            wizardLevel: this.monsterLevel
        };
    }

}

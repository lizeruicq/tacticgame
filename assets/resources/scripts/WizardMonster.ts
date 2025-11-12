const { regClass, property } = Laya;
import { BaseMonster, IMonsterStats } from "./BaseMonster";
import { WizardAnimationManager } from "./WizardAnimationManager";

/**
 * Wizard怪物类
 * 继承自BaseMonster，实现Wizard特有的属性和行为
 * 特点：攻击范围比Rock更大，适合远程攻击
 */
@regClass()
export class WizardMonster extends BaseMonster {
    
    // ========== Wizard特有属性 ==========
    
    // Wizard的动画管理器引用
    private wizardAnimationManager: WizardAnimationManager | null = null;
    
    // ========== 实现抽象方法 ==========
    
    /**
     * 初始化Wizard怪物属性
     */
    protected initializeMonster(): void {
        // 根据等级设置Wizard的基础属性
        this.monsterStats = this.calculateWizardStats();
        
        // console.log(`Wizard怪物初始化 - 等级: ${this.monsterLevel}`, this.monsterStats);
    }
    
    /**
     * 获取动画管理器组件
     */
    protected getAnimationManagerComponent(): any {
        this.wizardAnimationManager = this.owner.getComponent(WizardAnimationManager);
        return this.wizardAnimationManager;
    }
    
    // ========== Wizard特有方法 ==========
    
    /**
     * 根据等级计算Wizard属性
     */
    private calculateWizardStats(): IMonsterStats {
        const baseStats: IMonsterStats = {
            speed: 60,           // Wizard移动较慢（法师特点）
            attackPower: 30,     // Wizard攻击力较高（魔法攻击）
            attackSpeed: 1200,   // Wizard攻击速度中等
            attackRange: 400,    // Wizard攻击范围很大（远程攻击）
            maxHealth: 120       // Wizard血量中等（脆皮法师）
        };
        
        // 根据等级调整属性
        const levelMultiplier = 1 + (this.monsterLevel - 1) * 0.2; // 每级增加20%
        
        return {
            speed: Math.floor(baseStats.speed * levelMultiplier),
            attackPower: Math.floor(baseStats.attackPower * levelMultiplier),
            attackSpeed: Math.max(600, Math.floor(baseStats.attackSpeed / levelMultiplier)), // 攻击速度上限
            attackRange: Math.floor(baseStats.attackRange * (1 + (this.monsterLevel - 1) * 0.15)), // 攻击范围较大幅增长
            maxHealth: Math.floor(baseStats.maxHealth * levelMultiplier)
        };
    }
    
    // ========== 重写基类方法 ==========
    
    /**
     * 重写怪物特有的死亡处理
     */
    protected onMonsterSpecificDeath(): void {
        // console.log("Wizard法师倒下了...");

        // Wizard死亡时的特殊效果
        this.createDeathEffect();
    }

    // ========== Wizard特有行为 ==========

    /**
     * 创建死亡特效
     */
    private createDeathEffect(): void {
        // console.log("💫 Wizard死亡魔法特效播放");

        // 可以添加死亡时的魔法消散效果
        // 例如：魔法能量散发、光芒消失等
    }


    
    // ========== 公共接口 ==========
    
    /**
     * 设置等级（重写基类方法）
     */
    public setLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.monsterLevel = level;
        
        // 重新计算属性
        this.monsterStats = this.calculateWizardStats();
        this.currentHealth = this.monsterStats.maxHealth; // 重置血量
        
        // console.log(`Wizard等级设置为: ${this.monsterLevel}`, this.monsterStats);
    }
    
    /**
     * 获取等级
     */
    public getLevel(): number {
        return this.monsterLevel;
    }
    
    /**
     * 获取Wizard的详细信息
     */
    public getWizardInfo(): any {
        return {
            name: "Wizard",
            level: this.monsterLevel,
            camp: this.isPlayerCamp ? "Player" : "Enemy",
            health: `${this.currentHealth}/${this.monsterStats.maxHealth}`,
            attackPower: this.monsterStats.attackPower,
            attackRange: this.monsterStats.attackRange,
            speed: this.monsterStats.speed,
            state: this.currentState
        };
    }
    
    /**
     * 检查是否可以攻击指定目标（考虑Wizard的远程特性）
     */
    public canAttackTarget(target: any): boolean {
        if (!target || !target.owner) return false;
        
        const targetSprite = target.owner as Laya.Sprite;
        const distance = this.getDistanceToPosition(targetSprite.x, targetSprite.y);
        
        // Wizard可以攻击更远的目标
        return distance <= this.monsterStats.attackRange;
    }
    
    // ========== 调试方法 ==========
    
    /**
     * 输出Wizard状态信息（调试用）
     */
    public debugWizardStatus(): void {
        // console.log("=== Wizard状态信息 ===");
        // console.log(`等级: ${this.monsterLevel}`);
        // console.log(`生命值: ${this.currentHealth}/${this.monsterStats.maxHealth}`);
        // console.log(`攻击力: ${this.monsterStats.attackPower}`);
        // console.log(`攻击范围: ${this.monsterStats.attackRange}`);
        // console.log(`移动速度: ${this.monsterStats.speed}`);
        // console.log(`当前状态: ${this.currentState}`);
        // console.log(`阵营: ${this.isPlayerCamp ? "玩家" : "敌方"}`);
        
        if (this.currentTarget) {
            const targetSprite = this.currentTarget.owner as Laya.Sprite;
            const distance = this.getDistanceToPosition(targetSprite.x, targetSprite.y);
            // console.log(`目标距离: ${distance.toFixed(1)}`);
        }
    }
}

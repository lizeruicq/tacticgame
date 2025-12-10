const { regClass, property } = Laya;
import { BaseMonster, IMonsterStats, MonsterState } from "../BaseMonster";
import { SailorAnimationManager } from "./SailorAnimationManager";
import { Castle } from "../Castle";

/**
 * Sailor怪物类
 * 继承自BaseMonster，实现Sailor特有的属性和行为
 */
@regClass()
export class SailorMonster extends BaseMonster {
    
    // Sailor的动画管理器引用
    private sailorAnimationManager: SailorAnimationManager | null = null;
    
    // ========== 实现抽象方法 ==========

    /**
     * 获取怪物类型
     */
    public getMonsterType(): string {
        return "Sailor";
    }

    /**
     * 初始化Sailor怪物属性
     */
    protected initializeMonster(): void {
        // 根据等级设置Sailor的基础属性
        this.monsterStats = this.calculateSailorStats();
    }
    
    /**
     * 获取动画管理器组件
     */
    protected getAnimationManagerComponent(): any {
        this.sailorAnimationManager = this.owner.getComponent(SailorAnimationManager);
        return this.sailorAnimationManager;
    }
    
    // ========== Sailor特有方法 ==========
    
    /**
     * 根据等级计算Sailor属性
     */
    private calculateSailorStats(): IMonsterStats {
        const baseStats: IMonsterStats = {
            speed: 120,           // Sailor移动较慢
            attackPower: 20,     // Sailor攻击力较高
            attackSpeed: 2000,   // Sailor攻击速度较慢
            attackRange: 500,     // Sailor攻击范围中等
            maxHealth: 50       // Sailor血量较高
        };
        
        // 根据等级调整属性
        const levelMultiplier = 1 + (this.monsterLevel - 1) * 0.2; // 每级增加20%
        
        return {
            speed: baseStats.speed,
            attackPower: Math.floor(baseStats.attackPower * levelMultiplier),
            attackSpeed: Math.max(800, Math.floor(baseStats.attackSpeed)), // 攻击速度上限
            attackRange: Math.floor(baseStats.attackRange * (1 + (this.monsterLevel - 1) * 0.1)), // 攻击范围小幅增长
            maxHealth: Math.floor(baseStats.maxHealth * levelMultiplier)
        };
    }
    
    // ========== 重写基类方法 ==========
    
    /**
     * 重写状态切换处理
     */
    protected onStateChange(oldState: MonsterState, newState: MonsterState): void {
        super.onStateChange(oldState, newState);
        
        // Sailor特有的状态切换逻辑
        switch (newState) {
            case MonsterState.ATTACKING:
                break;
            case MonsterState.DYING:
                break;
        }
    }
    
    /**
     * 重写攻击执行完成事件
     */
    protected onAttackPerformed(target: BaseMonster | Castle): void {
        super.onAttackPerformed(target);

        const targetName = target instanceof BaseMonster ? target.constructor.name : 'Castle';

        // Sailor攻击后有短暂的硬直时间
        // this.addAttackCooldown();
    }
    
    /**
     * 重写怪物特有的死亡处理
     */
    protected onMonsterSpecificDeath(): void {
        // Sailor死亡时的特殊效果
        this.createDeathEffect();
    }
    
    /**
     * 添加攻击冷却
     */
    // private addAttackCooldown(): void {
    //     // Sailor攻击后有额外的冷却时间
    //     this.lastAttackTime += 200; // 额外200ms冷却
    // }
    
    /**
     * 创建死亡效果
     */
    private createDeathEffect(): void {
       
    }
    
    // ========== 公共接口 ==========
    
    /**
     * 设置Sailor等级
     */
    public setLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.monsterLevel = level;
        
        // 重新计算属性
        const oldMaxHealth = this.monsterStats.maxHealth;
        this.monsterStats = this.calculateSailorStats();
        
        // 按比例调整当前血量
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.monsterStats.maxHealth * healthRatio);
    }
    
    /**
     * 获取Sailor等级
     */
    public getLevel(): number {
        return this.monsterLevel;
    }
}


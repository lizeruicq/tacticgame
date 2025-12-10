const { regClass, property } = Laya;
import { BaseMonster, IMonsterStats, MonsterState } from "../BaseMonster";
import { FairyAnimationManager } from "./FairyAnimationManager";
import { Castle } from "../Castle";

/**
 * Fairy怪物类
 * 继承自BaseMonster，实现Fairy特有的属性和行为
 */
@regClass()
export class FairyMonster extends BaseMonster {
    
    // Fairy的动画管理器引用
    private fairyAnimationManager: FairyAnimationManager | null = null;
    
    // ========== 实现抽象方法 ==========

    /**
     * 获取怪物类型
     */
    public getMonsterType(): string {
        return "Fairy";
    }

    /**
     * 初始化Fairy怪物属性
     */
    protected initializeMonster(): void {
        // 根据等级设置Fairy的基础属性
        this.monsterStats = this.calculateFairyStats();
    }
    
    /**
     * 获取动画管理器组件
     */
    protected getAnimationManagerComponent(): any {
        this.fairyAnimationManager = this.owner.getComponent(FairyAnimationManager);
        return this.fairyAnimationManager;
    }
    
    // ========== Fairy特有方法 ==========
    
    /**
     * 根据等级计算Fairy属性
     */
    private calculateFairyStats(): IMonsterStats {
        const baseStats: IMonsterStats = {
            speed: 100,           // Fairy移动较慢
            attackPower: 30,     // Fairy攻击力较高
            attackSpeed: 2000,   // Fairy攻击速度较慢
            attackRange: 300,     // Fairy攻击范围中等
            maxHealth: 30       // Fairy血量较高
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
        
        // Fairy特有的状态切换逻辑
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

        // 对怪物目标施加冻结效果（使用freeze.lh预制体）
        if (target instanceof BaseMonster) {
            target.freeze(2000, BaseMonster.FROZEN_EFFECT_PREFAB_PATH_FREEZE);
        }

        // Fairy攻击后有短暂的硬直时间
        // this.addAttackCooldown();
    }
    
    /**
     * 重写怪物特有的死亡处理
     */
    protected onMonsterSpecificDeath(): void {
        // Fairy死亡时的特殊效果
        this.createDeathEffect();
    }
    
    /**
     * 添加攻击冷却
     */
    private addAttackCooldown(): void {
        // Fairy攻击后有额外的冷却时间
        // this.lastAttackTime += 200; // 额外200ms冷却
    }
    
    /**
     * 创建死亡效果
     */
    private createDeathEffect(): void {
       
    }
    
    // ========== 公共接口 ==========
    
    /**
     * 设置Fairy等级
     */
    public setLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.monsterLevel = level;
        
        // 重新计算属性
        const oldMaxHealth = this.monsterStats.maxHealth;
        this.monsterStats = this.calculateFairyStats();
        
        // 按比例调整当前血量
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.monsterStats.maxHealth * healthRatio);
    }
    
    /**
     * 获取Fairy等级
     */
    public getLevel(): number {
        return this.monsterLevel;
    }
}


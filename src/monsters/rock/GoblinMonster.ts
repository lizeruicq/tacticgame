const { regClass, property } = Laya;
import { BaseMonster, IMonsterStats, MonsterState } from "../BaseMonster";
import { GoblinAnimationManager } from "./GoblinAnimationManager";
import { Castle } from "../Castle";

/**
 * Goblin怪物类
 * 继承自BaseMonster，实现Goblin特有的属性和行为
 */
@regClass()
export class GoblinMonster extends BaseMonster {
    
    // Goblin的动画管理器引用
    private goblinAnimationManager: GoblinAnimationManager | null = null;
    
    // ========== 实现抽象方法 ==========

    /**
     * 获取怪物类型
     */
    public getMonsterType(): string {
        return "Goblin";
    }

    /**
     * 初始化Goblin怪物属性
     */
    protected initializeMonster(): void {
        // 根据等级设置Goblin的基础属性
        this.monsterStats = this.calculateGoblinStats();
    }
    
    /**
     * 获取动画管理器组件
     */
    protected getAnimationManagerComponent(): any {
        this.goblinAnimationManager = this.owner.getComponent(GoblinAnimationManager);
        return this.goblinAnimationManager;
    }
    
    // ========== Goblin特有方法 ==========
    
    /**
     * 根据等级计算Goblin属性
     */
    private calculateGoblinStats(): IMonsterStats {
        const baseStats: IMonsterStats = {
            speed: 80,           // Goblin移动较慢
            attackPower: 25,     // Goblin攻击力较高
            attackSpeed: 1500,   // Goblin攻击速度较慢
            attackRange: 80,     // Goblin攻击范围中等
            maxHealth: 150       // Goblin血量较高
        };
        
        // 根据等级调整属性
        const levelMultiplier = 1 + (this.monsterLevel - 1) * 0.2; // 每级增加20%
        
        return {
            speed: Math.floor(baseStats.speed * levelMultiplier),
            attackPower: Math.floor(baseStats.attackPower * levelMultiplier),
            attackSpeed: Math.max(800, Math.floor(baseStats.attackSpeed / levelMultiplier)), // 攻击速度上限
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
        
        // Goblin特有的状态切换逻辑
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

        // Goblin攻击后有短暂的硬直时间
        this.addAttackCooldown();
    }
    
    /**
     * 重写怪物特有的死亡处理
     */
    protected onMonsterSpecificDeath(): void {
        // Goblin死亡时的特殊效果
        this.createDeathEffect();
    }
    
    /**
     * 添加攻击冷却
     */
    private addAttackCooldown(): void {
        // Goblin攻击后有额外的冷却时间
        this.lastAttackTime += 200; // 额外200ms冷却
    }
    
    /**
     * 创建死亡效果
     */
    private createDeathEffect(): void {
       
    }
    
    // ========== 公共接口 ==========
    
    /**
     * 设置Goblin等级
     */
    public setLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.monsterLevel = level;
        
        // 重新计算属性
        const oldMaxHealth = this.monsterStats.maxHealth;
        this.monsterStats = this.calculateGoblinStats();
        
        // 按比例调整当前血量
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.monsterStats.maxHealth * healthRatio);
    }
    
    /**
     * 获取Goblin等级
     */
    public getLevel(): number {
        return this.monsterLevel;
    }
}


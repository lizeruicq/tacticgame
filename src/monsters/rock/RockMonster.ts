const { regClass, property } = Laya;
import { BaseMonster, IMonsterStats, MonsterState } from "../BaseMonster";
import { RockAnimationManager } from "./RockAnimationManager";
import { Castle } from "../Castle";

/**
 * Rock怪物类
 * 继承自BaseMonster，实现Rock特有的属性和行为
 */
@regClass()
export class RockMonster extends BaseMonster {
    
    // ========== Rock特有属性 ==========
    
    // @property({ type: Boolean })
    // public canCounterAttack: boolean = true;  // 是否可以反击
    
    // Rock的动画管理器引用
    private rockAnimationManager: RockAnimationManager | null = null;
    
    // ========== 实现抽象方法 ==========

    /**
     * 获取怪物类型
     */
    public getMonsterType(): string {
        return "Rock";
    }

    /**
     * 初始化Rock怪物属性
     */
    protected initializeMonster(): void {
        // 根据等级设置Rock的基础属性
        this.monsterStats = this.calculateRockStats();
        
    }
    
    /**
     * 获取动画管理器组件
     */
    protected getAnimationManagerComponent(): any {
        this.rockAnimationManager = this.owner.getComponent(RockAnimationManager);
        return this.rockAnimationManager;
    }
    
    // ========== Rock特有方法 ==========
    
    /**
     * 根据等级计算Rock属性
     */
    private calculateRockStats(): IMonsterStats {
        const baseStats: IMonsterStats = {
            speed: 80,           // Rock移动较慢
            attackPower: 25,     // Rock攻击力较高
            attackSpeed: 1500,   // Rock攻击速度较慢
            attackRange: 80,    // Rock攻击范围中等
            maxHealth: 150       // Rock血量较高
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
        
        // Rock特有的状态切换逻辑
        switch (newState) {
            case MonsterState.ATTACKING:
                // console.log(`Rock开始攻击，目标: ${this.currentTarget?.constructor.name}`);
                break;
            case MonsterState.DYING:
                // console.log("Rock开始死亡动画");
                break;
        }
    }
    
    /**
     * 重写攻击执行完成事件
     */
    protected onAttackPerformed(target: BaseMonster | Castle): void {
        super.onAttackPerformed(target);

        const targetName = target instanceof BaseMonster ? target.constructor.name : 'Castle';
        // console.log(`Rock攻击完成，对 ${targetName} 造成 ${this.monsterStats.attackPower} 点伤害`);

        // Rock攻击后有短暂的硬直时间
        this.addAttackCooldown();
    }
    
   
    
    /**
     * 重写怪物特有的死亡处理
     */
    protected onMonsterSpecificDeath(): void {
        // console.log("Rock死亡，可能掉落石头资源");

        // Rock死亡时的特殊效果
        this.createDeathEffect();
    }
    
    

    
    /**
     * 添加攻击冷却
     */
    private addAttackCooldown(): void {
        // Rock攻击后有额外的冷却时间
        this.lastAttackTime += 200; // 额外200ms冷却
    }
    
    /**
     * 创建死亡效果
     */
    private createDeathEffect(): void {
       
    }
    

    
    // ========== 公共接口 ==========
    
    /**
     * 设置Rock等级
     */
    public setLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.monsterLevel = level;
        
        // 重新计算属性
        const oldMaxHealth = this.monsterStats.maxHealth;
        this.monsterStats = this.calculateRockStats();
        
        // 按比例调整当前血量
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.monsterStats.maxHealth * healthRatio);
        
        // console.log(`Rock等级设置为 ${level}，属性已更新`);
    }
    
    /**
     * 获取Rock等级
     */
    public getLevel(): number {
        return this.monsterLevel;
    }
    
    /**
     * 设置反击能力
     */
    // public setCounterAttackEnabled(enabled: boolean): void {
    //     this.canCounterAttack = enabled;
    // console.log(`Rock反击能力: ${enabled ? "启用" : "禁用"}`);
    // }
    
    /**
     * 检查是否可以反击
     */
    // public canPerformCounterAttack(): boolean {
    //     return this.canCounterAttack && !this.isDead && this.currentState !== MonsterState.ATTACKING;
    // }
    
    /**
     * 强制触发攻击（用于测试或特殊情况）
     */
    // public forceAttack(target: BaseMonster): void {
    //     if (this.isDead) return;
        
    //     this.setTarget(target);
    //     this.changeState(MonsterState.ATTACKING);
    // console.log(`Rock强制攻击: ${target.constructor.name}`);
    // }
    
}

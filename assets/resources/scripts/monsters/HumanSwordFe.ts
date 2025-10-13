const { regClass, property } = Laya;
import { BaseMonster, IMonsterStats, MonsterState } from "../BaseMonster";
import { SwordFeAnimationManager } from "./SwordFeAnimationManager";
import { Castle } from "../Castle";

/**
 * SwordFe怪物类
 * 继承自BaseMonster，实现SwordFe特有的属性和行为
 */
@regClass()
export class HumanSwordFe extends BaseMonster {
    
    // ========== SwordFe特有属性 ==========
    
    @property({ type: Number })
    public SwordFeLevel: number = 1;  // SwordFe等级，影响属性
    
    // @property({ type: Boolean })
    // public canCounterAttack: boolean = true;  // 是否可以反击
    
    // SwordFe的动画管理器引用
    private SwordFeAnimationManager: SwordFeAnimationManager | null = null;
    
    // ========== 实现抽象方法 ==========
    
    /**
     * 初始化SwordFe怪物属性
     */
    protected initializeMonster(): void {
        // 根据等级设置SwordFe的基础属性
        this.monsterStats = this.calculateSwordFeStats();
        
        console.log(`SwordFe初始化 - 等级: ${this.SwordFeLevel}`, this.monsterStats);
    }
    
    /**
     * 获取动画管理器组件
     */
    protected getAnimationManagerComponent(): any {
        this.SwordFeAnimationManager = this.owner.getComponent(SwordFeAnimationManager);
        return this.SwordFeAnimationManager;
    }
    
    // ========== SwordFe特有方法 ==========
    
    /**
     * 根据等级计算SwordFe属性
     */
    private calculateSwordFeStats(): IMonsterStats {
        const baseStats: IMonsterStats = {
            speed: 80,           // SwordFe移动较慢
            attackPower: 25,     // SwordFe攻击力较高
            attackSpeed: 1500,   // SwordFe攻击速度较慢
            attackRange: 120,    // SwordFe攻击范围中等
            maxHealth: 150       // SwordFe血量较高
        };
        
        // 根据等级调整属性
        const levelMultiplier = 1 + (this.SwordFeLevel - 1) * 0.2; // 每级增加20%
        
        return {
            speed: Math.floor(baseStats.speed * levelMultiplier),
            attackPower: Math.floor(baseStats.attackPower * levelMultiplier),
            attackSpeed: Math.max(800, Math.floor(baseStats.attackSpeed / levelMultiplier)), // 攻击速度上限
            attackRange: Math.floor(baseStats.attackRange * (1 + (this.SwordFeLevel - 1) * 0.1)), // 攻击范围小幅增长
            maxHealth: Math.floor(baseStats.maxHealth * levelMultiplier)
        };
    }
    
    // ========== 重写基类方法 ==========
    
    /**
     * 重写状态切换处理
     */
    protected onStateChange(oldState: MonsterState, newState: MonsterState): void {
        super.onStateChange(oldState, newState);
        
        // SwordFe特有的状态切换逻辑
        switch (newState) {
            case MonsterState.ATTACKING:
                console.log(`SwordFe开始攻击，目标: ${this.currentTarget?.constructor.name}`);
                break;
            case MonsterState.DYING:
                console.log("SwordFe开始死亡动画");
                break;
        }
    }
    
    /**
     * 重写攻击执行完成事件
     */
    protected onAttackPerformed(target: BaseMonster | Castle): void {
        super.onAttackPerformed(target);

        const targetName = target instanceof BaseMonster ? target.constructor.name : 'Castle';
        console.log(`SwordFe攻击完成，对 ${targetName} 造成 ${this.monsterStats.attackPower} 点伤害`);

        // SwordFe攻击后有短暂的硬直时间
        this.addAttackCooldown();
    }
    
  
    /**
     * 重写怪物特有的死亡处理
     */
    protected onMonsterSpecificDeath(): void {
        console.log("SwordFe死亡，可能掉落石头资源");

        // SwordFe死亡时的特殊效果
        this.createDeathEffect();
    }
    
    // ========== SwordFe特有行为 ==========
 
    /**
     * 添加攻击冷却
     */
    private addAttackCooldown(): void {
        // SwordFe攻击后有额外的冷却时间
        this.lastAttackTime += 200; // 额外200ms冷却
    }
    
    /**
     * 创建死亡效果
     */
    private createDeathEffect(): void {
        // 这里可以添加SwordFe死亡时的特效
        // 比如石头碎裂效果、掉落物品等
        console.log("SwordFe死亡");
        
        // 触发掉落事件
        // this.owner.event("SwordFe_DROP_RESOURCES", { 
        //     monster: this, 
        //     dropType: "stone", 
        //     amount: this.SwordFeLevel 
        // });
    }
    

    
    // ========== 公共接口 ==========
    
    /**
     * 设置SwordFe等级
     */
    public setSwordFeLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.SwordFeLevel = level;
        
        // 重新计算属性
        const oldMaxHealth = this.monsterStats.maxHealth;
        this.monsterStats = this.calculateSwordFeStats();
        
        // 按比例调整当前血量
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.monsterStats.maxHealth * healthRatio);
        
        console.log(`SwordFe等级设置为 ${level}，属性已更新`);
    }
    
    /**
     * 获取SwordFe等级
     */
    public getSwordFeLevel(): number {
        return this.SwordFeLevel;
    }

    /**
     * 重写基类的setLevel方法
     */
    public setLevel(level: number): void {
        this.setSwordFeLevel(level);
    }
    
  
    public getSwordFeInfo(): any {
        return {
            name: "SwordFe",
            level: this.SwordFeLevel,
            camp: this.isPlayerCamp ? "Player" : "Enemy",
            health: `${this.currentHealth}/${this.monsterStats.maxHealth}`,
            state: this.currentState,
            // canCounterAttack: this.canCounterAttack,
            stats: this.getStats()
        };
    }
}

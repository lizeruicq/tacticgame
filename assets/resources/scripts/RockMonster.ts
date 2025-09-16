const { regClass, property } = Laya;
import { BaseMonster, IMonsterStats, MonsterState } from "./BaseMonster";
import { RockAnimationManager } from "./RockAnimationManager";

/**
 * Rock怪物类
 * 继承自BaseMonster，实现Rock特有的属性和行为
 */
@regClass()
export class RockMonster extends BaseMonster {
    
    // ========== Rock特有属性 ==========
    
    @property({ type: Number })
    public rockLevel: number = 1;  // Rock等级，影响属性
    
    // @property({ type: Boolean })
    // public canCounterAttack: boolean = true;  // 是否可以反击
    
    // Rock的动画管理器引用
    private rockAnimationManager: RockAnimationManager | null = null;
    
    // ========== 实现抽象方法 ==========
    
    /**
     * 初始化Rock怪物属性
     */
    protected initializeMonster(): void {
        // 根据等级设置Rock的基础属性
        this.monsterStats = this.calculateRockStats();
        
        console.log(`Rock怪物初始化 - 等级: ${this.rockLevel}`, this.monsterStats);
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
            attackRange: 120,    // Rock攻击范围中等
            maxHealth: 150       // Rock血量较高
        };
        
        // 根据等级调整属性
        const levelMultiplier = 1 + (this.rockLevel - 1) * 0.2; // 每级增加20%
        
        return {
            speed: Math.floor(baseStats.speed * levelMultiplier),
            attackPower: Math.floor(baseStats.attackPower * levelMultiplier),
            attackSpeed: Math.max(800, Math.floor(baseStats.attackSpeed / levelMultiplier)), // 攻击速度上限
            attackRange: Math.floor(baseStats.attackRange * (1 + (this.rockLevel - 1) * 0.1)), // 攻击范围小幅增长
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
                console.log(`Rock开始攻击，目标: ${this.currentTarget?.constructor.name}`);
                break;
            case MonsterState.DYING:
                console.log("Rock开始死亡动画");
                break;
        }
    }
    
    /**
     * 重写攻击执行完成事件
     */
    protected onAttackPerformed(target: BaseMonster): void {
        super.onAttackPerformed(target);
        
        console.log(`Rock攻击完成，对 ${target.constructor.name} 造成 ${this.monsterStats.attackPower} 点伤害`);
        
        // Rock攻击后有短暂的硬直时间
        this.addAttackCooldown();
    }
    
    /**
     * 重写受到伤害事件
     */
    // protected onDamageTaken(damage: number, attacker: BaseMonster): void {
    //     super.onDamageTaken(damage, attacker);
        
    //     console.log(`Rock受到攻击，来自: ${attacker.constructor.name}`);
        
    //     // Rock的反击机制
    //     if (this.canCounterAttack && !this.isDead && this.currentState !== MonsterState.ATTACKING) {
    //         this.triggerCounterAttack(attacker);
    //     }
    // }
    
    /**
     * 重写死亡事件
     */
    protected onDeath(): void {
        super.onDeath();
        
        console.log("Rock死亡，可能掉落石头资源");
        
        // Rock死亡时的特殊效果
        this.createDeathEffect();
        
        // 监听死亡动画完成
        if (this.rockAnimationManager) {
            this.owner.once("ROCK_DEATH_COMPLETE", this, this.onDeathAnimationComplete);
        }
    }
    
    // ========== Rock特有行为 ==========
    
    /**
     * 触发反击
     */
    // private triggerCounterAttack(attacker: BaseMonster): void {
    //     const attackerSprite = attacker.owner as Laya.Sprite;
    //     if (this.getDistanceToPosition(attackerSprite.x, attackerSprite.y) <= this.monsterStats.attackRange) {
    //         console.log("Rock触发反击！");
    //         this.setTarget(attacker);
    //         this.changeState(MonsterState.ATTACKING);
    //     }
    // }
    
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
        // 这里可以添加Rock死亡时的特效
        // 比如石头碎裂效果、掉落物品等
        console.log("Rock碎裂成石块");
        
        // 触发掉落事件
        // this.owner.event("ROCK_DROP_RESOURCES", { 
        //     monster: this, 
        //     dropType: "stone", 
        //     amount: this.rockLevel 
        // });
    }
    
    /**
     * 死亡动画完成处理
     */
    private onDeathAnimationComplete(): void {
        console.log("Rock死亡动画播放完成");
        
        // 设置为完全死亡状态
        this.changeState(MonsterState.DEAD);
        
        // 可以在这里处理尸体移除、资源掉落等
        Laya.timer.once(1000, this, () => {
            this.removeCorpse();
        });
    }
    
    /**
     * 移除尸体
     */
    private removeCorpse(): void {
        console.log("Rock尸体消失");
        
        // 触发尸体移除事件
        this.owner.event("ROCK_CORPSE_REMOVED", { monster: this });
        
        // 可以选择销毁节点或隐藏
        this.owner.removeSelf();
        // (this.owner as Laya.Sprite).visible = false;
    }
    
    // ========== 公共接口 ==========
    
    /**
     * 设置Rock等级
     */
    public setRockLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.rockLevel = level;
        
        // 重新计算属性
        const oldMaxHealth = this.monsterStats.maxHealth;
        this.monsterStats = this.calculateRockStats();
        
        // 按比例调整当前血量
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.monsterStats.maxHealth * healthRatio);
        
        console.log(`Rock等级设置为 ${level}，属性已更新`);
    }
    
    /**
     * 获取Rock等级
     */
    public getRockLevel(): number {
        return this.rockLevel;
    }
    
    /**
     * 设置反击能力
     */
    // public setCounterAttackEnabled(enabled: boolean): void {
    //     this.canCounterAttack = enabled;
    //     console.log(`Rock反击能力: ${enabled ? "启用" : "禁用"}`);
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
    //     console.log(`Rock强制攻击: ${target.constructor.name}`);
    // }
    
    /**
     * 获取Rock的详细信息
     */
    public getRockInfo(): any {
        return {
            name: "Rock",
            level: this.rockLevel,
            camp: this.isPlayerCamp ? "Player" : "Enemy",
            health: `${this.currentHealth}/${this.monsterStats.maxHealth}`,
            state: this.currentState,
            // canCounterAttack: this.canCounterAttack,
            stats: this.getStats()
        };
    }
}

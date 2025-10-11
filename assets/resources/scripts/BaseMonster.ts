const { regClass, property } = Laya;
import { MonsterManager } from "./MonsterManager";
import { Castle } from "./Castle";

/**
 * 怪物基础属性接口
 */
export interface IMonsterStats {
    speed: number;           // 移动速度
    attackPower: number;     // 攻击力
    attackSpeed: number;     // 攻击速度（攻击间隔，单位：毫秒）
    attackRange: number;     // 攻击范围（像素）
    maxHealth: number;       // 最大血量
}

/**
 * 怪物状态枚举
 */
export enum MonsterState {
    IDLE = "idle",           // 待机
    MOVING = "moving",       // 移动中
    ATTACKING = "attacking", // 攻击中
    CASTING = "casting",     // 施法中
    DYING = "dying",         // 死亡中
    DEAD = "dead"            // 已死亡
}

/**
 * 怪物基类
 * 提供所有怪物的通用功能和属性
 */
@regClass()
export abstract class BaseMonster extends Laya.Script {
    
    // ========== 基础属性 ==========
    
    @property({ type: Number })
    public isPlayerCamp: boolean = false;  // 是否玩家阵营
    
    // 怪物基础属性（由子类设置）
    protected monsterStats: IMonsterStats = {
        speed: 100,
        attackPower: 10,
        attackSpeed: 1000,
        attackRange: 100,
        maxHealth: 100
    };
    
    // ========== 运行时属性 ==========

    protected currentHealth: number = 100;        // 当前血量
    protected currentState: MonsterState = MonsterState.IDLE;  // 当前状态
    protected currentTarget: BaseMonster | Castle | null = null;       // 当前攻击目标
    
    // ========== 内部状态 ==========

    protected lastAttackTime: number = 0;         // 上次攻击时间
    protected isDead: boolean = false;            // 是否已死亡
    protected isInitialized: boolean = false;     // 是否已初始化
    protected corpseRemovalDelay: number = 3000;  // 尸体消失延迟时间（毫秒）
    
    // ========== 组件引用 ==========
    
    protected animationManager: any = null;       // 动画管理器组件
    
    onAwake(): void {
        console.log(`=== ${this.constructor.name} 初始化 ===`);

        // 初始化怪物属性
        this.initializeMonster();

        // 设置初始血量
        this.currentHealth = this.monsterStats.maxHealth;

        // 获取动画管理器组件
        this.setupAnimationManager();

        // 注册到MonsterManager
        this.registerToManager();

        // 标记为已初始化
        this.isInitialized = true;

        console.log(`${this.constructor.name} 初始化完成:`, {
            阵营: this.isPlayerCamp ? "玩家" : "敌方",
            血量: `${this.currentHealth}/${this.monsterStats.maxHealth}`,
            攻击力: this.monsterStats.attackPower,
            攻击速度: this.monsterStats.attackSpeed + "ms",
            攻击范围: this.monsterStats.attackRange + "px",
            移动速度: this.monsterStats.speed + "px/s"
        });
    }
    
    onEnable(): void {
        if (this.isInitialized) {
            this.startBehavior();
        }
    }
    
    onUpdate(): void {
        if (this.isDead || !this.isInitialized) return;
        
        // 更新怪物行为
        this.updateBehavior();
    }
    
    onDisable(): void {
        this.stopBehavior();
    }
    
    onDestroy(): void {
        this.cleanup();
        console.log(`${this.constructor.name} 销毁`);
    }
    
    // ========== 核心方法 ==========
    
    /**
     * 设置动画管理器
     */
    protected setupAnimationManager(): void {
        // 尝试获取动画管理器组件（子类可能有不同的组件名）
        const animationManagerComponent = this.getAnimationManagerComponent();
        if (animationManagerComponent) {
            this.animationManager = animationManagerComponent;
            console.log(`${this.constructor.name} 动画管理器设置完成`);
        } else {
            console.warn(`${this.constructor.name} 未找到动画管理器组件`);
        }
    }

    /**
     * 注册到MonsterManager
     */
    protected registerToManager(): void {
        const monsterManager = MonsterManager.getInstance();
        if (monsterManager) {
            monsterManager.registerMonster(this);
            console.log(`${this.constructor.name} 已注册到MonsterManager`);
        } else {
            console.warn(`${this.constructor.name} 无法获取MonsterManager实例，延迟注册`);
            // 延迟注册，等待MonsterManager初始化
            Laya.timer.once(100, this, () => {
                const manager = MonsterManager.getInstance();
                if (manager) {
                    manager.registerMonster(this);
                    console.log(`${this.constructor.name} 延迟注册到MonsterManager成功`);
                }
            });
        }
    }

    /**
     * 从MonsterManager中注销
     */
    protected unregisterFromManager(): void {
        const monsterManager = MonsterManager.getInstance();
        if (monsterManager) {
            monsterManager.unregisterMonster(this);
            console.log(`${this.constructor.name} 已从MonsterManager注销`);
        } else {
            console.error("MonsterManager实例不存在，无法注销怪物");
        }
    }

    /**
     * 开始行为逻辑
     */
    protected startBehavior(): void {
        console.log(`${this.constructor.name} 开始行为逻辑`);
        this.changeState(MonsterState.IDLE);
    }
    
    /**
     * 停止行为逻辑
     */
    protected stopBehavior(): void {
        console.log(`${this.constructor.name} 停止行为逻辑`);
        this.currentTarget = null;
    }
    
    /**
     * 更新行为逻辑
     */
    protected updateBehavior(): void {
        switch (this.currentState) {
            case MonsterState.IDLE:
                this.updateIdleBehavior();
                break;
            case MonsterState.MOVING:
                this.updateMovingBehavior();
                break;
            case MonsterState.ATTACKING:
                this.updateAttackingBehavior();
                break;
            case MonsterState.DYING:
                this.updateDyingBehavior();
                break;
        }
    }
    
    /**
     * 切换状态
     */
    protected changeState(newState: MonsterState): void {
        if (this.currentState === newState) return;
        if (this.isDead && newState !== MonsterState.DEAD) return;
        
        const oldState = this.currentState;
        this.currentState = newState;
        
        console.log(`${this.constructor.name} 状态切换: ${oldState} -> ${newState}`);
        
        // 处理状态切换
        this.onStateChange(oldState, newState);
        
        // 更新动画
        this.updateAnimation();
    }
    
    /**
     * 状态切换处理
     */
    protected onStateChange(oldState: MonsterState, newState: MonsterState): void {
        // 子类可以重写此方法来处理特殊的状态切换逻辑
    }
    
    /**
     * 更新动画
     */
    protected updateAnimation(): void {
        if (!this.animationManager) return;
        
        switch (this.currentState) {
            case MonsterState.IDLE:
                if (this.animationManager.changeState) {
                    this.animationManager.changeState("idle");
                }
                break;
            case MonsterState.MOVING:
                if (this.animationManager.startWalking) {
                    this.animationManager.startWalking();
                }
                break;
            case MonsterState.ATTACKING:
                if (this.animationManager.startAttack) {
                    this.animationManager.startAttack();
                }
                break;
            case MonsterState.CASTING:
                if (this.animationManager.startCasting) {
                    this.animationManager.startCasting();
                }
                break;
            case MonsterState.DYING:
                if (this.animationManager.startDying) {
                    this.animationManager.startDying();
                }
                break;
        }
    }
    
    // ========== 行为更新方法 ==========
    
    /**
     * 更新待机行为
     */
    protected updateIdleBehavior(): void {
        // 寻找目标
        const target = this.findTarget();
        if (target) {
            this.setTarget(target);
            this.changeState(MonsterState.MOVING);
        }
    }
    
    /**
     * 更新移动行为
     */
    protected updateMovingBehavior(): void {
        if (!this.currentTarget || this.isTargetDead(this.currentTarget)) {
            this.currentTarget = null;
            this.changeState(MonsterState.IDLE);
            return;
        }

        // 在移动过程中寻找更近的目标
        this.updateTargetWhileMoving();

        const distance = this.getDistanceToTarget();
        if (distance <= this.monsterStats.attackRange) {
            // 进入攻击范围
            this.changeState(MonsterState.ATTACKING);
        } else {
            // 继续移动向目标
            this.moveTowardsTarget();
        }
    }
    
    /**
     * 更新攻击行为
     */
    protected updateAttackingBehavior(): void {
        if (!this.currentTarget || this.isTargetDead(this.currentTarget)) {
            this.currentTarget = null;
            this.changeState(MonsterState.IDLE);
            return;
        }

        const distance = this.getDistanceToTarget();
        if (distance > this.monsterStats.attackRange) {
            // 目标超出攻击范围，继续移动
            this.changeState(MonsterState.MOVING);
            return;
        }

        // 检查攻击冷却
        const currentTime = Laya.timer.currTimer;
        if (currentTime - this.lastAttackTime >= this.monsterStats.attackSpeed) {
            this.performAttack();
            this.lastAttackTime = currentTime;
        }
    }
    
    /**
     * 更新死亡行为
     */
    protected updateDyingBehavior(): void {
        // 死亡动画播放中，等待动画完成
    }

    // ========== 战斗相关方法 ==========

    /**
     * 设置攻击目标
     */
    public setTarget(target: BaseMonster | Castle): void {
        if (target === this) {
            console.error(`${this.constructor.name} 尝试攻击自己，已阻止！`);
            return; // 不能攻击自己
        }
        if (this.isTargetDead(target)) {
            console.log(`${this.constructor.name} 目标已死亡，跳过设置`);
            return;   // 不能攻击已死亡的目标
        }
        if (this.isTargetSameCamp(target)) {
            console.log(`${this.constructor.name} 目标是同阵营，跳过设置`);
            return; // 不能攻击同阵营
        }

        this.currentTarget = target;
        const targetName = target instanceof BaseMonster ? target.constructor.name : 'Castle';
        console.log(`${this.constructor.name} 设置攻击目标: ${targetName}`);
    }

    /**
     * 执行攻击
     */
    protected performAttack(): void {
        if (!this.currentTarget) return;

        console.log(`${this.constructor.name} 攻击 ${this.currentTarget.constructor.name}, 伤害: ${this.monsterStats.attackPower}`);

        // 造成伤害
        this.currentTarget.takeDamage(this.monsterStats.attackPower, this);

        // 触发攻击事件
        this.onAttackPerformed(this.currentTarget);
    }

    /**
     * 受到伤害
     */
    public takeDamage(damage: number, attacker: BaseMonster): void {
        if (this.isDead) return;

        this.currentHealth -= damage;
        console.log(`${this.constructor.name} 受到 ${damage} 点伤害, 剩余血量: ${this.currentHealth}/${this.monsterStats.maxHealth}`);

        // 触发受伤事件
        this.onDamageTaken(damage, attacker);

        // 更新血条显示
        this.updateHealthBar();

        // 检查是否死亡
        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.die();
        }
    }

    //    /**
    //  * 强制设置血量
    //  */
    // public setHealth(health: number): void {
    //     this.currentHealth = Math.max(0, Math.min(health, this.monsterStats.maxHealth));
    //     if (this.currentHealth <= 0 && !this.isDead) {
    //         this.die();
    //     }
    // }

    /**
     * 死亡处理
     */
    protected die(): void {
        if (this.isDead) return;

        
        this.currentTarget = null;
        this.changeState(MonsterState.DYING);

        console.log(`${this.constructor.name} 死亡`);
        this.isDead = true;
        
        // 隐藏血条
        this.hideHealthBar();
        
        // 触发死亡事件
        this.onDeath();
    }

        /**
     * 死亡事件
     */
    protected onDeath(): void {
        // 触发死亡事件
        this.owner.event("MONSTER_DEATH", { monster: this });

        // 子类特有死亡处理
        this.onMonsterSpecificDeath();

        // 监听死亡动画完成事件
        this.owner.once("DEATH_ANIMATION_COMPLETE", this, this.onDeathAnimationComplete);
    }

    /**
     * 死亡动画完成处理
     */
    protected onDeathAnimationComplete(): void {
        console.log(`${this.constructor.name} 死亡动画播放完成`);

        // 延迟移除尸体
        Laya.timer.once(this.corpseRemovalDelay, this, this.removeCorpse);
    }

    /**
     * 移除尸体
     */
    protected removeCorpse(): void {
        console.log(`${this.constructor.name} 尸体消失`);

        // 触发尸体移除事件
        this.owner.event("MONSTER_CORPSE_REMOVED", { monster: this });

        // 从MonsterManager中注销并销毁
        this.unregisterFromManager();
        Laya.timer.clearAll(this);
        this.owner.destroy();
    }

    /**
     * 怪物特有的死亡处理（子类重写）
     */
    protected onMonsterSpecificDeath(): void {
        // 子类可以重写此方法来处理特殊的死亡逻辑
    }


    /**
     * 移动向目标
     */
    protected moveTowardsTarget(): void {
        if (!this.currentTarget) return;

        const targetSprite = this.currentTarget.owner as Laya.Sprite;
        const currentSprite = this.owner as Laya.Sprite;

        // 计算方向向量
        const dx = targetSprite.x - currentSprite.x;
        const dy = targetSprite.y - currentSprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // 标准化方向向量
            const dirX = dx / distance;
            const dirY = dy / distance;

            // 计算移动距离
            const moveDistance = this.monsterStats.speed * Laya.timer.delta / 1000;

            // 更新位置
            currentSprite.x += dirX * moveDistance;
            currentSprite.y += dirY * moveDistance;
        }
    }

    // ========== 工具方法 ==========

    /**
     * 检查目标是否死亡
     */
    protected isTargetDead(target: BaseMonster | Castle): boolean {
        if (target instanceof BaseMonster) {
            return target.isDead;
        } else if (target instanceof Castle) {
            return target.getIsDestroyed();
        }
        return true;
    }

    /**
     * 检查目标是否同阵营
     */
    protected isTargetSameCamp(target: BaseMonster | Castle): boolean {
        return target.isPlayerCamp === this.isPlayerCamp;
    }

    /**
     * 获取到目标的距离
     */
    protected getDistanceToTarget(): number {
        if (!this.currentTarget) return Infinity;

        const targetSprite = this.currentTarget.owner as Laya.Sprite;
        const currentSprite = this.owner as Laya.Sprite;

        const dx = targetSprite.x - currentSprite.x;
        const dy = targetSprite.y - currentSprite.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 获取到指定位置的距离
     */
    protected getDistanceToPosition(x: number, y: number): number {
        const currentSprite = this.owner as Laya.Sprite;
        const dx = x - currentSprite.x;
        const dy = y - currentSprite.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 寻找攻击目标
     */
    protected findTarget(): BaseMonster | Castle | null {
        // 使用MonsterManager来寻找最近的敌方目标
        const monsterManager = MonsterManager.getInstance();
        if (!monsterManager) {
            console.warn(`${this.constructor.name} 无法获取MonsterManager实例`);
            return null;
        }

        return monsterManager.findNearestEnemyTarget(this);
    }

    /**
     * 移动时更新目标（寻找更近的敌人）
     */
    protected updateTargetWhileMoving(): void {
        // 寻找最近的敌方目标
        const newTarget = this.findTarget();
        if (!newTarget) return;

        // 如果找到了新目标，比较距离
        const currentDistance = this.getDistanceToTarget();
        const newDistance = this.getDistanceToPosition(
            (newTarget.owner as Laya.Sprite).x,
            (newTarget.owner as Laya.Sprite).y
        );

        // 如果新目标更近，切换目标
        if (newDistance < currentDistance) {
            const oldTargetName = this.currentTarget instanceof BaseMonster ?
                this.currentTarget.constructor.name : 'Castle';
            const newTargetName = newTarget instanceof BaseMonster ?
                newTarget.constructor.name : 'Castle';

            console.log(`${this.constructor.name} 移动中发现更近目标: ${oldTargetName} -> ${newTargetName}, 距离: ${currentDistance.toFixed(1)} -> ${newDistance.toFixed(1)}`);

            this.setTarget(newTarget);
        }
    }

    // ========== 血条管理方法 ==========

    /**
     * 更新血条显示
     */
    protected updateHealthBar(): void {
        // TODO: 实现血条更新逻辑
    }
    
    /**
     * 隐藏血条
     */
    protected hideHealthBar(): void {
        // TODO: 实现隐藏血条逻辑
    }
    
    /**
     * 显示血条
     */
    protected showHealthBar(): void {
        // TODO: 实现显示血条逻辑
    }

    // ========== 公共接口 ==========

    /**
     * 获取当前状态
     */
    public getCurrentState(): MonsterState {
        return this.currentState;
    }

    /**
     * 获取当前血量
     */
    public getCurrentHealth(): number {
        return this.currentHealth;
    }

    /**
     * 获取最大血量
     */
    public getMaxHealth(): number {
        return this.monsterStats.maxHealth;
    }

    /**
     * 获取血量百分比
     */
    public getHealthPercentage(): number {
        return this.currentHealth / this.monsterStats.maxHealth;
    }

    /**
     * 获取当前目标
     */
    public getCurrentTarget(): BaseMonster | Castle | null {
        return this.currentTarget;
    }

    /**
     * 检查是否死亡
     */
    public getIsDead(): boolean {
        return this.isDead;
    }

    /**
     * 获取怪物属性
     */
    public getStats(): IMonsterStats {
        return { ...this.monsterStats }; // 返回副本，防止外部修改
    }

 

    /**
     * 治疗
     */
    public heal(amount: number): void {
        if (this.isDead) return;

        const oldHealth = this.currentHealth;
        this.currentHealth = Math.min(this.currentHealth + amount, this.monsterStats.maxHealth);
        const actualHeal = this.currentHealth - oldHealth;

        if (actualHeal > 0) {
            console.log(`${this.constructor.name} 恢复 ${actualHeal} 点血量, 当前血量: ${this.currentHealth}/${this.monsterStats.maxHealth}`);
            this.onHealed(actualHeal);
            
            // 更新血条显示
            this.updateHealthBar();
        }
    }

    /**
     * 清理资源
     */
    protected cleanup(): void {
        this.currentTarget = null;
        this.animationManager = null;
    }

    // ========== 事件处理方法（子类可重写） ==========

    /**
     * 攻击执行完成事件
     */
    protected onAttackPerformed(target: BaseMonster | Castle): void {
        this.changeState(MonsterState.IDLE);
        // 子类可以重写此方法来处理攻击完成后的逻辑
        this.owner.event("MONSTER_ATTACK_PERFORMED", { attacker: this, target: target });
    }

    /**
     * 受到伤害事件
     */
    protected onDamageTaken(damage: number, attacker: BaseMonster): void {
        // 子类可以重写此方法来处理受伤逻辑
        this.owner.event("MONSTER_DAMAGE_TAKEN", { target: this, damage: damage, attacker: attacker });
    }


    /**
     * 治疗事件
     */
    protected onHealed(amount: number): void {
        // 子类可以重写此方法来处理治疗逻辑
        this.owner.event("MONSTER_HEALED", { monster: this, amount: amount });
    }

    // ========== 通用接口方法 ==========

    /**
     * 设置怪物等级（通用方法，子类可以重写）
     */
    public setLevel(level: number): void {
        // 默认实现：限制等级范围
        if (level < 1) level = 1;
        if (level > 10) level = 10;

        // 子类应该重写此方法来实现具体的等级设置逻辑
        console.log(`${this.constructor.name} 设置等级: ${level}`);
    }

    // ========== 抽象方法（子类必须实现） ==========

    /**
     * 初始化怪物属性（子类实现）
     */
    protected abstract initializeMonster(): void;

    /**
     * 获取动画管理器组件（子类实现）
     */
    protected abstract getAnimationManagerComponent(): any;
}

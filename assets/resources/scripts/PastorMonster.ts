const { regClass, property } = Laya;
import { BaseMonster, MonsterState, IMonsterStats } from "./BaseMonster";
import { MonsterManager } from "./MonsterManager";
import { PastorAnimationManager } from "./PastorAnimationManager";
import { Castle } from "./Castle";

/**
 * Pastor怪物类
 * 治疗型怪物，不攻击敌人，专门治疗友方怪物
 */
@regClass()
export class PastorMonster extends BaseMonster {

    @property(Number)
    public pastorLevel: number = 1;

    // Pastor动画管理器引用
    private pastorAnimationManager: PastorAnimationManager = null;

    // Pastor特有属性
    private healAmount: number = 10;           // 每次治疗量
    private healInterval: number = 2000;       // 治疗间隔（毫秒）
    private maxHealTargets: number = 2;        // 每次最多治疗目标数
    private minDistanceToAlly: number = 500;   // 与友方怪物的最小距离
    private lastHealTime: number = 0;          // 上次治疗时间

    onAwake(): void {
        super.onAwake();
        console.log("Pastor怪物初始化");
    }

    protected initializeMonster(): void {
        this.monsterStats = this.calculatePastorStats();

        console.log(`Pastor初始化完成 - 等级: ${this.pastorLevel}`, this.monsterStats);
    }

    private calculatePastorStats(): IMonsterStats {
        const baseStats: IMonsterStats = {
            speed: 50,               // 移动速度缓慢
            attackPower: 0,          // 无攻击力
            attackSpeed: 0,          // 无攻击速度
            attackRange: 0,          // 无攻击范围
            maxHealth: 100           // 基础血量
        };

        // 根据等级调整属性
        const levelMultiplier = 1 + (this.pastorLevel - 1) * 0.2;
        return {
            speed: Math.floor(baseStats.speed * levelMultiplier),
            attackPower: 0,  // 始终为0
            attackSpeed: 0,  // 始终为0
            attackRange: 0,  // 始终为0
            maxHealth: Math.floor(baseStats.maxHealth * levelMultiplier)
        };
    }

    // 重写父类的updateIdleBehavior方法
    protected updateIdleBehavior(): void {
        // 检查是否需要移动到友方怪物附近
        this.checkAndMoveToAllies();
        
        // 检查是否可以进行治疗
        const currentTime = Date.now();
        if (this.canCast() && currentTime - this.lastHealTime >= this.healInterval) {
            this.performHealing();
            this.lastHealTime = currentTime;
        }
    }

    // 重写父类的updateMovingBehavior方法
    protected updateMovingBehavior(): void {
        if (!this.currentTarget) {
            this.changeState(MonsterState.IDLE);
            return;
        }

        const distance = this.getDistanceToTarget();
        if (distance <= this.minDistanceToAlly) { // 到达目标附近
            this.onReachTarget();
        } else {
            // 继续移动向目标
            this.moveTowardsTarget();
        }
    }

    private checkAndMoveToAllies(): void {
        const nearestAlly = this.findNearestAlly();
        
        if (!nearestAlly) {
            return; // 没有友方怪物，保持idle
        }

        const distance = this.calculateDistanceToAlly(nearestAlly);

        if (distance > this.minDistanceToAlly) {
            // 距离太远，需要移动
            this.currentTarget = nearestAlly;
            this.changeState(MonsterState.MOVING);
        }
    }

    private findNearestAlly(): BaseMonster | null {
        const monsterManager = MonsterManager.getInstance();
        if (!monsterManager) return null;

        const allies = this.isPlayerCamp ? 
            monsterManager.getPlayerMonsters() : 
            monsterManager.getEnemyMonsters();

        let nearestAlly: BaseMonster | null = null;
        let minDistance = Infinity;

        for (const ally of allies) {
            if (ally === this || ally.getIsDead()) continue;
            
            const distance = this.calculateDistanceToAlly(ally);
            if (distance < minDistance) {
                minDistance = distance;
                nearestAlly = ally;
            }
        }

        return nearestAlly;
    }

    private canCast(): boolean {
        // 检查是否有友方怪物在附近
        const nearestAlly = this.findNearestAlly();
        if (!nearestAlly) return false;

        const distance = this.calculateDistanceToAlly(nearestAlly);
        return distance < this.minDistanceToAlly;
    }

    private performHealing(): void {
        const healTargets = this.findHealTargets();
        
        if (healTargets.length === 0) {
            return; // 没有需要治疗的目标
        }

        this.changeState(MonsterState.CASTING);
        
        // 治疗目标
        for (const target of healTargets) {
            this.healTarget(target);
        }

        // 施法动画完成后回到idle状态
        Laya.timer.once(1000, this, () => {
            this.changeState(MonsterState.IDLE);
        });
    }

    private findHealTargets(): BaseMonster[] {
        const monsterManager = MonsterManager.getInstance();
        if (!monsterManager) return [];

        const allies = this.isPlayerCamp ? 
            monsterManager.getPlayerMonsters() : 
            monsterManager.getEnemyMonsters();

        const targets: BaseMonster[] = [];

        for (const ally of allies) {
            if (ally === this || ally.getIsDead()) continue;
            
            // 检查是否需要治疗（血量不满）
            if (ally.getCurrentHealth() < ally.getMaxHealth()) {
                targets.push(ally);
            }
        }

        // 按血量百分比排序，优先治疗血量最少的
        targets.sort((a, b) => {
            const aHealthPercent = a.getCurrentHealth() / a.getMaxHealth();
            const bHealthPercent = b.getCurrentHealth() / b.getMaxHealth();
            return aHealthPercent - bHealthPercent;
        });

        // 最多治疗指定数量的目标
        return targets.slice(0, this.maxHealTargets);
    }

    private healTarget(target: BaseMonster): void {
        const healAmount = Math.min(this.healAmount, target.getMaxHealth() - target.getCurrentHealth());
        target.heal(healAmount);
        
        console.log(`Pastor治疗了 ${target.constructor.name}，恢复 ${healAmount} 血量`);
        
        // 这里可以添加治疗特效
        this.playHealEffect(target);
    }

    private playHealEffect(target: BaseMonster): void {
        // 简单的治疗特效（可以后续扩展）
        console.log(`播放治疗特效给 ${target.constructor.name}`);
    }

    private calculateDistanceToAlly(ally: BaseMonster): number {
        const allySprite = ally.owner as Laya.Sprite;
        const currentSprite = this.owner as Laya.Sprite;
        const dx = allySprite.x - currentSprite.x;
        const dy = allySprite.y - currentSprite.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    protected onReachTarget(): void {
        // 到达友方怪物附近，停止移动
        this.changeState(MonsterState.IDLE);
        this.currentTarget = null;
    }

    // 重写寻找目标方法，使Pastor不会寻找敌人
    protected findTarget(): BaseMonster | Castle | null {
        // Pastor不寻找攻击目标，始终返回null
        return null;
    }

    // ========== 死亡处理 ==========

    /**
     * 重写怪物特有的死亡处理
     */
    protected onMonsterSpecificDeath(): void {
        console.log("Pastor牧师安息了...");

        // Pastor死亡时的特殊效果
        this.createDeathEffect();
    }

    /**
     * 创建死亡特效
     */
    private createDeathEffect(): void {
        console.log("✨ Pastor死亡时散发神圣光芒");

        // 可以添加死亡时的神圣效果
        // 例如：光芒消散、治疗能量释放等
    }

    // ========== 公共接口 ==========

    public setPastorLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10;

        this.pastorLevel = level;

        // 重新计算属性
        const oldMaxHealth = this.monsterStats.maxHealth;
        this.monsterStats = this.calculatePastorStats();

        // 按比例调整当前血量（与RockMonster保持一致）
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.monsterStats.maxHealth * healthRatio);

        console.log(`Pastor等级设置为: ${this.pastorLevel}`, this.monsterStats);
    }

    public getPastorLevel(): number {
        return this.pastorLevel;
    }

    public setLevel(level: number): void {
        this.setPastorLevel(level);
    }

    protected getAnimationManagerComponent(): any {
        this.pastorAnimationManager = this.owner.getComponent(PastorAnimationManager);
        return this.pastorAnimationManager;
    }

    public getPastorInfo(): any {
        return {
            name: "Pastor",
            level: this.pastorLevel,
            camp: this.isPlayerCamp ? "Player" : "Enemy",
            health: `${this.currentHealth}/${this.monsterStats.maxHealth}`,
            healAmount: this.healAmount,
            state: this.currentState
        };
    }
}
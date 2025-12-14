const { regClass, property } = Laya;
import { BaseMonster, IMonsterStats, MonsterState } from "../BaseMonster";
import { ZombieAnimationManager } from "./ZombieAnimationManager";
import { Castle } from "../Castle";
import { MonsterManager } from "../../Manager/MonsterManager";
import { GameMainManager } from "../../Manager/GameMainManager";

/**
 * Zombie怪物类
 * 继承自BaseMonster，实现Zombie特有的属性和行为
 */
@regClass()
export class ZombieMonster extends BaseMonster {
    
    // Zombie的动画管理器引用
    private zombieAnimationManager: ZombieAnimationManager | null = null;
    
    // ========== 实现抽象方法 ==========

    /**
     * 获取怪物类型
     */
    public getMonsterType(): string {
        return "Zombie";
    }

    /**
     * 初始化Zombie怪物属性
     */
    protected initializeMonster(): void {
        // 根据等级设置Zombie的基础属性
        this.monsterStats = this.calculateZombieStats();
    }
    
    /**
     * 获取动画管理器组件
     */
    protected getAnimationManagerComponent(): any {
        this.zombieAnimationManager = this.owner.getComponent(ZombieAnimationManager);
        return this.zombieAnimationManager;
    }
    
    // ========== Zombie特有方法 ==========
    
    /**
     * 根据等级计算Zombie属性
     */
    private calculateZombieStats(): IMonsterStats {
        const baseStats: IMonsterStats = {
            speed: 40,           // Zombie移动较慢
            attackPower: 30,     // Zombie攻击力较高
            attackSpeed: 3000,   // Zombie攻击速度较慢
            attackRange: 80,     // Zombie攻击范围中等
            maxHealth: 150       // Zombie血量较高
        };
        
        // 根据等级调整属性
        const levelMultiplier = 1 + (this.monsterLevel - 1); // 每级增加20%
        
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
        
        // Zombie特有的状态切换逻辑
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
        this.soundManager.playSound("rock.wav");

        // 如果击杀了敌人，监听敌人的尸体移除事件
        if (target instanceof BaseMonster && target.getIsDead()) {
            const targetSprite = target.owner as Laya.Sprite;
            const position = { x: targetSprite.x, y: targetSprite.y };

            // 监听敌人的尸体移除事件，在敌人完全消失后生成新僵尸
            targetSprite.once("MONSTER_CORPSE_REMOVED", this, () => {
                this.spawnZombieOnKill(position);
            });
        }

        // Zombie攻击后有短暂的硬直时间
        // this.addAttackCooldown();
    }

    /**
     * 击杀敌人后生成新僵尸
     */
    private spawnZombieOnKill(position: { x: number; y: number }): void {
        const monsterManager = MonsterManager.getInstance();
        const gameManager = GameMainManager.getInstance();

        if (!monsterManager || !gameManager) return;

        const battleField = gameManager.getBattleField();

        // 生成生成特效
        this.createSpawnEffect(position, battleField);

        // 创建血量为20的新僵尸
        monsterManager.createMonster("Zombie", this.isPlayerCamp, position, 1).then((newZombie) => {
            if (newZombie) {
                battleField.addChild(newZombie);

                // 设置新僵尸的血量为20
                const zombieComponent = (newZombie as any)._components?.find((c: any) => c instanceof ZombieMonster);
                if (zombieComponent) {
                    zombieComponent.currentHealth = 20;
                    zombieComponent.updateHealthBar();
                }

                console.log(`Zombie击杀敌人，在${position.x},${position.y}生成新僵尸`);
            }
        });
    }

    /**
     * 创建生成特效
     */
    private createSpawnEffect(position: { x: number; y: number }, parent: Laya.Sprite): void {
        Laya.loader.load(BaseMonster.SPAWN_EFFECT_PREFAB_PATH).then(() => {
            const prefab = Laya.loader.getRes(BaseMonster.SPAWN_EFFECT_PREFAB_PATH);
            const effectSprite = prefab.create() as Laya.Sprite;

            effectSprite.pos(position.x, position.y);
            parent.addChild(effectSprite);

            // 1秒后销毁特效
            Laya.timer.once(1000, this, () => {
                if (effectSprite && !effectSprite.destroyed) {
                    effectSprite.removeSelf();
                }
            });
        });
    }
    
    /**
     * 重写怪物特有的死亡处理
     */
    protected onMonsterSpecificDeath(): void {
        // Zombie死亡时的特殊效果
        this.createDeathEffect();
    }
    
    /**
     * 添加攻击冷却
     */
    // private addAttackCooldown(): void {
    //     // Zombie攻击后有额外的冷却时间
    //     this.lastAttackTime += 200; // 额外200ms冷却
    // }
    
    /**
     * 创建死亡效果
     */
    private createDeathEffect(): void {
       
    }
    
    // ========== 公共接口 ==========
    
    /**
     * 设置Zombie等级
     */
    public setLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.monsterLevel = level;
        
        // 重新计算属性
        const oldMaxHealth = this.monsterStats.maxHealth;
        this.monsterStats = this.calculateZombieStats();
        
        // 按比例调整当前血量
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.monsterStats.maxHealth * healthRatio);
    }
    
    /**
     * 获取Zombie等级
     */
    public getLevel(): number {
        return this.monsterLevel;
    }
}


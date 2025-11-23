const { regClass } = Laya;
import { BaseAnimationManager, IAnimationState, IAnimationConfig } from "../BaseAnimationManager";
import { MonsterDisplayConfig } from "../MonsterDisplayConfig";

/**
 * Zombie精灵动画状态枚举
 */
export enum ZombieAnimationState {
    IDLE = "idle",
    ATTACKING = "attacking",
    WALKING = "walking",
    DYING = "dying"
}

/**
 * Zombie精灵动画管理器
 * 继承自BaseAnimationManager，实现Zombie特有的动画逻辑
 */
@regClass()
export class ZombieAnimationManager extends BaseAnimationManager {

    // 动画资源路径配置
    private animationPaths = {
        [ZombieAnimationState.IDLE]: "resources/images/ANI/zombie/idle.atlas",
        [ZombieAnimationState.ATTACKING]: "resources/images/ANI/zombie/attacking.atlas",
        [ZombieAnimationState.WALKING]: "resources/images/ANI/zombie/walking.atlas",
        [ZombieAnimationState.DYING]: "resources/images/ANI/zombie/dying.atlas"
    };

    // 动画配置参数
    private animationConfigs = {
        [ZombieAnimationState.IDLE]: {
            interval: 100,
            wrapMode: 2, // PINGPONG 来回播放
            autoPlay: true,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            loop: true
        },
        [ZombieAnimationState.ATTACKING]: {
            interval: 80,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            offsetY: -10,
            loop: true
        },
        [ZombieAnimationState.WALKING]: {
            interval: 60,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            loop: true,
            offsetY: 0
        },
        [ZombieAnimationState.DYING]: {
            interval: 120,
            wrapMode: 0, // POSITIVE 正序播放一次
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            loop: false,
            offsetY: 0
        }
    };

    constructor() {
        super();

        // 设置Zombie特有的属性
        this.defaultState = ZombieAnimationState.IDLE;
        this.deathState = ZombieAnimationState.DYING;

        // 从配置中获取图集尺寸
        const config = MonsterDisplayConfig.getMonsterAtlasConfig("Zombie");
        if (config) {
            this.atlasOriginalWidth = config.originalWidth;
            this.atlasOriginalHeight = config.originalHeight;
        } else {
            // 备用默认值
            this.atlasOriginalWidth = 720;
            this.atlasOriginalHeight = 480;
        }
    }

    // ========== 实现抽象方法 ==========

    /**
     * 获取动画状态枚举
     */
    protected getAnimationStates(): IAnimationState {
        return ZombieAnimationState;
    }

    /**
     * 获取动画资源路径
     */
    protected getAnimationPath(state: string): string {
        return this.animationPaths[state as ZombieAnimationState] || "";
    }

    /**
     * 获取动画配置
     */
    protected getAnimationConfig(state: string): IAnimationConfig | null {
        return this.animationConfigs[state as ZombieAnimationState] || null;
    }

    /**
     * 处理动画播放完成
     */
    protected handleAnimationComplete(state: string): void {
        switch (state) {
            case ZombieAnimationState.ATTACKING:
                // 攻击动画完成后回到idle状态
                this.changeState(ZombieAnimationState.IDLE);
                break;

            case ZombieAnimationState.DYING:
                // 死亡动画完成后，触发死亡事件
                this.onDeathComplete();
                break;
        }
    }

    /**
     * 死亡动画完成处理
     */
    private onDeathComplete(): void {
        // 发送统一的死亡动画完成事件
        this.owner.event("DEATH_ANIMATION_COMPLETE");
    }

    // ========== Zombie特有的外部接口 ==========

    /**
     * 外部接口：开始攻击
     */
    public startAttack(): void {
        this.changeState(ZombieAnimationState.ATTACKING);
    }

    /**
     * 外部接口：开始移动
     */
    public startWalking(): void {
        this.changeState(ZombieAnimationState.WALKING);
    }

    /**
     * 外部接口：停止移动
     */
    public stopWalking(): void {
        this.changeState(ZombieAnimationState.IDLE);
    }

    /**
     * 外部接口：开始死亡
     */
    public startDying(): void {
        this.changeState(ZombieAnimationState.DYING);
    }

    /**
     * 获取当前是否为攻击状态
     */
    public isAttacking(): boolean {
        return this.getCurrentState() === ZombieAnimationState.ATTACKING;
    }

    /**
     * 获取当前是否为移动状态
     */
    public isWalking(): boolean {
        return this.getCurrentState() === ZombieAnimationState.WALKING;
    }
}


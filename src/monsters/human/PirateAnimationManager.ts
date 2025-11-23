const { regClass } = Laya;
import { BaseAnimationManager, IAnimationState, IAnimationConfig } from "../BaseAnimationManager";
import { MonsterDisplayConfig } from "../MonsterDisplayConfig";

/**
 * Pirate精灵动画状态枚举
 */
export enum PirateAnimationState {
    IDLE = "idle",
    ATTACKING = "attacking",
    WALKING = "walking",
    DYING = "dying"
}

/**
 * Pirate精灵动画管理器
 * 继承自BaseAnimationManager，实现Pirate特有的动画逻辑
 */
@regClass()
export class PirateAnimationManager extends BaseAnimationManager {

    // 动画资源路径配置
    private animationPaths = {
        [PirateAnimationState.IDLE]: "resources/images/ANI/pirate/idle.atlas",
        [PirateAnimationState.ATTACKING]: "resources/images/ANI/pirate/attacking.atlas",
        [PirateAnimationState.WALKING]: "resources/images/ANI/pirate/walking.atlas",
        [PirateAnimationState.DYING]: "resources/images/ANI/pirate/dying.atlas"
    };

    // 动画配置参数
    private animationConfigs = {
        [PirateAnimationState.IDLE]: {
            interval: 100,
            wrapMode: 2, // PINGPONG 来回播放
            autoPlay: true,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            loop: true
        },
        [PirateAnimationState.ATTACKING]: {
            interval: 80,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            offsetY: -10,
            loop: true
        },
        [PirateAnimationState.WALKING]: {
            interval: 60,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            loop: true,
            offsetY: 0
        },
        [PirateAnimationState.DYING]: {
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

        // 设置Pirate特有的属性
        this.defaultState = PirateAnimationState.IDLE;
        this.deathState = PirateAnimationState.DYING;

        // 从配置中获取图集尺寸
        const config = MonsterDisplayConfig.getMonsterAtlasConfig("Pirate");
        if (config) {
            this.atlasOriginalWidth = config.originalWidth;
            this.atlasOriginalHeight = config.originalHeight;
        } else {
            // 备用默认值
            this.atlasOriginalWidth = 1650;
            this.atlasOriginalHeight = 1000;
        }
    }

    // ========== 实现抽象方法 ==========

    /**
     * 获取动画状态枚举
     */
    protected getAnimationStates(): IAnimationState {
        return PirateAnimationState;
    }

    /**
     * 获取动画资源路径
     */
    protected getAnimationPath(state: string): string {
        return this.animationPaths[state as PirateAnimationState] || "";
    }

    /**
     * 获取动画配置
     */
    protected getAnimationConfig(state: string): IAnimationConfig | null {
        return this.animationConfigs[state as PirateAnimationState] || null;
    }

    /**
     * 处理动画播放完成
     */
    protected handleAnimationComplete(state: string): void {
        switch (state) {
            case PirateAnimationState.ATTACKING:
                // 攻击动画完成后回到idle状态
                this.changeState(PirateAnimationState.IDLE);
                break;

            case PirateAnimationState.DYING:
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

    // ========== Pirate特有的外部接口 ==========

    /**
     * 外部接口：开始攻击
     */
    public startAttack(): void {
        this.changeState(PirateAnimationState.ATTACKING);
    }

    /**
     * 外部接口：开始移动
     */
    public startWalking(): void {
        this.changeState(PirateAnimationState.WALKING);
    }

    /**
     * 外部接口：停止移动
     */
    public stopWalking(): void {
        this.changeState(PirateAnimationState.IDLE);
    }

    /**
     * 外部接口：开始死亡
     */
    public startDying(): void {
        this.changeState(PirateAnimationState.DYING);
    }

    /**
     * 获取当前是否为攻击状态
     */
    public isAttacking(): boolean {
        return this.getCurrentState() === PirateAnimationState.ATTACKING;
    }

    /**
     * 获取当前是否为移动状态
     */
    public isWalking(): boolean {
        return this.getCurrentState() === PirateAnimationState.WALKING;
    }
}


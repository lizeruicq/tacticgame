const { regClass } = Laya;
import { BaseAnimationManager, IAnimationState, IAnimationConfig } from "./BaseAnimationManager";

/**
 * Rock精灵动画状态枚举
 */
export enum RockAnimationState {
    IDLE = "idle",
    ATTACKING = "attacking",
    WALKING = "walking",
    DYING = "dying"
}

/**
 * Rock精灵动画管理器
 * 继承自BaseAnimationManager，实现Rock特有的动画逻辑
 */
@regClass()
export class RockAnimationManager extends BaseAnimationManager {

    // 动画资源路径配置
    private animationPaths = {
        [RockAnimationState.IDLE]: "resources/images/ANI/idle.atlas",
        [RockAnimationState.ATTACKING]: "resources/images/ANI/attacking.atlas",
        [RockAnimationState.WALKING]: "resources/images/ANI/walking.atlas",
        [RockAnimationState.DYING]: "resources/images/ANI/dying.atlas"
    };

    // 动画配置参数
    private animationConfigs = {
        [RockAnimationState.IDLE]: {
            interval: 100,
            wrapMode: 2, // PINGPONG 来回播放
            autoPlay: true,
            scale: 1.0,  // 缩放比例
            offsetX: 0,  // X轴偏移
            offsetY: 0   // Y轴偏移
        },
        [RockAnimationState.ATTACKING]: {
            interval: 80,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,  // 攻击时稍微放大
            offsetX: 0,
            offsetY: -10 // 向上偏移一点
        },
        [RockAnimationState.WALKING]: {
            interval: 60,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0
        },
        [RockAnimationState.DYING]: {
            interval: 120,
            wrapMode: 0, // POSITIVE 正序播放一次
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0
        }
    };

    constructor() {
        super();

        // 设置Rock特有的属性
        this.defaultState = RockAnimationState.IDLE;
        this.deathState = RockAnimationState.DYING;
        this.atlasOriginalWidth = 720;
        this.atlasOriginalHeight = 480;
    }

    // ========== 实现抽象方法 ==========

    /**
     * 获取动画状态枚举
     */
    protected getAnimationStates(): IAnimationState {
        return RockAnimationState;
    }

    /**
     * 获取动画资源路径
     */
    protected getAnimationPath(state: string): string {
        return this.animationPaths[state as RockAnimationState] || "";
    }

    /**
     * 获取动画配置
     */
    protected getAnimationConfig(state: string): IAnimationConfig | null {
        return this.animationConfigs[state as RockAnimationState] || null;
    }

    /**
     * 处理动画播放完成
     */
    protected handleAnimationComplete(state: string): void {
        switch (state) {
            case RockAnimationState.ATTACKING:
                // 攻击动画完成后回到idle状态
                this.changeState(RockAnimationState.IDLE);
                break;

            case RockAnimationState.DYING:
                // 死亡动画完成后，触发死亡事件
                this.onDeathComplete();
                break;

            // idle和walking通常是循环播放，不需要特殊处理
        }
    }

    /**
     * 死亡动画完成处理
     */
    private onDeathComplete(): void {
        console.log("Rock死亡动画播放完成");

        // 发送自定义事件通知其他系统
        this.owner.event("ROCK_DEATH_COMPLETE");
    }

    // ========== Rock特有的外部接口 ==========

    /**
     * 外部接口：开始攻击
     */
    public startAttack(): void {
        this.changeState(RockAnimationState.ATTACKING);
    }

    /**
     * 外部接口：开始移动
     */
    public startWalking(): void {
        this.changeState(RockAnimationState.WALKING);
    }

    /**
     * 外部接口：停止移动
     */
    public stopWalking(): void {
        this.changeState(RockAnimationState.IDLE);
    }

    /**
     * 外部接口：开始死亡
     */
    public startDying(): void {
        this.changeState(RockAnimationState.DYING);
    }

    /**
     * 获取当前是否为攻击状态
     */
    public isAttacking(): boolean {
        return this.getCurrentState() === RockAnimationState.ATTACKING;
    }

    /**
     * 获取当前是否为移动状态
     */
    public isWalking(): boolean {
        return this.getCurrentState() === RockAnimationState.WALKING;
    }
}
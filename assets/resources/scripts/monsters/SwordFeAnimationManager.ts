const { regClass } = Laya;
import { BaseAnimationManager, IAnimationState, IAnimationConfig } from "../BaseAnimationManager";
import { MonsterDisplayConfig } from "../MonsterDisplayConfig";

/**
 * SwordFe精灵动画状态枚举
 */
export enum SwordFeAnimationState {
    IDLE = "idle",
    ATTACKING = "attacking",
    WALKING = "walking",
    DYING = "dying"
}

/**
 * SwordFe精灵动画管理器
 * 继承自BaseAnimationManager，实现SwordFe特有的动画逻辑
 */
@regClass()
export class SwordFeAnimationManager extends BaseAnimationManager {

    // 动画资源路径配置
    private animationPaths = {
        [SwordFeAnimationState.IDLE]: "resources/images/ANI/swordfe/idle.atlas",
        [SwordFeAnimationState.ATTACKING]: "resources/images/ANI/swordfe/attack.atlas",
        [SwordFeAnimationState.WALKING]: "resources/images/ANI/swordfe/walk.atlas",
        [SwordFeAnimationState.DYING]: "resources/images/ANI/swordfe/die.atlas"
    };

    // 动画配置参数
    private animationConfigs = {
        [SwordFeAnimationState.IDLE]: {
            interval: 100,
            wrapMode: 2, // PINGPONG 来回播放
            autoPlay: true,
            scale: 1.0,  // 缩放比例
            offsetX: 0,  // X轴偏移
            offsetY: 0,   // Y轴偏移
            loop: true
        },
        [SwordFeAnimationState.ATTACKING]: {
            interval: 80,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,  // 攻击时稍微放大
            offsetX: 0,
            offsetY: -10, // 向上偏移一点
            loop: true
        },
        [SwordFeAnimationState.WALKING]: {
            interval: 60,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            loop: true,
            offsetY: 0
        },
        [SwordFeAnimationState.DYING]: {
            interval: 120,
            wrapMode: 0, // POSITIVE 正序播放一次
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            loop: false, // 播放一次
            offsetY: 0
        }
    };

    constructor() {
        super();

        // 设置SwordFe特有的属性
        this.defaultState = SwordFeAnimationState.IDLE;
        this.deathState = SwordFeAnimationState.DYING;

        // 从配置中获取图集尺寸
        const config = MonsterDisplayConfig.getMonsterAtlasConfig("SwordFe");
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
        return SwordFeAnimationState;
    }

    /**
     * 获取动画资源路径
     */
    protected getAnimationPath(state: string): string {
        return this.animationPaths[state as SwordFeAnimationState] || "";
    }

    /**
     * 获取动画配置
     */
    protected getAnimationConfig(state: string): IAnimationConfig | null {
        return this.animationConfigs[state as SwordFeAnimationState] || null;
    }

    /**
     * 处理动画播放完成
     */
    protected handleAnimationComplete(state: string): void {
        switch (state) {
            case SwordFeAnimationState.ATTACKING:
                // 攻击动画完成后回到idle状态
                this.changeState(SwordFeAnimationState.IDLE);
                break;

            case SwordFeAnimationState.DYING:
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
        console.log("SwordFe死亡动画完成");

        // 发送统一的死亡动画完成事件
        this.owner.event("DEATH_ANIMATION_COMPLETE");
    }

    // ========== SwordFe特有的外部接口 ==========

    /**
     * 外部接口：开始攻击
     */
    public startAttack(): void {
        this.changeState(SwordFeAnimationState.ATTACKING);
    }

    /**
     * 外部接口：开始移动
     */
    public startWalking(): void {
        this.changeState(SwordFeAnimationState.WALKING);
    }

    /**
     * 外部接口：停止移动
     */
    public stopWalking(): void {
        this.changeState(SwordFeAnimationState.IDLE);
    }

    /**
     * 外部接口：开始死亡
     */
    public startDying(): void {
        this.changeState(SwordFeAnimationState.DYING);
    }

    /**
     * 获取当前是否为攻击状态
     */
    public isAttacking(): boolean {
        return this.getCurrentState() === SwordFeAnimationState.ATTACKING;
    }

    /**
     * 获取当前是否为移动状态
     */
    public isWalking(): boolean {
        return this.getCurrentState() === SwordFeAnimationState.WALKING;
    }
}
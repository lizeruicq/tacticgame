 const { regClass } = Laya;
import { BaseAnimationManager, IAnimationState, IAnimationConfig } from "../BaseAnimationManager";
import { MonsterDisplayConfig } from "../MonsterDisplayConfig";

/**
 * Pastor动画状态枚举
 */
export enum PastorAnimationState {
    IDLE = "idle",
    WALKING = "walking",
    CASTING = "casting",
    DYING = "dying"
}

/**
 * Pastor动画管理器
 * 继承自BaseAnimationManager，实现Pastor特有的动画逻辑
 */
@regClass()
export class PastorAnimationManager extends BaseAnimationManager {

    // 动画资源路径配置
    private animationPaths: { [key: string]: string } = {
        [PastorAnimationState.IDLE]: "resources/images/ANI/pastor/idle.atlas",
        [PastorAnimationState.WALKING]: "resources/images/ANI/pastor/walking.atlas",
        [PastorAnimationState.CASTING]: "resources/images/ANI/pastor/casting.atlas",
        [PastorAnimationState.DYING]: "resources/images/ANI/pastor/dying.atlas"
    };

    // 动画配置参数
    private animationConfigs: { [key: string]: IAnimationConfig } = {
        [PastorAnimationState.IDLE]: {
            interval: 150,
            wrapMode: 2, // PINGPONG 来回播放
            autoPlay: true,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            loop: true
        },
        [PastorAnimationState.WALKING]: {
            interval: 100,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: true,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            loop: true
        },
        [PastorAnimationState.CASTING]: {
            interval: 120,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.1,  // 施法时稍微放大
            offsetX: 0,
            offsetY: -5, // 向上偏移一点
            loop: false  // 施法动画不循环
        },
        [PastorAnimationState.DYING]: {
            interval: 100,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            loop: false
        }
    };

    constructor() {
        super();

        // 设置Pastor特有的属性
        this.defaultState = PastorAnimationState.IDLE;
        this.deathState = PastorAnimationState.DYING;
        this.castingState = PastorAnimationState.CASTING;

        // 从配置中获取图集尺寸
        const config = MonsterDisplayConfig.getMonsterAtlasConfig("Pastor");
        if (config) {
            this.atlasOriginalWidth = config.originalWidth;
            this.atlasOriginalHeight = config.originalHeight;
        } else {
            // 备用默认值
            this.atlasOriginalWidth = 512;
            this.atlasOriginalHeight = 512;
        }
    }

    // ========== 实现BaseAnimationManager的抽象方法 ==========

    protected getAnimationStates(): IAnimationState {
        return PastorAnimationState;
    }

    protected getAnimationPath(state: string): string {
        return this.animationPaths[state] || "";
    }

    protected getAnimationConfig(state: string): IAnimationConfig | null {
        return this.animationConfigs[state] || null;
    }

    protected handleAnimationComplete(state: string): void {
        // console.log(`Pastor动画完成: ${state}`);

        switch (state) {
            case PastorAnimationState.CASTING:
                // 施法动画完成，回到idle状态
                this.changeState(PastorAnimationState.IDLE);
                break;

            case PastorAnimationState.DYING:
                // 死亡动画完成，触发死亡事件
                this.onDeathComplete();
                break;

            default:
                // 其他动画完成后的处理
                break;
        }
    }

    /**
     * 死亡动画完成处理
     */
    private onDeathComplete(): void {
        // console.log("Pastor死亡动画完成");

        // 发送统一的死亡动画完成事件
        this.owner.event("DEATH_ANIMATION_COMPLETE");
    }

    // ========== 公共动画控制方法 ==========

    /**
     * 开始施法动画
     */
    public startCasting(): void {
        this.changeState(PastorAnimationState.CASTING);
    }

    /**
     * 开始行走动画
     */
    public startWalking(): void {
        this.changeState(PastorAnimationState.WALKING);
    }

    /**
     * 停止行走，回到idle
     */
    public stopWalking(): void {
        this.changeState(PastorAnimationState.IDLE);
    }

    /**
     * 开始死亡动画
     */
    public startDying(): void {
        this.changeState(PastorAnimationState.DYING);
    }

    /**
     * 开始idle动画
     */
    public startIdle(): void {
        this.changeState(PastorAnimationState.IDLE);
    }

    // ========== 状态查询方法 ==========

    /**
     * 是否正在施法
     */
    public isCastingAnimation(): boolean {
        return this.getCurrentState() === PastorAnimationState.CASTING;
    }

    /**
     * 是否正在行走
     */
    public isWalkingAnimation(): boolean {
        return this.getCurrentState() === PastorAnimationState.WALKING;
    }

    /**
     * 是否处于idle状态
     */
    public isIdleAnimation(): boolean {
        return this.getCurrentState() === PastorAnimationState.IDLE;
    }
}

const { regClass } = Laya;
import { BaseAnimationManager, IAnimationState, IAnimationConfig } from "../BaseAnimationManager";
import { MonsterDisplayConfig } from "../MonsterDisplayConfig";

/**
 * Necromance精灵动画状态枚举
 */
export enum NecromanceAnimationState {
    IDLE = "idle",
    ATTACKING = "attacking",
    WALKING = "walking",
    DYING = "dying"
}

/**
 * Necromance精灵动画管理器
 * 继承自BaseAnimationManager，实现Necromance特有的动画逻辑
 */
@regClass()
export class NecromanceAnimationManager extends BaseAnimationManager {

    // 动画资源路径配置
    private animationPaths = {
        [NecromanceAnimationState.IDLE]: "resources/images/ANI/necromance/idle.atlas",
        [NecromanceAnimationState.ATTACKING]: "resources/images/ANI/necromance/attacking.atlas",
        [NecromanceAnimationState.WALKING]: "resources/images/ANI/necromance/walking.atlas",
        [NecromanceAnimationState.DYING]: "resources/images/ANI/necromance/dying.atlas"
    };

    // 动画配置参数
    private animationConfigs = {
        [NecromanceAnimationState.IDLE]: {
            interval: 100,
            wrapMode: 2, // PINGPONG 来回播放
            autoPlay: true,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0,
            loop: true
        },
        [NecromanceAnimationState.ATTACKING]: {
            interval: 80,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            offsetY: -10,
            loop: true
        },
        [NecromanceAnimationState.WALKING]: {
            interval: 60,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            loop: true,
            offsetY: 0
        },
        [NecromanceAnimationState.DYING]: {
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

        // 设置Necromance特有的属性
        this.defaultState = NecromanceAnimationState.IDLE;
        this.deathState = NecromanceAnimationState.DYING;

        // 从配置中获取图集尺寸
        const config = MonsterDisplayConfig.getMonsterAtlasConfig("Necromance");
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
        return NecromanceAnimationState;
    }

    /**
     * 获取动画资源路径
     */
    protected getAnimationPath(state: string): string {
        return this.animationPaths[state as NecromanceAnimationState] || "";
    }

    /**
     * 获取动画配置
     */
    protected getAnimationConfig(state: string): IAnimationConfig | null {
        return this.animationConfigs[state as NecromanceAnimationState] || null;
    }

    /**
     * 处理动画播放完成
     */
    protected handleAnimationComplete(state: string): void {
        switch (state) {
            case NecromanceAnimationState.ATTACKING:
                // 攻击动画完成后回到idle状态
                this.changeState(NecromanceAnimationState.IDLE);
                break;

            case NecromanceAnimationState.DYING:
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

    // ========== Necromance特有的外部接口 ==========

    /**
     * 外部接口：开始攻击
     */
    public startAttack(): void {
        this.changeState(NecromanceAnimationState.ATTACKING);
    }

    /**
     * 外部接口：开始移动
     */
    public startWalking(): void {
        this.changeState(NecromanceAnimationState.WALKING);
    }

    /**
     * 外部接口：停止移动
     */
    public stopWalking(): void {
        this.changeState(NecromanceAnimationState.IDLE);
    }

    /**
     * 外部接口：开始死亡
     */
    public startDying(): void {
        this.changeState(NecromanceAnimationState.DYING);
    }

    /**
     * 获取当前是否为攻击状态
     */
    public isAttacking(): boolean {
        return this.getCurrentState() === NecromanceAnimationState.ATTACKING;
    }

    /**
     * 获取当前是否为移动状态
     */
    public isWalking(): boolean {
        return this.getCurrentState() === NecromanceAnimationState.WALKING;
    }
}


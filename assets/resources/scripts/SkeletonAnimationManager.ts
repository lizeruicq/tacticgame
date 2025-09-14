const { regClass } = Laya;
import { BaseAnimationManager, IAnimationState, IAnimationConfig } from "./BaseAnimationManager";

/**
 * 骷髅精灵动画状态枚举
 */
export enum SkeletonAnimationState {
    IDLE = "idle",
    ATTACKING = "attacking", 
    WALKING = "walking",
    DYING = "dying",
    CASTING = "casting"  // 骷髅特有的施法动画
}

/**
 * 骷髅精灵动画管理器
 * 继承自BaseAnimationManager，实现骷髅特有的动画逻辑
 */
@regClass()
export class SkeletonAnimationManager extends BaseAnimationManager {
    
    // 动画资源路径配置
    private animationPaths = {
        [SkeletonAnimationState.IDLE]: "resources/images/ANI/skeleton_idle.atlas",
        [SkeletonAnimationState.ATTACKING]: "resources/images/ANI/skeleton_attacking.atlas", 
        [SkeletonAnimationState.WALKING]: "resources/images/ANI/skeleton_walking.atlas",
        [SkeletonAnimationState.DYING]: "resources/images/ANI/skeleton_dying.atlas",
        [SkeletonAnimationState.CASTING]: "resources/images/ANI/skeleton_casting.atlas"
    };
    
    // 动画配置参数
    private animationConfigs = {
        [SkeletonAnimationState.IDLE]: {
            interval: 120,
            wrapMode: 2, // PINGPONG 来回播放
            autoPlay: true,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0
        },
        [SkeletonAnimationState.ATTACKING]: {
            interval: 60,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.1,  // 攻击时稍微放大
            offsetX: 5,  // 向前突进
            offsetY: -5
        },
        [SkeletonAnimationState.WALKING]: {
            interval: 80,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            offsetY: 0
        },
        [SkeletonAnimationState.DYING]: {
            interval: 150,
            wrapMode: 0, // POSITIVE 正序播放一次
            autoPlay: false,
            scale: 1.0,
            offsetX: 0,
            offsetY: 10  // 倒下时向下偏移
        },
        [SkeletonAnimationState.CASTING]: {
            interval: 100,
            wrapMode: 0, // POSITIVE 正序播放
            autoPlay: false,
            scale: 1.2,  // 施法时放大
            offsetX: 0,
            offsetY: -15 // 向上偏移，显示法术效果
        }
    };
    
    constructor() {
        super();
        
        // 设置骷髅特有的属性
        this.defaultState = SkeletonAnimationState.IDLE;
        this.deathState = SkeletonAnimationState.DYING;
        this.atlasOriginalWidth = 512;  // 骷髅图集尺寸不同
        this.atlasOriginalHeight = 512;
    }
    
    // ========== 实现抽象方法 ==========
    
    /**
     * 获取动画状态枚举
     */
    protected getAnimationStates(): IAnimationState {
        return SkeletonAnimationState;
    }
    
    /**
     * 获取动画资源路径
     */
    protected getAnimationPath(state: string): string {
        return this.animationPaths[state as SkeletonAnimationState] || "";
    }
    
    /**
     * 获取动画配置
     */
    protected getAnimationConfig(state: string): IAnimationConfig | null {
        return this.animationConfigs[state as SkeletonAnimationState] || null;
    }
    
    /**
     * 处理动画播放完成
     */
    protected handleAnimationComplete(state: string): void {
        switch (state) {
            case SkeletonAnimationState.ATTACKING:
                // 攻击动画完成后回到idle状态
                this.changeState(SkeletonAnimationState.IDLE);
                break;
                
            case SkeletonAnimationState.CASTING:
                // 施法动画完成后回到idle状态
                this.changeState(SkeletonAnimationState.IDLE);
                // 触发施法完成事件
                this.owner.event("SKELETON_CAST_COMPLETE");
                break;
                
            case SkeletonAnimationState.DYING:
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
        console.log("骷髅死亡动画播放完成");
        
        // 发送自定义事件通知其他系统
        this.owner.event("SKELETON_DEATH_COMPLETE");
    }
    
    // ========== 骷髅特有的外部接口 ==========
    
    /**
     * 外部接口：开始攻击
     */
    public startAttack(): void {
        this.changeState(SkeletonAnimationState.ATTACKING);
    }
    
    /**
     * 外部接口：开始移动
     */
    public startWalking(): void {
        this.changeState(SkeletonAnimationState.WALKING);
    }
    
    /**
     * 外部接口：停止移动
     */
    public stopWalking(): void {
        this.changeState(SkeletonAnimationState.IDLE);
    }
    
    /**
     * 外部接口：开始死亡
     */
    public startDying(): void {
        this.changeState(SkeletonAnimationState.DYING);
    }
    
    /**
     * 外部接口：开始施法（骷髅特有）
     */
    public startCasting(): void {
        this.changeState(SkeletonAnimationState.CASTING);
    }
    
    /**
     * 获取当前是否为攻击状态
     */
    public isAttacking(): boolean {
        return this.getCurrentState() === SkeletonAnimationState.ATTACKING;
    }
    
    /**
     * 获取当前是否为移动状态
     */
    public isWalking(): boolean {
        return this.getCurrentState() === SkeletonAnimationState.WALKING;
    }
    
    /**
     * 获取当前是否为施法状态（骷髅特有）
     */
    public isCasting(): boolean {
        return this.getCurrentState() === SkeletonAnimationState.CASTING;
    }
}

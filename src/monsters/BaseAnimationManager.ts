const { regClass, property } = Laya;

/**
 * 通用动画状态接口
 */
export interface IAnimationState {
    [key: string]: string;
}

/**
 * 动画配置接口
 */
export interface IAnimationConfig {
    interval: number;    // 帧间隔时间
    wrapMode: number;    // 播放模式
    autoPlay: boolean;   // 是否自动播放
    scale: number;       // 缩放比例
    offsetX: number;     // X轴偏移
    offsetY: number;     // Y轴偏移
    loop: boolean;
}

/**
 * 通用动画管理器基类
 * 提供所有精灵动画的通用功能
 */
@regClass()
export abstract class BaseAnimationManager extends Laya.Script {
    
    @property({ type: Laya.Animation })
    public spriteAnimation: Laya.Animation;
    
    // 当前动画状态
    protected currentState: string = "";
    
    // 基础缩放值（用于适配图集尺寸）
    protected baseScale: number = 1.0;
    
    // 是否正在播放死亡动画
    protected isDying: boolean = false;
    
    // 默认状态名称
    protected defaultState: string = "idle";

    // 死亡状态名称
    protected deathState: string = "dying";

    // 施法状态名称
    protected castingState: string = "casting";

    // 是否正在施法
    protected isCasting: boolean = false;
    
    // 图集原始尺寸（子类需要设置）
    protected atlasOriginalWidth: number;
    protected atlasOriginalHeight: number;

    // 统一目标显示尺寸（所有怪物都会缩放到这个尺寸）
    protected static readonly UNIFIED_DISPLAY_WIDTH: number = 500;
    protected static readonly UNIFIED_DISPLAY_HEIGHT: number = 500;

    // 是否启用统一尺寸模式（可以通过这个开关控制）
    protected static readonly ENABLE_UNIFIED_SIZE: boolean = true;
    
    onAwake(): void {
        console.log(`=== ${this.constructor.name} 初始化 ===`);
        
        if (!this.spriteAnimation) {
            console.error("spriteAnimation 未设置！请在IDE中拖入Animation节点");
            return;
        }
        
        // 初始化动画尺寸和位置
        this.setupAnimationTransform();
        
        // 初始化动画系统
        this.initializeAnimation();
        
        // 切换到默认状态
        this.changeState(this.defaultState);
    }
    
    /**
     * 设置动画的尺寸和位置
     */
    protected setupAnimationTransform(): void {
        const sprite = this.owner as Laya.Sprite;
        
        // 获取精灵的尺寸
        const spriteWidth = sprite.width;
        const spriteHeight = sprite.height;
        
        console.log(`${this.constructor.name} 精灵尺寸: ${spriteWidth} x ${spriteHeight}`);
        
        // 设置锚点为中心
        this.spriteAnimation.anchorX = 0.5;
        this.spriteAnimation.anchorY = 0.5;
        
        // 设置位置为精灵的中心
        this.spriteAnimation.x = spriteWidth / 2;
        this.spriteAnimation.y = spriteHeight / 2;
        
        // 智能适配图集尺寸
        this.setupAtlasAdaptation();
        
        console.log(`Animation节点设置: 位置(${this.spriteAnimation.x}, ${this.spriteAnimation.y}), 锚点(0.5, 0.5)`);
    }
    
    /**
     * 智能适配图集尺寸
     */
    protected setupAtlasAdaptation(): void {
        let targetWidth: number;
        let targetHeight: number;

        if (BaseAnimationManager.ENABLE_UNIFIED_SIZE) {
            // 统一尺寸模式：所有怪物都缩放到相同大小
            targetWidth = BaseAnimationManager.UNIFIED_DISPLAY_WIDTH;
            targetHeight = BaseAnimationManager.UNIFIED_DISPLAY_HEIGHT;
            console.log(`使用统一尺寸模式: ${targetWidth}x${targetHeight}`);
        } else {
            // 原始模式：根据精灵容器尺寸适配
            const sprite = this.owner as Laya.Sprite;
            targetWidth = sprite.width;
            targetHeight = sprite.height;
            console.log(`使用容器适配模式: ${targetWidth}x${targetHeight}`);
        }

        // 计算合适的缩放比例
        const scaleX = targetWidth / this.atlasOriginalWidth;
        const scaleY = targetHeight / this.atlasOriginalHeight;

        // 取较小的缩放值以保持比例
        const baseScale = Math.min(scaleX, scaleY);

        // 存储基础缩放值
        this.baseScale = baseScale;

        console.log(`图集适配: 原始尺寸(${this.atlasOriginalWidth}x${this.atlasOriginalHeight}) → 目标尺寸(${targetWidth}x${targetHeight})`);
        console.log(`计算缩放: scaleX=${scaleX.toFixed(3)}, scaleY=${scaleY.toFixed(3)}, 基础缩放=${baseScale.toFixed(3)}`);
    }
    
    /**
     * 初始化动画组件
     */
    protected initializeAnimation(): void {
        // 监听动画播放完成事件
        this.spriteAnimation.on(Laya.Event.COMPLETE, this, this.onAnimationComplete);
        
        console.log(`${this.constructor.name} 动画管理器初始化完成`);
    }
    
    /**
     * 切换动画状态
     * @param newState 新的动画状态
     */
    public changeState(newState: string): void {
        // 如果正在死亡，不允许切换到其他状态
        if (this.isDying && newState !== this.deathState) {
            console.log("正在死亡中，无法切换状态");
            return;
        }
        
        // 如果状态相同，不需要切换
        if (this.currentState === newState) {
            console.log("状态相同，无需切换");
            return;
        }
        
        console.log(`切换动画状态: ${this.currentState} -> ${newState}`);
        
        this.currentState = newState;
        this.playAnimation(newState);
        
        // 设置死亡标记
        this.isDying = (newState === this.deathState);

        // 设置施法标记
        this.isCasting = (newState === this.castingState);
    }
    
    /**
     * 播放指定状态的动画
     * @param state 动画状态
     */
    protected playAnimation(state: string): void {
        const config = this.getAnimationConfig(state);
        const sourcePath = this.getAnimationPath(state);
        
        if (!config || !sourcePath) {
            console.error(`动画配置或资源路径不存在: ${state}`);
            return;
        }
        
        // 停止当前动画
        this.spriteAnimation.stop();
        
        // 设置新的动画资源和配置
        this.spriteAnimation.source = sourcePath;
        this.spriteAnimation.interval = config.interval;
        this.spriteAnimation.wrapMode = config.wrapMode;
        this.spriteAnimation.autoPlay = config.autoPlay;
        this.spriteAnimation.loop = config.loop;
        
        // 应用变换（缩放和位置偏移）
        this.applyAnimationTransform(config);
        
        // 如果不是自动播放，手动开始播放
        if (!config.autoPlay) {
            this.spriteAnimation.play();
        }
        
        console.log(`播放动画: ${state}, 间隔: ${config.interval}ms, 缩放: ${config.scale}, 偏移: (${config.offsetX}, ${config.offsetY})`);
    }
    
    /**
     * 应用动画变换（缩放和位置）
     * @param config 动画配置
     */
    protected applyAnimationTransform(config: IAnimationConfig): void {
        const sprite = this.owner as Laya.Sprite;
        const baseX = sprite.width / 2;
        const baseY = sprite.height / 2;
        
        // 计算最终缩放值：基础缩放 × 配置缩放
        const finalScale = this.baseScale * config.scale;
        
        // 应用缩放
        this.spriteAnimation.scaleX = finalScale;
        this.spriteAnimation.scaleY = finalScale;
        
        // 应用位置偏移
        this.spriteAnimation.x = baseX + config.offsetX;
        this.spriteAnimation.y = baseY + config.offsetY;
        
        console.log(`应用变换: 基础缩放(${this.baseScale.toFixed(3)}) × 配置缩放(${config.scale}) = 最终缩放(${finalScale.toFixed(3)})`);
        console.log(`位置: (${this.spriteAnimation.x}, ${this.spriteAnimation.y})`);
    }
    
    /**
     * 动画播放完成回调
     */
    protected onAnimationComplete(): void {
        // 调用子类的完成处理方法
        this.handleAnimationComplete(this.currentState);
    }
    
    /**
     * 获取当前动画状态
     */
    public getCurrentState(): string {
        return this.currentState;
    }
    
    /**
     * 检查是否正在死亡
     */
    public getIsDying(): boolean {
        return this.isDying;
    }

    /**
     * 检查是否正在施法
     */
    public getIsCasting(): boolean {
        return this.isCasting;
    }
    
    /**
     * 重置动画变换
     */
    public resetAnimationTransform(): void {
        this.setupAnimationTransform();
        console.log("重置动画变换");
    }

    /**
     * 设置统一显示尺寸（静态方法，影响所有怪物）
     */
    public static setUnifiedDisplaySize(width: number, height: number): void {
        // 注意：这需要修改为可配置的，这里只是示例
        console.log(`设置统一显示尺寸: ${width}x${height}`);
        console.log("注意：需要重新创建怪物才能生效");
    }

    /**
     * 获取当前统一显示尺寸
     */
    public static getUnifiedDisplaySize(): { width: number, height: number } {
        return {
            width: BaseAnimationManager.UNIFIED_DISPLAY_WIDTH,
            height: BaseAnimationManager.UNIFIED_DISPLAY_HEIGHT
        };
    }
    
    onDestroy(): void {
        // 清理事件监听
        if (this.spriteAnimation) {
            this.spriteAnimation.off(Laya.Event.COMPLETE, this, this.onAnimationComplete);
        }
        
        console.log(`${this.constructor.name} 销毁`);
    }
    
    // ========== 抽象方法，子类必须实现 ==========
    
    /**
     * 获取动画状态枚举（子类实现）
     */
    protected abstract getAnimationStates(): IAnimationState;
    
    /**
     * 获取动画资源路径（子类实现）
     * @param state 动画状态
     */
    protected abstract getAnimationPath(state: string): string;
    
    /**
     * 获取动画配置（子类实现）
     * @param state 动画状态
     */
    protected abstract getAnimationConfig(state: string): IAnimationConfig | null;
    
    /**
     * 处理动画播放完成（子类实现）
     * @param state 完成的动画状态
     */
    protected abstract handleAnimationComplete(state: string): void;
}

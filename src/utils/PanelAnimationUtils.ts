const { regClass } = Laya;

/**
 * 面板动画工具类
 * 为所有面板提供统一的打开和关闭动画效果
 */
@regClass()
export class PanelAnimationUtils {
    // 默认动画参数
    private static readonly DEFAULT_OPEN_SCALE: number = 1.0;
    private static readonly DEFAULT_CLOSE_SCALE: number = 0.0;
    private static readonly DEFAULT_DURATION: number = 300;
    
    /**
     * 为面板添加打开动画效果
     * @param panel 要添加动画的面板
     * @param onComplete 动画完成后的回调函数
     */
    public static playOpenAnimation(panel: Laya.Sprite, onComplete?: () => void): void {
        if (!panel) {
            console.warn("面板对象为空，无法添加打开动画效果");
            return;
        }

        // 设置初始状态（缩小到0）
        panel.scaleX = 0;
        panel.scaleY = 0;
        panel.visible = true;

        // 获取自定义参数或使用默认值
        const targetScale = PanelAnimationUtils.DEFAULT_OPEN_SCALE;
        const duration = PanelAnimationUtils.DEFAULT_DURATION;

        // 保存当前游戏速度
        const originalTimerScale = Laya.timer.scale;

        // 临时恢复游戏速度以执行动画
        Laya.timer.scale = 1;

        // 执行打开动画
        console.log("执行打开动画");
        Laya.Tween.to(panel, {
            scaleX: targetScale,
            scaleY: targetScale
        }, duration, Laya.Ease.backOut, Laya.Handler.create(null, () => {
            // 动画完成后恢复原来的游戏速度
            Laya.timer.scale = originalTimerScale;
            if (onComplete) onComplete();
        }), 0, true);
    }
    
    /**
     * 为面板添加关闭动画效果
     * @param panel 要添加动画的面板
     * @param onComplete 动画完成后的回调函数
     */
    public static playCloseAnimation(panel: Laya.Sprite, onComplete?: () => void): void {
        if (!panel) {
            console.warn("面板对象为空，无法添加关闭动画效果");
            if (onComplete) onComplete();
            return;
        }

        // 获取自定义参数或使用默认值
        const targetScale = (panel as any).closeScale || PanelAnimationUtils.DEFAULT_CLOSE_SCALE;
        const duration = (panel as any).animationDuration || PanelAnimationUtils.DEFAULT_DURATION;

        // 保存当前游戏速度
        const originalTimerScale = Laya.timer.scale;

        // 临时恢复游戏速度以执行动画
        Laya.timer.scale = 1;

        // 执行关闭动画
        Laya.Tween.to(panel, {
            scaleX: targetScale,
            scaleY: targetScale
        }, duration, Laya.Ease.backIn, Laya.Handler.create(null, () => {
            panel.visible = false;
            // 动画完成后恢复原来的游戏速度
            Laya.timer.scale = originalTimerScale;
            if (onComplete) onComplete();
        }), 0, true);
    }
    
    /**
     * 为面板设置自定义动画参数
     * @param panel 要设置参数的面板
     * @param openScale 打开时的目标缩放比例
     * @param closeScale 关闭时的目标缩放比例
     * @param duration 动画持续时间
     */
    public static setPanelAnimationParams(panel: Laya.Component, openScale: number, closeScale: number, duration: number): void {
        if (!panel) {
            console.warn("面板对象为空，无法设置动画参数");
            return;
        }
        
        // 将自定义参数存储在面板对象上，供动画方法使用
        (panel as any).openScale = openScale;
        (panel as any).closeScale = closeScale;
        (panel as any).animationDuration = duration;
    }
}
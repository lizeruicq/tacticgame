const { regClass } = Laya;

/**
 * 按钮动画工具类
 * 为所有按钮提供统一的点击动画效果
 */
@regClass()
export class ButtonAnimationUtils {
    // 默认动画参数
    private static readonly DEFAULT_SCALE: number = 1.1;
    private static readonly DEFAULT_DURATION: number = 100;
    
    /**
     * 为按钮添加点击动画效果
     * @param button 要添加动画的按钮
     */
    public static addButtonClickEffect(button: Laya.Button): void {
        if (!button) {
            // console.warn("按钮对象为空，无法添加点击动画效果");
            return;
        }
        
        // 添加触摸开始和结束事件，用于实现按钮动画效果（适配微信小游戏平台）
        button.on(Laya.Event.MOUSE_DOWN, this, this.onButtonTouchBegin, [button]);
        button.on(Laya.Event.MOUSE_UP, this, this.onButtonTouchEnd, [button]);
        button.on(Laya.Event.MOUSE_OUT, this, this.onButtonTouchEnd, [button]);
    }
    
    /**
     * 移除按钮的点击动画效果
     * @param button 要移除动画的按钮
     */
    public static removeButtonClickEffect(button: Laya.Button): void {
        if (!button) {
            // console.warn("按钮对象为空，无法移除点击动画效果");
            return;
        }
        
        // 移除事件监听
        button.off(Laya.Event.MOUSE_DOWN, this, this.onButtonTouchBegin);
        button.off(Laya.Event.MOUSE_UP, this, this.onButtonTouchEnd);
        button.off(Laya.Event.MOUSE_OUT, this, this.onButtonTouchEnd);
    }
    
    /**
     * 按钮触摸开始时的动画效果
     */
    private static onButtonTouchBegin(button: Laya.Button): void {
        if (button) {
            // 获取自定义参数或使用默认值
            const scale = (button as any).customScale || ButtonAnimationUtils.DEFAULT_SCALE;
            const duration = (button as any).customDuration || ButtonAnimationUtils.DEFAULT_DURATION;
            
            // 使用 Laya.Tween.to 创建缩放动画
            Laya.Tween.to(button, { 
                scaleX: scale, 
                scaleY: scale 
            }, duration, Laya.Ease.linearIn, null, 0, true);
        }
    }
    
    /**
     * 按钮触摸结束时恢复按钮状态
     */
    private static onButtonTouchEnd(button: Laya.Button): void {
        if (button) {
            // 获取自定义参数或使用默认值
            const duration = (button as any).customDuration || ButtonAnimationUtils.DEFAULT_DURATION;
            
            // 恢复按钮到原始大小
            Laya.Tween.to(button, { 
                scaleX: 1.5, 
                scaleY: 1.5 
            }, duration, Laya.Ease.linearIn, null, 0, true);
        }
    }
    
    /**
     * 为按钮设置自定义动画参数
     * @param button 要设置参数的按钮
     * @param scale 缩放比例
     * @param duration 动画持续时间
     */
    public static setButtonAnimationParams(button: Laya.Button, scale: number, duration: number): void {
        if (!button) {
            // console.warn("按钮对象为空，无法设置动画参数");
            return;
        }
        
        // 将自定义参数存储在按钮对象上，供动画方法使用
        (button as any).customScale = scale;
        (button as any).customDuration = duration;
    }
}
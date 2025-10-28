const { regClass, property } = Laya;
import { PanelAnimationUtils } from "../../../src/utils/PanelAnimationUtils";
import { SceneManager } from "../../../src/SceneManager";

/**
 * 游戏结束面板
 * 显示游戏结果（胜利或失败），包含返回菜单和重新开始按钮
 */
@regClass()
export class GameEndPanel extends Laya.Script {

    @property(Laya.Image)
    public resultImage: Laya.Image = null;

    @property(Laya.Label)
    public textLabel: Laya.Label = null;

    @property(Laya.Button)
    public menuButton: Laya.Button = null;

    @property(Laya.Button)
    public restartButton: Laya.Button = null;

    // 游戏结果状态
    private isWin: boolean = false;

    onAwake(): void {
        console.log("GameEndPanel 初始化");
        this.setupUI();
    }

    /**
     * 初始化UI
     */
    private setupUI(): void {
        // 绑定按钮事件
        if (this.menuButton) {
            this.menuButton.on(Laya.Event.CLICK, this, this.onMenuButtonClick);
        }

        if (this.restartButton) {
            this.restartButton.on(Laya.Event.CLICK, this, this.onRestartButtonClick);
        }

        // 初始化面板为隐藏状态
        const panelBox = this.owner as Laya.Box;
        panelBox.visible = false;
        panelBox.scaleX = 0;
        panelBox.scaleY = 0;
    }

    /**
     * 显示面板
     * @param win 是否胜利
     */
    public show(win: boolean): void {
        this.isWin = win;

        // 设置结果图片
        if (this.resultImage) {
            this.resultImage.skin = win 
                ? "resources/images/UI/win.png" 
                : "resources/images/UI/lose.png";
        }

        // 设置文本
        if (this.textLabel) {
            this.textLabel.text = win 
                ? "您保卫了部落！" 
                : "部落被攻陷了！";
        }

        // 播放打开动画
        const panelBox = this.owner as Laya.Box;
        PanelAnimationUtils.playOpenAnimation(panelBox);
    }

    /**
     * 隐藏面板
     */
    public hide(): void {
        const panelBox = this.owner as Laya.Box;
        PanelAnimationUtils.playCloseAnimation(panelBox);
    }

    /**
     * 菜单按钮点击事件
     */
    private onMenuButtonClick(): void {
        console.log("返回菜单按钮被点击");
        this.hide();

        // 切换到关卡选择场景
        try {
            const sceneManager = SceneManager.getInstance();
            if (sceneManager) {
                sceneManager.switchToLevelSelect();
            } else {
                console.error("无法获取SceneManager实例");
            }
        } catch (error) {
            console.error("切换到关卡选择场景时出错:", error);
        }
    }

    /**
     * 重新开始按钮点击事件
     */
    private onRestartButtonClick(): void {
        console.log("重新开始按钮被点击");
        this.hide();

        // 重新加载当前场景（重新开始关卡）
        try {
            const sceneManager = SceneManager.getInstance();
            if (sceneManager) {
                // 重新加载游戏场景
                sceneManager.switchToGameScene();
            } else {
                console.error("无法获取SceneManager实例");
            }
        } catch (error) {
            console.error("重新开始关卡时出错:", error);
        }
    }

    onDestroy(): void {
        // 清理事件监听
        if (this.menuButton) {
            this.menuButton.off(Laya.Event.CLICK, this, this.onMenuButtonClick);
        }

        if (this.restartButton) {
            this.restartButton.off(Laya.Event.CLICK, this, this.onRestartButtonClick);
        }
    }
}
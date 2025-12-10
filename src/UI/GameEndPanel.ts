const { regClass, property } = Laya;
import { PanelAnimationUtils } from "../../src/utils/PanelAnimationUtils";
import { SceneManager } from "../../src/SceneManager";
import { GameMainManager } from "../Manager/GameMainManager";

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

    @property({ type: Laya.Sprite })
    public fail: Laya.Sprite = null;  // 游戏失败图片

    @property({ type: Laya.Sprite })
    public star1: Laya.Sprite = null;  // 第一个星星

    @property({ type: Laya.Sprite })
    public star2: Laya.Sprite = null;  // 第二个星星

    @property({ type: Laya.Sprite })
    public star3: Laya.Sprite = null;  // 第三个星星

    // 游戏结果状态
    private isWin: boolean = false;

    // 星星动画配置
    private readonly starAnimDuration: number = 300;  // 单个星星动画时长（毫秒）
    private readonly starAnimDelay: number = 150;     // 星星之间的延迟（毫秒）
    private readonly starScaleMin: number = 0.0;      // 最小缩放（隐藏）
    private readonly starScaleMax: number = 1.0;      // 最大缩放（正常）

    onAwake(): void {
        // console.log("GameEndPanel 初始化");
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
                ? "你击退了侵略者！" 
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
     * 显示失败图片
     */
    public showFailImage(): void {
        this.fail.scaleX = this.starScaleMin;
        this.fail.scaleY = this.starScaleMin;
        this.fail.visible = false;
        Laya.timer.once(100, this, () => {
                this.playStarAnimation(this.fail);
            });
    }

    /**
     * 显示关卡星星
     * 根据获得的星星数量显示对应的星星，并播放从小到大的动画
     * @param stars 星星数量 (0-3)
     */
    public showStars(stars: number): void {
        if (stars == 0) {
            this.showFailImage();
        }
        // 确保星星数量在有效范围内
        const validStars = Math.max(0, Math.min(stars, 3));

        // 初始化所有星星为隐藏状态（缩放为0）
        this.star1.scaleX = this.starScaleMin;
        this.star1.scaleY = this.starScaleMin;
        this.star1.visible = false;

        this.star2.scaleX = this.starScaleMin;
        this.star2.scaleY = this.starScaleMin;
        this.star2.visible = false;

        this.star3.scaleX = this.starScaleMin;
        this.star3.scaleY = this.starScaleMin;
        this.star3.visible = false;

        // 根据星星数量显示对应的星星，并播放动画
        const starsArray = [this.star1, this.star2, this.star3];
        for (let i = 0; i < validStars; i++) {
            const star = starsArray[i];
            // 延迟显示和播放动画
            Laya.timer.once(i * this.starAnimDelay, this, () => {
                this.playStarAnimation(star);
            });
        }

        console.log(`GameEndPanel: 显示 ${validStars} 个星星`);
    }

    /**
     * 播放单个星星的从小到大动画
     * @param star 星星精灵
     */
    private playStarAnimation(star: Laya.Sprite): void {
        if (!star) return;

        // 显示星星
        star.visible = true;
        star.scaleX = this.starScaleMin;
        star.scaleY = this.starScaleMin;

        // 播放从小到大的缩放动画
        Laya.Tween.to(star, {
            scaleX: this.starScaleMax,
            scaleY: this.starScaleMax
        }, this.starAnimDuration, Laya.Ease.backOut);
    }

    /**
     * 菜单按钮点击事件
     */
    private onMenuButtonClick(): void {
        // console.log("返回菜单按钮被点击");
        this.hide();

        // 切换到关卡选择场景
        try {
            const sceneManager = SceneManager.getInstance();
            const gameMainManager = GameMainManager.getInstance();
            if (sceneManager &&  gameMainManager) {
                sceneManager.switchToLevelSelect();
                gameMainManager.restoreDefaultBgm();
            } else {
                // console.error("无法获取SceneManager实例");
            }
        } catch (error) {
            // console.error("切换到关卡选择场景时出错:", error);
        }
    }

    /**
     * 重新开始按钮点击事件
     */
    private onRestartButtonClick(): void {
        console.log("重新开始按钮被点击");
        this.hide();

        // 重新开始游戏场景（先退出再重新加载，确保完全重置）
        try {
            const sceneManager = SceneManager.getInstance();
            console.log("SceneManager 实例:", sceneManager);
            if (sceneManager) {
                // 使用 restartGameScene() 确保场景完全重置
                console.log("调用 restartGameScene()");
                sceneManager.restartGameScene().then(() => {
                    console.log("场景重启完成");
                }).catch((error) => {
                    console.error("场景重启失败:", error);
                });
            } else {
                console.error("无法获取SceneManager实例");
            }
        } catch (error) {
            console.error("重新开始关卡时出错:", error);
        }
    }

    onDisable(): void {
        // 清理事件监听
        if (this.menuButton) {
            this.menuButton.off(Laya.Event.CLICK, this, this.onMenuButtonClick);
        }

        if (this.restartButton) {
            this.restartButton.off(Laya.Event.CLICK, this, this.onRestartButtonClick);
        }
    }
}
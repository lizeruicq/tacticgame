const { regClass, property } = Laya;
import { ButtonAnimationUtils } from "../utils/ButtonAnimationUtils";
import { GameDataManager } from "../GameDataManager";
import { PanelAnimationUtils } from "../utils/PanelAnimationUtils";
import { SceneManager } from "../SceneManager";

/**
 * 关卡锁定面板脚本
 * 处理解锁所有关卡的逻辑
 */
@regClass()
export class LevelLockPanel extends Laya.Script {
    @property(Laya.Sprite)
    public unlockAllLevels: Laya.Sprite;

    @property(Laya.Sprite)
    public completeLevels: Laya.Sprite;

    @property(Laya.Button)
    public yesButton: Laya.Button;

    @property(Laya.Button)
    public closeButton: Laya.Button;

    onAwake(): void {
        this.initPanel();
    }

    onStart(): void {
        this.bindEvents();
    }

    /**
     * 初始化面板
     */
    private initPanel(): void {
        if (this.owner) {
            (this.owner as Laya.Sprite).visible = false;
        }
    }

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        if (this.yesButton) {
            this.yesButton.on(Laya.Event.CLICK, this, this.onYesButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.yesButton);
        }

        if (this.closeButton) {
            this.closeButton.on(Laya.Event.CLICK, this, this.onCloseButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.closeButton);
        }
    }

    /**
     * 显示面板
     */
    public show(): void {
        if (this.owner) {
            const gameDataManager = GameDataManager.getInstance();
            const maxUnlockedLevel = gameDataManager.getMaxUnlockedLevel();
            
            // 根据当前玩家最大解锁关卡决定显示哪个节点
            if (maxUnlockedLevel >= 11) {
                // 显示已完成所有关卡节点
                this.completeLevels.visible = true;
                this.unlockAllLevels.visible = false;
            } else {
                // 显示解锁所有关卡节点
                this.completeLevels.visible = false;
                this.unlockAllLevels.visible = true;
            }
            
            PanelAnimationUtils.playOpenAnimation(this.owner as Laya.Sprite);
        }
    }

    /**
     * 隐藏面板
     */
    public hide(): void {
        if (this.owner) {
            PanelAnimationUtils.playCloseAnimation(this.owner as Laya.Sprite, () => {
                (this.owner as Laya.Sprite).visible = false;
            });
        }
    }

    /**
     * 确认按钮点击事件
     */
    private onYesButtonClick(): void {
        const gameDataManager = GameDataManager.getInstance();
        // 解锁所有关卡（1-11）
        for (let i = 1; i <= 11; i++) {
            gameDataManager.unlockLevel(i);
        }
        
        // 隐藏面板
        this.hide();
        
        // 重新加载关卡选择场景
        const sceneManager = SceneManager.getInstance();
        sceneManager.switchToScene(SceneManager.SCENES.MAIN_MENU).then(() => {
            console.log("成功切换到主菜单场景");
        }).catch((error: any) => {
            console.error("切换到主菜单场景失败:", error);
        });
    }

    /**
     * 关闭按钮点击事件
     */
    private onCloseButtonClick(): void {
        this.hide();
    }

    onDisable(): void {
        if (this.yesButton) {
            this.yesButton.off(Laya.Event.CLICK, this, this.onYesButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.yesButton);
        }

        if (this.closeButton) {
            this.closeButton.off(Laya.Event.CLICK, this, this.onCloseButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.closeButton);
        }
    }
}
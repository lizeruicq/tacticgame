const { regClass, property } = Laya;
import { ButtonAnimationUtils } from "../../src/utils/ButtonAnimationUtils";
import { PanelAnimationUtils } from "../../src/utils/PanelAnimationUtils";
import { GameDataManager } from "../../src/GameDataManager";

@regClass()
export class SettingPanel extends Laya.Script {
    @property(Laya.Button)
    public closeButton: Laya.Button;

    @property(Laya.Button)
    public resetButton: Laya.Button;

    @property(Laya.Button)
    public mergesetButton: Laya.Button;

    @property(Laya.Sprite)
    public confirmPanel: Laya.Sprite;

    @property(Laya.Button)
    public yesButton: Laya.Button;

    @property(Laya.Button)
    public noButton: Laya.Button;

    private gameDataManager: GameDataManager;

    onAwake(): void {
        this.gameDataManager = GameDataManager.getInstance();
        this.initPanel();
    }

    onStart(): void {
        this.bindEvents();
        this.updateMergeButtonText();
        Laya.stage.on("GameDataReset", this, this.updateMergeButtonText);
    }

    private initPanel(): void {
        if (this.confirmPanel) {
            this.confirmPanel.visible = false;
        }
        
        if (this.owner) {
            (this.owner as Laya.Sprite).visible = false;
        }
    }

    private bindEvents(): void {
        if (this.closeButton) {
            this.closeButton.on(Laya.Event.CLICK, this, this.onCloseButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.closeButton);
        }

        if (this.resetButton) {
            this.resetButton.on(Laya.Event.CLICK, this, this.onResetButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.resetButton);
        }

        if (this.mergesetButton) {
            this.mergesetButton.on(Laya.Event.CLICK, this, this.onMergeSetButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.mergesetButton);
        }

        if (this.yesButton) {
            this.yesButton.on(Laya.Event.CLICK, this, this.onYesButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.yesButton);
        }

        if (this.noButton) {
            this.noButton.on(Laya.Event.CLICK, this, this.onNoButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.noButton);
        }
    }

    private updateMergeButtonText(): void {
        if (this.mergesetButton && this.gameDataManager) {
            const canMerge = this.gameDataManager.getCanEnemyMerge();
            this.mergesetButton.label = canMerge ? "敌人可合成" : "敌人不可合成";
        }
    }

    private onMergeSetButtonClick(): void {
        if (this.gameDataManager) {
            const currentStatus = this.gameDataManager.getCanEnemyMerge();
            this.gameDataManager.setCanEnemyMerge(!currentStatus);
            this.updateMergeButtonText();
        }
    }

    public show(): void {
        if (this.owner) {
            (this.owner as Laya.Sprite).visible = true;
            PanelAnimationUtils.playOpenAnimation(this.owner as Laya.Sprite);
        }
    }

    public hide(): void {
        if (this.owner) {
            PanelAnimationUtils.playCloseAnimation(this.owner as Laya.Sprite, () => {
                (this.owner as Laya.Sprite).visible = false;
            });
        }
    }

    private onCloseButtonClick(): void {
        this.hide();
    }

    private onResetButtonClick(): void {
        if (this.confirmPanel) {
            this.confirmPanel.visible = true;
            PanelAnimationUtils.playOpenAnimation(this.confirmPanel);
        }
    }

    private async onYesButtonClick(): Promise<void> {
        if (this.gameDataManager) {
            await this.gameDataManager.resetGameData();
        }

        if (this.confirmPanel) {
            this.confirmPanel.visible = false;
        }

        this.hide();
    }

    private onNoButtonClick(): void {
        if (this.confirmPanel) {
            PanelAnimationUtils.playCloseAnimation(this.confirmPanel, () => {
                this.confirmPanel.visible = false;
            });
        }
    }

    onDestroy(): void {
        // 移除UI按钮事件监听
        if (this.closeButton) {
            this.closeButton.off(Laya.Event.CLICK, this, this.onCloseButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.closeButton);
        }

        if (this.resetButton) {
            this.resetButton.off(Laya.Event.CLICK, this, this.onResetButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.resetButton);
        }

        if (this.mergesetButton) {
            this.mergesetButton.off(Laya.Event.CLICK, this, this.onMergeSetButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.mergesetButton);
        }

        if (this.yesButton) {
            this.yesButton.off(Laya.Event.CLICK, this, this.onYesButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.yesButton);
        }

        if (this.noButton) {
            this.noButton.off(Laya.Event.CLICK, this, this.onNoButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.noButton);
        }
        
        // 移除全局事件监听
        Laya.stage.off("GameDataReset", this, this.updateMergeButtonText);
    }
}
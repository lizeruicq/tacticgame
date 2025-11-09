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

        if (this.yesButton) {
            this.yesButton.on(Laya.Event.CLICK, this, this.onYesButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.yesButton);
        }

        if (this.noButton) {
            this.noButton.on(Laya.Event.CLICK, this, this.onNoButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.noButton);
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

    private onYesButtonClick(): void {
        if (this.gameDataManager) {
            this.gameDataManager.resetGameData();
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
        if (this.closeButton) {
            this.closeButton.off(Laya.Event.CLICK, this, this.onCloseButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.closeButton);
        }

        if (this.resetButton) {
            this.resetButton.off(Laya.Event.CLICK, this, this.onResetButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.resetButton);
        }

        if (this.yesButton) {
            this.yesButton.off(Laya.Event.CLICK, this, this.onYesButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.yesButton);
        }

        if (this.noButton) {
            this.noButton.off(Laya.Event.CLICK, this, this.onNoButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.noButton);
        }
    }
}
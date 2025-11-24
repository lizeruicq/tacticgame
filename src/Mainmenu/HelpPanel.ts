const { regClass, property } = Laya;
import { ButtonAnimationUtils } from "../../src/utils/ButtonAnimationUtils";
import { PanelAnimationUtils } from "../../src/utils/PanelAnimationUtils";

/**
 * 帮助面板脚本
 * 显示游戏帮助信息
 */
@regClass()
export class HelpPanel extends Laya.Script {
    @property(Laya.Button)
    public closeButton: Laya.Button;

    private vscrollBar: Laya.VScrollBar;

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
     * 初始化垂直滚动条
     */
   

    /**
     * 绑定事件
     */
    private bindEvents(): void {
        if (this.closeButton) {
            this.closeButton.on(Laya.Event.CLICK, this, this.onCloseButtonClick);
            ButtonAnimationUtils.addButtonClickEffect(this.closeButton);
        }
    }

    /**
     * 显示帮助面板
     */
    public show(): void {
        if (this.owner) {
            (this.owner as Laya.Sprite).visible = true;
            PanelAnimationUtils.playOpenAnimation(this.owner as Laya.Sprite);
        }
    }

    /**
     * 隐藏帮助面板
     */
    public hide(): void {
        if (this.owner) {
            PanelAnimationUtils.playCloseAnimation(this.owner as Laya.Sprite, () => {
                (this.owner as Laya.Sprite).visible = false;
            });
        }
    }

    /**
     * 关闭按钮点击事件
     */
    private onCloseButtonClick(): void {
        this.hide();
    }

    onDestroy(): void {
        if (this.closeButton) {
            this.closeButton.off(Laya.Event.CLICK, this, this.onCloseButtonClick);
            ButtonAnimationUtils.removeButtonClickEffect(this.closeButton);
        }
    }
}


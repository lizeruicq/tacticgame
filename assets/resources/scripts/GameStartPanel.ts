const { regClass, property } = Laya;
import { CardConfig } from "./CardConfig";

/**
 * 游戏开始说明面板
 * 显示关卡指引和怪物种类，包含开始按钮
 */
@regClass()
export class GameStartPanel extends Laya.Script {

    @property(Laya.Label)
    public guideLabel: Laya.Label = null;

    @property(Laya.Label)
    public monsterTypesLabel: Laya.Label = null;

    @property(Laya.Button)
    public startButton: Laya.Button = null;

    @property(Laya.Box)
    public panelBox: Laya.Box = null;

    // 当前关卡
    private currentLevel: number = 1;

    // 回调函数
    private onStartCallback: () => void = null;

    onAwake(): void {
        console.log("GameStartPanel 初始化");
        this.setupUI();
    }

    /**
     * 初始化UI
     */
    private setupUI(): void {
        // 绑定开始按钮事件
        if (this.startButton) {
            this.startButton.on(Laya.Event.CLICK, this, this.onStartButtonClick);
        }

        // 初始化面板为隐藏状态
        if (this.panelBox) {
            this.panelBox.visible = false;
        }
    }

    /**
     * 显示面板
     * @param level 关卡编号
     * @param onStart 开始按钮回调
     */
    public show(level: number, onStart: () => void): void {
        this.currentLevel = level;
        this.onStartCallback = onStart;

        // 获取关卡配置
        const levelConfig = CardConfig.getLevelConfig(level);
        if (!levelConfig) {
            console.error(`关卡 ${level} 配置不存在`);
            return;
        }

        // 更新指引文本
        if (this.guideLabel) {
            this.guideLabel.text = levelConfig.guide || `第 ${level} 关`;
        }

        // 更新怪物类型文本
        if (this.monsterTypesLabel) {
            const monsterText = levelConfig.monsterTypes 
                ? levelConfig.monsterTypes.join("\n")
                : "Rock\nWizard\nPastor";
            this.monsterTypesLabel.text = monsterText;
        }

        // 显示面板
        if (this.panelBox) {
            this.panelBox.visible = true;
        }

        console.log(`显示关卡 ${level} 的游戏说明面板`);
    }

    /**
     * 隐藏面板
     */
    public hide(): void {
        if (this.panelBox) {
            this.panelBox.visible = false;
        }
        console.log("隐藏游戏说明面板");
    }

    /**
     * 开始按钮点击事件
     */
    private onStartButtonClick(): void {
        console.log("开始游戏按钮被点击");
        this.hide();

        // 调用回调函数
        if (this.onStartCallback) {
            this.onStartCallback();
        }
    }

    onDestroy(): void {
        // 清理事件监听
        if (this.startButton) {
            this.startButton.off(Laya.Event.CLICK, this, this.onStartButtonClick);
        }
        this.onStartCallback = null;
    }
}


const { regClass, property } = Laya;
import { CardConfig } from "../Cards/CardConfig";
import { GameMainManager } from "../Manager/GameMainManager";
import { PanelAnimationUtils } from "../../src/utils/PanelAnimationUtils";

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

    @property(Laya.Image)
    public backgroundImage: Laya.Image = null;

    // 当前关卡
    private currentLevel: number = 1;

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

        // 初始化面板为隐藏状态（缩放为0，不可见）
        const panelBox = this.owner as Laya.Box;
        panelBox.visible = false;
        panelBox.scaleX = 0;
        panelBox.scaleY = 0;
    }

    /**
     * 显示面板
     * @param level 关卡编号
     */
    public show(level: number): void {
        this.currentLevel = level;

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

        // 加载故事背景图片
        this.loadStoryBackground(levelConfig);

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
     * 开始按钮点击事件
     */
    private onStartButtonClick(): void {
        console.log("开始游戏按钮被点击");
        this.hide();

        // 直接调用GameMainManager的resumeGame方法继续游戏
        try {
            const gameMainManager = GameMainManager.getInstance();
            if (gameMainManager) {
                gameMainManager.resumeGame();
            } else {
                console.error("无法获取GameMainManager实例");
            }
        } catch (error) {
            console.error("调用GameMainManager.resumeGame时出错:", error);
        }
    }

    /**
     * 加载故事背景图片
     * @param levelConfig 关卡配置
     */
    private loadStoryBackground(levelConfig: any): void {
        // 检查是否配置了故事背景图片路径
        if (!levelConfig.storyBackgroundImagePath) {
            console.warn(`关卡 ${this.currentLevel} 未配置故事背景图片路径`);
            return;
        }

        // 检查是否有背景图片组件
        if (!this.backgroundImage) {
            console.warn("GameStartPanel 未配置 backgroundImage 组件");
            return;
        }

        // 加载故事背景图片
        const imagePath = levelConfig.storyBackgroundImagePath;
        Laya.loader.load(imagePath).then(() => {
            const texture = Laya.loader.getRes(imagePath);
            if (texture && this.backgroundImage) {
                this.backgroundImage.texture = texture;
                console.log(`加载关卡 ${this.currentLevel} 故事背景图片成功: ${imagePath}`);
            } else {
                console.warn(`加载关卡 ${this.currentLevel} 故事背景图片失败: ${imagePath}`);
            }
        }).catch((error) => {
            console.error(`加载关卡 ${this.currentLevel} 故事背景图片出错: ${imagePath}`, error);
        });
    }

    onDisable(): void {
        // 清理事件监听
        if (this.startButton) {
            this.startButton.off(Laya.Event.CLICK, this, this.onStartButtonClick);
        }
    }
}


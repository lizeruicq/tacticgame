const { regClass } = Laya;
import { LevelSelectRTBase } from "./LevelSelectRT.generated";
import { SceneManager } from "./SceneManager";
import { GameDataManager } from "./GameDataManager";
import { ButtonAnimationUtils } from './utils/ButtonAnimationUtils';
import { HelpPanel } from './Mainmenu/HelpPanel';
import { LevelLockPanel } from './UI/LevelLockPanel';
@regClass()
export class LevelSelectRT extends LevelSelectRTBase {
    private selectedLevel: number = 1;
    private helpPanel: HelpPanel;

    /**
     * 组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
     */
    onAwake(): void {
        console.log("=== LevelSelectRT onAwake 执行 ===");

        // 检查节点是否存在
        console.log("节点状态:", {
            item0Tab: !!this.item0Tab,
            levelstack: !!this.levelstack,
            LevelList: !!this.LevelList
        });

        this.initComponents();
    }

    /**
     * 组件被启用后执行，比如节点被添加到舞台后
     */
    onEnable(): void {
        console.log("=== LevelSelectRT onEnable 执行 ===");
    }

    private initComponents(): void {
        console.log("初始化组件...");

        // 初始化Tab
        this.setupTabs();

        // 初始化关卡列表
        this.setupLevelList();

        // 初始化按钮
        this.setupButtons();
    }

    private setupTabs(): void {
        console.log("设置Tab组件...");

        if (!this.item0Tab || !this.levelstack) {
            console.error("Tab或ViewStack节点不存在");
            return;
        }

        // 设置默认选中
        this.item0Tab.selectedIndex = 0;
        this.levelstack.selectedIndex = 0;

        // 监听Tab变化
        this.item0Tab.on(Laya.Event.CHANGE, this, this.onTabChange);

        console.log("Tab组件设置完成");
    }

    private onTabChange(): void {
        if (!this.item0Tab || !this.levelstack) return;

        const index = this.item0Tab.selectedIndex;
        this.levelstack.selectedIndex = index;
        console.log("切换到Tab:", index);
    }

    private setupLevelList(): void {
        console.log("设置关卡列表...");

        if (!this.LevelList) {
            console.error("LevelList不存在");
            return;
        }

        try {
            // 创建简单的数据数组
            const data = [];
            for (let i = 1; i <= 10; i++) {
                data.push(i); // 直接使用数字，不用对象
            }


            // 安全地设置数组
            this.LevelList.array = data;

            this.LevelList.renderHandler = new Laya.Handler(this, this.renderLevelItem);

            console.log("关卡列表设置完成");
        } catch (error) {
            console.error("设置关卡列表失败:", error);
        }
    }

    private renderLevelItem(cell: Laya.Box, index: number): void {
        if (!cell) return;

        const levelNum = index + 1;
        const gameDataManager = GameDataManager.getInstance();
        const isUnlocked = gameDataManager.isLevelUnlocked(levelNum);

        // 查找Number标签
        const numberLabel = cell.getChildByName("Number") as Laya.Label;
        // 查找背景
        const bg = cell.getChildByName("listItemBG") as Laya.Image;

        if (!isUnlocked) {
            // 未解锁关卡：隐藏Number节点并替换背景图片
            if (numberLabel) {
                numberLabel.visible = false;
            }
            
            if (bg) {
                // 替换为锁图标
                bg.skin = "resources/images/UI/lock.png";
                bg.color = "#ffffff"; // 重置颜色
            }
        } else {
            // 已解锁关卡：显示Number节点并使用原有逻辑
            if (numberLabel) {
                numberLabel.visible = true;
                numberLabel.text = levelNum.toString();
            }
            
            if (bg) {
                if (levelNum === this.selectedLevel) {
                    // 已解锁且被选中：黄色
                    bg.color = "#ffff00";
                } else {
                    // 已解锁但未选中：白色
                    bg.color = "#ffffff";
                }
            }
        }

        // 绑定点击事件（只有已解锁的关卡才能点击）
        cell.off(Laya.Event.CLICK, this, this.onLevelClick);
        if (isUnlocked) {
            cell.on(Laya.Event.CLICK, this, this.onLevelClick, [levelNum]);
        }
    }

    private onLevelClick(levelNum: number): void {
        const gameDataManager = GameDataManager.getInstance();

        // 检查关卡是否已解锁
        if (!gameDataManager.isLevelUnlocked(levelNum)) {
            console.log("关卡未解锁:", levelNum);
            return;
        }

        console.log("点击关卡:", levelNum);
        this.selectedLevel = levelNum;
        if (this.LevelList) {
            this.LevelList.refresh();
        }
    }

    private setupButtons(): void {
        console.log("设置按钮...");

        // 设置开始按钮
        const startBtn = SceneManager.getChildSafe(this, "Start") as Laya.Button;
        if (startBtn) {
            startBtn.on(Laya.Event.CLICK, this, this.onStartClick);
            ButtonAnimationUtils.addButtonClickEffect(startBtn);
            console.log("Start按钮设置完成");
        } else {
            console.error("未找到Start按钮");
        }

        // 设置返回按钮
        const backBtn = SceneManager.getChildSafe(this, "Back") as Laya.Button;
        if (backBtn) {
            backBtn.on(Laya.Event.CLICK, this, this.onBackClick);
            ButtonAnimationUtils.addButtonClickEffect(backBtn);
            console.log("Back按钮设置完成");
        } else {
            console.error("未找到Back按钮");
        }

        // 设置帮助按钮
        const helpBtn = SceneManager.getChildSafe(this, "Help") as Laya.Button;
        if (helpBtn) {
            helpBtn.on(Laya.Event.CLICK, this, this.onHelpClick);
            ButtonAnimationUtils.addButtonClickEffect(helpBtn);
            console.log("Help按钮设置完成");
        } else {
            console.error("未找到Help按钮");
        }

        // 设置关卡解锁按钮
        const levelUnlockBtn = SceneManager.getChildSafe(this, "LevelUnlock") as Laya.Button;
        if (levelUnlockBtn) {
            levelUnlockBtn.on(Laya.Event.CLICK, this, this.onLevelUnlockClick);
            ButtonAnimationUtils.addButtonClickEffect(levelUnlockBtn);
        } else {
            console.error("未找到LevelUnlock按钮");
        }
    }

    

    private onStartClick(): void {
        const gameDataManager = GameDataManager.getInstance();

        // 检查关卡是否已解锁
        if (!gameDataManager.isLevelUnlocked(this.selectedLevel)) {
            console.log("关卡未解锁，无法开始游戏:", this.selectedLevel);
            return;
        }

        console.log("开始游戏，关卡:", this.selectedLevel);

        // 保存关卡编号
        Laya.LocalStorage.setItem("selectedLevel", this.selectedLevel.toString());

        // 切换到游戏场景
        const sceneManager = SceneManager.getInstance();
        sceneManager.switchToGameScene().then(() => {
            console.log("成功切换到游戏场景");
        }).catch((error) => {
            console.error("切换到游戏场景失败:", error);
        });
    }

    /**
     * 返回按钮点击事件
     */
    private onBackClick(): void {
        console.log("返回按钮被点击了！");

        // 切换回主菜单场景
        const sceneManager = SceneManager.getInstance();
        sceneManager.switchToScene(SceneManager.SCENES.MAIN_MENU).then(() => {
            console.log("成功切换到主菜单场景");
        }).catch((error: any) => {
            console.error("切换到主菜单场景失败:", error);
        });
    }

    /**
     * 帮助按钮点击事件
     */
    private onHelpClick(): void {
        console.log("帮助按钮被点击了！");

        // 如果还没有获取帮助面板实例，则先获取
        if (!this.helpPanel) {
            const panelNode = SceneManager.getChildSafe(this, "HelpPanel");
            if (panelNode) {
                this.helpPanel = panelNode.getComponent(HelpPanel);
            }
        }

        // 显示帮助面板
        if (this.helpPanel) {
            this.helpPanel.show();
        } else {
            console.warn("帮助面板未找到！");
        }
    }

    /**
     * 关卡解锁按钮点击事件
     */
    private onLevelUnlockClick(): void {
        console.log("关卡解锁按钮被点击了！");

        // 获取LevelLockPanel组件并显示
        const panelNode = SceneManager.getChildSafe(this, "LevelLockPanel");
        if (panelNode) {
            const levelLockPanel = panelNode.getComponent(LevelLockPanel);
            if (levelLockPanel) {
                levelLockPanel.show();
            } else {
                console.warn("LevelLockPanel组件未找到！");
            }
        } else {
            console.warn("LevelLockPanel节点未找到！");
        }
    }



    /**
     * 组件被禁用时执行，比如从节点从舞台移除后
     */
    // onDisable(): void {
    //     console.log("=== LevelSelectRT onDisable 执行 ===");
    // }

    /**
     * 销毁时执行
     */
    onDisable(): void {
        console.log("=== LevelSelectRT onDestroy 执行 ===");

        // 清理事件监听
        if (this.item0Tab) {
            this.item0Tab.off(Laya.Event.CHANGE, this, this.onTabChange);
        }

        const startBtn = SceneManager.getChildSafe(this, "Start") as Laya.Button;
        if (startBtn) {
            startBtn.off(Laya.Event.CLICK, this, this.onStartClick);
        }

        const backBtn = SceneManager.getChildSafe(this, "Back") as Laya.Button;
        if (backBtn) {
            backBtn.off(Laya.Event.CLICK, this, this.onBackClick);
        }

        const helpBtn = SceneManager.getChildSafe(this, "Help") as Laya.Button;
        if (helpBtn) {
            helpBtn.off(Laya.Event.CLICK, this, this.onHelpClick);
        }

        const levelUnlockBtn = SceneManager.getChildSafe(this, "LevelUnlock") as Laya.Button;
        if (levelUnlockBtn) {
            levelUnlockBtn.off(Laya.Event.CLICK, this, this.onLevelUnlockClick);
            // 清除按钮上的所有Tween动画
            Laya.Tween.clearAll(levelUnlockBtn);
        }
    }
}
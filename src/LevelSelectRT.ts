const { regClass } = Laya;
import { LevelSelectRTBase } from "./LevelSelectRT.generated";
import { SceneManager } from "./SceneManager";
import { GameDataManager } from "./GameDataManager";

@regClass()
export class LevelSelectRT extends LevelSelectRTBase {
    private selectedLevel: number = 1;

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
            for (let i = 1; i <= 30; i++) {
                data.push(i); // 直接使用数字，不用对象
            }

            console.log("创建数据:", data.length, "项");

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
        if (numberLabel) {
            numberLabel.text = levelNum.toString();
        }

        // 查找背景
        const bg = cell.getChildByName("listItemBG") as Laya.Image;
        if (bg) {
            if (!isUnlocked) {
                // 未解锁：灰色
                bg.color = "#cccccc";
            } else if (levelNum === this.selectedLevel) {
                // 已解锁且被选中：黄色
                bg.color = "#ffff00";
            } else {
                // 已解锁但未选中：白色
                bg.color = "#ffffff";
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

        const startBtn = this.getChildByName("Start") as Laya.Button;
        if (startBtn) {
            startBtn.on(Laya.Event.CLICK, this, this.onStartClick);
            console.log("Start按钮设置完成");
        } else {
            console.error("未找到Start按钮");
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
     * 组件被禁用时执行，比如从节点从舞台移除后
     */
    onDisable(): void {
        console.log("=== LevelSelectRT onDisable 执行 ===");
    }

    /**
     * 销毁时执行
     */
    onDestroy(): void {
        console.log("=== LevelSelectRT onDestroy 执行 ===");

        // 清理事件监听
        if (this.item0Tab) {
            this.item0Tab.off(Laya.Event.CHANGE, this, this.onTabChange);
        }

        const startBtn = this.getChildByName("Start") as Laya.Button;
        if (startBtn) {
            startBtn.off(Laya.Event.CLICK, this, this.onStartClick);
        }
    }
}
const { regClass, property } = Laya;
import { PlayerManager } from "./PlayerManager";
import { EnemyAIManager } from "./EnemyAIManager";
import { GameMainManager } from "./GameMainManager";
import { Castle } from "./Castle";
import { GameStartPanel } from "./GameStartPanel";
import { GameEndPanel } from "./GameEndPanel";

/**
 * UI管理器
 * 管理游戏中的所有UI组件，包括血条、魔法值、暂停按钮等
 */
@regClass()
export class UIManager extends Laya.Script {

    // UI组件引用
    @property({ type: Laya.ProgressBar })
    public playerHpBar: Laya.ProgressBar = null;

    @property({ type: Laya.ProgressBar })
    public enemyHpBar: Laya.ProgressBar = null;

    // 玩家与敌方能量条（Power）
    @property({ type: Laya.ProgressBar })
    public playerPowerBar: Laya.ProgressBar = null;

    @property({ type: Laya.ProgressBar })
    public enemyPowerBar: Laya.ProgressBar = null;

    @property({ type: Laya.Label })
    public manaText: Laya.Label = null;

    @property({ type: Laya.Button })
    public stopButton: Laya.Button = null;

    @property({ type: Laya.Box })
    public gameStartPanelBox: Laya.Box = null;

    // 游戏结束面板引用
    @property({ type: Laya.Box })
    public gameEndPanelBox: Laya.Box = null;

    // 提示标签
    @property({ type: Laya.Label })
    public hintLabel: Laya.Label = null;

    // 合成按钮
    @property({ type: Laya.Button })
    public mergeButton: Laya.Button = null;

    // 管理器引用
    private playerManager: PlayerManager = null;
    private enemyAIManager: EnemyAIManager = null;
    private gameMainManager: GameMainManager = null;
    private gameStartPanel: GameStartPanel = null;
    private gameEndPanel: GameEndPanel = null;

    // 标志位表示UIManager是否已完成初始化
    public static isInitialized: boolean = false;

    // 城堡引用
    private playerCastle: Castle = null;
    private enemyCastle: Castle = null;

    // 血条颜色配置
    private readonly COLOR_GREEN: string = "#00ff00ff";   // 绿色 (71%-100%)
    private readonly COLOR_YELLOW: string = "#ffff00";  // 黄色 (31%-70%)
    private readonly COLOR_RED: string = "#ff0000";     // 红色 (0%-30%)

    // 提示标签配置
    private hintDisplayTime: number = 2000;  // 显示时间（毫秒）
    private hintFadeDuration: number = 300;  // 渐显/渐隐时间（毫秒）

    onAwake(): void {
        // 延迟一帧执行初始化，确保所有管理器已完成初始化
        Laya.timer.once(1, this, () => {
            this.initializeManagers();
            this.initializeCastles();
            this.initializeUI();
            this.setupEventListeners();

            // 标记UIManager已完成初始化
            UIManager.isInitialized = true;
        });
    }

    /**
     * 初始化管理器引用
     */
    private initializeManagers(): void {
        // 获取GameMainManager节点
        const gameMainManagerNode = this.owner.scene.getChildByName("GameMainManager");

        // 从GameMainManager节点获取组件实例
        if (gameMainManagerNode) {
            this.playerManager = gameMainManagerNode.getComponent(PlayerManager);
            this.enemyAIManager = gameMainManagerNode.getComponent(EnemyAIManager);
            this.gameMainManager = gameMainManagerNode.getComponent(GameMainManager);
        } else {
            console.error("UIManager: 未找到GameMainManager节点");
        }

        // 如果通过节点获取失败，则尝试通过单例模式获取
        if (!this.playerManager) {
            try {
                this.playerManager = PlayerManager.getInstance();
            } catch (e) {
                console.error("UIManager: 无法通过单例获取PlayerManager实例", e);
            }
        }

        if (!this.enemyAIManager) {
            try {
                this.enemyAIManager = EnemyAIManager.getInstance();
            } catch (e) {
                console.error("UIManager: 无法通过单例获取EnemyAIManager实例", e);
            }
        }

        if (!this.gameMainManager) {
            try {
                this.gameMainManager = GameMainManager.getInstance();
            } catch (e) {
                console.error("UIManager: 无法通过单例获取GameMainManager实例", e);
            }
        }

        // 最终检查
        if (!this.playerManager) {
            console.error("UIManager: 未找到PlayerManager实例");
        } else {
            console.log("UIManager: 成功获取PlayerManager实例");
        }

        if (!this.enemyAIManager) {
            console.error("UIManager: 未找到EnemyAIManager实例");
        } else {
            console.log("UIManager: 成功获取EnemyAIManager实例");
        }

        if (!this.gameMainManager) {
            console.error("UIManager: 未找到GameMainManager实例");
        } else {
            console.log("UIManager: 成功获取GameMainManager实例");
        }
    }

    /**
     * 初始化城堡引用
     */
    private initializeCastles(): void {
        if (!this.gameMainManager) return;

        const gameScene = this.owner.scene;

        // 获取玩家城堡
        const playerCastleNode = gameScene.getChildByName("castle-self");
        if (playerCastleNode) {
            this.playerCastle = playerCastleNode.getComponent(Castle);
        }

        // 获取敌方城堡
        const enemyCastleNode = gameScene.getChildByName("castle-enemy");
        if (enemyCastleNode) {
            this.enemyCastle = enemyCastleNode.getComponent(Castle);
        }

        if (!this.playerCastle) {
            console.error("UIManager: 未找到玩家城堡");
        }
        if (!this.enemyCastle) {
            console.error("UIManager: 未找到敌方城堡");
        }
    }

    /**
     * 初始化UI组件
     */
    private initializeUI(): void {
        // 初始化暂停按钮
        if (this.stopButton) {
            this.stopButton.on(Laya.Event.CLICK, this, this.onStopButtonClick);
        }

        // 初始化合成按钮
        if (this.mergeButton) {
            this.mergeButton.on(Laya.Event.CLICK, this, this.onMergeButtonClick);
        }
        // this.gameStartPanel = this.gameStartPanelBox.getComponent(GameStartPanel);

        // 初始化游戏开始面板
        this.initializeGameStartPanel();

        // 初始化游戏结束面板
        this.initializeGameEndPanel();

        // 初始化显示（延迟一帧，确保所有组件已初始化）
        Laya.timer.once(100, this, () => {
            this.updatePlayerHealthBar();
            this.updateEnemyHealthBar();
            this.updateManaText();
            this.refreshPowerBars();
        });
    }

    /**
     * 初始化游戏开始面板
     */
    private initializeGameStartPanel(): void {
        if (this.gameStartPanelBox) {
            this.gameStartPanel = this.gameStartPanelBox.getComponent(GameStartPanel);
            if (!this.gameStartPanel) {
                this.gameStartPanel = this.gameStartPanelBox.addComponent(GameStartPanel);
            }
        }
        else {
            console.error("UIManager: 未找到游戏开始面板");
        }
    }

    /**
     * 初始化游戏结束面板
     */
    private initializeGameEndPanel(): void {
        if (this.gameEndPanelBox) {
            this.gameEndPanel = this.gameEndPanelBox.getComponent(GameEndPanel);
            if (!this.gameEndPanel) {
                this.gameEndPanel = this.gameEndPanelBox.addComponent(GameEndPanel);
            }
            console.log("UIManager: 游戏结束面板初始化完成");
        } else {
            console.warn("UIManager: 未找到游戏结束面板节点");
        }
    }

    /**
     * 设置事件监听
     */
    private setupEventListeners(): void {
        // 监听玩家城堡受伤事件
        if (this.playerCastle) {
            this.playerCastle.owner.on("CASTLE_DAMAGE_TAKEN", this, this.onPlayerCastleDamaged);
            this.playerCastle.owner.on("CASTLE_HEALED", this, this.onPlayerCastleHealed);
        }

        // 监听敌方城堡受伤事件
        if (this.enemyCastle) {
            this.enemyCastle.owner.on("CASTLE_DAMAGE_TAKEN", this, this.onEnemyCastleDamaged);
            this.enemyCastle.owner.on("CASTLE_HEALED", this, this.onEnemyCastleHealed);
        }

        // 监听魔法值变化（使用定时器，因为PlayerManager没有事件）
        // 每0.5秒检查一次魔法值变化
        Laya.timer.loop(500, this, this.updateManaText);

        // 监听 Power 变化，更新 Merge 按钮状态
        Laya.timer.loop(100, this, this.updateMergeButtonState);
    }

    /**
     * 玩家城堡受伤事件处理
     */
    private onPlayerCastleDamaged(): void {
        this.updatePlayerHealthBar();
    }

    /**
     * 玩家城堡治疗事件处理
     */
    private onPlayerCastleHealed(): void {
        this.updatePlayerHealthBar();
    }

    /**
     * 敌方城堡受伤事件处理
     */
    private onEnemyCastleDamaged(): void {
        this.updateEnemyHealthBar();
    }

    /**
     * 敌方城堡治疗事件处理
     */
    private onEnemyCastleHealed(): void {
        this.updateEnemyHealthBar();
    }

    /**
     * 更新玩家血条
     */
    private updatePlayerHealthBar(): void {
        if (!this.playerHpBar || !this.playerCastle) return;

        const currentHealth = this.playerCastle.getCurrentHealth();
        const maxHealth = this.playerCastle.getMaxHealth();
        const healthPercentage = currentHealth / maxHealth;

        this.playerHpBar.value = healthPercentage;
        this.updateHealthBarColor(this.playerHpBar, healthPercentage);
    }

    /**
     * 更新敌方血条
     */
    private updateEnemyHealthBar(): void {
        if (!this.enemyHpBar || !this.enemyCastle) return;

        const currentHealth = this.enemyCastle.getCurrentHealth();
        const maxHealth = this.enemyCastle.getMaxHealth();
        const healthPercentage = currentHealth / maxHealth;

        this.enemyHpBar.value = healthPercentage;
        this.updateHealthBarColor(this.enemyHpBar, healthPercentage);
    }

    /**
     * 更新魔法值文本
     */
    private updateManaText(): void {
        if (!this.manaText || !this.playerManager) return;

        const currentMana = this.playerManager.getPlayerMana();
        const maxMana = this.playerManager.getPlayerMaxMana();
        this.manaText.text = `魔法值：${currentMana}/${maxMana}`;
    }

    /**
     * 刷新双方能量条（Power）显示
     * UIManager 通过 GameMainManager 获取能量值
     */
    public refreshPowerBars(): void {
        if (!this.gameMainManager) {
            return;
        }

        // 玩家能量
        if (this.playerPowerBar) {
            const playerPower = this.gameMainManager.getPlayerPower();
            const clampedPlayerPower = Math.max(0, Math.min(playerPower, 100));
            this.playerPowerBar.value = clampedPlayerPower / 100;
        }

        // 敌方能量
        if (this.enemyPowerBar) {
            const enemyPower = this.gameMainManager.getEnemyPower();
            const clampedEnemyPower = Math.max(0, Math.min(enemyPower, 100));
            this.enemyPowerBar.value = clampedEnemyPower / 100;
        }
    }

    /**
     * 根据血量百分比更新血条颜色
     * @param progressBar 进度条组件
     * @param percentage 血量百分比 (0-1)
     */
    private updateHealthBarColor(progressBar: Laya.ProgressBar, percentage: number): void {
        let color: string;

        if (percentage > 0.7) {
            // 71%-100%: 绿色
            color = this.COLOR_GREEN;
        } else if (percentage > 0.3) {
            // 31%-70%: 黄色
            color = this.COLOR_YELLOW;
        } else {
            // 0%-30%: 红色
            color = this.COLOR_RED;
        }

        // 设置进度条颜色
        if (progressBar.bar) {
            (progressBar.bar as Laya.Image).color = color;
        }
    }

    /**
     * 暂停按钮点击事件
     */
    private onStopButtonClick(): void {
        console.log("暂停按钮被点击");
        this.showPauseMenu();
    }

    /**
     * 显示暂停菜单
     */
    private showPauseMenu(): void {
        // TODO: 实现暂停菜单逻辑
        // 1. 暂停游戏时间
        // 2. 显示暂停菜单UI
        // 3. 提供继续、重新开始、退出等选项
        this.gameMainManager.pauseGame()
        console.log("显示暂停菜单面板");

        // 临时实现：暂停游戏时间
        // Laya.timer.scale = Laya.timer.scale === 0 ? 1 : 0;
        // console.log(`游戏时间缩放: ${Laya.timer.scale === 0 ? "暂停" : "继续"}`);
    }

    /**
     * 合成按钮点击事件
     */
    private async onMergeButtonClick(): Promise<void> {
        // 检查玩家 Power 是否满
        if (!this.gameMainManager || this.gameMainManager.getPlayerPower() < 100) {
            return;
        }

        console.log("合成按钮被点击，执行怪物合成");

        // 执行合成
        await this.gameMainManager.synthesizeMonsters(true);

        // 合成完成后清空玩家 Power
        this.gameMainManager.resetPower(true);

        // 刷新 Power 条显示
        this.refreshPowerBars();
    }

    /**
     * 更新 Merge 按钮状态（根据玩家 Power 是否满）
     */
    private updateMergeButtonState(): void {
        if (!this.mergeButton || !this.gameMainManager) return;

        const playerPower = this.gameMainManager.getPlayerPower();
        const isFull = playerPower >= 100;

        // 根据 Power 是否满来设置按钮的可点击状态
        this.mergeButton.disabled = !isFull;
    }

    /**
     * 获取玩家城堡血量百分比
     */
    public getPlayerHealthPercentage(): number {
        if (!this.playerCastle) return 0;
        return this.playerCastle.getHealthPercentage();
    }

    /**
     * 获取敌方城堡血量百分比
     */
    public getEnemyHealthPercentage(): number {
        if (!this.enemyCastle) return 0;
        return this.enemyCastle.getHealthPercentage();
    }

    /**
     * 显示游戏开始面板
     * @param level 关卡编号
     */
    public showGameStartPanel(level: number): void {
        if (this.gameStartPanel) {
            this.gameStartPanel.show(level);
        } else {
            console.warn("GameStartPanel 组件未初始化");
        }
    }

    /**
     * 隐藏游戏开始面板
     */
    public hideGameStartPanel(): void {
        if (this.gameStartPanel) {
            this.gameStartPanel.hide();
        }
    }

    /**
     * 显示游戏结束面板
     * @param win 是否胜利
     */
    public showGameEndPanel(win: boolean): void {
        if (this.gameEndPanel) {
            this.gameEndPanel.show(win);
        } else {
            console.warn("GameEndPanel 组件未初始化");
        }
    }

    /**
     * 隐藏游戏结束面板
     */
    public hideGameEndPanel(): void {
        if (this.gameEndPanel) {
            this.gameEndPanel.hide();
        }
    }

    /**
     * 显示提示文本（渐显再渐隐）
     */
    public showHint(text: string): void {
        if (!this.hintLabel) return;

        // 清除之前的定时器
        Laya.timer.clear(this, this.hideHint);

        // 设置文本
        this.hintLabel.text = text;

        // 渐显
        this.hintLabel.alpha = 0;
        Laya.Tween.to(this.hintLabel, { alpha: 1 }, this.hintFadeDuration);

        // 设置显示时间后渐隐
        Laya.timer.once(this.hintDisplayTime, this, this.hideHint);
    }

    /**
     * 隐藏提示文本
     */
    private hideHint(): void {
        if (this.hintLabel) {
            Laya.Tween.to(this.hintLabel, { alpha: 0 }, this.hintFadeDuration);
        }
    }

    onDisable(): void {
        // // console.log("UIManager 禁用");
        // 清理事件监听

        if (this.stopButton) {
            this.stopButton.off(Laya.Event.CLICK, this, this.onStopButtonClick);
        }

        if (this.mergeButton) {
            this.mergeButton.off(Laya.Event.CLICK, this, this.onMergeButtonClick);
        }

        // 清理城堡事件监听
        if (this.playerCastle && this.playerCastle.owner) {
            this.playerCastle.owner.off("CASTLE_DAMAGE_TAKEN", this, this.onPlayerCastleDamaged);
            this.playerCastle.owner.off("CASTLE_HEALED", this, this.onPlayerCastleHealed);
        }

        if (this.enemyCastle && this.enemyCastle.owner) {
            this.enemyCastle.owner.off("CASTLE_DAMAGE_TAKEN", this, this.onEnemyCastleDamaged);
            this.enemyCastle.owner.off("CASTLE_HEALED", this, this.onEnemyCastleHealed);
        }

        // 清理所有定时器（包括 loop 和 once）
        Laya.timer.clearAll(this);

        // 重置初始化标志
        UIManager.isInitialized = false;

        // 清空引用
        this.playerManager = null;
        this.enemyAIManager = null;
        this.gameMainManager = null;
        this.playerCastle = null;
        this.enemyCastle = null;
    }
}


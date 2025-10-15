const { regClass, property } = Laya;
import { PlayerManager } from "./PlayerManager";
import { EnemyAIManager } from "./EnemyAIManager";
import { GameMainManager } from "./GameMainManager";
import { Castle } from "./Castle";

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

    @property({ type: Laya.Label })
    public manaText: Laya.Label = null;

    @property({ type: Laya.Button })
    public stopButton: Laya.Button = null;

    // 管理器引用
    private playerManager: PlayerManager = null;
    private enemyAIManager: EnemyAIManager = null;
    private gameMainManager: GameMainManager = null;

    // 城堡引用
    private playerCastle: Castle = null;
    private enemyCastle: Castle = null;

    // 血条颜色配置
    private readonly COLOR_GREEN: string = "#00ff00ff";   // 绿色 (71%-100%)
    private readonly COLOR_YELLOW: string = "#ffff00";  // 黄色 (31%-70%)
    private readonly COLOR_RED: string = "#ff0000";     // 红色 (0%-30%)

    onAwake(): void {
        // 延迟一帧执行初始化，确保所有管理器已完成初始化
        Laya.timer.once(1, this, () => {
            this.initializeManagers();
            this.initializeCastles();
            this.initializeUI();
            this.setupEventListeners();
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

        // 初始化显示（延迟一帧，确保所有组件已初始化）
        Laya.timer.once(100, this, () => {
            this.updatePlayerHealthBar();
            this.updateEnemyHealthBar();
            this.updateManaText();
        });
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
        this.manaText.text = `${currentMana}/${maxMana}`;
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
        
        console.log("显示暂停菜单（待实现）");
        
        // 临时实现：暂停游戏时间
        Laya.timer.scale = Laya.timer.scale === 0 ? 1 : 0;
        console.log(`游戏时间缩放: ${Laya.timer.scale === 0 ? "暂停" : "继续"}`);
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

    onDestroy(): void {
        // 清理事件监听
        if (this.stopButton) {
            this.stopButton.off(Laya.Event.CLICK, this, this.onStopButtonClick);
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

        // 清理定时器
        Laya.timer.clear(this, this.updateManaText);

        // 清空引用
        this.playerManager = null;
        this.enemyAIManager = null;
        this.gameMainManager = null;
        this.playerCastle = null;
        this.enemyCastle = null;
    }
}


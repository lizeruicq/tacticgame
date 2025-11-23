const { regClass, property } = Laya;
import { MonsterManager } from "./MonsterManager";
import { Castle } from "../monsters/Castle";
import { EnemyAIManager } from "./EnemyAIManager";
import { PlayerManager } from "./PlayerManager";
import { UIManager } from "./UIManager";
import { GameEndPanel } from "../UI/GameEndPanel";

@regClass()
export class GameMainManager extends Laya.Script {

    // 单例实例
    private static _instance: GameMainManager = null;

    // @property(String)
    // public text: string = "";

    // 获取传递的关卡数据
    private selectedLevel: number = 0;

    // 场景节点引用
    private battleField: Laya.Box = null;
    private spawnArea: Laya.Sprite = null;
    private lightings: Laya.Sprite = null;  // 闪电效果节点

    // 城堡引用
    private playerCastle: Castle = null;
    private enemyCastle: Castle = null;

    // 管理器引用
    private monsterManager: MonsterManager = null;
    private playerManager: PlayerManager = null;
    private enemyAIManager: EnemyAIManager = null;
    private uiManager: UIManager = null;
    
    // 游戏结束面板引用
    private gameEndPanel: GameEndPanel = null;

    // 游戏状态
    // private gameStarted: boolean = false;
    private gameEnded: boolean = false;
    private winner: string = ""; // "player" 或 "enemy"
    // private isPaused: boolean = true; // 游戏初始为暂停状态


    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        console.log("=== GameMainManager 初始化 ===");

        // 设置单例
        GameMainManager._instance = this;

        // 初始化场景节点引用
        this.initializeSceneNodes();

        // 初始化MonsterManager
        this.initializeMonsterManager();
        
        // 获取已挂载的PlayerManager和EnemyAIManager组件
        this.playerManager = this.owner.getComponent(PlayerManager);
        this.enemyAIManager = this.owner.getComponent(EnemyAIManager);

        this.initializeGame();

        // 初始化城堡系统
        this.initializeCastles();

        // 初始化游戏系统
        this.initializeGameSystems();


    }

    //组件被启用后执行，例如节点被添加到舞台后
    onEnable(): void {
        console.log("GameMainManager 启用");
    }

    //第一次执行update之前执行，只会执行一次
    onStart(): void {
        console.log("GameMainManager 开始");
        this.setupRockAnimation();
        this.startGameLoop();
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): GameMainManager {
        return GameMainManager._instance;
    }

    /**
     * 初始化场景节点引用
     */
    private initializeSceneNodes(): void {
        const gameScene = this.owner.scene;

        // 查找BattleField节点
        this.battleField = gameScene.getChildByName("BattleField") as Laya.Box;
        if (!this.battleField) {
            console.error("未找到BattleField节点！");
        } else {
            console.log(`BattleField节点初始化成功: ${this.battleField.width}x${this.battleField.height}`);
        }

        // 查找spawnArea节点
        this.spawnArea = this.battleField.getChildByName("spawnArea") as Laya.Sprite;
        if (!this.spawnArea) {
            console.error("未找到spawnArea节点！");
        } else {
            console.log(`spawnArea节点初始化成功: 中心(${this.spawnArea.x}, ${this.spawnArea.y}), 尺寸${this.spawnArea.width}x${this.spawnArea.height}`);
        }

        // 查找lightings节点
        this.lightings = this.battleField.getChildByName("lightings") as Laya.Sprite;
        if (!this.lightings) {
            console.warn("未找到lightings节点！");
        } else {
            console.log("lightings节点初始化成功");
        }
    }
    
    public showHint(text: string): void {
        if (this.uiManager) {
            this.uiManager.showHint(text);
        }
    }

    /**
     * 获取BattleField节点
     */
    public getBattleField(): Laya.Box {
        return this.battleField;
    }

    /**
     * 获取spawnArea节点
     */
    public getSpawnArea(): Laya.Sprite {
        return this.spawnArea;
    }

    /**
     * 初始化MonsterManager
     */
    private initializeMonsterManager(): void {
        console.log("初始化MonsterManager...");

        // 创建MonsterManager组件
        this.monsterManager = this.owner.addComponent(MonsterManager);

        console.log("MonsterManager初始化完成");
    }

    /**
     * 初始化游戏系统
     */
    private initializeGameSystems(): void {
        // 初始化UI管理器
        this.initializeUIManager();

        console.log("游戏系统初始化完成");
    }

    /**
     * 初始化UI管理器
     */
    private initializeUIManager(): void {
        const gameScene = this.owner.scene;
        const uiManagerNode = gameScene.getChildByName("UIManager");
        
        if (uiManagerNode) {
            this.uiManager = uiManagerNode.getComponent(UIManager);
            if (!this.uiManager) {
                console.error("未找到UIManager组件");
            }
        } else {
            console.error("未找到UIManager节点");
        }
        
        // 初始化游戏结束面板
        this.initializeGameEndPanel();
    }
    
    /**
     * 初始化游戏结束面板
     */
    private initializeGameEndPanel(): void {
        const gameScene = this.owner.scene;
        const endPanelNode = gameScene.getChildByName("EndPanel");
        
        if (endPanelNode) {
            this.gameEndPanel = endPanelNode.getComponent(GameEndPanel);
            if (!this.gameEndPanel) {
                this.gameEndPanel = endPanelNode.addComponent(GameEndPanel);
            }
            console.log("游戏结束面板初始化完成");
        } else {
            console.warn("未找到EndPanel节点");
        }
    }

    /**
     * 初始化敌人AI
     */
    private initializeEnemyAI(): void {
        console.log("初始化敌人AI...");

        if (this.enemyAIManager) {
            // 设置关卡
            this.enemyAIManager.setLevel(this.selectedLevel);
            console.log("敌人AI初始化完成");
        } else {
            console.warn("未找到EnemyAIManager组件，请确保已挂载到节点上");
        }
    }

    /**
     * 初始化城堡系统
     */
    private initializeCastles(): void {
        console.log("初始化城堡系统...");

        const gameScene = this.owner.scene;

        // 查找玩家城堡
        const playerCastleNode = gameScene.getChildByName("castle-self");
        if (playerCastleNode) {
            this.playerCastle = playerCastleNode.getComponent(Castle);
            if (this.playerCastle) {
                // 设置城堡为玩家阵营
                this.playerCastle.isPlayerCamp = true;

                console.log(`玩家城堡初始化完成，生命值: ${this.playerCastle.getCurrentHealth()}/${this.playerCastle.getMaxHealth()}`);
            } else {
                console.log("玩家城堡节点未找到Castle组件，请手动添加");
            }
        } else {
            console.log("未找到castle-self节点");
        }

        // 查找敌方城堡
        const enemyCastleNode = gameScene.getChildByName("castle-enemy");
        if (enemyCastleNode) {
            this.enemyCastle = enemyCastleNode.getComponent(Castle);
            if (this.enemyCastle) {
                // 设置城堡为敌方阵营
                this.enemyCastle.isPlayerCamp = false;

                console.log(`敌方城堡初始化完成，生命值: ${this.enemyCastle.getCurrentHealth()}/${this.enemyCastle.getMaxHealth()}`);
            } else {
                console.log("敌方城堡节点未找到Castle组件，请手动添加");
            }
        } else {
            console.log("未找到castle-enemy节点");
        }

        console.log("城堡系统初始化完成");
    }

    // ========== 游戏流程管理 ==========

    /**
     * 城堡被摧毁时的处理
     */
    private onCastleDestroyed(castleType: string): void {
        if (this.gameEnded) return;

        this.gameEnded = true;

        if (castleType === "player") {
            this.winner = "enemy";
            console.log("=== 游戏结束 ===");
            console.log("玩家城堡被摧毁，敌方获胜！");
        } else {
            this.winner = "player";
            console.log("=== 游戏结束 ===");
            console.log("敌方城堡被摧毁，玩家获胜！");
        }

        // 停止所有游戏系统
        this.stopGameSystems();

        // 触发游戏结束事件
        this.onGameEnd();
    }

    /**
     * 停止游戏系统
     */
    private stopGameSystems(): void {
        // 通知PlayerManager游戏结束
        if (this.playerManager) {
            this.playerManager.setGameEnded(true);
        }

        console.log("游戏系统已停止");
    }

    /**
     * 游戏结束处理
     */
    private onGameEnd(): void {
        console.log(`游戏结束，获胜方: ${this.winner}`);
        
        // 通过UIManager显示游戏结束面板
        this.showGameEndPanel();
    }
    
    /**
     * 显示游戏结束面板
     */
    private showGameEndPanel(): void {
        if (this.uiManager) {
            const isPlayerWin = this.winner === "player";
            this.uiManager.showGameEndPanel(isPlayerWin);
        } else {
            console.warn("UIManager未初始化，无法显示游戏结束面板");
        }
    }

    /**
     * 检查游戏是否结束
     */
    public isGameEnded(): boolean {
        if (this.playerManager) {
            return this.playerManager.isGameEnded();
        }
        return this.gameEnded;
    }

    /**
     * 获取获胜方
     */
    public getWinner(): string {
        return this.winner;
    }

    /**
     * 检查城堡状态并处理游戏结束
     */
    private checkCastleStatus(): void {
        if (this.gameEnded) return;

        // 检查玩家城堡
        if (this.playerCastle && this.playerCastle.getIsDestroyed()) {
            this.onCastleDestroyed("player");
            return;
        }

        // 检查敌方城堡
        if (this.enemyCastle && this.enemyCastle.getIsDestroyed()) {
            this.onCastleDestroyed("enemy");
            return;
        }
    }

    /**
     * 初始化游戏
     */
    private initializeGame(): void {
        console.log("初始化游戏系统...");

        // 获取关卡编号
        const levelStr = Laya.LocalStorage.getItem("selectedLevel");
        this.selectedLevel = levelStr ? parseInt(levelStr) : 1;
        console.log(`当前关卡: ${this.selectedLevel}`);
        this.initializeEnemyAI();
        // 获取UIManager
        const gameScene = this.owner.scene;
        const uiManagerNode = gameScene.getChildByName("UIParent");
        if (uiManagerNode) {
            this.uiManager = uiManagerNode.getComponent(UIManager);
        }

        // 初始化游戏开始面板
        this.initializeGameStartPanel();
    }

    /**
     * 初始化游戏开始面板
     */
    private initializeGameStartPanel(): void {
        if (!this.uiManager) {
            console.warn("UIManager未找到，无法显示游戏开始面板");
            return;
        }

        // 轮询检查UIManager是否已完成初始化
        const checkInitialization = () => {
            if (UIManager.isInitialized) {
                // UIManager已完成初始化，可以安全地暂停游戏
                this.pauseGame();
            } else {
                // 继续等待，下一帧再检查
                Laya.timer.frameOnce(1, this, checkInitialization);
            }
        };

        // 开始轮询检查
        checkInitialization();
    }

    /**
     * 暂停游戏
     */
    public pauseGame(): void {
        // this.isPaused = true;
        Laya.timer.scale = 0;
        
        // 显示游戏开始面板
        if (this.uiManager) {
            this.uiManager.showGameStartPanel(this.selectedLevel);
             console.log("游戏已暂停");
        }
        
       
    }

    /**
     * 继续游戏
     */
    public resumeGame(): void {
        this.uiManager.hideGameStartPanel();
        // this.isPaused = false;
        Laya.timer.scale = 1;
        console.log("游戏已继续");
    }

    /**
     * 设置Rock动画系统
     */
    private setupRockAnimation(): void {
        // 查找Rock精灵节点
        const battleField = this.owner.parent.getChildByName("BattleField") as Laya.Box;
        if (!battleField) {
            console.error("未找到BattleField节点");
            return;
        }

        // const rockSprite = battleField.getChildByName("Rock") as Laya.Sprite;
        // if (!rockSprite) {
        //     console.error("未找到Rock精灵节点");
        //     return;
        // }

        // 检查是否已经有RockMonster组件
        // this.rockMonster = rockSprite.getComponent(RockMonster);

        // console.log("Rock怪物信息:", this.rockMonster.getRockInfo());

        // // 设置Rock为玩家阵营（根据关卡需要调整）
        // this.rockMonster.isPlayerCamp = true;

        // 为了测试AI，创建一个敌方Rock怪物
        // this.createEnemyRockForTesting();

        // 监听怪物事件
        // this.setupMonsterEvents();


        console.log("Rock怪物系统设置完成");
    }

 


    /**
     * 创建敌方Rock怪物用于测试AI
     */
    private createEnemyRockForTesting(): void {
        console.log("创建敌方Rock怪物用于测试...");

        const monsterManager = MonsterManager.getInstance();
        const battleField = this.getBattleField();

        monsterManager.createMonster("Rock", false, { x: 600, y: 240 }, 1)
            .then((rockSprite) => {
                battleField.addChild(rockSprite);
                console.log(`敌方Rock怪物创建成功: ${rockSprite.name}`);
            });
    }

    
   

    /**
     * 开始游戏循环
     */
    private startGameLoop(): void {
        // this.gameStarted = true;
        console.log("游戏开始运行");

        // 启动游戏状态检查循环
        this.startGameStatusCheck();

    
    }

    /**
     * 启动游戏状态检查
     */
    private startGameStatusCheck(): void {
        // 每秒检查一次游戏状态
        Laya.timer.loop(1000, this, this.checkCastleStatus);
        console.log("游戏状态检查已启动");
    }

    /**
     * 启动魔法值恢复系统
     */
    private startManaRegeneration(): void {
        console.log("魔法值恢复系统已移至PlayerManager管理");
    }

    /**
     * 魔法值恢复
     */
    private regenerateMana(): void {
        // 魔法值恢复已移至PlayerManager管理
        console.log("魔法值恢复已移至PlayerManager管理");
    }

    
    /**
     * Rock死亡完成回调
     */
    private onRockDeath(): void {
        console.log("Rock死亡，游戏结束");

        // 这里可以处理游戏结束逻辑
        // 比如显示游戏结束界面、重置游戏等
    }

   

    /**
     * 获取玩家当前魔法值
     */
    public getPlayerMana(): number {
        if (this.playerManager) {
            return this.playerManager.getPlayerMana();
        }
        return 0;
    }

    /**
     * 获取玩家最大魔法值
     */
    public getPlayerMaxMana(): number {
        if (this.playerManager) {
            return this.playerManager.getPlayerMaxMana();
        }
        return 0;
    }

    /**
     * 消耗玩家魔法值
     */
    public consumeMana(amount: number): boolean {
        if (this.playerManager) {
            return this.playerManager.consumeMana(amount);
        }
        return false;
    }

    /**
     * 为指定阵营增加能量（Power）
     * @param isPlayerCamp 是否为玩家阵营（true 玩家，false 敌方）
     * @param amount 增加的能量值（等于受到的伤害值）
     */
    public addPower(isPlayerCamp: boolean, amount: number): void {
        if (amount <= 0) return;

        if (isPlayerCamp) {
            if (this.playerManager) {
                this.playerManager.addPower(amount);
            }
        } else {
            if (this.enemyAIManager) {
                this.enemyAIManager.addPower(amount);
            }
        }

        // 每次能量更新时，同步刷新UI中的能量条
        if (this.uiManager) {
            this.uiManager.refreshPowerBars();
        }
    }

    /**
     * 获取玩家当前能量值
     */
    public getPlayerPower(): number {
        if (this.playerManager) {
            return this.playerManager.getPlayerPower();
        }
        return 0;
    }

    /**
     * 获取敌方当前能量值
     */
    public getEnemyPower(): number {
        if (this.enemyAIManager) {
            return this.enemyAIManager.getEnemyPower();
        }
        return 0;
    }

    /**
     * 清空指定阵营的能量值
     * @param isPlayerCamp 是否为玩家阵营
     */
    public resetPower(isPlayerCamp: boolean): void {
        if (isPlayerCamp) {
            if (this.playerManager) {
                this.playerManager.resetPower();
            }
        } else {
            if (this.enemyAIManager) {
                this.enemyAIManager.resetPower();
            }
        }
    }

    /**
     * 合成怪物
     * @param isPlayerCamp 是否玩家阵营
     */
    public async synthesizeMonsters(isPlayerCamp: boolean): Promise<void> {
        if (this.monsterManager) {
            await this.monsterManager.synthesizeMonsters(isPlayerCamp);
        } else {
            console.error("GameMainManager: 无法获取MonsterManager实例");
        }
    }

    /**
     * 播放闪电效果动画
     * 1. lightings 节点显示
     * 2. cloud 节点渐显
     * 3. 闪电随机顺序闪烁
     * 4. 闪烁完成后 cloud 渐隐
     * 5. lightings 节点隐藏
     */
    public playLightningEffect(): void {
        if (!this.lightings) {
            console.warn("lightings节点不存在，无法播放闪电效果");
            return;
        }

        // 显示 lightings 节点
        this.lightings.visible = true;

        // 获取 cloud 节点
        const cloud = this.lightings.getChildByName("cloud") as Laya.Sprite;
        // 获取所有闪电子节点（排除 cloud）
        const lightningList: Laya.Sprite[] = [];
        for (let i = 0; i < this.lightings.numChildren; i++) {
            const child = this.lightings.getChildAt(i) as Laya.Sprite;
            if (child && child.name !== "cloud") {
                child.visible = false;  // 初始隐藏
                lightningList.push(child);
            }
        }

        if (lightningList.length === 0) {
            console.warn("lightings节点下没有闪电子节点");
            return;
        }

        // Cloud 渐显
        cloud.alpha = 0;
        Laya.Tween.to(cloud, { alpha: 1 }, 300, Laya.Ease.linearNone);

        // 延迟 300ms 后开始闪电动画
        Laya.timer.once(300, this, () => {
            // 随机打乱闪电顺序
            const shuffledList = this.shuffleArray([...lightningList]);

            // 依次播放每个闪电的闪烁动画
            let delay = 0;
            for (const lightning of shuffledList) {
                Laya.timer.once(delay, this, () => {
                    this.playLightningFlash(lightning);
                });
                delay += 300;  // 每个闪电间隔 300ms
            }

            // 计算所有闪电完成的时间
            const totalLightningDuration = delay + 300;  // 最后一个闪电的延迟 + 闪烁时间

            // 闪电完成后，cloud 渐隐
            Laya.timer.once(totalLightningDuration, this, () => {
                Laya.Tween.to(cloud, { alpha: 0 }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                    // Cloud 渐隐完成后，隐藏 lightings 节点
                    this.lightings.visible = false;
                }));
            });
        });
    }

    /**
     * 播放单个闪电的闪烁动画
     * @param lightning 闪电精灵
     */
    private playLightningFlash(lightning: Laya.Sprite): void {
        let flashCount = 0;
        const maxFlashes = 2;  // 闪烁2次
        const flashInterval = 200;  // 每次闪烁间隔 500ms

        const flashTimer = () => {
            if (flashCount >= maxFlashes * 2) {
                lightning.visible = false;
                return;
            }

            // 切换可见性（显示/隐藏）
            lightning.visible = !lightning.visible;
            flashCount++;

            // 继续下一次闪烁
            Laya.timer.once(flashInterval, this, flashTimer);
        };

        flashTimer();
    }

    /**
     * 随机打乱数组
     */
    private shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    //脚本禁用时执行
    onDisable(): void {
        // // console.log("GameMainManager 禁用");
        // 清理定时器
        Laya.timer.clearAll(this);

        // 重置游戏状态
        this.gameEnded = false;
        this.winner = "";

        // 清理单例引用
        GameMainManager._instance = null;
    }

    //每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onUpdate(): void {}

    //每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onLateUpdate(): void {}

    //鼠标点击后执行。与交互相关的还有onMouseDown等十多个函数，具体请参阅文档。
    //onMouseClick(): void {}
}
const { regClass, property } = Laya;
import { RockMonster } from "./RockMonster";
import { MonsterManager } from "./MonsterManager";
import { Castle } from "./Castle";

@regClass()
export class GameMainManager extends Laya.Script {

    // 单例实例
    private static _instance: GameMainManager = null;

    @property(String)
    public text: string = "";

    // 获取传递的关卡数据
    private selectedLevel: number = 1;

    // 场景节点引用
    private battleField: Laya.Box = null;
    private spawnArea: Laya.Sprite = null;

    // // Rock怪物引用
    // private rockMonster: RockMonster;

    // 城堡引用
    private playerCastle: Castle = null;
    private enemyCastle: Castle = null;

    // 管理器引用
    private monsterManager: MonsterManager = null;

    // 游戏状态
    private gameStarted: boolean = false;

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        console.log("=== GameMainManager 初始化 ===");

        // 设置单例
        GameMainManager._instance = this;

        // 初始化场景节点引用
        this.initializeSceneNodes();

        // 初始化MonsterManager
        this.initializeMonsterManager();

        // 初始化城堡系统
        this.initializeCastles();

        this.initializeGame();
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
     * 初始化城堡系统
     */
    private initializeCastles(): void {
        console.log("初始化城堡系统...");

        // 暂时跳过城堡初始化，等待场景中手动配置Castle组件
        console.log("城堡系统需要在场景中手动配置Castle组件");
        console.log("请为 'castle-self' 和 'castle-enemy' 节点添加Castle脚本组件");

        console.log("城堡系统初始化完成");
    }

    /**
     * 初始化游戏
     */
    private initializeGame(): void {
        console.log("初始化游戏系统...");

        // 这里可以初始化其他游戏系统
        // 比如敌人管理器、卡牌系统等
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
        this.createEnemyRockForTesting();

        // 监听怪物事件
        // this.setupMonsterEvents();


        console.log("Rock怪物系统设置完成");
    }

    /**
     * 设置怪物事件监听
     * 简化版本：只监听核心事件
     */
    // private setupMonsterEvents(): void {
    //     const rockSprite = this.rockMonster.owner;

    //     // 核心事件：血量变化（用于更新血条）
    //     rockSprite.on("MONSTER_DAMAGE_TAKEN", this, this.onMonsterDamageTaken);
    //     rockSprite.on("MONSTER_HEALED", this, this.onMonsterHealed);
    //     rockSprite.on("MONSTER_DEATH", this, this.onMonsterDeath);

    //     console.log("怪物核心事件监听设置完成");
    // }



    /**
     * 创建敌方Rock怪物用于测试AI
     */
    private createEnemyRockForTesting(): void {
        console.log("创建敌方Rock怪物用于测试...");

        // 使用类似RockCard中的方法加载并创建Rock预制体
        this.loadAndCreateRockPrefab({x: 600, y: 240});
    }

    /**
     * 加载并创建Rock预制体（参考RockCard中的实现）
     */
    private loadAndCreateRockPrefab(position: {x: number, y: number}): void {
        const rockPrefabPath = "prefabs/Rock.lh";
        console.log(`加载Rock预制体: ${rockPrefabPath}`);

        // 使用LayaAir的预制体加载方法
        Laya.loader.load(rockPrefabPath).then(() => {
            // 创建预制体实例
            const rockPrefab = Laya.loader.getRes(rockPrefabPath);
            

            // 实例化预制体
            const rockSprite = Laya.Pool.getItemByCreateFun("Rock", rockPrefab.create, rockPrefab) as Laya.Sprite;

            // 设置位置和名称
            rockSprite.name = `EnemyRock_${Date.now()}`;
            rockSprite.pos(position.x, position.y);

            // 获取RockMonster组件并设置属性
            const rockMonster = rockSprite.getComponent(RockMonster);
            if (rockMonster) {
                rockMonster.isPlayerCamp = false; // 设置为敌方阵营
                rockMonster.setRockLevel(1);
                console.log(`设置Rock属性: 阵营=敌方, 等级=1`);
            } else {
                console.error("Rock预制体中未找到RockMonster组件！");
                // 降级到原来的创建方法
                return;
            }

            // 添加到战场
            const battleField = this.getBattleField();
            if (battleField) {
                battleField.addChild(rockSprite);
                console.log(`敌方Rock预制体生成成功: ${rockSprite.name}, 位置: (${position.x}, ${position.y})`);
            } else {
                console.error("无法获取BattleField节点");
            }

        }).catch((error) => {
            console.error(`加载Rock预制体失败: ${error}`);
            return;
        });
    }

   

    /**
     * 开始游戏循环
     */
    private startGameLoop(): void {
        this.gameStarted = true;
        console.log("游戏开始运行");

        // 模拟游戏事件（实际项目中这些应该由具体的游戏逻辑触发）
        // this.simulateGameEvents();

        // // 测试怪物系统
        // this.testMonsterSystem();

        // // 测试怪物AI系统
        // this.testMonsterAI();
    }

    /**
     * 模拟游戏事件（用于测试动画切换）
     * 注意：这个方法与testMonsterSystem()并行执行，时间线会交错
     */
    // private simulateGameEvents(): void {
    //     console.log("=== 开始模拟游戏事件序列 ===");

    //     // 3秒后模拟敌人出现
    //     Laya.timer.once(3000, this, () => {
    //         console.log("🎯 游戏事件: 敌人出现！");

    //         // Rock开始移动迎敌 - 这里可以设置目标或触发其他行为
    //         if (this.rockMonster) {
    //             console.log("Rock检测到敌人，准备应战");
    //             // 实际游戏中这里会设置攻击目标
    //             // this.rockMonster.setTarget(enemyMonster);
    //         }
    //     });

    //     // 6秒后模拟攻击
    //     Laya.timer.once(6000, this, () => {
    //         console.log("🎯 游戏事件: Rock开始攻击！");

    //         if (this.rockMonster) {
    //             // 模拟攻击 - 实际游戏中会有具体的目标
    //             console.log("Rock执行攻击动作");
    //             // this.rockMonster.forceAttack(targetMonster);
    //         }
    //     });

    //     // 9秒后模拟移动
    //     Laya.timer.once(9000, this, () => {
    //         console.log("🎯 游戏事件: Rock开始移动");

    //         if (this.rockMonster) {
    //             console.log("Rock开始移动状态");
    //             // 实际游戏中会通过设置目标来触发移动
    //         }
    //     });

    //     // 12秒后停止移动
    //     Laya.timer.once(12000, this, () => {
    //         console.log("🎯 游戏事件: Rock停止移动");

    //         if (this.rockMonster) {
    //             console.log("Rock停止移动");
    //             // 实际游戏中会通过清除目标来停止移动
    //         }
    //     });

    //     // 15秒后模拟受伤
    //     Laya.timer.once(15000, this, () => {
    //         console.log("🎯 游戏事件: Rock受到环境伤害！");

    //         if (this.rockMonster) {
    //             // 模拟受到50点环境伤害
    //             console.log("Rock受到环境伤害50点");
    //             this.rockMonster.takeDamage(50, this.rockMonster);
    //         }
    //     });

    //     console.log("游戏事件定时器已设置完成");
    // }

    /**
     * Rock死亡完成回调
     */
    private onRockDeath(): void {
        console.log("Rock死亡，游戏结束");

        // 这里可以处理游戏结束逻辑
        // 比如显示游戏结束界面、重置游戏等
    }

    // ========== 怪物事件处理方法 ==========

    // ========== 核心事件处理方法 ==========

    /**
     * 怪物受到伤害事件 - 更新血条
     */
    // private onMonsterDamageTaken(data: any): void {
    //     const { target, damage, attacker } = data;
    //     console.log(`${target.constructor.name} 受到 ${damage} 点伤害，来自 ${attacker.constructor.name}`);

    //     // 更新血条显示
    //     this.updateHealthBar(target);
    // }

    /**
     * 怪物治疗事件 - 更新血条
     */
    // private onMonsterHealed(data: any): void {
    //     const { monster, amount } = data;
    //     console.log(`${monster.constructor.name} 恢复了 ${amount} 点血量`);

    //     // 更新血条显示
    //     this.updateHealthBar(monster);
    // }

    /**
     * 怪物死亡事件 - 处理死亡逻辑
     */
    // private onMonsterDeath(data: any): void {
    //     const { monster } = data;
    //     // 这里可以处理死亡奖励、经验值等
    //     // 隐藏血条
    //     HealthBarManager.hideHealthBar(monster);
    // }

    /**
     * 更新血条显示
     */
    // private updateHealthBar(monster: any): void {
    //     // 使用专门的血条管理器来处理血条更新
    //     HealthBarManager.updateMonsterHealthBar(monster);
    // }

    // ========== 测试方法 ==========

    /**
     * 测试怪物系统
     * 注意：这个方法与simulateGameEvents()并行执行，时间线会交错
     */
    // private testMonsterSystem(): void {
    //     if (!this.rockMonster) {
    //         console.log("Rock怪物未初始化，跳过测试");
    //         return;
    //     }

    //     console.log("=== 开始测试怪物系统 ===");
    //     console.log("Rock怪物信息:", this.rockMonster.getRockInfo());

    //     // 测试序列 - 使用setTimeout而不是Laya.timer以区分两个测试系统
    //     setTimeout(() => {
    //         console.log("🧪 怪物测试1: Rock受到30点伤害");
    //         this.rockMonster.takeDamage(30, this.rockMonster);
    //     }, 2000);

    //      setTimeout(() => {
    //         console.log("🧪 怪物测试2: Rock行走");
    //     }, 4000);

    //     setTimeout(() => {
    //         console.log("🧪 怪物测试3: Rock恢复20点血量");
    //         this.rockMonster.heal(20);
    //     }, 6000);

    //     setTimeout(() => {
    //         console.log("🧪 怪物测试4: 设置Rock等级为3");
    //         this.rockMonster.setRockLevel(3);
    //         console.log("升级后信息:", this.rockMonster.getRockInfo());
    //     }, 8000);

    //     setTimeout(() => {
    //         console.log("🧪 怪物测试5: Rock受到致命伤害");
    //         this.rockMonster.takeDamage(200, this.rockMonster);
    //     }, 10000);

    //     console.log("怪物系统测试定时器已设置完成");
    // }

    /**
     * 测试怪物AI系统
     */
    // private testMonsterAI(): void {
    //     console.log("=== 开始测试怪物AI系统 ===");

    //     // 等待5秒后开始AI测试
    //     setTimeout(() => {
    //         console.log("🤖 AI测试1: 检查MonsterManager状态");
    //         const manager = MonsterManager.getInstance();
    //         if (manager) {
    //             console.log("MonsterManager状态:", manager.getManagerInfo());
    //         }
    //     }, 5000);

    //     // 等待8秒后测试目标搜索
    //     setTimeout(() => {
    //         console.log("🤖 AI测试2: 测试目标搜索");
    //         if (this.rockMonster) {
    //             const target = this.rockMonster.getCurrentTarget();
    //             if (target) {
    //                 const targetName = target instanceof BaseMonster ? target.constructor.name : 'Castle';
    //                 console.log(`Rock当前目标: ${targetName}`);
    //             } else {
    //                 console.log("Rock当前无目标，尝试寻找目标...");
    //                 // 手动触发目标搜索
    //                 const manager = MonsterManager.getInstance();
    //                 if (manager) {
    //                     const newTarget = manager.findNearestEnemyTarget(this.rockMonster);
    //                     if (newTarget) {
    //                         const targetName = newTarget instanceof BaseMonster ? newTarget.constructor.name : 'Castle';
    //                         console.log(`为Rock找到新目标: ${targetName}`);
    //                         this.rockMonster.setTarget(newTarget);
    //                     } else {
    //                         console.log("未找到任何敌方目标");
    //                     }
    //                 }
    //             }
    //         }
    //     }, 8000);

    //     // 等待12秒后检查怪物状态
    //     setTimeout(() => {
    //         console.log("🤖 AI测试3: 检查怪物状态");
    //         if (this.rockMonster) {
    //             console.log("Rock状态:", {
    //                 当前状态: this.rockMonster.getCurrentState(),
    //                 当前目标: this.rockMonster.getCurrentTarget() ? "有目标" : "无目标",
    //                 血量: `${this.rockMonster.getCurrentHealth()}/${this.rockMonster.getMaxHealth()}`,
    //                 是否死亡: this.rockMonster.getIsDead()
    //             });
    //         }
    //     }, 12000);

    //     console.log("怪物AI测试定时器已设置完成");
    // }

    //手动调用节点销毁时执行
    onDestroy(): void {
        // 清理单例引用
        GameMainManager._instance = null;

        // 清理定时器
        Laya.timer.clearAll(this);

        console.log("GameMainManager 销毁");
    }

    //每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onUpdate(): void {}

    //每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onLateUpdate(): void {}

    //鼠标点击后执行。与交互相关的还有onMouseDown等十多个函数，具体请参阅文档。
    //onMouseClick(): void {}
}
const { regClass, property } = Laya;
import { RockMonster } from "./RockMonster";
import { HealthBarManager } from "./HealthBarManager";

@regClass()
export class GameMainManager extends Laya.Script {

    @property(String)
    public text: string = "";

    // 获取传递的关卡数据
    private selectedLevel: number = 1;

    // Rock怪物引用
    private rockMonster: RockMonster;

    // 游戏状态
    private gameStarted: boolean = false;

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        console.log("=== GameMainManager 初始化 ===");
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

        const rockSprite = battleField.getChildByName("Rock") as Laya.Sprite;
        if (!rockSprite) {
            console.error("未找到Rock精灵节点");
            return;
        }

        // 检查是否已经有RockMonster组件
        this.rockMonster = rockSprite.getComponent(RockMonster);

        console.log("Rock怪物信息:", this.rockMonster.getRockInfo());

        // 设置Rock为玩家阵营（根据关卡需要调整）
        this.rockMonster.isPlayerCamp = true;

        // 监听怪物事件
        this.setupMonsterEvents();

        // 检查并创建血条（如果不存在）
        this.setupHealthBar();

        console.log("Rock怪物系统设置完成");
    }

    /**
     * 设置怪物事件监听
     * 简化版本：只监听核心事件
     */
    private setupMonsterEvents(): void {
        const rockSprite = this.rockMonster.owner;

        // 核心事件：血量变化（用于更新血条）
        rockSprite.on("MONSTER_DAMAGE_TAKEN", this, this.onMonsterDamageTaken);
        rockSprite.on("MONSTER_HEALED", this, this.onMonsterHealed);
        rockSprite.on("MONSTER_DEATH", this, this.onMonsterDeath);

        console.log("怪物核心事件监听设置完成");
    }

    /**
     * 设置血条系统
     */
    private setupHealthBar(): void {
        if (!this.rockMonster) return;

        const rockSprite = this.rockMonster.owner as Laya.Sprite;

        // 检查是否已经有血条
        const existingHealthBar = rockSprite.getChildByName("healthbar");
        if (existingHealthBar) {
            console.log("Rock已有血条，跳过创建");
            // 显示血条并更新一次
            HealthBarManager.showHealthBar(this.rockMonster);
            HealthBarManager.updateMonsterHealthBar(this.rockMonster);
            return;
        }

        // 如果没有血条，创建一个简单的血条
        console.log("为Rock创建血条...");
        HealthBarManager.createSimpleHealthBar(rockSprite, 80, 10);

        // 初始化血条显示
        HealthBarManager.updateMonsterHealthBar(this.rockMonster);

        console.log("Rock血条设置完成");
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
        this.testMonsterSystem();
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
    private onMonsterDamageTaken(data: any): void {
        const { target, damage, attacker } = data;
        console.log(`${target.constructor.name} 受到 ${damage} 点伤害，来自 ${attacker.constructor.name}`);

        // 更新血条显示
        this.updateHealthBar(target);
    }

    /**
     * 怪物治疗事件 - 更新血条
     */
    private onMonsterHealed(data: any): void {
        const { monster, amount } = data;
        console.log(`${monster.constructor.name} 恢复了 ${amount} 点血量`);

        // 更新血条显示
        this.updateHealthBar(monster);
    }

    /**
     * 怪物死亡事件 - 处理死亡逻辑
     */
    private onMonsterDeath(data: any): void {
        const { monster } = data;
        console.log(`${monster.constructor.name} 死亡`);

        // 这里可以处理死亡奖励、经验值等
        // 隐藏血条
        HealthBarManager.hideHealthBar(monster);
    }

    /**
     * 更新血条显示
     */
    private updateHealthBar(monster: any): void {
        // 使用专门的血条管理器来处理血条更新
        HealthBarManager.updateMonsterHealthBar(monster);
    }



    // ========== 测试方法 ==========

    /**
     * 测试怪物系统
     * 注意：这个方法与simulateGameEvents()并行执行，时间线会交错
     */
    private testMonsterSystem(): void {
        if (!this.rockMonster) {
            console.log("Rock怪物未初始化，跳过测试");
            return;
        }

        console.log("=== 开始测试怪物系统 ===");
        console.log("Rock怪物信息:", this.rockMonster.getRockInfo());

        // 测试序列 - 使用setTimeout而不是Laya.timer以区分两个测试系统
        setTimeout(() => {
            console.log("🧪 怪物测试1: Rock受到30点伤害");
            this.rockMonster.takeDamage(30, this.rockMonster);
        }, 2000);

         setTimeout(() => {
            console.log("🧪 怪物测试2: Rock行走");
        }, 4000);

        setTimeout(() => {
            console.log("🧪 怪物测试3: Rock恢复20点血量");
            this.rockMonster.heal(20);
        }, 6000);

        setTimeout(() => {
            console.log("🧪 怪物测试4: 设置Rock等级为3");
            this.rockMonster.setRockLevel(3);
            console.log("升级后信息:", this.rockMonster.getRockInfo());
        }, 8000);

        setTimeout(() => {
            console.log("🧪 怪物测试5: Rock受到致命伤害");
            this.rockMonster.takeDamage(200, this.rockMonster);
        }, 10000);

        console.log("怪物系统测试定时器已设置完成");
    }

    //手动调用节点销毁时执行
    onDestroy(): void {
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
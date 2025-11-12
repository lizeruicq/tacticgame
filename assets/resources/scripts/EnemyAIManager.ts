const { regClass } = Laya;
import { MonsterManager } from "./MonsterManager";
import { GameMainManager } from "./GameMainManager";
import { CardConfig } from "./CardConfig";

@regClass()
export class EnemyAIManager extends Laya.Script {
    private static _instance: EnemyAIManager = null;
    
    // 敌人魔法值系统
    private enemyMana: number = 10;
    private enemyMaxMana: number = 10;
    private manaRegenRate: number = 1;
    private manaRegenInterval: number = 2000;
    
    // AI决策参数
    private decisionInterval: number = 1000; // 每3秒做一次决策
    private currentLevel: number = 1;
    
    // AI决策队列
    private pendingDecision: string | null = null; // 等待执行的决策
    
    // 怪物管理器引用
    private monsterManager: MonsterManager = null;
    private gameManager: GameMainManager = null;
    
    onAwake(): void {
        EnemyAIManager._instance = this;
        this.initializeAI();
    }
    
    public static getInstance(): EnemyAIManager {
        return EnemyAIManager._instance;
    }
    
    private initializeAI(): void {
        // 获取管理器实例
        this.monsterManager = MonsterManager.getInstance();
        this.gameManager = GameMainManager.getInstance();
        
        // 启动魔法值恢复系统
        this.startManaRegeneration();
        
        // 启动AI决策系统
        this.startAIDecisionMaking();
    }
    
    private startManaRegeneration(): void {
        Laya.timer.loop(this.manaRegenInterval, this, this.regenerateMana);
    }
    
    private regenerateMana(): void {
        this.enemyMana = Math.min(this.enemyMana + this.manaRegenRate, this.enemyMaxMana);
        // console.log(`敌人魔法值恢复: ${this.enemyMana}/${this.enemyMaxMana}`);
    }
    
    private startAIDecisionMaking(): void {
        // this,this.makeDecision();
        Laya.timer.loop(this.decisionInterval, this, this.makeDecision);
    }
    
    private makeDecision(): void {
        // 检查游戏是否结束
        if (this.gameManager && this.gameManager.isGameEnded()) {
            // console.log("游戏已结束，敌人AI停止决策");
            return;
        }

        // 检查是否有正在等待执行的决策
        if (this.pendingDecision) {
            const monsterType = this.pendingDecision;
            const monsterConfig = CardConfig.getCardConfig(monsterType);

            if (monsterConfig && this.enemyMana >= monsterConfig.manaCost) {
                // 魔法值足够，执行等待中的决策
                this.executePendingDecision(monsterType, monsterConfig);
                this.pendingDecision = null; // 清空等待中的决策

                // 不再做新的决策，等待下次决策周期
                return;
            } else if (!monsterConfig) {
                // 配置不存在，放弃决策
                console.error(`无法获取${monsterType}的配置，放弃决策`);
                this.pendingDecision = null;
                return;
            }
            // 魔法值仍不足，继续等待
            console.log(`仍在等待魔法值足够召唤${monsterType}（需要${monsterConfig.manaCost}点魔法值，当前${this.enemyMana}）`);
            return;
        }

        // 检查是否有足够的魔法值
        if (this.enemyMana <= 0) {
            console.log("敌人魔法值不足，跳过本次决策");
            return;
        }
        
        // 获取当前关卡的敌人配置
        const levelConfig = CardConfig.getLevelConfig(this.currentLevel);
        if (!levelConfig) {
            console.error(`无法获取关卡${this.currentLevel}的配置`);
            return;
        }
        
        // 根据权重选择怪物类型
        const monsterType = this.selectMonsterByWeight(levelConfig.enemyCards);
        if (!monsterType) {
            console.log("未选择到合适的怪物类型");
            return;
        }
        
        // 获取怪物配置
        const monsterConfig = CardConfig.getCardConfig(monsterType);
        if (!monsterConfig) {
            console.error(`无法获取${monsterType}的配置`);
            return;
        }
        
        // 检查魔法值是否足够
        if (this.enemyMana < monsterConfig.manaCost) {
            console.log(`敌人魔法值不足，等待足够魔法值召唤${monsterType}（需要${monsterConfig.manaCost}点魔法值，当前${this.enemyMana}）`);
            this.pendingDecision = monsterType; // 记录等待中的决策
            return;
        }
        
        // 消耗魔法值并召唤怪物
        this.executeDecision(monsterType, monsterConfig);
    }
    
    /**
     * 执行决策（消耗魔法值并召唤怪物）
     */
    private executeDecision(monsterType: string, monsterConfig: any): void {
        // 消耗魔法值
        this.enemyMana -= monsterConfig.manaCost;
        console.log(`敌人消耗${monsterConfig.manaCost}点魔法值召唤${monsterType}，剩余魔法值: ${this.enemyMana}`);
        
        // 召唤怪物
        this.spawnMonster(monsterType);
    }
    
    /**
     * 执行等待中的决策
     */
    private executePendingDecision(monsterType: string, monsterConfig: any): void {
        // 消耗魔法值
        this.enemyMana -= monsterConfig.manaCost;
        console.log(`敌人消耗${monsterConfig.manaCost}点魔法值召唤等待中的${monsterType}，剩余魔法值: ${this.enemyMana}`);
        
        // 召唤怪物
        this.spawnMonster(monsterType);
    }
    
    private selectMonsterByWeight(availableCards: string[]): string | null {
        // 简单的权重选择实现
        // 可以根据战场情况调整权重
        if (availableCards.length === 0) return null;

        // 敌方AI不受数量限制，可以任意召唤
        // 获取当前关卡配置
        const levelConfig = CardConfig.getLevelConfig(this.currentLevel);
        if (!levelConfig || !levelConfig.enemyWeights) {
            // 如果没有配置权重，则平均分配
            const randomIndex = Math.floor(Math.random() * availableCards.length);
            return availableCards[randomIndex];
        }

        // 构建权重数组
        const weights = [];
        let totalWeight = 0;

        for (const cardType of availableCards) {
            const config = CardConfig.getCardConfig(cardType);
            if (config) {
                // 获取配置的权重，默认为0.1
                const weight = levelConfig.enemyWeights[cardType] || 0.1;
                weights.push({ type: cardType, weight: weight });
                totalWeight += weight;
            }
        }

        if (totalWeight <= 0) {
            // 如果总权重为0，则随机选择
            const randomIndex = Math.floor(Math.random() * availableCards.length);
            return availableCards[randomIndex];
        }

        // 随机选择
        let random = Math.random() * totalWeight;
        for (const item of weights) {
            random -= item.weight;
            if (random <= 0) {
                return item.type;
            }
        }

        return weights.length > 0 ? weights[0].type : null;
    }
    
    private spawnMonster(monsterType: string): void {
        if (!this.monsterManager || !this.gameManager) {
            console.error("无法获取MonsterManager或GameMainManager");
            return;
        }

        // 敌方生成位置随机化
        // BattleField尺寸: 1102x2037, 位置: (42, 38)
        // 敌方生成在上半部分，Y坐标范围: 100-500
        const battleField = this.gameManager.getBattleField();
        if (!battleField) {
            console.error("无法获取BattleField节点");
            return;
        }

        // 随机X坐标，确保在场景内（留出边距）
        const minX = battleField.width * 0.3;
        const maxX = battleField.width * 0.7;
        const randomX = minX + Math.random() * (maxX - minX);

        // Y坐标在上半部分
        const randomY = 100 + Math.random() * 100;

        const spawnPosition = { x: randomX, y: randomY };

        // 创建敌方怪物（敌方不受数量限制）
        this.monsterManager.createMonster(monsterType, false, spawnPosition, 1)
            .then((monsterSprite) => {
                if (monsterSprite) {
                    battleField.addChild(monsterSprite);
                    console.log(`敌人成功召唤${monsterType}怪物，位置: (${randomX.toFixed(0)}, ${randomY.toFixed(0)})`);
                } else {
                    console.log(`敌人召唤${monsterType}失败`);
                }
            })
            .catch((error) => {
                console.error(`创建${monsterType}怪物时发生错误:`, error);
            });
    }
    
    public setLevel(level: number): void {
        this.currentLevel = level;
    }
    
    public getEnemyMana(): number {
        return this.enemyMana;
    }
    
    public setEnemyMana(mana: number): void {
        this.enemyMana = Math.max(0, Math.min(mana, this.enemyMaxMana));
    }

    /**
     * 脚本禁用时执行
     */
    onDisable(): void {
        // // console.log("EnemyAIManager 禁用");
        // 清理所有定时器
        Laya.timer.clearAll(this);

        // 清空单例引用
        EnemyAIManager._instance = null;
    }
}
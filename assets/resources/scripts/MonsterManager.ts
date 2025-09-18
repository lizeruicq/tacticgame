const { regClass, property } = Laya;
import { BaseMonster } from "./BaseMonster";
import { Castle } from "./Castle";

/**
 * 目标类型枚举
 */
export enum TargetType {
    MONSTER = "monster",
    CASTLE = "castle"
}

/**
 * 目标信息接口
 */
export interface ITargetInfo {
    type: TargetType;
    target: BaseMonster | Castle;
    distance: number;
    isPlayerCamp: boolean;
}

/**
 * 怪物管理器
 * 负责管理场景中的所有怪物和城堡，提供目标搜索功能
 */
@regClass()
export class MonsterManager extends Laya.Script {
    
    // 单例实例
    private static _instance: MonsterManager = null;
    
    // ========== 管理的实体列表 ==========
    
    private monsters: BaseMonster[] = [];           // 所有怪物列表
    private castles: Castle[] = [];                 // 所有城堡列表
    private playerMonsters: BaseMonster[] = [];     // 玩家怪物列表
    private enemyMonsters: BaseMonster[] = [];      // 敌方怪物列表
    private playerCastles: Castle[] = [];           // 玩家城堡列表
    private enemyCastles: Castle[] = [];            // 敌方城堡列表
    
    // ========== 配置参数 ==========
    
    @property({ type: Number })
    public maxSearchDistance: number = 2000;       // 最大搜索距离
    
    @property({ type: Boolean })
    public enableDebugLog: boolean = true;         // 是否启用调试日志
    
    onAwake(): void {
        console.log("=== MonsterManager 初始化 ===");
        
        // 设置单例
        MonsterManager._instance = this;
        
        // 初始化管理器
        this.initializeManager();
    }
    
    onDestroy(): void {
        // 清理单例引用
        MonsterManager._instance = null;
        
        // 清理所有列表
        this.cleanup();
        
        console.log("MonsterManager 销毁");
    }
    
    // ========== 单例方法 ==========
    
    /**
     * 获取单例实例
     */
    public static getInstance(): MonsterManager {
        return MonsterManager._instance;
    }
    
    // ========== 初始化方法 ==========
    
    /**
     * 初始化管理器
     */
    private initializeManager(): void {
        console.log("初始化怪物管理器...");
        
        // 这里可以添加其他初始化逻辑
    }
    
    // ========== 注册和注销方法 ==========
    
    /**
     * 注册怪物
     */
    public registerMonster(monster: BaseMonster): void {
        if (!monster || this.monsters.indexOf(monster) !== -1) return;
        
        this.monsters.push(monster);
        
        // 根据阵营分类
        if (monster.isPlayerCamp) {
            this.playerMonsters.push(monster);
        } else {
            this.enemyMonsters.push(monster);
        }
        
        if (this.enableDebugLog) {
            console.log(`注册怪物: ${monster.constructor.name}, 阵营: ${monster.isPlayerCamp ? '玩家' : '敌方'}, 总数: ${this.monsters.length}`);
        }
        
        // 监听怪物死亡事件
        monster.owner.on("MONSTER_DEATH", this, this.onMonsterDeath);
    }
    
    /**
     * 注销怪物
     */
    public unregisterMonster(monster: BaseMonster): void {
        if (!monster) return;
        
        // 从所有列表中移除
        this.removeFromArray(this.monsters, monster);
        this.removeFromArray(this.playerMonsters, monster);
        this.removeFromArray(this.enemyMonsters, monster);
        
        if (this.enableDebugLog) {
            console.log(`注销怪物: ${monster.constructor.name}, 剩余总数: ${this.monsters.length}`);
        }
        
        // 取消事件监听
        monster.owner.off("MONSTER_DEATH", this, this.onMonsterDeath);
    }
    
    /**
     * 注册城堡
     */
    public registerCastle(castle: Castle): void {
        if (!castle || this.castles.indexOf(castle) !== -1) return;
        
        this.castles.push(castle);
        
        // 根据阵营分类
        if (castle.isPlayerCamp) {
            this.playerCastles.push(castle);
        } else {
            this.enemyCastles.push(castle);
        }
        
        if (this.enableDebugLog) {
            console.log(`注册城堡: 阵营: ${castle.isPlayerCamp ? '玩家' : '敌方'}, 总数: ${this.castles.length}`);
        }
        
        // 监听城堡摧毁事件
        castle.owner.on("CASTLE_DESTROYED", this, this.onCastleDestroyed);
    }
    
    /**
     * 注销城堡
     */
    public unregisterCastle(castle: Castle): void {
        if (!castle) return;
        
        // 从所有列表中移除
        this.removeFromArray(this.castles, castle);
        this.removeFromArray(this.playerCastles, castle);
        this.removeFromArray(this.enemyCastles, castle);
        
        if (this.enableDebugLog) {
            console.log(`注销城堡: 剩余总数: ${this.castles.length}`);
        }
        
        // 取消事件监听
        castle.owner.off("CASTLE_DESTROYED", this, this.onCastleDestroyed);
    }
    
    // ========== 目标搜索方法 ==========
    
    /**
     * 为指定怪物寻找最近的敌方目标
     */
    public findNearestEnemyTarget(monster: BaseMonster): BaseMonster | Castle | null {
        if (!monster || monster.getIsDead()) return null;

        const monsterSprite = monster.owner as Laya.Sprite;
        const isPlayerCamp = monster.isPlayerCamp;

        // 获取敌方怪物和城堡列表
        const enemyMonsters = isPlayerCamp ? this.enemyMonsters : this.playerMonsters;
        const enemyCastles = isPlayerCamp ? this.enemyCastles : this.playerCastles;

        if (this.enableDebugLog) {
            console.log(`目标搜索 - 怪物阵营: ${isPlayerCamp ? '玩家' : '敌方'}, 敌方怪物数量: ${enemyMonsters.length}, 敌方城堡数量: ${enemyCastles.length}`);
        }
        
        // 收集所有可能的目标
        const allTargets: ITargetInfo[] = [];
        
        // 添加敌方怪物作为目标
        for (const enemyMonster of enemyMonsters) {
            if (enemyMonster.getIsDead()) continue;
            if (enemyMonster === monster) continue; // 排除自己

            const distance = this.calculateDistance(monsterSprite, enemyMonster.owner as Laya.Sprite);
            if (distance <= this.maxSearchDistance) {
                allTargets.push({
                    type: TargetType.MONSTER,
                    target: enemyMonster,
                    distance: distance,
                    isPlayerCamp: enemyMonster.isPlayerCamp
                });
            }
        }
        
        // 添加敌方城堡作为目标
        for (const enemyCastle of enemyCastles) {
            if (enemyCastle.getIsDestroyed()) continue;
            
            const distance = this.calculateDistance(monsterSprite, enemyCastle.owner as Laya.Sprite);
            if (distance <= this.maxSearchDistance) {
                allTargets.push({
                    type: TargetType.CASTLE,
                    target: enemyCastle,
                    distance: distance,
                    isPlayerCamp: enemyCastle.isPlayerCamp
                });
            }
        }
        
        // 如果没有找到任何目标
        if (allTargets.length === 0) {
            if (this.enableDebugLog) {
                console.log(`${monster.constructor.name} 未找到任何敌方目标`);
            }
            return null;
        }

        // 调试：检查是否包含自己
        for (const targetInfo of allTargets) {
            if (targetInfo.target === monster) {
                console.error(`错误：目标列表包含怪物自己！`, targetInfo);
                // 从列表中移除自己
                const index = allTargets.indexOf(targetInfo);
                allTargets.splice(index, 1);
            }
        }
        
        // 按优先级排序：优先攻击怪物，然后是城堡；相同类型按距离排序
        allTargets.sort((a, b) => {
            // 怪物优先级高于城堡
            if (a.type !== b.type) {
                return a.type === TargetType.MONSTER ? -1 : 1;
            }
            // 相同类型按距离排序
            return a.distance - b.distance;
        });
        
        const nearestTarget = allTargets[0];
        
        if (this.enableDebugLog) {
            console.log(`${monster.constructor.name} 找到目标: ${nearestTarget.type === TargetType.MONSTER ? nearestTarget.target.constructor.name : 'Castle'}, 距离: ${nearestTarget.distance.toFixed(1)}`);
        }
        
        return nearestTarget.target;
    }
    
    /**
     * 计算两个精灵之间的距离
     */
    private calculateDistance(sprite1: Laya.Sprite, sprite2: Laya.Sprite): number {
        const dx = sprite2.x - sprite1.x;
        const dy = sprite2.y - sprite1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // ========== 事件处理方法 ==========
    
    /**
     * 怪物死亡事件处理
     */
    private onMonsterDeath(data: any): void {
        const { monster } = data;
        if (monster instanceof BaseMonster) {
            this.unregisterMonster(monster);
        }
    }
    
    /**
     * 城堡摧毁事件处理
     */
    private onCastleDestroyed(data: any): void {
        const { castle } = data;
        if (castle instanceof Castle) {
            this.unregisterCastle(castle);
        }
    }
    
    // ========== 工具方法 ==========
    
    /**
     * 从数组中移除元素
     */
    private removeFromArray<T>(array: T[], item: T): void {
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
    
    /**
     * 清理所有列表
     */
    private cleanup(): void {
        this.monsters.length = 0;
        this.castles.length = 0;
        this.playerMonsters.length = 0;
        this.enemyMonsters.length = 0;
        this.playerCastles.length = 0;
        this.enemyCastles.length = 0;
    }
    
    // ========== 公共查询接口 ==========
    
    /**
     * 获取所有怪物
     */
    public getAllMonsters(): BaseMonster[] {
        return [...this.monsters]; // 返回副本
    }
    
    /**
     * 获取所有城堡
     */
    public getAllCastles(): Castle[] {
        return [...this.castles]; // 返回副本
    }
    
    /**
     * 获取玩家怪物
     */
    public getPlayerMonsters(): BaseMonster[] {
        return [...this.playerMonsters]; // 返回副本
    }
    
    /**
     * 获取敌方怪物
     */
    public getEnemyMonsters(): BaseMonster[] {
        return [...this.enemyMonsters]; // 返回副本
    }
    
    /**
     * 获取玩家城堡
     */
    public getPlayerCastles(): Castle[] {
        return [...this.playerCastles]; // 返回副本
    }
    
    /**
     * 获取敌方城堡
     */
    public getEnemyCastles(): Castle[] {
        return [...this.enemyCastles]; // 返回副本
    }
    
    /**
     * 获取管理器状态信息
     */
    public getManagerInfo(): any {
        return {
            totalMonsters: this.monsters.length,
            totalCastles: this.castles.length,
            playerMonsters: this.playerMonsters.length,
            enemyMonsters: this.enemyMonsters.length,
            playerCastles: this.playerCastles.length,
            enemyCastles: this.enemyCastles.length,
            maxSearchDistance: this.maxSearchDistance
        };
    }
}

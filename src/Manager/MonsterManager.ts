const { regClass, property } = Laya;
import { BaseMonster } from "../monsters/BaseMonster";
import { Castle } from "../monsters/Castle";
import { GameMainManager } from "./GameMainManager";
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
    private gameMainManager: GameMainManager = null;
    // ========== 配置参数 ==========
    
    @property({ type: Number })
    public maxSearchDistance: number = 2000;       // 最大搜索距离
    
    @property({ type: Boolean })
    public enableDebugLog: boolean = false;         // 是否启用调试日志
    
    onAwake(): void {
        console.log("=== MonsterManager 初始化 ===");

        // 设置单例
        MonsterManager._instance = this;
        this.gameMainManager = GameMainManager.getInstance();
        // 初始化管理器
        this.initializeManager();
    }

    onDisable(): void {
        // 清理单例引用
        MonsterManager._instance = null;

        // 清理所有列表
        this.cleanup();

        console.log("MonsterManager 禁用");
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

        // 更新怪物层级
        this.updateMonsterZOrder(monster);

        if (this.enableDebugLog) {
            console.log(`注册怪物: ${monster.constructor.name}, 阵营: ${monster.isPlayerCamp ? '玩家' : '敌方'}, 总数: ${this.monsters.length}`);
        }

        // 监听怪物死亡事件
        monster.owner.on("MONSTER_DEATH", this, this.onMonsterDeath);
        // 监听怪物受伤事件，用于累积能量（Power）
        monster.owner.on("MONSTER_DAMAGE_TAKEN", this, this.onMonsterDamageTaken);
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
        monster.owner.off("MONSTER_DAMAGE_TAKEN", this, this.onMonsterDamageTaken);
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
     * 怪物受伤事件处理：用于累积双方的能量（Power）
     */
    private onMonsterDamageTaken(data: any): void {
        if (!data || !data.target || typeof data.damage !== "number") {
            return;
        }

        const target: BaseMonster = data.target as BaseMonster;
        const damage: number = data.damage;

        if (!this.gameMainManager) {
            this.gameMainManager = GameMainManager.getInstance();
        }

        if (!this.gameMainManager) {
            return;
        }

        // 己方怪物受到攻击时，根据阵营累积对应的能量
        this.gameMainManager.addPower(target.isPlayerCamp, damage);
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
    
    // /**
    //  * 获取管理器状态信息
    //  */
    // public getManagerInfo(): any {
    //     return {
    //         totalMonsters: this.monsters.length,
    //         totalCastles: this.castles.length,
    //         playerMonsters: this.playerMonsters.length,
    //         enemyMonsters: this.enemyMonsters.length,
    //         playerCastles: this.playerCastles.length,
    //         enemyCastles: this.enemyCastles.length,
    //         maxSearchDistance: this.maxSearchDistance
    //     };
    // }

    /**
     * 更新怪物层级（根据Y坐标）
     */
    private updateMonsterZOrder(monster: BaseMonster): void {
        const sprite = monster.owner as Laya.Sprite;
        if (!sprite) return;

        // 玩家怪物：Y越小，层级越小（在后面）
        // 敌方怪物：Y越大，层级越小（在后面）
        if (monster.isPlayerCamp) {
            sprite.zOrder = Math.floor(sprite.y);
        } else {
            sprite.zOrder = Math.floor(1000 - sprite.y); // 反转层级
        }

        if (this.enableDebugLog) {
            console.log(`${monster.constructor.name} 层级设置: Y=${sprite.y}, zOrder=${sprite.zOrder}`);
        }
    }

    // ========== 怪物创建方法 ==========

    /**
     * 创建怪物
     * @param monsterType 怪物类型（"Rock"）
     * @param isPlayerCamp 是否玩家阵营
     * @param position 生成位置
     * @param level 怪物等级，默认1
     */
    public createMonster(
        monsterType: string,
        isPlayerCamp: boolean,
        position: { x: number; y: number },
        level: number = 1
    ): Promise<Laya.Sprite | null> {
        const prefabPath = this.getPrefabPath(monsterType);

        return Laya.loader.load(prefabPath).then(() => {
            const prefab = Laya.loader.getRes(prefabPath);
            const monsterSprite = Laya.Pool.getItemByCreateFun(monsterType, prefab.create, prefab) as Laya.Sprite;

            monsterSprite.name = `${monsterType}_${isPlayerCamp ? 'Player' : 'Enemy'}_${Date.now()}`;
            monsterSprite.pos(position.x, position.y);

            this.configureMonster(monsterSprite, monsterType, isPlayerCamp, level);

            return monsterSprite;
        });
    }

    /**
     * 获取预制体路径
     */
    private getPrefabPath(monsterType: string): string {
        const paths: { [key: string]: string } = {
            // 石头人阵营
            "Rock": "prefabs/monster/Rock.lh",
            "Wizard": "prefabs/monster/Wizard.lh",
            "Pastor": "prefabs/monster/Pastor.lh",
            "Goblin": "prefabs/monster/Goblin.lh",
            "Necromance": "prefabs/monster/Necromance.lh",
            "Skeleton": "prefabs/monster/Skeleton.lh",
            "Troll": "prefabs/monster/Troll.lh",
            "Zombie": "prefabs/monster/Zombie.lh",
            // 人类阵营
            "SwordFe": "prefabs/monster/SwordFe.lh",
            "Archer": "prefabs/monster/Archer.lh",
            "Fairy": "prefabs/monster/Fairy.lh",
            "Knight": "prefabs/monster/Knight.lh",
            "Pirate": "prefabs/monster/Pirate.lh",
            "Sailor": "prefabs/monster/Sailor.lh",
            "Sword": "prefabs/monster/Sword.lh"
        };
        return paths[monsterType];
    }

    /**
     * 配置怪物属性（通用方法，适用于所有怪物类型）
     */
    private configureMonster(sprite: Laya.Sprite, type: string, isPlayerCamp: boolean, level: number): void {
        // 遍历所有组件，找到BaseMonster类型的组件
        const components = (sprite as any)._components || [];
        for (const component of components) {
            // 检查是否是BaseMonster的实例（包括所有子类）
            if (component && typeof component.setLevel === 'function' && typeof component.isPlayerCamp !== 'undefined') {
                component.isPlayerCamp = isPlayerCamp;
                component.setLevel(level);
                console.log(`配置${type}怪物: 阵营=${isPlayerCamp ? '玩家' : '敌方'}, 等级=${level}`);
                break;
            }
        }
    }

    // ========== 怪物合成方法 ==========

    /**
     * 合成怪物（支持玩家和敌方）
     * @param isPlayerCamp 是否玩家阵营
     */
    public async synthesizeMonsters(isPlayerCamp: boolean): Promise<void> {
        const monsterList: BaseMonster[] = isPlayerCamp ? this.playerMonsters : this.enemyMonsters;
        const camp: string = isPlayerCamp ? "玩家" : "敌方";

        if(isPlayerCamp)
        {
            this.gameMainManager.playLightningEffect();
            this.gameMainManager.showHint(`对敌人产生闪电伤害，${camp}同类怪物开始合成`);
        }
        else
        {
            this.gameMainManager.playFlameEffect();
            if(!this.gameMainManager.gameDataManager.getCanEnemyMerge())
            {
                return;
            }
            // this.gameMainManager.showHint(`我方🫡火焰伤害，${camp}同类怪物开始合成`);
        }
        // this.gameMainManager.playLightningEffect();
        // this.gameMainManager.showHint(`对敌人产生闪电伤害，${camp}同类怪物开始合成`);

        // 递归合成
        await this.synthesizeRecursive(monsterList, isPlayerCamp);

        
    }

    /**
     * 递归合成怪物
     * @param monsterList 怪物列表
     * @param isPlayerCamp 是否玩家阵营
     */
    private async synthesizeRecursive(monsterList: BaseMonster[], isPlayerCamp: boolean): Promise<void> {
        // 从后往前遍历，寻找可合成的怪物（1级或2级）
        for (let i = monsterList.length - 1; i >= 0; i--) {
            const backMonster: BaseMonster = monsterList[i];

            // 跳过3级怪物（最高等级，不可合成）
            if (backMonster.monsterLevel === 3) continue;

            // 只处理1级和2级怪物
            if (backMonster.monsterLevel < 1 || backMonster.monsterLevel > 2) continue;

            // 获取怪物类型
            const backType: string = backMonster.getMonsterType();
            const backLevel: number = backMonster.monsterLevel;

            // 在前面的怪物中寻找相同类型和等级的怪物
            for (let j = i - 1; j >= 0; j--) {
                const frontMonster: BaseMonster = monsterList[j];
                if (frontMonster.monsterLevel !== backLevel) continue;
                if (frontMonster.getMonsterType() !== backType) continue;

                // 找到了两个相同类型和等级的怪物，执行合成
                await this.performSynthesis(frontMonster, backMonster, isPlayerCamp);

                // 合成完成后，继续递归查找下一对可合成的怪物
                await this.synthesizeRecursive(monsterList, isPlayerCamp);
                return;
            }
        }

        // 没有找到可合成的怪物对，合成完成
    }

    /**
     * 执行单次合成
     */
    private performSynthesis(frontMonster: BaseMonster, backMonster: BaseMonster, isPlayerCamp: boolean): Promise<void> {
        return new Promise((resolve) => {
            const frontSprite = frontMonster.owner as Laya.Sprite;
            const backSprite = backMonster.owner as Laya.Sprite;
            const monsterType = frontMonster.getMonsterType();
            const currentLevel = frontMonster.monsterLevel;
            const nextLevel = currentLevel + 1;
            const battleField = this.gameMainManager.getBattleField();

            // 获取靠前怪物的位置
            const targetPos = { x: frontSprite.x, y: frontSprite.y };

            // 靠后怪物移动到靠前怪物位置
            Laya.Tween.to(backSprite, { x: targetPos.x, y: targetPos.y }, 300, Laya.Ease.quadOut, Laya.Handler.create(this, () => {
                // 移动完成后，移除两个怪物
                this.unregisterMonster(frontMonster);
                this.unregisterMonster(backMonster);
                frontSprite.removeSelf();
                backSprite.removeSelf();

                // 创建下一级怪物
                this.createMonster(monsterType, isPlayerCamp, targetPos, nextLevel).then((newMonster) => {
                    if (newMonster) {
                        battleField.addChild(newMonster);
                        console.log(`合成成功: ${monsterType} LV${currentLevel} + LV${currentLevel} -> ${monsterType} LV${nextLevel}`);
                    }
                    // 合成完成，resolve Promise
                    resolve();
                });
            }));
        });
    }

    /**
     * 对所有敌方怪物造成伤害（闪电伤害）
     * @param damage 伤害值
     */
    public damageAllEnemyMonsters(damage: number): void {
        if (this.enemyMonsters.length === 0) {
            console.log("场景中没有敌方怪物");
            return;
        }

        console.log(`闪电对 ${this.enemyMonsters.length} 个敌方怪物造成 ${damage} 点伤害`);

        // 对每个敌方怪物造成伤害
        for (const monster of this.enemyMonsters) {
            if (monster && !monster.getIsDead()) {
                // 使用第一个敌方怪物作为攻击者（闪电效果来自合成）
                // 如果没有其他敌方怪物，则传入当前怪物本身
                const attacker = this.enemyMonsters.length > 1 ? this.enemyMonsters[0] : monster;
                monster.takeDamage(damage, attacker);
            }
        }
    }

    /**
     * 对所有玩家怪物造成伤害（敌人技能伤害）
     * @param damage 伤害值
     */
    public damageAllPlayerMonsters(damage: number): void {
        if (this.playerMonsters.length === 0) {
            console.log("场景中没有玩家怪物");
            return;
        }


        // 对每个玩家怪物造成伤害
        for (const monster of this.playerMonsters) {
            if (monster && !monster.getIsDead()) {
                // 使用第一个敌方怪物作为攻击者（技能来自敌人）
                // 如果没有敌方怪物，则传入当前怪物本身
                const attacker = this.enemyMonsters.length > 0 ? this.enemyMonsters[0] : monster;
                monster.takeDamage(damage, attacker);
            }
        }
    }
}

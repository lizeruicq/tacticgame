const { regClass, property } = Laya;
import { RockMonster } from "./RockMonster";
import { CardManager } from "./CardManager";
import { GameMainManager } from "./GameMainManager";

/**
 * Rock卡片脚本
 * 负责处理Rock卡片的点击事件和生成Rock预制体
 */
@regClass()
export class RockCard extends Laya.Script {

    @property(String)
    public cardName: string = "Rock卡片";

    @property(Number)
    public manaCost: number = 3; // 法力消耗

    @property(Number)
    public rockLevel: number = 1; // Rock等级

    @property(Boolean)
    public isPlayerCard: boolean = true; // 是否为玩家卡片

    @property(String)
    public rockPrefabPath: string = "prefabs/Rock.lh"; // Rock预制体路径

    // 引用相关组件
    private cardManager: CardManager = null;

    // 卡片状态
    private isUsable: boolean = true;
    private cooldownTime: number = 0;
    
    onAwake(): void {
        console.log(`${this.cardName} 卡片初始化`);
        this.initializeCard();
    }
    
    onEnable(): void {
        // 设置点击事件
        this.owner.on(Laya.Event.CLICK, this, this.onCardClick);
        // 修复mouseEnabled属性访问
        (this.owner as Laya.Sprite).mouseEnabled = true;
    }

    onDisable(): void {
        // 移除点击事件
        this.owner.off(Laya.Event.CLICK, this, this.onCardClick);
    }

    /**
     * 初始化卡片
     */
    private initializeCard(): void {
        // 查找CardManager
        const cardBox = this.owner.parent;
        this.cardManager = cardBox.getComponent(CardManager);

        console.log(`${this.cardName} 初始化完成`);

        // 验证GameMainManager是否可用
        const gameManager = GameMainManager.getInstance();
        if (!gameManager) {
            console.error("GameMainManager单例未初始化！");
            return;
        }

        const spawnArea = gameManager.getSpawnArea();
        const battleField = gameManager.getBattleField();

        if (!spawnArea || !battleField) {
            console.error("场景节点未正确初始化！");
            return;
        }

        console.log(`通过GameManager获取节点成功:`);
        console.log(`- spawnArea: ${spawnArea.width}x${spawnArea.height}`);
        console.log(`- battleField: ${battleField.width}x${battleField.height}`);
    }
    
    /**
     * 卡片点击事件
     */
    private onCardClick(): void {
        console.log(`点击了 ${this.cardName}`);
        
        // 检查是否可以使用
        if (!this.canUseCard()) {
            console.log("卡片当前不可使用");
            return;
        }
        
        // 生成Rock预制体
        this.spawnRockSprite();

        // 触发卡片使用效果
        this.onCardUsed();
    }
    
    /**
     * 检查卡片是否可以使用
     */
    private canUseCard(): boolean {
        if (!this.isUsable) {
            console.log("卡片正在冷却中");
            return false;
        }

        const gameManager = GameMainManager.getInstance();
        if (!gameManager) {
            console.log("GameMainManager不可用");
            return false;
        }

        const spawnArea = gameManager.getSpawnArea();
        const battleField = gameManager.getBattleField();

        if (!spawnArea || !battleField) {
            console.log("场景节点不可用");
            return false;
        }

        // 这里可以添加法力值检查等逻辑
        // if (playerMana < this.manaCost) return false;

        return true;
    }
    
    /**
     * 生成Rock预制体
     */
    public spawnRockSprite(): void {
        console.log(`开始生成 ${this.cardName} 预制体`);

        // 计算生成位置
        const spawnPosition = this.calculateSpawnPosition();

        // 加载并生成Rock预制体
        this.loadAndCreateRockPrefab(spawnPosition);
    }
    
    /**
     * 计算生成位置
     * 考虑spawnArea的锚点为(0.5, 0.5)
     */
    private calculateSpawnPosition(): {x: number, y: number} {
        const gameManager = GameMainManager.getInstance();
        const spawnArea = gameManager.getSpawnArea();

        // spawnArea的锚点为(0.5, 0.5)，所以x,y是中心点位置
        const areaCenterX = spawnArea.x;
        const areaCenterY = spawnArea.y;
        const areaWidth = spawnArea.width;
        const areaHeight = spawnArea.height;

        // 计算spawnArea的实际边界（基于中心点和尺寸）
        const areaLeft = areaCenterX - areaWidth / 2;
        const areaRight = areaCenterX + areaWidth / 2;
        const areaTop = areaCenterY - areaHeight / 2;
        const areaBottom = areaCenterY + areaHeight / 2;

        // 留出边距，避免精灵生成在边缘
        const margin = 50;
        const randomX = areaLeft + margin + Math.random() * (areaWidth - margin * 2);
        const randomY = areaTop + margin + Math.random() * (areaHeight - margin * 2.5);

        console.log(`spawnArea中心: (${areaCenterX}, ${areaCenterY}), 尺寸: ${areaWidth}x${areaHeight}`);
        console.log(`生成范围: X[${areaLeft + margin}, ${areaRight - margin}], Y[${areaTop + margin}, ${areaBottom - margin}]`);

        return { x: randomX, y: randomY };
    }
    
    /**
     * 加载并创建Rock预制体
     */
    private loadAndCreateRockPrefab(position: {x: number, y: number}): void {
        console.log(`加载Rock预制体: ${this.rockPrefabPath}`);

        // 使用LayaAir的预制体加载方法
        Laya.loader.load(this.rockPrefabPath).then(() => {
            // 创建预制体实例
            const rockPrefab = Laya.loader.getRes(this.rockPrefabPath);
            if (!rockPrefab) {
                console.error(`无法加载Rock预制体: ${this.rockPrefabPath}`);
                return;
            }

            // 实例化预制体
            const rockSprite = Laya.Pool.getItemByCreateFun("Rock", rockPrefab.create, rockPrefab) as Laya.Sprite;

            // 设置位置和名称
            rockSprite.name = `Rock_${Date.now()}`;
            rockSprite.pos(position.x, position.y);

            // 获取RockMonster组件并设置属性
            const rockMonster = rockSprite.getComponent(RockMonster);
            if (rockMonster) {
                rockMonster.isPlayerCamp = this.isPlayerCard;
                rockMonster.setRockLevel(this.rockLevel);
                console.log(`设置Rock属性: 阵营=${this.isPlayerCard ? '玩家' : '敌方'}, 等级=${this.rockLevel}`);
            } else {
                console.error("Rock预制体中未找到RockMonster组件！");
            }

            // 通过GameMainManager获取BattleField并添加
            const gameManager = GameMainManager.getInstance();
            const battleField = gameManager.getBattleField();
            battleField.addChild(rockSprite);

            console.log(`Rock预制体生成成功: ${rockSprite.name}, 位置: (${position.x}, ${position.y})`);
            console.log(`已添加到BattleField节点下，当前BattleField子节点数: ${battleField.numChildren}`);

        }).catch((error) => {
            console.error(`加载Rock预制体失败: ${error}`);
        });
    }
    
    /**
     * 卡片使用后的处理
     */
    private onCardUsed(): void {
        console.log(`${this.cardName} 使用完成`);
        
        // 开始冷却
        this.startCooldown();
        
        // 通知CardManager
        if (this.cardManager && this.cardManager.onCardUsed) {
            this.cardManager.onCardUsed(this);
        }
        
        // 这里可以添加卡片使用特效
        this.playCardUseEffect();
    }
    
    /**
     * 开始冷却
     */
    private startCooldown(): void {
        this.isUsable = false;
        this.cooldownTime = 3000; // 3秒冷却
        
        // 设置卡片视觉效果（变灰等）
        this.setCardVisualState(false);
        
        // 冷却计时器
        Laya.timer.once(this.cooldownTime, this, () => {
            this.isUsable = true;
            this.setCardVisualState(true);
            console.log(`${this.cardName} 冷却完成`);
        });
    }
    
    /**
     * 设置卡片视觉状态
     */
    private setCardVisualState(usable: boolean): void {
        const sprite = this.owner as Laya.Sprite;
        if (usable) {
            sprite.alpha = 1.0;
        } else {
            sprite.alpha = 0.6; // 冷却中变暗
        }
    }
    
    /**
     * 播放卡片使用特效
     */
    private playCardUseEffect(): void {
        // 简单的缩放特效
        const sprite = this.owner as Laya.Sprite;
        const originalScale = sprite.scaleX;
        
        // 缩放动画
        sprite.scaleX = sprite.scaleY = originalScale * 1.2;
        
        Laya.timer.once(200, this, () => {
            sprite.scaleX = sprite.scaleY = originalScale;
        });
    }
    
    /**
     * 获取卡片信息
     */
    public getCardInfo(): any {
        return {
            name: this.cardName,
            manaCost: this.manaCost,
            rockLevel: this.rockLevel,
            isPlayerCard: this.isPlayerCard,
            isUsable: this.isUsable,
            cooldownTime: this.cooldownTime
        };
    }
    
    onDestroy(): void {
        // 清理定时器
        Laya.timer.clearAll(this);
        console.log(`${this.cardName} 卡片销毁`);
    }
}

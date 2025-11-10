const { regClass, property } = Laya;
import { GameMainManager } from "./GameMainManager";
import { MonsterManager } from "./MonsterManager";

/**
 * 怪物卡片基类
 * 包含所有怪物卡片的公共逻辑
 */
@regClass()
export abstract class BaseMonsterCard extends Laya.Script {

    @property(String)
    public cardName: string = "怪物卡片";

    @property(Number)
    public manaCost: number = 3; // 法力消耗

    @property(Number)
    public monsterLevel: number = 1; // 怪物等级

    @property(Boolean)
    public isPlayerCard: boolean = true; // 是否为玩家卡片

    @property(String)
    public monsterPrefabPath: string = ""; // 怪物预制体路径

    @property(Laya.Label)
    public levelLabel: Laya.Label = null; // 等级标签

    @property(Laya.Label)
    public costLabel: Laya.Label = null; // 消耗标签

    @property(Laya.Box)
    public lv2Node: Laya.Box = null; // LV2属性展示节点

    // 卡牌状态
    private isEnabled: boolean = true;

    // 回调函数
    public onCardUsedCallback: ((card: BaseMonsterCard) => void) | null = null;

    onAwake(): void {
        console.log(`${this.cardName} 卡片初始化`);
        this.initializeCard();
        this.updateCardLabels();
        this.updateLv2Visibility();
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
     * 更新卡片标签（等级和消耗）
     */
    public updateCardLabels(): void {
        if (this.levelLabel) {
            this.levelLabel.text = "LV" + this.monsterLevel.toString();
        }
        if (this.costLabel) {
            this.costLabel.text = this.manaCost.toString();
        }
    }

    /**
     * 更新LV2节点的可见性
     */
    public updateLv2Visibility(): void {
        if (this.lv2Node) {
            this.lv2Node.visible = this.monsterLevel >= 2;
        }
    }
    
    /**
     * 卡片点击事件
     * 只在非拖拽情况下生成怪物
     */
    private onCardClick(): void {
        console.log(`点击了 ${this.cardName}`);

        // 检查卡牌是否启用
        if (!this.isEnabled) {
            console.log("卡牌当前被禁用（冷却中）");
            return;
        }

        // 检查是否可以使用
        if (!this.canUseCard()) {
            console.log("卡片当前不可使用");
            return;
        }

        // 生成怪物预制体（由子类实现）
        this.spawnMonster();

        // 触发卡片使用效果
        this.onCardUsed();
    }
    
    /**
     * 检查卡片是否可以使用
     */
    private canUseCard(): boolean {
        const gameManager = GameMainManager.getInstance();
        if (!gameManager) {
            console.log("GameMainManager不可用");
            return false;
        }

        // 检查游戏是否结束
        if (gameManager.isGameEnded()) {
            console.log("游戏已结束，无法使用卡牌");
            return false;
        }

        const spawnArea = gameManager.getSpawnArea();
        const battleField = gameManager.getBattleField();

        if (!spawnArea || !battleField) {
            console.log("场景节点不可用");
            return false;
        }

        // 检查魔法值是否足够
        const currentMana = gameManager.getPlayerMana();
        if (currentMana < this.manaCost) {
            console.log(`魔法值不足！需要: ${this.manaCost}，当前: ${currentMana}`);
            return false;
        }

        return true;
    }
    
    /**
     * 计算生成位置
     * 考虑spawnArea的锚点为(0.5, 0.5)
     */
    protected calculateSpawnPosition(): {x: number, y: number} {
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
     * 使用MonsterManager创建怪物
     */
    protected createMonsterWithManager(monsterType: string, position: {x: number, y: number}): void {
        const monsterManager = MonsterManager.getInstance();
        const gameManager = GameMainManager.getInstance();
        const battleField = gameManager.getBattleField();

        monsterManager.createMonster(monsterType, this.isPlayerCard, position, this.monsterLevel)
            .then((monsterSprite) => {
                if (monsterSprite) {
                    battleField.addChild(monsterSprite);
                    console.log(`${monsterType}怪物创建成功: ${monsterSprite.name}`);
                } else {
                    console.log(`${monsterType}怪物创建失败：已达到数量上限`);
                }
            });
    }
    
    /**
     * 卡片使用后的处理
     */
    private onCardUsed(): void {
        // 调用回调函数
        if (this.onCardUsedCallback) {
            console.log(`${this.cardName} 使用完成`);
            this.onCardUsedCallback(this);
        }

        // 这里可以添加卡片使用特效
        this.playCardUseEffect();
    }

    /**
     * 设置卡牌启用状态
     */
    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;

        // 可以在这里添加视觉效果，比如变灰等
        const sprite = this.owner as Laya.Sprite;
        if (sprite) {
            sprite.alpha = enabled ? 1.0 : 0.5; // 禁用时变半透明
        }

        console.log(`${this.cardName} ${enabled ? '启用' : '禁用'}`);
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
     * 获取卡片信息（由子类重写以提供具体信息）
     */
    public getCardInfo(): any {
        return {
            name: this.cardName,
            manaCost: this.manaCost,
            monsterLevel: this.monsterLevel,
            isPlayerCard: this.isPlayerCard,
            isEnabled: this.isEnabled
        };
    }
    
    onDestroy(): void {
        // 清理定时器
        Laya.timer.clearAll(this);
        console.log(`${this.cardName} 卡片销毁`);
    }

    // ========== 抽象方法，由子类实现 ==========

    /**
     * 生成怪物（由子类实现具体的怪物生成逻辑）
     */
    protected abstract spawnMonster(): void;

    /**
     * 获取怪物类型名称（由子类实现）
     * 公开此方法供CardManager使用
     */
    public abstract getMonsterType(): string;
}

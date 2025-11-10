const { regClass, property } = Laya;
import { MonsterManager } from "./MonsterManager";
/**
 * 城堡接口，定义城堡的基本属性
 */
export interface ICastleStats {
    maxHealth: number;      // 最大血量
    defense: number;        // 防御力（减少受到的伤害）
    regeneration: number;   // 血量回复速度（每秒回复的血量）
}

/**
 * 城堡状态枚举
 */
export enum CastleState {
    NORMAL = "normal",       // 正常状态
    DAMAGED = "damaged",     // 受损状态
    CRITICAL = "critical",   // 危险状态（血量低于30%）
    DESTROYED = "destroyed"  // 已摧毁
}

/**
 * 城堡脚本
 * 管理城堡的血量、阵营和状态
 */
@regClass()
export class Castle extends Laya.Script {
    
    // ========== 基础属性 ==========
    
    @property({ type: Boolean })
    public isPlayerCamp: boolean = true;  // 是否玩家阵营
    
    @property({ type: Number })
    public castleLevel: number = 1;  // 城堡等级，影响属性

    @property({ type: String })
    public textureHealthy: string = "";  // 血量 > 70% 时的纹理路径

    @property({ type: String })
    public textureDamaged: string = "";  // 血量 30%-70% 时的纹理路径

    @property({ type: String })
    public textureCritical: string = "";  // 血量 < 30% 时的纹理路径

    // 城堡基础属性
    protected castleStats: ICastleStats = {
        maxHealth: 1000,
        defense: 10,
        regeneration: 0  // 城堡不自动回复血量
    };

    // ========== 运行时属性 ==========

    protected currentHealth: number = 1000;        // 当前血量
    protected currentState: CastleState = CastleState.NORMAL;  // 当前状态
    protected isDestroyed: boolean = false;        // 是否已摧毁
    protected isInitialized: boolean = false;      // 是否已初始化
    protected castleSprite: Laya.Sprite = null;    // 城堡精灵
    
    // ========== 内部状态 ==========
    
    protected lastRegenerationTime: number = 0;    // 上次回血时间
    protected regenerationInterval: number = 1000; // 回血间隔（毫秒）
    
    onAwake(): void {
        console.log(`=== 城堡初始化 ===`);

        // 初始化城堡属性
        this.initializeCastle();

        // 获取城堡精灵
        this.castleSprite = this.owner as Laya.Sprite;

        // 注册到MonsterManager
        this.registerToManager();

        // 设置初始血量
        this.currentHealth = this.castleStats.maxHealth;

        // 更新纹理
        this.updateCastleTexture();

        // 标记为已初始化
        this.isInitialized = true;

        console.log(`城堡初始化完成:`, {
            阵营: this.isPlayerCamp ? "玩家" : "敌方",
            等级: this.castleLevel,
            血量: `${this.currentHealth}/${this.castleStats.maxHealth}`,
            防御力: this.castleStats.defense,
            回血速度: this.castleStats.regeneration + "/秒"
        });
    }
    
    onEnable(): void {
        if (this.isInitialized) {
            this.startRegeneration();
        }
    }
    
    onUpdate(): void {
        if (this.isDestroyed || !this.isInitialized) return;
        
        // 更新血量回复
        this.updateRegeneration();
    }
    
    onDisable(): void {
        this.stopRegeneration();
    }
    
    onDestroy(): void {
        this.cleanup();
        console.log(`城堡销毁`);
    }
    
    // ========== 核心方法 ==========
    
    /**
     * 初始化城堡属性
     */
    protected initializeCastle(): void {
        // 根据等级计算城堡属性
        this.castleStats = this.calculateCastleStats();

        
        console.log(`城堡属性初始化 - 等级: ${this.castleLevel}`, this.castleStats);
    }

    protected registerToManager(): void {
        const monsterManager = MonsterManager.getInstance();
        if (monsterManager) {
            monsterManager.registerCastle(this);
            console.log(`${this.constructor.name} 城堡注册到MonsterManager`);
        } else {
            // 延迟注册，等待MonsterManager初始化
            Laya.timer.once(100, this, () => {
                const manager = MonsterManager.getInstance();
                if (manager) {
                    manager.registerCastle(this);
                    
                }
            });
        }
    }
    
    /**
     * 根据等级计算城堡属性
     */
    private calculateCastleStats(): ICastleStats {
        const baseStats: ICastleStats = {
            maxHealth: 1000,     // 基础血量
            defense: 10,         // 基础防御力
            regeneration: 0      // 城堡不自动回复血量
        };

        // 根据等级调整属性
        const levelMultiplier = 1 + (this.castleLevel - 1) * 0.3; // 每级增加30%

        return {
            maxHealth: Math.floor(baseStats.maxHealth * levelMultiplier),
            defense: Math.floor(baseStats.defense * levelMultiplier),
            regeneration: 0  // 城堡不自动回复血量
        };
    }
    
    /**
     * 开始血量回复
     */
    protected startRegeneration(): void {
        this.lastRegenerationTime = Laya.timer.currTimer;
        console.log(`城堡开始血量回复`);
    }
    
    /**
     * 停止血量回复
     */
    protected stopRegeneration(): void {
        console.log(`城堡停止血量回复`);
    }
    
    /**
     * 更新血量回复
     */
    protected updateRegeneration(): void {
        if (this.isDestroyed || this.currentHealth >= this.castleStats.maxHealth) return;
        
        const currentTime = Laya.timer.currTimer;
        if (currentTime - this.lastRegenerationTime >= this.regenerationInterval) {
            this.heal(this.castleStats.regeneration);
            this.lastRegenerationTime = currentTime;
        }
    }
    
    /**
     * 切换状态
     */
    protected changeState(newState: CastleState): void {
        if (this.currentState === newState) return;
        if (this.isDestroyed && newState !== CastleState.DESTROYED) return;
        
        const oldState = this.currentState;
        this.currentState = newState;
        
        console.log(`城堡状态切换: ${oldState} -> ${newState}`);
        
        // 处理状态切换
        this.onStateChange(oldState, newState);
    }
    
    /**
     * 状态切换处理
     */
    protected onStateChange(oldState: CastleState, newState: CastleState): void {
        // 子类可以重写此方法来处理特殊的状态切换逻辑
        switch (newState) {
            case CastleState.DAMAGED:
                console.log("城堡受损，开始冒烟效果");
                break;
            case CastleState.CRITICAL:
                console.log("城堡危险，开始燃烧效果");
                break;
            case CastleState.DESTROYED:
                console.log("城堡被摧毁");
                break;
        }
    }
    
    // ========== 战斗相关方法 ==========
    
    /**
     * 受到伤害
     */
    public takeDamage(damage: number, attacker: any): void {
        if (this.isDestroyed) return;
        
        // 计算实际伤害（考虑防御力）
        const actualDamage = Math.max(1, damage - this.castleStats.defense);
        
        this.currentHealth -= actualDamage;
        console.log(`城堡受到 ${actualDamage} 点伤害 (原始伤害: ${damage}, 防御: ${this.castleStats.defense}), 剩余血量: ${this.currentHealth}/${this.castleStats.maxHealth}`);
        
        // 触发受伤事件
        this.onDamageTaken(actualDamage, attacker);
        
        // 更新状态
        this.updateStateByHealth();
        
        // 检查是否被摧毁
        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.destroyCastle();
        }
    }
    
    /**
     * 治疗
     */
    public heal(amount: number): void {
        if (this.isDestroyed) return;
        
        const oldHealth = this.currentHealth;
        this.currentHealth = Math.min(this.currentHealth + amount, this.castleStats.maxHealth);
        const actualHeal = this.currentHealth - oldHealth;
        
        if (actualHeal > 0) {
            console.log(`城堡恢复 ${actualHeal} 点血量, 当前血量: ${this.currentHealth}/${this.castleStats.maxHealth}`);
            this.onHealed(actualHeal);
            
            // 更新状态
            this.updateStateByHealth();
        }
    }
    
    /**
     * 根据血量更新状态
     */
    protected updateStateByHealth(): void {
        if (this.isDestroyed) return;

        const healthPercentage = this.currentHealth / this.castleStats.maxHealth;

        if (healthPercentage <= 0) {
            this.changeState(CastleState.DESTROYED);
        } else if (healthPercentage <= 0.3) {
            this.changeState(CastleState.CRITICAL);
        } else if (healthPercentage <= 0.7) {
            this.changeState(CastleState.DAMAGED);
        } else {
            this.changeState(CastleState.NORMAL);
        }

        // 更新纹理
        this.updateCastleTexture();
    }

    /**
     * 根据血量百分比更新城堡纹理
     */
    private updateCastleTexture(): void {
        if (!this.castleSprite) return;

        const healthPercentage = this.currentHealth / this.castleStats.maxHealth;
        let texturePath = "";

        if (healthPercentage > 0.5) {
            texturePath = this.textureHealthy;
        } else if (healthPercentage > 0.1) {
            texturePath = this.textureDamaged;
        } else {
            texturePath = this.textureCritical;
        }

        if (texturePath) {
            Laya.loader.load(texturePath).then(() => {
                const texture = Laya.loader.getRes(texturePath);
                if (texture && this.castleSprite) {
                    this.castleSprite.texture = texture;
                }
            });
        }
    }
    
    /**
     * 摧毁处理
     */
    protected destroyCastle(): void {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.changeState(CastleState.DESTROYED);

        console.log(`城堡被摧毁`);

        // 触发摧毁事件
        this.onDestroyed();
    }
    
    /**
     * 清理资源
     */
    protected cleanup(): void {
        // 清理定时器等资源
    }

    /**
     * 重写destroy方法以匹配基类
     */
    public destroy(): void {
        this.cleanup();
        super.destroy();
    }
    
    // ========== 事件处理方法 ==========
    
    /**
     * 受到伤害事件
     */
    protected onDamageTaken(damage: number, attacker: any): void {
        // 触发事件供外部监听
        this.owner.event("CASTLE_DAMAGE_TAKEN", { castle: this, damage: damage, attacker: attacker });
    }
    
    /**
     * 治疗事件
     */
    protected onHealed(amount: number): void {
        // 触发事件供外部监听
        this.owner.event("CASTLE_HEALED", { castle: this, amount: amount });
    }
    
    /**
     * 摧毁事件
     */
    protected onDestroyed(): void {
        // 触发事件供外部监听
        this.owner.event("CASTLE_DESTROYED", { castle: this });
    }
    
    // ========== 公共接口 ==========
    
    /**
     * 获取当前状态
     */
    public getCurrentState(): CastleState {
        return this.currentState;
    }
    
    /**
     * 获取当前血量
     */
    public getCurrentHealth(): number {
        return this.currentHealth;
    }
    
    /**
     * 获取最大血量
     */
    public getMaxHealth(): number {
        return this.castleStats.maxHealth;
    }
    
    /**
     * 获取血量百分比
     */
    public getHealthPercentage(): number {
        return this.currentHealth / this.castleStats.maxHealth;
    }
    
    /**
     * 检查是否被摧毁
     */
    public getIsDestroyed(): boolean {
        return this.isDestroyed;
    }
    
    /**
     * 获取城堡属性
     */
    public getStats(): ICastleStats {
        return { ...this.castleStats }; // 返回副本，防止外部修改
    }
    
    /**
     * 设置城堡等级
     */
    public setCastleLevel(level: number): void {
        if (level < 1) level = 1;
        if (level > 10) level = 10; // 最大等级限制
        
        this.castleLevel = level;
        
        // 重新计算属性
        const oldMaxHealth = this.castleStats.maxHealth;
        this.castleStats = this.calculateCastleStats();
        
        // 按比例调整当前血量
        const healthRatio = this.currentHealth / oldMaxHealth;
        this.currentHealth = Math.floor(this.castleStats.maxHealth * healthRatio);
        
        console.log(`城堡等级设置为 ${level}，属性已更新`);
    }
    
    /**
     * 获取城堡等级
     */
    public getCastleLevel(): number {
        return this.castleLevel;
    }
    
    /**
     * 获取城堡的详细信息
     */
    public getCastleInfo(): any {
        return {
            name: "Castle",
            level: this.castleLevel,
            camp: this.isPlayerCamp ? "Player" : "Enemy",
            health: `${this.currentHealth}/${this.castleStats.maxHealth}`,
            state: this.currentState,
            stats: this.getStats()
        };
    }
}

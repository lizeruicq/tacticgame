const { regClass } = Laya;

/**
 * 血条管理器 - 专门处理怪物血条显示
 */
@regClass()
export class HealthBarManager {
    
    /**
     * 更新怪物血条显示
     */
    public static updateMonsterHealthBar(monster: any): void {
        const healthPercentage = monster.getHealthPercentage();
        const currentHealth = monster.getCurrentHealth();
        const maxHealth = monster.getMaxHealth();
        
        console.log(`${monster.constructor.name} 血量: ${currentHealth}/${maxHealth} (${(healthPercentage * 100).toFixed(1)}%)`);
        
        // 获取怪物节点
        const monsterSprite = monster.owner as Laya.Sprite;
        
        // 查找血条子节点
        const healthBarNode = monsterSprite.getChildByName("healthbar");
        if (!healthBarNode) {
            console.warn(`${monster.constructor.name} 未找到healthbar子节点`);
            return;
        }
        
        // 更新血条显示
        this.updateHealthBarUI(healthBarNode, healthPercentage, currentHealth, maxHealth);
    }
    
    /**
     * 更新血条UI显示
     */
    private static updateHealthBarUI(healthBarNode: Laya.Node, healthPercentage: number, currentHealth: number, maxHealth: number): void {
        // 方案1: ProgressBar组件
        const progressBar = healthBarNode as Laya.ProgressBar;
        if (progressBar && progressBar.value !== undefined) {
            progressBar.value = healthPercentage;
            console.log(`血条进度更新: ${(healthPercentage * 100).toFixed(1)}%`);
            this.updateHealthBarColor(healthBarNode, healthPercentage);
            return;
        }
        
        // 方案2: 缩放填充条
        const fillSprite = healthBarNode.getChildByName("fill") || 
                          healthBarNode.getChildByName("bar") || 
                          healthBarNode.getChildByName("health");
        
        if (fillSprite && fillSprite instanceof Laya.Sprite) {
            fillSprite.scaleX = healthPercentage;
            console.log(`血条填充缩放更新: ${(healthPercentage * 100).toFixed(1)}%`);
        }
        
        // 方案3: 血量文本显示
        const healthText = healthBarNode.getChildByName("text") || 
                          healthBarNode.getChildByName("label") ||
                          healthBarNode.getChildByName("healthText");
        
        if (healthText && healthText instanceof Laya.Label) {
            healthText.text = `${currentHealth}/${maxHealth}`;
            console.log(`血量文本更新: ${currentHealth}/${maxHealth}`);
        }
        
        // 方案4: 宽度调整填充条
        const backgroundBar = healthBarNode.getChildByName("background") || healthBarNode.getChildByName("bg");
        const foregroundBar = healthBarNode.getChildByName("foreground") || healthBarNode.getChildByName("fg");
        
        if (backgroundBar && foregroundBar && foregroundBar instanceof Laya.Sprite) {
            const bgSprite = backgroundBar as Laya.Sprite;
            const maxWidth = bgSprite.width || 100;
            foregroundBar.width = maxWidth * healthPercentage;
            console.log(`血条宽度更新: ${foregroundBar.width}/${maxWidth}`);
        }
        
        // 更新血条颜色和特效
        this.updateHealthBarColor(healthBarNode, healthPercentage);
    }
    
    /**
     * 根据血量百分比更新血条颜色和特效
     */
    private static updateHealthBarColor(healthBarNode: Laya.Node, healthPercentage: number): void {
        // 查找可以改变颜色的血条元素
        const colorableElements = [
            healthBarNode.getChildByName("fill"),
            healthBarNode.getChildByName("bar"),
            healthBarNode.getChildByName("health"),
            healthBarNode.getChildByName("foreground"),
            healthBarNode.getChildByName("fg")
        ].filter(element => element && element instanceof Laya.Sprite) as Laya.Sprite[];
        
        if (colorableElements.length === 0) return;
        
        // 根据血量百分比确定状态
        let healthState: 'healthy' | 'warning' | 'danger';
        if (healthPercentage > 0.6) {
            healthState = 'healthy';
        } else if (healthPercentage > 0.3) {
            healthState = 'warning';
        } else {
            healthState = 'danger';
        }
        
        // 应用状态效果到所有可着色元素
        colorableElements.forEach(element => {
            this.applyHealthState(element, healthState);
        });
    }
    
    /**
     * 应用血量状态效果到精灵
     */
    private static applyHealthState(sprite: Laya.Sprite, state: 'healthy' | 'warning' | 'danger'): void {
        try {
            // 清除之前的效果
            this.clearEffects(sprite);
            
            switch (state) {
                case 'healthy':
                    sprite.alpha = 1.0;
                    sprite.scaleY = 1.0;
                    break;
                    
                case 'warning':
                    sprite.alpha = 0.9;
                    sprite.scaleY = 0.95;
                    break;
                    
                case 'danger':
                    sprite.alpha = 0.8;
                    sprite.scaleY = 0.9;
                    // 添加闪烁效果表示危险
                    this.addBlinkEffect(sprite);
                    break;
            }
            
        } catch (error) {
            console.warn("应用血量状态效果失败:", error);
        }
    }
    
    /**
     * 清除精灵上的特效
     */
    private static clearEffects(sprite: Laya.Sprite): void {
        // 重置基本属性
        sprite.alpha = 1.0;
        sprite.scaleY = 1.0;
        
        // 清除定时器（如果有的话）
        // 注意：这里简化处理，实际项目中可能需要更精确的定时器管理
    }
    
    /**
     * 添加闪烁效果（危险状态）
     */
    private static addBlinkEffect(sprite: Laya.Sprite): void {
        let blinkCount = 0;
        const maxBlinks = 4;
        
        const blinkTimer = () => {
            if (blinkCount >= maxBlinks) {
                sprite.alpha = 0.8; // 恢复到危险状态的透明度
                return;
            }
            
            sprite.alpha = sprite.alpha > 0.6 ? 0.5 : 0.8;
            blinkCount++;
            
            Laya.timer.once(300, null, blinkTimer);
        };
        
        // 开始闪烁
        Laya.timer.once(300, null, blinkTimer);
    }
    
    /**
     * 创建简单的血条节点（代码创建方式）
     */
    public static createSimpleHealthBar(parent: Laya.Sprite, width: number = 60, height: number = 8): Laya.Box {
        // 创建血条容器
        const healthBar = new Laya.Box();
        healthBar.name = "healthbar";
        healthBar.size(width, height);
        healthBar.pos(0, -30); // 位于父节点上方
        
        // 创建背景
        const background = new Laya.Sprite();
        background.name = "background";
        background.graphics.drawRect(0, 0, width, height, "#333333");
        background.pos(0, 0);
        healthBar.addChild(background);
        
        // 创建填充条
        const fill = new Laya.Sprite();
        fill.name = "fill";
        fill.graphics.drawRect(0, 0, width, height, "#00FF00");
        fill.pos(0, 0);
        fill.pivot(0, 0); // 设置锚点为左上角
        healthBar.addChild(fill);
        
        // 添加到父节点
        parent.addChild(healthBar);
        
        console.log(`为 ${parent.name} 创建了简单血条`);
        return healthBar;
    }
    
    /**
     * 隐藏血条
     */
    public static hideHealthBar(monster: any): void {
        const monsterSprite = monster.owner as Laya.Sprite;
        const healthBarNode = monsterSprite.getChildByName("healthbar");
        if (healthBarNode) {
            healthBarNode.visible = false;
        }
    }
    
    /**
     * 显示血条
     */
    public static showHealthBar(monster: any): void {
        const monsterSprite = monster.owner as Laya.Sprite;
        const healthBarNode = monsterSprite.getChildByName("healthbar");
        if (healthBarNode) {
            healthBarNode.visible = true;
        }
    }
}

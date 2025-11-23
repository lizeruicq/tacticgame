const { regClass, property } = Laya;

/**
 * 怪物血条脚本
 * 挂载在怪物预制体的healthbar组件上，通过事件驱动更新血量显示
 */
@regClass()
export class MonsterHealthBar extends Laya.Script {

    @property({ type: Laya.ProgressBar })
    public healthBar: Laya.ProgressBar = null;

    // 血条颜色配置
    private readonly COLOR_GREEN: string = "#00ff00";   // 绿色 (71%-100%)
    private readonly COLOR_YELLOW: string = "#ffff00";  // 黄色 (31%-70%)
    private readonly COLOR_RED: string = "#ff0000";     // 红色 (0%-30%)

    onAwake(): void {
        // 如果没有手动指定healthBar，尝试自动获取
        if (!this.healthBar) {
            this.healthBar = this.owner as Laya.ProgressBar;
        }

        if (!this.healthBar) {
            // console.error("MonsterHealthBar: 未找到ProgressBar组件");
            return;
        }

        // 监听怪物受伤事件
        this.owner.parent.on("MONSTER_DAMAGE_TAKEN", this, this.onMonsterDamaged);

        // 监听怪物治疗事件
        this.owner.parent.on("MONSTER_HEALED", this, this.onMonsterHealed);

        // 初始化血条（延迟一帧，确保怪物组件已初始化）
        Laya.timer.once(100, this, this.updateHealthBar);
    }

    /**
     * 怪物受伤事件处理
     */
    private onMonsterDamaged(): void {
        this.updateHealthBar();
    }

    /**
     * 怪物治疗事件处理
     */
    private onMonsterHealed(): void {
        this.updateHealthBar();
    }

    /**
     * 更新血条显示
     */
    private updateHealthBar(): void {
        // 从父节点获取怪物组件（支持所有BaseMonster子类）
        const monsterNode = this.owner.parent;
        if (!monsterNode) return;

        // 获取怪物组件（会自动获取RockMonster、WizardMonster、PastorMonster等子类）
        const components = (monsterNode as any)._components || [];
        let currentHealth = 0;
        let maxHealth = 100;

        for (const component of components) {
            // 检查是否有getCurrentHealth方法（BaseMonster及其子类都有）
            if (component && typeof component.getCurrentHealth === 'function') {
                currentHealth = component.getCurrentHealth();
                maxHealth = component.getMaxHealth();
                break;
            }
        }

        const healthPercentage = currentHealth / maxHealth;

        // 更新进度条值 (0-1)
        this.healthBar.value = healthPercentage;

        // 根据血量百分比更新颜色
        this.updateHealthBarColor(healthPercentage);
    }

    /**
     * 根据血量百分比更新血条颜色
     * @param percentage 血量百分比 (0-1)
     */
    private updateHealthBarColor(percentage: number): void {
        let color: string;

        if (percentage > 0.7) {
            // 71%-100%: 绿色
            color = this.COLOR_GREEN;
        } else if (percentage > 0.3) {
            // 31%-70%: 黄色
            color = this.COLOR_YELLOW;
        } else {
            // 0%-30%: 红色
            color = this.COLOR_RED;
        }

        // 设置进度条颜色
        if (this.healthBar.bar) {
            (this.healthBar.bar as Laya.Image).color = color;
        }
    }

    onDestroy(): void {
        // 移除事件监听
        if (this.owner.parent) {
            this.owner.parent.off("MONSTER_DAMAGE_TAKEN", this, this.onMonsterDamaged);
            this.owner.parent.off("MONSTER_HEALED", this, this.onMonsterHealed);
        }

        this.healthBar = null;
    }
}


# 🎯 怪物系统使用指南

## 📋 系统架构

### 基类：BaseMonster
- **位置**：`assets/resources/scripts/BaseMonster.ts`
- **功能**：提供所有怪物的通用功能和属性
- **特点**：抽象类，包含完整的战斗、移动、状态管理系统

### 子类：RockMonster
- **位置**：`assets/resources/scripts/RockMonster.ts`
- **功能**：Rock怪物的特有属性和行为
- **特点**：继承基类所有功能，添加反击、等级系统等特性

## 🏗️ 怪物属性系统

### 基础属性（IMonsterStats）
```typescript
interface IMonsterStats {
    speed: number;           // 移动速度（像素/秒）
    attackPower: number;     // 攻击力
    attackSpeed: number;     // 攻击间隔（毫秒）
    attackRange: number;     // 攻击范围（像素）
    maxHealth: number;       // 最大血量
}
```

### 运行时属性
- `currentHealth` - 当前血量
- `currentState` - 当前状态（idle/moving/attacking/dying/dead）
- `currentTarget` - 当前攻击目标
- `isPlayerCamp` - 阵营标识（true=玩家阵营，false=敌方阵营）

## 🎮 怪物状态系统

### 状态枚举
```typescript
enum MonsterState {
    IDLE = "idle",           // 待机
    MOVING = "moving",       // 移动中
    ATTACKING = "attacking", // 攻击中
    DYING = "dying",         // 死亡中
    DEAD = "dead"            // 已死亡
}
```

### 状态转换逻辑
1. **IDLE** → **MOVING**：发现敌方目标
2. **MOVING** → **ATTACKING**：进入攻击范围
3. **ATTACKING** → **MOVING**：目标超出攻击范围
4. **任何状态** → **DYING**：血量归零
5. **DYING** → **DEAD**：死亡动画完成

## 🔧 在LayaAir IDE中设置

### 步骤1：添加组件
1. 选中怪物节点（如Rock）
2. 在属性面板底部点击"添加组件"
3. 选择"脚本组件" → "RockMonster"
4. 确保同时添加了对应的动画管理器组件

### 步骤2：配置属性
```typescript
// 在IDE属性面板中设置
isPlayerCamp: false        // 设置为敌方阵营
rockLevel: 2              // 设置Rock等级
canCounterAttack: true    // 启用反击能力
```

### 步骤3：场景结构
```
GameScene (Scene2D)
├── BattleField (Box)
│   ├── Rock (Sprite) ← RockMonster组件在这里
│   │   └── RockAnimation (Animation) ← 动画节点
│   └── Enemy (Sprite) ← 其他怪物
└── UI层...
```

## 💻 代码使用示例

### 基本使用
```typescript
// 获取怪物组件
const rockMonster = rockNode.getComponent(RockMonster);

// 查看怪物信息
console.log(rockMonster.getRockInfo());

// 设置阵营
rockMonster.isPlayerCamp = true;

// 设置等级
rockMonster.setRockLevel(3);

// 设置攻击目标
const enemyMonster = enemyNode.getComponent(BaseMonster);
rockMonster.setTarget(enemyMonster);

// 强制执行攻击
rockMonster.forceAttack(enemyMonster);
```

### 监听怪物事件
```typescript
// 监听通用怪物事件
rockNode.on("MONSTER_ATTACK_PERFORMED", this, (data) => {
    const { attacker, target } = data;
    console.log(`${attacker.constructor.name} 攻击了 ${target.constructor.name}`);
});

rockNode.on("MONSTER_DAMAGE_TAKEN", this, (data) => {
    const { target, damage, attacker } = data;
    console.log(`${target.constructor.name} 受到 ${damage} 点伤害`);
    // 更新血条UI
    this.updateHealthBar(target);
});

rockNode.on("MONSTER_DEATH", this, (data) => {
    const { monster } = data;
    console.log(`${monster.constructor.name} 死亡`);
    // 处理死亡奖励
    this.giveDeathReward(monster);
});

// 监听Rock特有事件
rockNode.on("ROCK_DROP_RESOURCES", this, (data) => {
    const { dropType, amount } = data;
    console.log(`掉落了 ${amount} 个 ${dropType}`);
    // 收集资源
    this.collectResources(dropType, amount);
});
```

### 战斗系统使用
```typescript
// 造成伤害
rockMonster.takeDamage(50, attackerMonster);

// 治疗
rockMonster.heal(30);

// 检查状态
if (rockMonster.getCurrentState() === MonsterState.ATTACKING) {
    console.log("Rock正在攻击");
}

// 获取血量信息
const healthPercent = rockMonster.getHealthPercentage();
console.log(`血量: ${(healthPercent * 100).toFixed(1)}%`);
```

## 🎨 创建新的怪物类型

### 步骤1：创建子类
```typescript
// 例如：SkeletonMonster.ts
@regClass()
export class SkeletonMonster extends BaseMonster {
    
    // 骷髅特有属性
    @property({ type: Boolean })
    public canCastSpells: boolean = true;
    
    protected initializeMonster(): void {
        // 设置骷髅的基础属性
        this.monsterStats = {
            speed: 120,
            attackPower: 15,
            attackSpeed: 1200,
            attackRange: 150,
            maxHealth: 80
        };
    }
    
    protected getAnimationManagerComponent(): any {
        return this.owner.getComponent(SkeletonAnimationManager);
    }
    
    // 骷髅特有方法
    public castSpell(target: BaseMonster): void {
        if (this.canCastSpells && !this.getIsDead()) {
            console.log("骷髅施法攻击！");
            target.takeDamage(this.monsterStats.attackPower * 1.5, this);
        }
    }
}
```

### 步骤2：重写特殊行为
```typescript
// 重写受伤事件
protected onDamageTaken(damage: number, attacker: BaseMonster): void {
    super.onDamageTaken(damage, attacker);
    
    // 骷髅受伤时有概率施法反击
    if (Math.random() < 0.3 && this.canCastSpells) {
        this.castSpell(attacker);
    }
}

// 重写死亡事件
protected onDeath(): void {
    super.onDeath();
    
    // 骷髅死亡时召唤小骷髅
    this.summonMinions();
}
```

## 🎯 最佳实践

### 1. 性能优化
- 使用对象池管理怪物实例
- 合理设置更新频率
- 及时清理死亡怪物的引用

### 2. 平衡性设计
- 根据等级合理调整属性
- 设置攻击冷却时间
- 平衡不同怪物的强度

### 3. 事件驱动
- 使用事件系统解耦代码
- 统一处理UI更新
- 便于添加特效和音效

### 4. 扩展性考虑
- 预留接口用于技能系统
- 支持状态效果（buff/debuff）
- 考虑AI行为树扩展

## 🐛 常见问题

### Q: 怪物不攻击目标
A: 检查以下几点：
- 目标是否为不同阵营
- 目标是否在攻击范围内
- 攻击冷却是否结束
- 怪物是否处于正确状态

### Q: 动画不播放
A: 确保：
- 动画管理器组件已正确添加
- 动画资源路径正确
- 基类能正确获取动画管理器组件

### Q: 事件不触发
A: 检查：
- 事件监听是否正确设置
- 事件名称是否匹配
- 监听器是否在正确的时机添加

## 🚀 高级功能

### 技能系统扩展
```typescript
// 为怪物添加技能系统
interface ISkill {
    name: string;
    cooldown: number;
    damage: number;
    range: number;
    execute(caster: BaseMonster, target: BaseMonster): void;
}

// 在怪物类中添加技能
public skills: ISkill[] = [];

public useSkill(skillIndex: number, target: BaseMonster): boolean {
    const skill = this.skills[skillIndex];
    if (skill && this.canUseSkill(skill)) {
        skill.execute(this, target);
        return true;
    }
    return false;
}
```

### AI行为扩展
```typescript
// 添加AI决策系统
protected updateIdleBehavior(): void {
    const target = this.findBestTarget();
    if (target) {
        this.setTarget(target);
        
        // AI决策：选择攻击方式
        if (this.shouldUseSkill()) {
            this.useSkill(0, target);
        } else {
            this.changeState(MonsterState.MOVING);
        }
    }
}
```

这个怪物系统为你的游戏提供了完整的战斗、状态管理和扩展能力！🎉

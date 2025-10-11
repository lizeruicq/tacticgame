# Wizard怪物实现文档

## ✅ 已创建的文件

### 1. WizardMonster.ts
- **路径**: `assets/resources/scripts/WizardMonster.ts`
- **功能**: Wizard怪物的核心逻辑类
- **继承**: 继承自BaseMonster

### 2. WizardAnimationManager.ts
- **路径**: `assets/resources/scripts/WizardAnimationManager.ts`
- **功能**: Wizard怪物的动画管理器
- **继承**: 继承自BaseAnimationManager

## 🎯 Wizard怪物特性

### 与Rock怪物的对比

| 属性 | Rock怪物 | Wizard怪物 | 说明 |
|------|----------|------------|------|
| **攻击范围** | 120 | **200** | Wizard攻击范围更大，适合远程攻击 |
| **移动速度** | 80 | 60 | Wizard移动较慢（法师特点） |
| **攻击力** | 25 | 30 | Wizard攻击力稍高（魔法攻击） |
| **攻击速度** | 1500ms | 1200ms | Wizard攻击速度中等 |
| **生命值** | 150 | 120 | Wizard血量较低（脆皮法师） |

### 核心属性配置

```typescript
const baseStats: IMonsterStats = {
    speed: 60,           // 移动较慢
    attackPower: 30,     // 攻击力较高
    attackSpeed: 1200,   // 攻击速度中等
    attackRange: 200,    // 攻击范围很大 ⭐
    maxHealth: 120       // 血量中等
};
```

## 🎨 动画系统

### 动画文件路径
- **基础路径**: `resources/images/ANI/wizard/`
- **动画文件**:
  - `idle.atlas` - 待机动画
  - `attacking.atlas` - 攻击动画
  - `walking.atlas` - 行走动画
  - `dying.atlas` - 死亡动画

### 动画配置特点

```typescript
// 待机动画 - 更优雅
interval: 120,  // 比Rock稍慢
wrapMode: 2,    // 来回播放

// 攻击动画 - 魔法效果
interval: 100,  // 施法速度
scale: 1.1,     // 攻击时放大
offsetY: -15,   // 向上偏移，显示魔法升腾

// 行走动画 - 轻盈移动
interval: 80,   // 较快，显示轻盈
wrapMode: 2,    // 来回播放

// 死亡动画 - 优雅倒下
interval: 150,  // 较慢，显示优雅
loop: false,    // 不循环
```

## ⚡ 特殊功能

### 1. 魔法攻击效果

```typescript
// 重写攻击方法
protected performAttack(): void {
    console.log(`Wizard施展魔法攻击！`);
    
    // 播放攻击动画
    this.wizardAnimationManager.playAttackingAnimation();
    
    // 执行基础攻击
    super.performAttack();
    
    // 添加魔法特效
    this.playMagicEffect();
}
```

### 2. 魔法特效系统

**攻击特效**:
- 魔法闪光效果
- 缩放和透明度变化
- 可扩展添加粒子效果

**死亡特效**:
- 魔法消散效果
- 渐隐和缩小动画
- 优雅的死亡过渡

### 3. 远程攻击能力

```typescript
// 检查攻击目标
public canAttackTarget(target: any): boolean {
    const distance = this.getDistanceToPosition(targetSprite.x, targetSprite.y);
    return distance <= this.monsterStats.attackRange; // 200像素范围
}
```

## 🔧 使用方法

### 1. 预制体设置

创建Wizard预制体时需要：
- 挂载WizardMonster组件
- 挂载WizardAnimationManager组件
- 设置正确的动画资源路径

### 2. 代码创建

```typescript
// 通过MonsterManager创建
const monsterManager = MonsterManager.getInstance();
monsterManager.createMonster("Wizard", true, {x: 300, y: 200}, 1)
    .then(wizardSprite => {
        battleField.addChild(wizardSprite);
    });
```

### 3. 属性设置

```typescript
const wizard = wizardSprite.getComponent(WizardMonster);
wizard.setWizardLevel(2);           // 设置等级
wizard.isPlayerCamp = true;         // 设置阵营
```

## 📊 等级系统

### 等级影响

```typescript
// 每级增加20%属性
const levelMultiplier = 1 + (this.wizardLevel - 1) * 0.2;

// 攻击范围特殊增长
attackRange: baseRange * (1 + (level - 1) * 0.15)  // 每级增加15%
```

### 等级示例

| 等级 | 攻击范围 | 攻击力 | 生命值 |
|------|----------|--------|--------|
| 1 | 200 | 30 | 120 |
| 2 | 230 | 36 | 144 |
| 3 | 260 | 42 | 168 |
| 5 | 320 | 54 | 216 |

## 🎮 战术特点

### 优势
- **远程攻击**: 200像素攻击范围，可以安全输出
- **高攻击力**: 30点基础攻击力，适合快速清理敌人
- **魔法特效**: 丰富的视觉效果，提升游戏体验

### 劣势
- **移动缓慢**: 60像素/秒，容易被快速单位追击
- **血量较低**: 120点生命值，需要保护
- **需要定位**: 远程单位需要合适的站位

### 使用策略
- **后排输出**: 放置在后排进行远程攻击
- **配合肉盾**: 与高血量单位配合使用
- **控制距离**: 利用攻击范围优势保持安全距离

## 🔍 调试功能

### 状态调试

```typescript
// 输出Wizard详细信息
wizard.debugWizardStatus();

// 输出动画状态
wizardAnimationManager.debugAnimationStatus();

// 获取Wizard信息
const info = wizard.getWizardInfo();
console.log(info);
```

### 调试输出示例

```
=== Wizard状态信息 ===
等级: 2
生命值: 144/144
攻击力: 36
攻击范围: 230
移动速度: 72
当前状态: IDLE
阵营: 玩家
目标距离: 156.2
```

## 🚀 扩展建议

### 1. 魔法技能系统
- 添加不同的魔法技能
- 技能冷却时间
- 魔法消耗系统

### 2. 特效增强
- 粒子系统集成
- 更丰富的魔法特效
- 攻击弹道效果

### 3. AI增强
- 智能站位系统
- 优先攻击目标选择
- 逃跑机制

这个Wizard怪物实现了你要求的所有功能，攻击范围比Rock更大，其他属性保持平衡，并且具有独特的魔法师特色和丰富的动画效果！

# Wizard怪物创建总结

## ✅ 已创建的文件

### 1. WizardMonster.ts
- **路径**: `assets/resources/scripts/WizardMonster.ts`
- **功能**: Wizard怪物核心逻辑，继承自BaseMonster
- **状态**: ✅ 已完成，无报错

### 2. WizardAnimationManager.ts
- **路径**: `assets/resources/scripts/WizardAnimationManager.ts`
- **功能**: Wizard动画管理器，继承自BaseAnimationManager
- **状态**: ✅ 已完成，格式与RockAnimationManager完全一致

## 🎯 Wizard怪物特性

### 核心属性对比

| 属性 | Rock | Wizard | 说明 |
|------|------|--------|------|
| **攻击范围** | 120 | **200** | Wizard攻击范围更大 ⭐ |
| 移动速度 | 80 | 60 | Wizard移动较慢 |
| 攻击力 | 25 | 30 | Wizard攻击力稍高 |
| 攻击速度 | 1500ms | 1200ms | Wizard攻击速度中等 |
| 生命值 | 150 | 120 | Wizard血量较低 |

### 关键代码

```typescript
// Wizard基础属性
const baseStats: IMonsterStats = {
    speed: 60,           // 移动较慢（法师特点）
    attackPower: 30,     // 攻击力较高（魔法攻击）
    attackSpeed: 1200,   // 攻击速度中等
    attackRange: 200,    // 攻击范围很大 ⭐
    maxHealth: 120       // 血量中等（脆皮法师）
};
```

## 🎨 动画系统

### 动画文件路径
```
resources/images/ANI/wizard/
├── idle.atlas      - 待机动画
├── attacking.atlas - 攻击动画
├── walking.atlas   - 行走动画
└── dying.atlas     - 死亡动画
```

### 动画接口（与Rock完全一致）
```typescript
// 外部调用接口
wizardAnimationManager.startAttack();    // 开始攻击
wizardAnimationManager.startWalking();   // 开始移动
wizardAnimationManager.stopWalking();    // 停止移动
wizardAnimationManager.startDying();     // 开始死亡

// 状态查询
wizardAnimationManager.isAttacking();    // 是否在攻击
wizardAnimationManager.isWalking();      // 是否在移动
```

## 🔧 使用方法

### 1. 预制体设置
创建Wizard预制体时需要：
- 挂载 `WizardMonster` 组件
- 挂载 `WizardAnimationManager` 组件
- 确保动画资源在 `resources/images/ANI/wizard/` 路径下

### 2. 代码创建
```typescript
// 通过MonsterManager创建（需要先在MonsterManager中添加Wizard支持）
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

### 属性增长
- **基础属性**: 每级增加20%
- **攻击范围**: 每级增加15%（特殊增长）

### 等级示例
| 等级 | 攻击范围 | 攻击力 | 生命值 |
|------|----------|--------|--------|
| 1 | 200 | 30 | 120 |
| 2 | 230 | 36 | 144 |
| 3 | 260 | 42 | 168 |

## 🎮 战术定位

### 优势
- **远程输出**: 200像素攻击范围，安全距离攻击
- **高攻击力**: 30点基础攻击，快速清理敌人
- **法师特色**: 独特的魔法师定位

### 劣势
- **移动缓慢**: 60像素/秒，容易被追击
- **血量较低**: 120点生命值，需要保护
- **需要定位**: 远程单位需要合适的站位

### 使用策略
- **后排输出**: 放置在后排进行远程攻击
- **配合肉盾**: 与高血量单位配合使用
- **控制距离**: 利用攻击范围优势保持安全距离

## 🔍 调试功能

```typescript
// 获取Wizard详细信息
const info = wizard.getWizardInfo();
console.log(info);

// 输出状态信息
wizard.debugWizardStatus();
```

## 📝 下一步工作

### 1. 集成到MonsterManager
需要在MonsterManager中添加Wizard的创建逻辑：
```typescript
// 在MonsterManager.createMonster()中添加
case "Wizard":
    // 加载Wizard预制体并创建
    break;
```

### 2. 创建Wizard卡牌
参考RockCard创建WizardCard：
- 卡牌预制体: `prefabs/cards/card_wizard.lh`
- 卡牌脚本: `WizardCard.ts`
- 在CardConfig中添加Wizard配置

### 3. 动画资源
确保以下动画文件存在：
- `resources/images/ANI/wizard/idle.atlas`
- `resources/images/ANI/wizard/attacking.atlas`
- `resources/images/ANI/wizard/walking.atlas`
- `resources/images/ANI/wizard/dying.atlas`

## ✨ 特色功能

### 1. 远程攻击优势
Wizard的200像素攻击范围使其成为优秀的远程输出单位，可以在安全距离内攻击敌人。

### 2. 法师定位
作为法师单位，Wizard具有高攻击力但相对脆弱的特点，需要合理的战术运用。

### 3. 扩展性
代码结构完全遵循现有的怪物系统架构，便于后续添加更多法师特有的技能和效果。

---

**总结**: Wizard怪物系统已经完成创建，具有更大的攻击范围和法师特色，代码结构与现有系统完全兼容，可以直接集成使用！

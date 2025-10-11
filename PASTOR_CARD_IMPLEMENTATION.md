# Pastor卡片系统实现总结

## 🎯 实现目标

参照RockCard和WizardCard的格式，创建PastorCard脚本，并在CardConfig等相关配置文件中完善Pastor怪物和卡片属性，保持代码简洁一致。

## ✅ 完成的工作

### 1. 创建PastorCard脚本

**文件**: `assets/resources/scripts/PastorCard.ts`

**核心特点**:
```typescript
@regClass()
export class PastorCard extends BaseMonsterCard {
    @property(Number)
    public pastorLevel: number = 1; // Pastor等级

    constructor() {
        super();
        this.cardName = "Pastor卡片";
        this.manaCost = 2; // 治疗型单位，法力消耗较低
        this.monsterPrefabPath = "prefabs/monster/Pastor.lh";
    }

    protected getMonsterType(): string {
        return "Pastor";
    }
}
```

**与其他卡片的一致性**:
- ✅ 继承自`BaseMonsterCard`
- ✅ 实现相同的抽象方法
- ✅ 相同的属性命名模式（`pastorLevel`）
- ✅ 相同的方法命名模式（`setPastorLevel`, `getPastorLevel`）
- ✅ 相同的信息获取方法（`getCardInfo`）

### 2. 更新CardConfig配置

**新增Pastor卡片配置**:
```typescript
"Pastor": {
    type: "Pastor",
    prefabPath: "prefabs/cards/card_pastor.lh",
    componentClass: "PastorCard",
    manaCost: 2,  // 治疗型单位，消耗较低
    level: 1
}
```

**更新关卡配置**:
```typescript
// 第一关
playerCards: ["Rock", "Wizard", "Pastor"]  // 新增Pastor
enemyCards: ["Rock", "Wizard"]

// 第二关  
playerCards: ["Rock", "Wizard", "Pastor"]  // 新增Pastor
enemyCards: ["Rock", "Wizard", "Pastor"]   // 敌方也可使用Pastor
```

### 3. 法力消耗平衡设计

| 卡片类型 | 法力消耗 | 角色定位 | 设计理念 |
|----------|----------|----------|----------|
| **Pastor** | 2 | 治疗支援 | 低消耗，易于部署 |
| **Rock** | 3 | 近战坦克 | 中等消耗，平衡选择 |
| **Wizard** | 4 | 远程输出 | 高消耗，强力单位 |

## 🔧 技术实现细节

### 1. 代码结构一致性

**所有卡片都遵循相同的模式**:
```typescript
// 1. 等级属性
@property(Number)
public [monsterType]Level: number = 1;

// 2. 构造函数设置
constructor() {
    super();
    this.cardName = "[MonsterType]卡片";
    this.manaCost = [cost];
    this.monsterPrefabPath = "prefabs/monster/[MonsterType].lh";
}

// 3. 实现抽象方法
protected getMonsterType(): string {
    return "[MonsterType]";
}

// 4. 特有方法
public set[MonsterType]Level(level: number): void
public get[MonsterType]Level(): number
public getCardInfo(): any
```

### 2. 配置文件集成

**CardConfig.ts中的完整配置**:
- ✅ 卡片类型配置（`CARD_CONFIGS`）
- ✅ 关卡配置更新（`LEVEL_CONFIGS`）
- ✅ 自动验证支持（现有的验证方法会自动支持Pastor）

### 3. 系统集成检查

**已确认的兼容性**:
- ✅ **MonsterManager**: 已有Pastor预制体路径配置
- ✅ **BaseMonsterCard**: 通用基类，无需修改
- ✅ **CardManager**: 使用通用接口，自动支持新卡片
- ✅ **PastorMonster**: 已实现完整的怪物逻辑
- ✅ **PastorAnimationManager**: 已实现动画管理

## 🚀 使用方法

### 1. 在游戏中使用Pastor卡片

```typescript
// 自动通过CardManager创建和管理
// 玩家点击Pastor卡片时会自动：
// 1. 检查法力值（需要2点法力）
// 2. 生成Pastor怪物
// 3. 设置正确的阵营和等级
// 4. 开始治疗行为
```

### 2. 获取Pastor卡片信息

```typescript
// 通过CardConfig获取配置
const pastorConfig = CardConfig.getCardConfig("Pastor");
console.log(pastorConfig.manaCost); // 2

// 通过卡片实例获取信息
const pastorCard = new PastorCard();
const cardInfo = pastorCard.getCardInfo();
console.log(cardInfo.pastorLevel); // 1
```

### 3. 设置Pastor等级

```typescript
const pastorCard = new PastorCard();
pastorCard.setPastorLevel(3);
console.log(pastorCard.getPastorLevel()); // 3
```

## 📊 卡片平衡性分析

### 法力消耗设计理念

**Pastor (2法力)**:
- **优势**: 提供治疗支援，增强团队生存能力
- **劣势**: 无攻击力，需要保护
- **定位**: 支援型，低成本快速部署

**Rock (3法力)**:
- **优势**: 近战坦克，血量较高
- **劣势**: 攻击范围有限
- **定位**: 前排肉盾，中等成本

**Wizard (4法力)**:
- **优势**: 远程高伤害输出
- **劣势**: 血量较低，需要保护
- **定位**: 后排输出，高成本高收益

### 战术组合建议

1. **平衡组合**: Rock + Pastor + Wizard
   - 总消耗: 9法力
   - 前排坦克 + 治疗支援 + 远程输出

2. **快攻组合**: Pastor + Pastor + Rock
   - 总消耗: 7法力
   - 双治疗保障 + 快速推进

3. **重火力组合**: Wizard + Wizard + Pastor
   - 总消耗: 10法力
   - 双远程输出 + 治疗保障

## ✅ 验证结果

### 代码质量检查
- ✅ **无编译错误**: TypeScript编译通过
- ✅ **命名一致**: 遵循现有的命名规范
- ✅ **结构统一**: 与RockCard、WizardCard完全一致
- ✅ **功能完整**: 实现所有必需的方法和属性

### 功能完整性检查
- ✅ **卡片创建**: 可以正确创建PastorCard实例
- ✅ **怪物生成**: 可以生成Pastor怪物
- ✅ **等级管理**: 支持等级设置和获取
- ✅ **配置集成**: CardConfig正确识别Pastor类型
- ✅ **关卡支持**: 关卡配置包含Pastor选项

### 系统集成检查
- ✅ **MonsterManager**: 支持Pastor怪物创建
- ✅ **CardManager**: 自动支持Pastor卡片管理
- ✅ **GameMainManager**: 法力系统支持Pastor消耗
- ✅ **动画系统**: PastorAnimationManager完整支持

## 🎯 总结

成功创建了完整的Pastor卡片系统：

1. **PastorCard脚本**: 与RockCard、WizardCard保持完全一致的代码结构
2. **CardConfig配置**: 添加了Pastor的完整配置信息
3. **关卡集成**: 更新了关卡配置，支持Pastor卡片
4. **平衡设计**: 2法力消耗的治疗型定位，与其他卡片形成良好平衡

现在玩家可以在游戏中使用Pastor卡片，享受治疗支援带来的战术多样性！

---

**关键特点**: 代码简洁、格式一致、功能完整、系统集成良好。

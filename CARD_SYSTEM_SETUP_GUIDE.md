# 🃏 卡片系统设置指南 (预制体版本)

## 🎯 **系统概述**

我已经为你创建了完整的卡片系统，实现了点击卡片生成Rock预制体的功能：

### ✅ **已完成的功能**

1. **RockCard脚本** - 处理Rock卡片的点击和预制体生成逻辑
2. **CardManager脚本** - 管理所有卡片和法力值系统
3. **预制体生成** - 直接加载并实例化Rock.lh预制体
4. **智能位置计算** - 在spawnArea范围内随机生成位置

## 🏗️ **场景结构分析**

根据场景文件，我找到了以下关键节点：

```
GameScene
├── BattleField (Box) - 位置: (42, 38), 尺寸: 1102x1905 ✅
│   └── [所有怪物都会生成在这里]
├── CardBox (HBox) - 位置: (100, 2029), 尺寸: 980x262
│   ├── CardManager组件 ✅
│   └── card (Sprite) - 子卡片节点
└── spawnArea (Sprite) - 中心: (598, 1787), 尺寸: 1069x313, 锚点: (0.5, 0.5) ✅
```

## 🔧 **设置步骤**

### 1. **确保Rock预制体存在**

确保你已经创建了Rock预制体，包含：
- Rock精灵节点
- RockMonster组件
- RockAnimationManager组件
- 动画子节点

### 2. **卡片节点设置**

在LayaAir IDE中：

1. **选择CardBox下的card节点**
2. **添加RockCard组件**：
   - 在属性面板中点击"添加组件"
   - 选择"RockCard"脚本
   - 设置属性：
     - `cardName`: "Rock卡片"
     - `manaCost`: 3
     - `rockLevel`: 1
     - `isPlayerCard`: true

### 3. **验证节点引用**

确保以下节点存在且命名正确：
- ✅ `CardBox` - 卡片容器
- ✅ `spawnArea` - 生成区域
- ✅ `card` - 卡片节点（CardBox的子节点）

## 🎮 **使用方法**

### **点击卡片生成精灵**

1. **运行场景**
2. **点击Rock卡片**
3. **系统会自动**：
   - 在spawnArea范围内随机选择位置
   - 创建Rock精灵节点
   - 添加所有必要组件
   - 设置为玩家阵营
   - 创建血条显示

### **生成的预制体特性**

```typescript
// 直接加载Rock.lh预制体，包含：
- 完整的Rock精灵结构
- 预配置的RockMonster组件
- 预配置的RockAnimationManager组件
- 预配置的血条和动画
- 唯一名称 (Rock_时间戳)
- 随机生成位置
```

## 🎯 **核心功能特性**

### 1. **预制体加载系统**

```typescript
// 使用LayaAir预制体加载
Laya.loader.load("prefabs/Rock.lh").then(() => {
    const rockPrefab = Laya.loader.getRes("prefabs/Rock.lh");
    const rockSprite = Laya.Pool.getItemByCreateFun("Rock", rockPrefab.create, rockPrefab);
    // 设置属性和位置
});
```

### 2. **智能位置计算（考虑锚点）**

```typescript
// spawnArea锚点为(0.5, 0.5)，需要基于中心点计算边界
const areaCenterX = this.spawnArea.x;  // 中心点X
const areaCenterY = this.spawnArea.y;  // 中心点Y
const areaWidth = this.spawnArea.width;
const areaHeight = this.spawnArea.height;

// 计算实际边界
const areaLeft = areaCenterX - areaWidth / 2;
const areaRight = areaCenterX + areaWidth / 2;
const areaTop = areaCenterY - areaHeight / 2;
const areaBottom = areaCenterY + areaHeight / 2;

// 在边界内随机生成，避免边缘
const margin = 50;
const randomX = areaLeft + margin + Math.random() * (areaWidth - margin * 2);
const randomY = areaTop + margin + Math.random() * (areaHeight - margin * 2);
```

### 3. **预制体属性设置和节点管理**

```typescript
// 获取预制体中的组件并设置属性
const rockMonster = rockSprite.getComponent(RockMonster);
rockMonster.isPlayerCamp = this.isPlayerCard;
rockMonster.setRockLevel(this.rockLevel);

// 添加到BattleField节点下进行统一管理
this.battleField.addChild(rockSprite);
```

### 3. **卡片冷却系统**

- 使用后3秒冷却
- 冷却期间卡片变暗
- 冷却完成后恢复正常

### 4. **法力值系统**

- 每张卡片有法力消耗
- 使用卡片会扣除法力值
- 支持法力值恢复

## 🧪 **测试方法**

### **控制台输出示例**

```
=== CardManager 初始化 ===
发现卡片节点: card
添加了 Rock卡片_1 组件
总共初始化了 1 张卡片
Rock卡片 卡片初始化
Rock卡片 初始化完成
生成区域: spawnArea (1069x190)

[点击卡片后]
点击了 Rock卡片
开始生成 Rock卡片 精灵
创建了 Rock_1703123456789 精灵，阵营: 玩家
Rock卡片 精灵生成成功，位置: (156.7, 1823.4)
CardManager: Rock卡片 被使用
剩余法力值: 7/10
Rock卡片 冷却完成
```

## 🎨 **自定义选项**

### **卡片属性**

```typescript
@property(String) cardName: string = "Rock卡片";
@property(Number) manaCost: number = 3;
@property(Number) rockLevel: number = 1;
@property(Boolean) isPlayerCard: boolean = true;
```

### **生成参数**

```typescript
// 可以调整的参数
- 精灵尺寸: rockSprite.size(245, 245)
- 生成边距: const margin = 50
- 冷却时间: this.cooldownTime = 3000
- 血条尺寸: createSimpleHealthBar(rockSprite, 80, 10)
```

## 🔄 **扩展其他怪物卡片**

### **创建新的怪物卡片**

1. **复制RockCard.ts** → `SkeletonCard.ts`
2. **修改关键部分**：
   ```typescript
   // 导入对应的怪物组件
   import { SkeletonMonster } from "./SkeletonMonster";
   import { SkeletonAnimationManager } from "./SkeletonAnimationManager";
   
   // 修改创建方法
   private createSkeletonSprite(position: {x: number, y: number}): Laya.Sprite {
       // 创建Skeleton特有的精灵逻辑
   }
   ```

### **CardManager自动识别**

CardManager会自动根据卡片节点名称添加对应组件：
```typescript
// 在initializeCards方法中添加
if (cardNode.name.includes("skeleton")) {
    const skeletonCard = cardNode.addComponent(SkeletonCard);
    // 设置Skeleton特有属性
}
```

## 🎉 **总结**

✅ **完整的卡片系统**：
- 点击卡片生成精灵
- 智能位置计算
- 完整组件集成
- 冷却和法力值系统

✅ **易于扩展**：
- 支持多种怪物卡片
- 可自定义卡片属性
- 模块化设计

✅ **用户友好**：
- 清晰的视觉反馈
- 详细的控制台日志
- 错误处理机制

现在你可以点击Rock卡片来生成玩家阵营的Rock精灵了！🎯

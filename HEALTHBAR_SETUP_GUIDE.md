# 🩸 血条系统设置指南

## 📋 血条节点结构

### 推荐的血条节点结构

在LayaAir IDE中，为Rock精灵创建血条子节点：

```
Rock (Sprite) ← 怪物主节点
├── RockAnimation (Animation) ← 动画节点
└── healthbar (Node/Box) ← 血条容器节点
    ├── background (Sprite) ← 血条背景（灰色）
    ├── fill (Sprite) ← 血条填充（绿色/黄色/红色）
    └── text (Label) ← 血量文字显示（可选）
```

## 🎨 血条创建步骤

### 方案1：使用ProgressBar组件（推荐）

1. **创建血条容器**：
   - 右键Rock节点 → 创建 → UI组件 → ProgressBar
   - 重命名为"healthbar"
   - 设置位置：相对于Rock中心上方（如：x=0, y=-30）

2. **配置ProgressBar属性**：
   - `value`: 1.0 (满血状态)
   - `min`: 0
   - `max`: 1
   - `skin`: 选择合适的血条皮肤资源

### 方案2：自定义Sprite血条

1. **创建血条容器**：
   - 右键Rock节点 → 创建 → 基础显示对象 → Box
   - 重命名为"healthbar"
   - 设置尺寸：width=60, height=8
   - 设置位置：x=0, y=-30（相对于Rock中心上方）

2. **创建背景条**：
   - 右键healthbar → 创建 → 基础显示对象 → Sprite
   - 重命名为"background"
   - 设置尺寸：width=60, height=8
   - 设置位置：x=0, y=0
   - 设置颜色：深灰色背景

3. **创建填充条**：
   - 右键healthbar → 创建 → 基础显示对象 → Sprite
   - 重命名为"fill"
   - 设置尺寸：width=60, height=8
   - 设置位置：x=0, y=0
   - 设置颜色：绿色填充
   - 设置锚点：anchorX=0, anchorY=0（左对齐）

4. **创建文字显示（可选）**：
   - 右键healthbar → 创建 → UI组件 → Label
   - 重命名为"text"
   - 设置位置：x=30, y=4（居中）
   - 设置文字：fontSize=10, color="#FFFFFF"
   - 设置对齐：align="center"

## 💻 代码集成

### 自动血条更新

血条会在以下情况自动更新：
- 怪物受到伤害时
- 怪物恢复血量时
- 怪物血量发生任何变化时

### 支持的血条类型

代码自动检测并支持以下血条结构：

1. **ProgressBar组件**：
   ```typescript
   // 自动检测ProgressBar并更新value属性
   progressBar.value = healthPercentage; // 0.0 - 1.0
   ```

2. **缩放填充条**：
   ```typescript
   // 查找名为"fill"、"bar"、"health"的子节点
   fillSprite.scaleX = healthPercentage; // 水平缩放
   ```

3. **宽度调整填充条**：
   ```typescript
   // 根据背景宽度调整前景宽度
   foregroundBar.width = maxWidth * healthPercentage;
   ```

4. **文字显示**：
   ```typescript
   // 显示具体数值
   healthText.text = `${currentHealth}/${maxHealth}`;
   ```

## 🎯 血条视觉效果

### 颜色状态指示

- **绿色**：血量 > 60%（健康状态）
- **黄色**：血量 30% - 60%（警告状态）
- **红色**：血量 < 30%（危险状态）

### 危险状态特效

当血量低于30%时：
- 血条会有闪烁效果
- 透明度会降低
- 垂直缩放会略微减小

## 🔧 自定义配置

### 修改血条位置

在IDE中调整healthbar节点的位置：
```
x: 0 (相对于Rock中心)
y: -30 (Rock上方30像素)
```

### 修改血条尺寸

调整healthbar容器和子节点的尺寸：
```
width: 60 (血条宽度)
height: 8 (血条高度)
```

### 修改颜色阈值

在GameMainManager.ts中修改：
```typescript
// 在updateHealthBarColor方法中
if (healthPercentage > 0.6) {
    color = "#00FF00"; // 健康阈值：60%
} else if (healthPercentage > 0.3) {
    color = "#FFFF00"; // 警告阈值：30%
} else {
    color = "#FF0000"; // 危险阈值：30%以下
}
```

## 🎨 美化建议

### 血条样式优化

1. **添加边框**：
   - 在background上添加描边效果
   - 使用更深的颜色作为边框

2. **渐变效果**：
   - 使用渐变纹理作为填充
   - 从亮绿色到深绿色的渐变

3. **动画效果**：
   - 血量变化时的平滑过渡
   - 受伤时的震动效果

### 高级特效

1. **粒子效果**：
   - 治疗时的绿色光点
   - 受伤时的红色飞溅

2. **数字飞出**：
   - 伤害数字从怪物身上飞出
   - 治疗数字以绿色显示

## 🐛 常见问题

### Q: 血条不显示
A: 检查以下几点：
- healthbar节点是否正确命名
- 节点是否在Rock的子节点中
- 节点的visible属性是否为true

### Q: 血条位置不对
A: 调整healthbar节点的位置：
- 确保锚点设置正确
- 检查相对位置是否合适

### Q: 血条颜色不变化
A: 检查子节点命名：
- 确保有名为"fill"、"bar"或"health"的子节点
- 确保子节点是Sprite类型

### Q: 血条更新不及时
A: 确保事件监听正确：
- 检查怪物事件是否正确触发
- 确保updateHealthBar方法被调用

## 🚀 扩展功能

### 多重血条

为Boss怪物创建多段血条：
```
healthbar (Box)
├── segment1 (Sprite) ← 第一段血条
├── segment2 (Sprite) ← 第二段血条
└── segment3 (Sprite) ← 第三段血条
```

### 护盾条

在血条上方添加护盾条：
```
healthbar (Box)
├── shield (Sprite) ← 护盾条（蓝色）
└── health (Sprite) ← 血条（红色）
```

### 状态指示器

在血条旁边添加状态图标：
```
healthbar (Box)
├── fill (Sprite) ← 血条填充
├── statusIcon (Sprite) ← 状态图标
└── text (Label) ← 血量文字
```

这个血条系统为你的游戏提供了完整的血量可视化功能！🎉

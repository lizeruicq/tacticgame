# Rock 精灵动画系统设置指南

## 🎯 概述

这个系统为 GameScene 中的 Rock 精灵提供了完整的动画状态管理，支持四种动画状态：idle、attacking、walking、dying。

## 📋 准备工作

### 1. 准备动画资源

确保以下动画图集文件存在于项目中：

```
assets/resources/images/ANI/
├── stone-idle.png      (已存在)
├── stone-attacking.png (需要添加)
├── stone-walking.png   (需要添加)
└── stone-dying.png     (需要添加)
```

### 2. 制作图集文件

如果你有序列帧图片，可以使用 LayaAir IDE 的图集制作工具：

1. **打开图集制作工具**：IDE菜单 → 工具 → 制作图集
2. **选择图片文件夹**：将同一动画的所有帧图片放在一个文件夹中
3. **设置输出路径**：选择 `assets/resources/images/ANI/` 目录
4. **命名规则**：
   - idle 动画 → `stone-idle`
   - attacking 动画 → `stone-attacking`
   - walking 动画 → `stone-walking`
   - dying 动画 → `stone-dying`

## 🔧 在 LayaAir IDE 中设置

### 步骤 1：为 Rock 精灵添加 Animation 子节点

**重要：Rock保持Sprite类型，不需要改为Box！**

1. **打开 GameScene.ls 场景**
2. **在层级面板中找到：BattleField → Rock 节点**
3. **右键点击 Rock 节点**
4. **选择菜单：创建 → 2D基础显示对象 → 动画节点**

   ```
   创建 → 2D基础显示对象 → 动画节点 (Animation)
   ```

5. **新创建的节点类型就是 "Animation"**
6. **将新节点重命名为 "RockAnimation"**

### 步骤 2：设置 Animation 节点属性

选中刚创建的 RockAnimation 节点，在属性面板中设置：

```
属性设置：
- Name: RockAnimation
- Position X: 0
- Position Y: 0  (相对于Rock父节点的位置)
- Width: 245
- Height: 245     (与Rock相同大小)
- AutoPlay: false (不勾选，由脚本控制)
- Source: 空      (先不设置，由脚本动态设置)
```

### 步骤 3：添加 RockAnimationManager 组件

**关键：组件添加到 Rock 节点上，不是 Animation 节点！**

1. **选中 Rock 节点（父节点，不是子节点）**
2. **在属性面板底部找到 "添加组件" 按钮**
3. **点击 "添加组件" → "脚本组件"**
4. **在弹出的脚本列表中选择 "RockAnimationManager"**

### 步骤 4：配置组件属性

在 Rock 节点的 RockAnimationManager 组件属性中：

1. **找到 "rockAnimation" 属性框**
2. **将刚创建的 RockAnimation 子节点拖入这个属性框**
3. **确保属性框显示 "RockAnimation" 而不是空**

## 🎮 使用方法

### 在代码中控制动画

```typescript
// 获取动画管理器
const rockAnimationManager = rockNode.getComponent(RockAnimationManager);

// 切换到不同状态
rockAnimationManager.startAttack();    // 攻击
rockAnimationManager.startWalking();   // 移动
rockAnimationManager.stopWalking();    // 停止移动（回到idle）
rockAnimationManager.startDying();     // 死亡

// 获取当前状态
const currentState = rockAnimationManager.getCurrentState();
const isDying = rockAnimationManager.getIsDying();
```

### 监听动画事件

```typescript
// 监听死亡完成事件
rockNode.on("ROCK_DEATH_COMPLETE", this, () => {
    console.log("Rock 死亡动画播放完成");
    // 处理死亡后的逻辑
});
```

## ⚙️ 动画配置

每种动画状态都有独立的配置：

```typescript
// 在 RockAnimationManager.ts 中可以调整这些参数
private animationConfigs = {
    idle: {
        interval: 100,      // 帧间隔（毫秒）
        wrapMode: 2,        // PINGPONG 来回播放
        autoPlay: true      // 自动播放
    },
    attacking: {
        interval: 80,       // 攻击动画较快
        wrapMode: 0,        // POSITIVE 正序播放
        autoPlay: false     // 手动控制
    },
    walking: {
        interval: 60,       // 移动动画最快
        wrapMode: 0,        // POSITIVE 循环播放
        autoPlay: false
    },
    dying: {
        interval: 120,      // 死亡动画较慢
        wrapMode: 0,        // POSITIVE 播放一次
        autoPlay: false
    }
};
```

## 🎮 关于动画状态机

**LayaAir 不需要创建传统的动画状态机，原因：**

1. **Animation 组件本身就是状态机**：
   - 每个动画资源（图集）代表一个状态
   - 通过切换 `source` 属性来切换状态
   - 通过 `wrapMode` 控制播放模式

2. **RockAnimationManager 就是我们的状态机**：
   - `RockAnimationState` 枚举定义了所有状态
   - `changeState()` 方法处理状态转换
   - `animationConfigs` 定义了每个状态的参数

## 🏗️ 最终的场景结构

```
GameScene (Scene2D)
├── BattleField (Box)
│   └── Rock (Sprite) ← RockAnimationManager组件添加在这里
│       └── RockAnimation (Animation) ← 子节点，类型是Animation
├── CardBox (HBox)
└── 其他节点...
```

## 🔄 动画状态转换逻辑

1. **默认状态**：idle（待机）
2. **攻击完成**：自动回到 idle
3. **死亡状态**：一旦进入，无法切换到其他状态
4. **移动状态**：可以手动停止，回到 idle

## 🧪 测试功能

GameMainManager 中包含了测试代码，会自动演示动画切换：

- 3秒后：开始移动
- 6秒后：攻击
- 9秒后：移动
- 12秒后：停止移动（回到idle）
- 15秒后：死亡

## 🐛 故障排除

### 常见问题

1. **动画不播放**：
   - 检查图集文件路径是否正确
   - 确认 Animation 节点已正确设置
   - 查看控制台错误信息

2. **动画切换不正常**：
   - 确认 RockAnimationManager 组件已添加
   - 检查 rockAnimation 属性是否已设置

3. **资源加载失败**：
   - 确认图集文件存在于正确路径
   - 检查文件名拼写是否正确

### 调试信息

系统会在控制台输出详细的调试信息：

```
=== RockAnimationManager 初始化 ===
Rock动画管理器初始化完成
切换动画状态: idle -> walking
播放动画: walking, 间隔: 60ms
```

## 📝 扩展建议

1. **添加音效**：在动画切换时播放对应音效
2. **粒子特效**：为攻击和死亡动画添加特效
3. **动画事件**：在动画的特定帧触发事件（如攻击判定）
4. **状态机**：实现更复杂的状态转换逻辑

## 🎉 完成

按照以上步骤设置后，你的 Rock 精灵就具备了完整的动画状态管理功能！

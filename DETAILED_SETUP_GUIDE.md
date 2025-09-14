# 🎯 Rock 精灵动画系统 - 超详细操作指南

## 📋 前置准备

### 1. 确认当前场景结构
打开 GameScene.ls，确认你有以下结构：
```
GameScene (Scene2D)
├── BattleField (Box)
│   └── Rock (Sprite) ← 当前是这样的
└── 其他节点...
```

### 2. 准备动画资源文件
确保以下文件存在：
- ✅ `assets/resources/images/ANI/stone-idle.png` (已存在)
- ❓ `assets/resources/images/ANI/stone-attacking.png` (需要添加)
- ❓ `assets/resources/images/ANI/stone-walking.png` (需要添加)  
- ❓ `assets/resources/images/ANI/stone-dying.png` (需要添加)

## 🔧 详细操作步骤

### 步骤 1：为 Rock 添加 Animation 子节点

**在 LayaAir IDE 中：**

1. **打开 GameScene.ls 场景文件**

2. **在左侧层级面板中找到节点路径：**
   ```
   Scene2D → BattleField → Rock
   ```

3. **右键点击 "Rock" 节点**

4. **在弹出的右键菜单中选择：**
   ```
   创建 → 2D基础显示对象 → 动画节点
   ```

5. **此时会在 Rock 下创建一个新的子节点**
   - 节点类型：Animation
   - 默认名称：Animation

6. **重命名新节点：**
   - 选中新创建的 Animation 节点
   - 在属性面板的 Name 字段中改为：`RockAnimation`

### 步骤 2：配置 RockAnimation 节点属性

**选中 RockAnimation 节点，在右侧属性面板中设置：**

```
基础属性：
┌─────────────────────────────────┐
│ Name: RockAnimation             │
│ Position X: 0                   │
│ Position Y: 0                   │
│ Width: 245                      │
│ Height: 245                     │
│ Visible: ✓ (勾选)              │
└─────────────────────────────────┘

Animation 专有属性：
┌─────────────────────────────────┐
│ Source: (空，不设置)            │
│ AutoPlay: ☐ (不勾选)           │
│ WrapMode: 0                     │
│ Interval: 50                    │
│ Index: 0                        │
└─────────────────────────────────┘
```

### 步骤 3：为 Rock 节点添加 RockAnimationManager 组件

**重要：组件要添加到 Rock 父节点上，不是 RockAnimation 子节点！**

1. **选中 Rock 节点（父节点）**
   - 确保选中的是 "Rock"，不是 "RockAnimation"

2. **在属性面板底部找到组件区域**

3. **点击 "添加组件" 按钮**

4. **在弹出的组件选择窗口中：**
   - 选择 "脚本组件" 分类
   - 找到并选择 "RockAnimationManager"
   - 点击确定

### 步骤 4：配置 RockAnimationManager 组件属性

**在 Rock 节点的 RockAnimationManager 组件中：**

1. **找到 "rockAnimation" 属性字段**
   - 这是一个对象引用字段，显示为空的输入框

2. **设置 rockAnimation 属性：**
   - 方法1：从层级面板拖拽 RockAnimation 节点到属性框
   - 方法2：点击属性框右侧的圆点按钮，在弹窗中选择 RockAnimation

3. **确认设置成功：**
   - 属性框应该显示 "RockAnimation" 而不是空

## ✅ 最终场景结构确认

完成后，你的场景结构应该是：

```
GameScene (Scene2D)
├── BattleField (Box)
│   └── Rock (Sprite) ← 有 RockAnimationManager 组件
│       └── RockAnimation (Animation) ← 子节点
└── 其他节点...
```

## 🧪 测试设置是否正确

### 方法 1：查看属性面板
选中 Rock 节点，在属性面板底部应该看到：
- ✅ RockAnimationManager 组件
- ✅ rockAnimation 属性已设置为 RockAnimation

### 方法 2：运行场景测试
1. 保存场景文件
2. 运行 GameScene
3. 查看控制台输出，应该看到：
   ```
   === GameMainManager 初始化 ===
   === RockAnimationManager 初始化 ===
   Rock动画管理器初始化完成
   Rock动画系统设置完成
   ```

## 🐛 常见问题解决

### 问题 1：找不到 RockAnimationManager 组件
**解决方案：**
1. 确认 `RockAnimationManager.ts` 文件存在于 `assets/resources/scripts/` 目录
2. 重新编译项目
3. 刷新 IDE 的组件列表

### 问题 2：rockAnimation 属性设置不上
**解决方案：**
1. 确认 RockAnimation 节点确实是 Rock 的子节点
2. 确认 RockAnimation 节点类型是 Animation
3. 尝试重新拖拽设置

### 问题 3：控制台报错 "未找到RockAnimationManager组件"
**解决方案：**
1. 确认组件添加到了 Rock 节点上，不是其他节点
2. 确认组件名称拼写正确
3. 重新添加组件

### 问题 4：动画不播放
**解决方案：**
1. 确认动画资源文件存在且路径正确
2. 检查 RockAnimation 节点的 Visible 属性是否勾选
3. 查看控制台是否有资源加载错误

## 📝 操作检查清单

完成设置后，请逐项检查：

- [ ] Rock 节点保持 Sprite 类型
- [ ] Rock 下有 RockAnimation 子节点（Animation 类型）
- [ ] Rock 节点上有 RockAnimationManager 组件
- [ ] RockAnimationManager 的 rockAnimation 属性已设置
- [ ] 动画资源文件存在于正确路径
- [ ] 运行场景无控制台错误

## 🎉 完成确认

如果以上步骤都正确完成，你应该能看到：
1. 场景运行正常
2. 控制台输出初始化信息
3. 3秒后开始自动演示动画切换

恭喜！你的 Rock 精灵动画系统已经设置完成！

# 🎯 动画尺寸和位置调整指南

## 📋 问题描述

使用图集动画时常见的问题：
- ✅ 动画尺寸比精灵大得多
- ✅ 动画位置与精灵不对齐
- ✅ 不同动画状态的尺寸不一致

## 🔧 解决方案

### 方案1：自动适应精灵尺寸（推荐）

系统会自动将动画尺寸调整为与Rock精灵相同：

```typescript
// 在RockAnimationManager中自动执行
private setupAnimationTransform(): void {
    // 获取Rock精灵尺寸 (245 x 245)
    // 设置Animation节点为相同尺寸
    // 设置锚点为中心 (0.5, 0.5)
    // 调整位置以居中对齐
}
```

### 方案2：手动调整（精确控制）

如果自动调整效果不理想，可以手动微调：

```typescript
// 获取动画管理器
const rockAnimationManager = rockNode.getComponent(RockAnimationManager);

// 调整整体缩放
rockAnimationManager.setAnimationScale(0.8); // 缩小到80%

// 调整位置偏移
rockAnimationManager.setAnimationOffset(0, -10); // 向上偏移10像素

// 重置所有变换
rockAnimationManager.resetAnimationTransform();
```

## ⚙️ 配置参数调整

在 `RockAnimationManager.ts` 中，每个动画状态都有独立的配置：

```typescript
private animationConfigs = {
    [RockAnimationState.IDLE]: {
        interval: 100,
        wrapMode: 2,
        autoPlay: true,
        scale: 1.0,    // 缩放比例
        offsetX: 0,    // X轴偏移
        offsetY: 0     // Y轴偏移
    },
    [RockAnimationState.ATTACKING]: {
        interval: 80,
        wrapMode: 0,
        autoPlay: false,
        scale: 1.2,    // 攻击时放大20%
        offsetX: 0,
        offsetY: -10   // 向上偏移10像素
    },
    // ... 其他状态
};
```

## 🎨 常见调整场景

### 场景1：动画太大
```typescript
// 方法1：修改配置文件中的scale值
scale: 0.7  // 缩小到70%

// 方法2：运行时调整
rockAnimationManager.setAnimationScale(0.7);
```

### 场景2：动画位置偏上/偏下
```typescript
// 向下偏移15像素
offsetY: 15

// 或运行时调整
rockAnimationManager.setAnimationOffset(0, 15);
```

### 场景3：动画位置偏左/偏右
```typescript
// 向右偏移10像素
offsetX: 10

// 或运行时调整
rockAnimationManager.setAnimationOffset(10, 0);
```

### 场景4：不同状态需要不同调整
```typescript
[RockAnimationState.IDLE]: {
    scale: 1.0,
    offsetX: 0,
    offsetY: 0
},
[RockAnimationState.ATTACKING]: {
    scale: 1.3,    // 攻击时更大
    offsetX: 5,    // 稍微向右
    offsetY: -15   // 向上偏移更多
}
```

## 🧪 调试方法

### 方法1：查看控制台日志
运行场景后，控制台会显示详细信息：
```
Rock精灵尺寸: 245 x 245
Animation节点设置: 位置(122.5, 122.5), 尺寸(245, 245)
播放动画: idle, 间隔: 100ms, 缩放: 1, 偏移: (0, 0)
应用变换: 缩放(1), 位置(122.5, 122.5)
```

### 方法2：在IDE中实时调整
1. 运行场景
2. 在层级面板中选中 RockAnimation 节点
3. 在属性面板中实时调整：
   - Position X/Y
   - Scale X/Y
   - Width/Height

### 方法3：代码中动态测试
```typescript
// 在GameMainManager中添加测试代码
private testAnimationAdjustment(): void {
    if (this.rockAnimationManager) {
        // 测试不同的缩放值
        setTimeout(() => {
            this.rockAnimationManager.setAnimationScale(0.8);
        }, 2000);
        
        // 测试位置偏移
        setTimeout(() => {
            this.rockAnimationManager.setAnimationOffset(0, -20);
        }, 4000);
    }
}
```

## 📐 推荐的调整流程

### 步骤1：确定基准
1. 记录Rock精灵的尺寸 (245 x 245)
2. 查看动画图集的原始尺寸
3. 计算合适的缩放比例

### 步骤2：粗调
1. 设置合适的scale值（通常在0.5-1.5之间）
2. 运行测试，观察整体效果

### 步骤3：精调
1. 微调offsetX和offsetY
2. 针对不同动画状态单独调整
3. 测试所有动画状态的切换效果

### 步骤4：验证
1. 测试所有四种动画状态
2. 确认切换时位置和尺寸的一致性
3. 在不同设备分辨率下测试

## 🎯 最佳实践

### 1. 图集制作建议
- 保持所有动画帧的尺寸一致
- 角色在帧中的位置保持居中
- 避免过多的空白边距

### 2. 配置建议
- idle状态使用1.0缩放作为基准
- 攻击状态可以稍微放大(1.1-1.3)
- 死亡状态可能需要特殊的位置调整

### 3. 性能建议
- 避免频繁调用调整方法
- 在动画切换时一次性应用所有变换
- 使用合理的图集尺寸，避免过大的纹理

## 🐛 常见问题

### Q: 动画显示不完整
A: 检查Animation节点的width/height是否足够大

### Q: 动画闪烁或跳跃
A: 确保所有动画状态的锚点设置一致

### Q: 不同状态切换时位置跳跃
A: 检查每个状态的offsetX/offsetY配置

### Q: 动画模糊
A: 避免非整数的缩放值，使用0.5, 1.0, 1.5等

## 🎉 完成检查

调整完成后，确认以下效果：
- [ ] 动画尺寸与精灵匹配
- [ ] 动画位置居中对齐
- [ ] 所有状态切换流畅
- [ ] 没有位置跳跃现象
- [ ] 视觉效果符合预期

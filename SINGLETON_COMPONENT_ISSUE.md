# 单例组件问题分析与解决方案

## 🐛 问题现象

1. **警告信息**：`the component is singleton, can't add the second one. [object Object]`
2. **回调函数不生效**：点击动态生成的卡牌后，`onCardUsedCallback` 没有被调用
3. **控制台日志**：显示"卡牌创建成功，增加回调事件成功"，但实际回调不工作

## 🔍 问题根本原因

### 1. LayaAir组件单例限制

在LayaAir中，某些组件被标记为单例（singleton），这意味着：
- 一个节点只能有一个该类型的组件实例
- 尝试添加第二个实例会失败并产生警告
- 这通常发生在预制体中已经包含了组件的情况下

### 2. 预制体结构问题

**可能的情况**：
- 卡牌预制体 `prefabs/cards/card_rock.lh` 中已经包含了RockCard组件
- 代码尝试再次添加RockCard组件时失败
- 导致 `cardComponent` 为null，回调函数无法设置

### 3. 组件生命周期问题

**时序问题**：
- 动态创建的组件可能需要时间初始化
- 立即设置回调可能在组件完全准备好之前执行
- 需要延迟设置回调函数

## ✅ 解决方案

### 1. 智能组件检测和处理

```typescript
// 首先检查预制体中是否已经有RockCard组件
cardComponent = cardSprite.getComponent(RockCard);
if (cardComponent) {
    console.log(`${cardType} 预制体中已包含组件，使用现有组件`);
} else {
    // 如果没有，尝试添加组件
    try {
        cardComponent = cardSprite.addComponent(RockCard);
        console.log(`${cardType} 组件动态添加成功`);
    } catch (error) {
        console.error(`${cardType} 组件添加失败:`, error);
        // 处理失败情况
    }
}
```

### 2. 子节点组件查找

```typescript
// 如果主节点没有组件，尝试在子节点中查找
for (let i = 0; i < cardSprite.numChildren; i++) {
    const child = cardSprite.getChildAt(i);
    const childComponent = child.getComponent(RockCard);
    if (childComponent) {
        cardComponent = childComponent;
        console.log(`在子节点中找到 ${cardType} 组件`);
        break;
    }
}
```

### 3. 延迟回调设置

```typescript
// 延迟设置回调，确保组件完全初始化
Laya.timer.once(100, this, () => {
    if (cardComponent && cardComponent.owner) {
        cardComponent.onCardUsedCallback = (card: any) => this.onCardUsed(card);
        console.log(`${cardType} 回调函数延迟设置成功`);
    } else {
        console.error(`${cardType} 组件或owner不存在，无法设置回调`);
    }
});
```

### 4. 完整的错误处理

```typescript
if (cardComponent) {
    // 设置组件属性
    cardComponent.cardName = `${cardType}卡片`;
    cardComponent.rockLevel = cardConfig.level;
    cardComponent.isPlayerCard = true;
    cardComponent.manaCost = cardConfig.manaCost;
    console.log(`${cardType} 组件属性设置完成`);
} else {
    console.error(`无法获取 ${cardType} 组件`);
    return;
}
```

## 🎯 调试步骤

### 1. 检查预制体结构

在LayaAir IDE中检查 `prefabs/cards/card_rock.lh`：
- 查看预制体是否已经包含RockCard组件
- 检查组件是否在根节点还是子节点上
- 确认组件的配置是否正确

### 2. 控制台日志分析

**正常情况应该看到**：
```
创建 Rock 卡牌
Rock 精灵创建成功，名称: Rock_Card_1234567890
Rock 预制体中已包含组件，使用现有组件
Rock 组件属性设置完成
Rock 卡牌创建成功，激活卡牌总数: 1
Rock 回调函数延迟设置成功
```

**异常情况可能看到**：
```
Rock 组件添加失败: Error: the component is singleton, can't add the second one
无法获取 Rock 组件
```

### 3. 回调函数测试

点击卡牌后应该看到：
```
点击了 Rock卡片
Rock卡片 使用完成
CardManager: Rock卡片 被使用
```

## 🔧 预制体配置建议

### 1. 推荐的预制体结构

```
card_rock.lh
├── 根节点 (Sprite)
│   ├── RockCard组件 ← 在这里添加组件
│   ├── 背景图片
│   ├── 图标
│   └── 文字
```

### 2. 组件配置

在预制体中正确配置RockCard组件：
- 设置默认属性值
- 确保mouseEnabled = true
- 正确设置节点层级

### 3. 避免重复组件

- 如果预制体中已有组件，代码中就不要再添加
- 使用 `getComponent()` 获取现有组件
- 只设置必要的属性，不要重复添加组件

## 📊 性能优化

### 1. 组件复用

```typescript
// 优先使用预制体中的组件
const existingComponent = cardSprite.getComponent(RockCard);
if (existingComponent) {
    // 复用现有组件，只更新属性
    existingComponent.cardName = newName;
}
```

### 2. 延迟初始化

```typescript
// 避免立即设置回调，给组件初始化时间
Laya.timer.once(50, this, () => {
    setupCallback();
});
```

## 🎉 预期结果

修复后应该实现：
1. **无警告信息**：不再出现单例组件警告
2. **回调正常工作**：点击卡牌能正确触发回调
3. **完整流程**：卡牌使用 → 销毁 → 冷却 → 生成新卡牌
4. **稳定性**：无论预制体如何配置都能正常工作

这个解决方案兼容了预制体中包含组件和不包含组件两种情况，确保动态生成的卡牌能正常工作。

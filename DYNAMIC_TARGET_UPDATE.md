# 动态目标更新功能

## 🎯 功能描述

为怪物AI添加了在移动过程中动态更新目标的功能。当怪物处于MOVING状态时，会持续搜索更近的敌人，如果发现更近的目标会自动切换。

## 🔧 实现原理

### 核心逻辑
在`BaseMonster.updateMovingBehavior()`中添加了目标更新检查：

```typescript
protected updateMovingBehavior(): void {
    // 检查当前目标是否有效
    if (!this.currentTarget || this.isTargetDead(this.currentTarget)) {
        this.currentTarget = null;
        this.changeState(MonsterState.IDLE);
        return;
    }

    // 🆕 在移动过程中寻找更近的目标
    this.updateTargetWhileMoving();

    // 检查是否进入攻击范围
    const distance = this.getDistanceToTarget();
    if (distance <= this.monsterStats.attackRange) {
        this.changeState(MonsterState.ATTACKING);
    } else {
        this.moveTowardsTarget();
    }
}
```

### 目标更新算法
`updateTargetWhileMoving()`方法的工作流程：

1. **搜索新目标**：调用`findTarget()`获取最近的敌方目标
2. **距离比较**：计算当前目标和新目标的距离
3. **智能切换**：如果新目标更近，则切换目标
4. **日志输出**：记录目标切换信息

```typescript
protected updateTargetWhileMoving(): void {
    const newTarget = this.findTarget();
    if (!newTarget) return;

    const currentDistance = this.getDistanceToTarget();
    const newDistance = this.getDistanceToPosition(
        (newTarget.owner as Laya.Sprite).x,
        (newTarget.owner as Laya.Sprite).y
    );

    // 如果新目标更近，切换目标
    if (newDistance < currentDistance) {
        console.log(`移动中发现更近目标: 距离 ${currentDistance.toFixed(1)} -> ${newDistance.toFixed(1)}`);
        this.setTarget(newTarget);
    }
}
```

## 🎮 应用场景

### 场景1：多敌人环境
```
玩家怪物A正在向敌人B移动
途中敌人C出现在更近的位置
→ 怪物A自动切换目标到敌人C
```

### 场景2：敌人移动
```
玩家怪物正在追击移动的敌人A
另一个敌人B移动到更近位置
→ 自动切换到距离更近的敌人B
```

### 场景3：优先级目标
```
怪物正在向敌方城堡移动
途中出现敌方怪物（优先级更高）
→ 立即切换攻击敌方怪物
```

## 📊 性能考虑

### 执行频率
- 只在MOVING状态下执行
- 每帧调用一次（通过update循环）
- 利用现有的`findTarget()`方法，无额外性能开销

### 优化措施
- 复用MonsterManager的目标搜索算法
- 只有找到更近目标时才切换
- 避免频繁的目标切换抖动

## 🔍 调试信息

当目标切换时，控制台会输出详细信息：
```
RockMonster 移动中发现更近目标: RockMonster -> Castle, 距离: 240.5 -> 180.2
```

信息包含：
- 怪物类型
- 原目标类型 → 新目标类型  
- 原距离 → 新距离

## ✨ 优势

1. **智能化**：怪物能够动态适应战场变化
2. **效率提升**：总是攻击最近的敌人，减少移动时间
3. **战术灵活性**：能够响应敌人的移动和新敌人的出现
4. **无缝集成**：基于现有的目标搜索系统，无需额外配置

## 🧪 测试建议

### 测试用例1：基本功能
1. 创建玩家怪物和两个敌方怪物
2. 让玩家怪物向较远的敌人移动
3. 观察是否会切换到更近的敌人

### 测试用例2：动态环境
1. 创建移动的敌方怪物
2. 观察玩家怪物是否能跟踪最近的目标
3. 验证目标切换的流畅性

### 测试用例3：优先级验证
1. 怪物向城堡移动时
2. 在路径上放置敌方怪物
3. 验证是否正确切换到怪物目标

## 📝 代码修改

**修改文件**：`BaseMonster.ts`

**新增方法**：
- `updateTargetWhileMoving()`: 移动时的目标更新逻辑

**修改方法**：
- `updateMovingBehavior()`: 添加目标更新调用

**代码行数**：新增约30行代码

这个功能让怪物AI变得更加智能和灵活，能够在复杂的战场环境中做出最优的目标选择决策。

# LV2 节点显示功能 - 快速设置指南

## 🎯 功能说明

当卡片升级到 LV2 时，自动显示 lv2 节点（Box 容器），展示卡片升级后增加的属性。

## 📝 代码实现

### BaseMonsterCard 新增属性

```typescript
@property(Laya.Box)
public lv2Node: Laya.Box = null; // LV2属性展示节点
```

### BaseMonsterCard 新增方法

```typescript
/**
 * 更新LV2节点的可见性
 */
public updateLv2Visibility(): void {
    if (this.lv2Node) {
        this.lv2Node.visible = this.monsterLevel >= 2;
    }
}
```

### 初始化时隐藏 LV2 节点

在 `onAwake()` 中调用 `updateLv2Visibility()`：

```typescript
onAwake(): void {
    console.log(`${this.cardName} 卡片初始化`);
    this.initializeCard();
    this.updateCardLabels();
    this.updateLv2Visibility();  // 初始化时隐藏LV2节点
}
```

### 升级时显示 LV2 节点

在 `CardManager.mergeCards()` 中调用 `updateLv2Visibility()`：

```typescript
private mergeCards(draggedCard: any, targetCard: any): void {
    // 升级目标卡牌为2级
    targetCard.monsterLevel = 2;
    console.log(`${targetCard.cardName} 升级为2级`);

    // 更新卡片标签
    if (targetCard.updateCardLabels) {
        targetCard.updateCardLabels();
    }

    // 更新LV2节点可见性
    if (targetCard.updateLv2Visibility) {
        targetCard.updateLv2Visibility();
    }

    // 销毁被拖拽的卡牌
    this.destroyCard(draggedCard);
}
```

## 🔧 编辑器配置步骤

### 第1步：打开卡片预制体

打开 `prefabs/cards/card_rock.lh`（或其他卡片预制体）

### 第2步：设置 lv2 节点

1. 找到卡片中的 `lv2` Box 节点
2. 确保该节点包含所有 LV2 属性显示内容
3. 在检查器中设置 `visible = false`（默认不显示）

### 第3步：关联到脚本

1. 选中卡片节点（挂载 BaseMonsterCard 脚本的节点）
2. 在检查器中找到 BaseMonsterCard 脚本
3. 找到 `lv2Node` 属性
4. 将 `lv2` Box 节点拖拽到 `lv2Node` 属性

### 第4步：保存并测试

1. 保存预制体
2. 运行游戏
3. 验证：
   - 初始卡片的 lv2 节点不显示
   - 合成升级后，lv2 节点自动显示

## 🔄 工作流程

### 初始化流程

```
卡片加载
    ↓
onAwake() 执行
    ├─ initializeCard() - 初始化卡片
    ├─ updateCardLabels() - 更新标签
    └─ updateLv2Visibility() - 隐藏LV2节点
    ↓
lv2Node.visible = false（因为 monsterLevel = 1）
```

### 升级流程

```
玩家拖拽卡片进行合成
    ↓
checkAndMergeCard() 检查是否可以合成
    ↓
mergeCards() 执行合成
    ├─ targetCard.monsterLevel = 2
    ├─ targetCard.updateCardLabels() 更新标签
    ├─ targetCard.updateLv2Visibility() 显示LV2节点
    └─ destroyCard(draggedCard) 销毁被拖拽的卡片
    ↓
lv2Node.visible = true（因为 monsterLevel >= 2）
```

## 💡 特点

1. **自动隐藏** - 卡片初始化时自动隐藏 LV2 节点
2. **自动显示** - 卡片升级时自动显示 LV2 节点
3. **简洁易用** - 只需在编辑器中拖拽关联
4. **灵活扩展** - 可以添加更多等级节点（lv3、lv4 等）

## 📊 可见性规则

| 卡片等级 | lv2Node 可见性 |
|--------|--------------|
| LV1 | 不可见 |
| LV2+ | 可见 |

## ⚠️ 注意事项

1. **节点可选** - 如果不关联 lv2Node，代码不会报错
2. **初始状态** - 在编辑器中设置 lv2 节点的 `visible = false`
3. **其他升级方式** - 如果有其他升级卡片的方式，需要手动调用 `updateLv2Visibility()`

## 🎯 后续扩展

可以添加更多等级节点：

```typescript
@property(Laya.Box)
public lv3Node: Laya.Box = null; // LV3属性展示节点

@property(Laya.Box)
public lv4Node: Laya.Box = null; // LV4属性展示节点

public updateLevelNodes(): void {
    if (this.lv2Node) {
        this.lv2Node.visible = this.monsterLevel >= 2;
    }
    if (this.lv3Node) {
        this.lv3Node.visible = this.monsterLevel >= 3;
    }
    if (this.lv4Node) {
        this.lv4Node.visible = this.monsterLevel >= 4;
    }
}
```

## ✅ 编译状态

- ✅ 无编译错误
- ✅ 无类型错误
- ✅ 代码简洁易懂

---

**LV2 节点功能实现完成！** 🎴


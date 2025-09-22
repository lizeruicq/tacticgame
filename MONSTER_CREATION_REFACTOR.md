# 怪物创建方法重构总结

## 🎯 重构目标

将分散在各处的怪物创建逻辑抽象到MonsterManager中，提供统一的怪物创建接口，避免代码冗余。

## 📝 实现方案

### 1. MonsterManager新增方法

在`MonsterManager.ts`中添加了简洁的怪物创建方法：

```typescript
/**
 * 创建怪物
 * @param monsterType 怪物类型（"Rock"）
 * @param isPlayerCamp 是否玩家阵营
 * @param position 生成位置
 * @param level 怪物等级，默认1
 */
public createMonster(
    monsterType: string,
    isPlayerCamp: boolean,
    position: { x: number; y: number },
    level: number = 1
): Promise<Laya.Sprite>
```

### 2. 辅助方法

- `getPrefabPath(monsterType: string)`: 获取预制体路径
- `configureMonster()`: 配置怪物组件属性

## 🔄 使用方式

### RockCard中的使用

**重构前**（37行代码）：
```typescript
// 复杂的预制体加载和配置逻辑
Laya.loader.load(this.rockPrefabPath).then(() => {
    const rockPrefab = Laya.loader.getRes(this.rockPrefabPath);
    // ... 大量重复代码
});
```

**重构后**（9行代码）：
```typescript
// 简洁的调用
const monsterManager = MonsterManager.getInstance();
const battleField = gameManager.getBattleField();

monsterManager.createMonster("Rock", this.isPlayerCard, position, this.rockLevel)
    .then((rockSprite) => {
        battleField.addChild(rockSprite);
        console.log(`Rock怪物创建成功: ${rockSprite.name}`);
    });
```

### GameMainManager中的使用

**测试敌方怪物创建**：
```typescript
private createEnemyRockForTesting(): void {
    const monsterManager = MonsterManager.getInstance();
    const battleField = this.getBattleField();

    monsterManager.createMonster("Rock", false, { x: 600, y: 240 }, 1)
        .then((rockSprite) => {
            battleField.addChild(rockSprite);
            console.log(`敌方Rock怪物创建成功: ${rockSprite.name}`);
        });
}
```

## ✨ 优势

1. **代码复用**：消除了重复的预制体加载逻辑
2. **统一管理**：所有怪物创建都通过MonsterManager
3. **简洁清晰**：调用方只需要关心参数，不需要了解实现细节
4. **易于扩展**：添加新怪物类型只需要在MonsterManager中配置
5. **类型安全**：返回Promise<Laya.Sprite>，确保类型正确

## 📊 代码减少统计

- **RockCard.loadAndCreateRockPrefab**: 37行 → 9行 (减少76%)
- **GameMainManager.createEnemyRockForTesting**: 复杂逻辑 → 简单调用
- **总体**: 消除了约60行重复代码

## 🔧 技术细节

### 预制体路径管理
```typescript
private getPrefabPath(monsterType: string): string {
    const paths: { [key: string]: string } = { "Rock": "prefabs/Rock.lh" };
    return paths[monsterType];
}
```

### 组件配置
```typescript
private configureMonster(sprite: Laya.Sprite, type: string, isPlayerCamp: boolean, level: number): void {
    if (type === "Rock") {
        const components = (sprite as any)._components || [];
        for (const component of components) {
            if (component.constructor.name === "RockMonster") {
                component.isPlayerCamp = isPlayerCamp;
                component.setRockLevel(level);
                break;
            }
        }
    }
}
```

## 🚀 扩展性

添加新怪物类型只需要：
1. 在`getPrefabPath`中添加路径映射
2. 在`configureMonster`中添加配置逻辑

例如添加"Warrior"怪物：
```typescript
// 在getPrefabPath中
const paths: { [key: string]: string } = { 
    "Rock": "prefabs/Rock.lh",
    "Warrior": "prefabs/Warrior.lh"  // 新增
};

// 在configureMonster中
if (type === "Warrior") {
    // 配置Warrior组件
}
```

## 📋 修改文件清单

1. **MonsterManager.ts**: 添加createMonster等方法
2. **RockCard.ts**: 简化loadAndCreateRockPrefab方法
3. **GameMainManager.ts**: 更新createEnemyRockForTesting方法

这次重构成功地将怪物创建逻辑集中管理，大幅减少了代码冗余，提高了代码的可维护性和扩展性。

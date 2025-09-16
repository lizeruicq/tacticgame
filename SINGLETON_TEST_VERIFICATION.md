# 🧪 单例架构测试验证

## 🎯 **架构重构完成**

我已经成功将GameMainManager改造为单例模式，并重构了RockCard的节点访问方式：

### ✅ **GameMainManager单例功能**

```typescript
export class GameMainManager extends Laya.Script {
    // 单例实例
    private static _instance: GameMainManager = null;
    
    // 场景节点引用
    private battleField: Laya.Box = null;
    private spawnArea: Laya.Sprite = null;
    
    onAwake(): void {
        // 设置单例
        GameMainManager._instance = this;
        
        // 初始化场景节点引用
        this.initializeSceneNodes();
    }
    
    // 获取单例实例
    public static getInstance(): GameMainManager {
        return GameMainManager._instance;
    }
    
    // 对外提供节点访问接口
    public getBattleField(): Laya.Box {
        return this.battleField;
    }
    
    public getSpawnArea(): Laya.Sprite {
        return this.spawnArea;
    }
    
    onDestroy(): void {
        // 清理单例引用
        GameMainManager._instance = null;
    }
}
```

### ✅ **RockCard重构**

```typescript
export class RockCard extends Laya.Script {
    // 不再直接持有场景节点引用
    // private battleField: Laya.Box = null;  ❌ 已删除
    // private spawnArea: Laya.Sprite = null; ❌ 已删除
    
    private initializeCard(): void {
        // 通过单例验证节点可用性
        const gameManager = GameMainManager.getInstance();
        if (!gameManager) {
            console.error("GameMainManager单例未初始化！");
            return;
        }
        
        const spawnArea = gameManager.getSpawnArea();
        const battleField = gameManager.getBattleField();
        
        if (!spawnArea || !battleField) {
            console.error("场景节点未正确初始化！");
            return;
        }
        
        console.log(`通过GameManager获取节点成功`);
    }
    
    private calculateSpawnPosition(): {x: number, y: number} {
        // 通过单例获取spawnArea
        const gameManager = GameMainManager.getInstance();
        const spawnArea = gameManager.getSpawnArea();
        
        // 使用spawnArea进行位置计算...
    }
    
    private loadAndCreateRockPrefab(position: {x: number, y: number}): void {
        // 通过单例获取battleField
        const gameManager = GameMainManager.getInstance();
        const battleField = gameManager.getBattleField();
        
        // 添加到battleField
        battleField.addChild(rockSprite);
    }
}
```

## 🏗️ **架构优势验证**

### **1. 单一职责原则**
- ✅ GameMainManager：负责场景节点管理和游戏逻辑控制
- ✅ RockCard：专注于卡片逻辑和预制体生成
- ✅ CardManager：专注于卡片系统管理

### **2. 依赖倒置原则**
- ✅ RockCard依赖GameMainManager的接口，而不是直接访问场景
- ✅ 场景结构变化只需要修改GameMainManager
- ✅ 其他组件通过统一接口访问场景资源

### **3. 解耦合**
- ✅ 卡片组件不需要知道场景节点的具体名称和结构
- ✅ 节点查找逻辑集中在GameMainManager中
- ✅ 易于单元测试和模块化开发

## 🧪 **测试步骤**

### **1. 验证GameMainManager初始化**

运行游戏后，应该看到：
```
=== GameMainManager 初始化 ===
BattleField节点初始化成功: 1102x1905
spawnArea节点初始化成功: 中心(598, 1787), 尺寸1069x313
初始化游戏系统...
GameMainManager 开始
```

### **2. 验证RockCard节点访问**

点击Rock卡片后，应该看到：
```
Rock卡片 初始化完成
通过GameManager获取节点成功:
- spawnArea: 1069x313
- battleField: 1102x1905
点击了 Rock卡片
开始生成 Rock卡片 预制体
spawnArea中心: (598, 1787), 尺寸: 1069x313
生成范围: X[113.5, 1082.5], Y[1680.5, 1893.5]
Rock预制体生成成功: Rock_1703123456789, 位置: (456.7, 1823.4)
已添加到BattleField节点下，当前BattleField子节点数: 2
```

### **3. 验证节点层级结构**

在LayaAir IDE的层级面板中：
```
GameScene
├── BattleField (Box)
│   ├── Rock (原有的Rock)
│   └── Rock_时间戳 (新生成的Rock) ← 应该在这里
├── CardBox (HBox)
└── spawnArea (Sprite)
```

## 🔧 **可能的问题和解决方案**

### **问题1：TypeScript类型错误**

如果IDE显示`Property 'getInstance' does not exist`错误：

**原因**：TypeScript编译器缓存问题
**解决方案**：
1. 重启LayaAir IDE
2. 清理项目缓存
3. 重新编译项目

### **问题2：单例未初始化**

如果控制台显示"GameMainManager单例未初始化"：

**原因**：GameMainManager的onAwake还未执行
**解决方案**：
```typescript
// 在RockCard中添加延迟检查
private initializeCard(): void {
    // 延迟检查，确保GameMainManager已初始化
    Laya.timer.once(100, this, () => {
        const gameManager = GameMainManager.getInstance();
        if (!gameManager) {
            console.error("GameMainManager单例未初始化！");
            return;
        }
        // 继续初始化...
    });
}
```

### **问题3：节点未找到**

如果控制台显示"未找到BattleField节点"：

**原因**：场景节点名称不匹配
**解决方案**：
```typescript
// 在GameMainManager中添加调试信息
private initializeSceneNodes(): void {
    const gameScene = this.owner.scene;
    console.log("场景中的所有子节点：");
    for (let i = 0; i < gameScene.numChildren; i++) {
        const child = gameScene.getChildAt(i);
        console.log(`- ${child.name} (${child.constructor.name})`);
    }
    
    // 然后查找节点...
}
```

## 🎯 **预期效果**

### **成功标志**

1. ✅ **GameMainManager单例正常工作**：其他组件可以通过getInstance()获取实例
2. ✅ **场景节点正确初始化**：BattleField和spawnArea都能正确找到
3. ✅ **RockCard通过单例访问节点**：不再直接查找场景节点
4. ✅ **Rock预制体正确生成**：在spawnArea范围内，添加到BattleField下
5. ✅ **架构清晰**：职责分离，易于维护和扩展

### **架构收益**

- 🎯 **代码复用**：其他卡片可以直接使用相同的节点访问方式
- 🎯 **易于维护**：场景结构变化只需要修改GameMainManager
- 🎯 **便于测试**：可以轻松模拟GameMainManager进行单元测试
- 🎯 **扩展性强**：添加新的场景节点只需要在GameMainManager中扩展

## 🚀 **下一步扩展**

### **添加其他怪物卡片**

```typescript
class SkeletonCard extends Laya.Script {
    private spawnSkeleton(): void {
        // 直接使用相同的架构
        const gameManager = GameMainManager.getInstance();
        const battleField = gameManager.getBattleField();
        const spawnArea = gameManager.getSpawnArea();
        
        // 生成Skeleton预制体...
    }
}
```

### **添加敌方生成区域**

```typescript
// 在GameMainManager中添加
private enemySpawnArea: Laya.Sprite = null;

private initializeSceneNodes(): void {
    // 添加敌方生成区域
    this.enemySpawnArea = gameScene.getChildByName("EnemySpawnArea");
}

public getEnemySpawnArea(): Laya.Sprite {
    return this.enemySpawnArea;
}
```

这个单例架构为游戏的后续开发奠定了坚实的基础！🎯

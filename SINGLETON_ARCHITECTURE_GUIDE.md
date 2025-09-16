# 🏗️ 单例架构设计指南

## 🎯 **架构设计理念**

你提出的建议非常正确！将场景节点的管理权集中到GameMainManager，并通过单例模式提供给其他组件使用，这是一个更合理的架构设计。

### ✅ **新架构的优势**

1. **单一职责原则**：GameMainManager负责场景节点管理
2. **依赖倒置**：其他组件依赖GameMainManager，而不是直接访问场景
3. **集中管理**：所有场景节点引用都在一个地方管理
4. **易于维护**：修改节点结构只需要改GameMainManager
5. **解耦合**：卡片组件不需要知道场景结构细节

## 🏛️ **架构层次结构**

```
GameMainManager (单例)
├── 场景节点管理
│   ├── BattleField节点引用
│   ├── spawnArea节点引用
│   └── 其他场景节点...
├── 游戏逻辑控制
│   ├── 游戏状态管理
│   ├── 系统协调
│   └── 事件处理
└── 对外接口
    ├── getBattleField()
    ├── getSpawnArea()
    └── 其他访问方法...

RockCard (组件)
├── 卡片逻辑
├── 通过GameMainManager.getInstance()获取节点
└── 不直接访问场景节点

CardManager (组件)
├── 卡片管理逻辑
├── 通过GameMainManager获取需要的资源
└── 专注于卡片系统功能
```

## 🔧 **实现细节**

### **1. GameMainManager单例实现**

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

### **2. RockCard组件使用方式**

```typescript
export class RockCard extends Laya.Script {
    // 不再直接持有场景节点引用
    // private battleField: Laya.Box = null;  ❌ 删除
    // private spawnArea: Laya.Sprite = null; ❌ 删除
    
    private canUseCard(): boolean {
        // 通过单例获取场景节点
        const gameManager = GameMainManager.getInstance();
        if (!gameManager) return false;
        
        const spawnArea = gameManager.getSpawnArea();
        const battleField = gameManager.getBattleField();
        
        return spawnArea && battleField && this.isUsable;
    }
    
    private calculateSpawnPosition(): {x: number, y: number} {
        // 通过单例获取spawnArea
        const gameManager = GameMainManager.getInstance();
        const spawnArea = gameManager.getSpawnArea();
        
        // 使用spawnArea进行位置计算
        // ...
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

## 🎯 **架构优势对比**

### **❌ 旧架构问题**

```typescript
// 每个组件都要自己查找场景节点
class RockCard {
    private initializeCard(): void {
        const gameScene = this.owner.scene;
        this.battleField = gameScene.getChildByName("BattleField");  // 重复代码
        this.spawnArea = gameScene.getChildByName("spawnArea");      // 重复代码
    }
}

class OtherCard {
    private initializeCard(): void {
        const gameScene = this.owner.scene;
        this.battleField = gameScene.getChildByName("BattleField");  // 重复代码
        this.spawnArea = gameScene.getChildByName("spawnArea");      // 重复代码
    }
}
```

**问题**：
- 代码重复
- 每个组件都要知道场景结构
- 节点名称改变需要修改多处
- 难以统一管理

### **✅ 新架构优势**

```typescript
// 只有GameMainManager负责场景节点管理
class GameMainManager {
    private initializeSceneNodes(): void {
        this.battleField = gameScene.getChildByName("BattleField");  // 只在一处
        this.spawnArea = gameScene.getChildByName("spawnArea");      // 只在一处
    }
}

// 其他组件通过单例获取
class RockCard {
    private useGameManager(): void {
        const gameManager = GameMainManager.getInstance();
        const battleField = gameManager.getBattleField();  // 统一接口
        const spawnArea = gameManager.getSpawnArea();      // 统一接口
    }
}
```

**优势**：
- 代码集中管理
- 组件只需要知道GameMainManager接口
- 节点名称改变只需要修改GameMainManager
- 易于扩展和维护

## 🚀 **扩展性**

### **添加新的场景节点**

```typescript
// 只需要在GameMainManager中添加
class GameMainManager {
    private enemySpawnArea: Laya.Sprite = null;
    private uiLayer: Laya.Box = null;
    
    private initializeSceneNodes(): void {
        // 添加新节点的初始化
        this.enemySpawnArea = gameScene.getChildByName("EnemySpawnArea");
        this.uiLayer = gameScene.getChildByName("UILayer");
    }
    
    // 添加新的访问接口
    public getEnemySpawnArea(): Laya.Sprite {
        return this.enemySpawnArea;
    }
    
    public getUILayer(): Laya.Box {
        return this.uiLayer;
    }
}
```

### **其他组件立即可用**

```typescript
class EnemyCard {
    private spawnEnemy(): void {
        const gameManager = GameMainManager.getInstance();
        const enemySpawnArea = gameManager.getEnemySpawnArea();  // 立即可用
        const battleField = gameManager.getBattleField();
        
        // 使用新节点...
    }
}
```

## 🧪 **测试和调试**

### **集中的错误处理**

```typescript
class GameMainManager {
    private initializeSceneNodes(): void {
        this.battleField = gameScene.getChildByName("BattleField") as Laya.Box;
        if (!this.battleField) {
            console.error("❌ 未找到BattleField节点！");
        } else {
            console.log("✅ BattleField节点初始化成功");
        }
        
        this.spawnArea = gameScene.getChildByName("spawnArea") as Laya.Sprite;
        if (!this.spawnArea) {
            console.error("❌ 未找到spawnArea节点！");
        } else {
            console.log("✅ spawnArea节点初始化成功");
        }
    }
}
```

### **统一的状态检查**

```typescript
class GameMainManager {
    public isReady(): boolean {
        return this.battleField !== null && this.spawnArea !== null;
    }
    
    public getStatus(): string {
        return `GameManager状态: battleField=${!!this.battleField}, spawnArea=${!!this.spawnArea}`;
    }
}

// 其他组件可以统一检查
class RockCard {
    private canUseCard(): boolean {
        const gameManager = GameMainManager.getInstance();
        if (!gameManager || !gameManager.isReady()) {
            console.log("GameManager未就绪:", gameManager?.getStatus());
            return false;
        }
        return true;
    }
}
```

## 🎉 **总结**

### **架构改进成果**

✅ **更清晰的职责分工**：
- GameMainManager：场景节点管理 + 游戏逻辑控制
- RockCard：卡片逻辑 + 预制体生成
- CardManager：卡片系统管理

✅ **更好的可维护性**：
- 场景结构变化只需要修改GameMainManager
- 组件间解耦，独立开发和测试
- 统一的错误处理和状态管理

✅ **更强的扩展性**：
- 添加新节点只需要在GameMainManager中扩展
- 新组件可以立即使用现有的节点管理功能
- 支持复杂的场景结构管理

这个单例架构设计确实比原来的方案更加合理和专业！🎯

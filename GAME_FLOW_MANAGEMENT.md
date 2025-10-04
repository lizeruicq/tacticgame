# 游戏流程管理系统实现

## ✅ 已实现功能

### 1. 玩家属性系统

**魔法值管理**：
- **最大魔法值**：`playerMaxMana = 10`
- **初始魔法值**：`playerMana = 5`
- **恢复速度**：`manaRegenRate = 1`（每次恢复1点）
- **恢复间隔**：`manaRegenInterval = 2000ms`（每2秒恢复一次）

**自动恢复机制**：
```typescript
// 启动魔法值恢复系统
private startManaRegeneration(): void {
    Laya.timer.loop(this.manaRegenInterval, this, this.regenerateMana);
}

// 魔法值恢复逻辑
private regenerateMana(): void {
    if (this.gameEnded) return;
    
    const oldMana = this.playerMana;
    this.playerMana = Math.min(this.playerMana + this.manaRegenRate, this.playerMaxMana);
    
    if (this.playerMana > oldMana) {
        console.log(`魔法值恢复: ${oldMana} -> ${this.playerMana}/${this.playerMaxMana}`);
    }
}
```

### 2. 城堡生命值系统

**城堡属性**：
- **玩家城堡最大生命值**：`playerCastleMaxHP = 100`
- **敌方城堡最大生命值**：`enemyCastleMaxHP = 100`
- **生命值不会自动恢复**

**城堡初始化**：
```typescript
// 玩家城堡
this.playerCastle.isPlayerCamp = true;

// 敌方城堡
this.enemyCastle.isPlayerCamp = false;
```

### 3. 游戏结束机制

**胜负判定**：
- 任何一方城堡生命值降至0时游戏结束
- 对方获胜

**游戏结束处理**：
```typescript
private onCastleDestroyed(castleType: string): void {
    if (this.gameEnded) return;

    this.gameEnded = true;
    
    if (castleType === "player") {
        this.winner = "enemy";
        console.log("玩家城堡被摧毁，敌方获胜！");
    } else {
        this.winner = "player";
        console.log("敌方城堡被摧毁，玩家获胜！");
    }

    this.stopGameSystems();
    this.onGameEnd();
}
```

### 4. 魔法值消耗系统

**卡牌使用流程**：
1. 点击卡牌 → 检查魔法值是否足够
2. 魔法值足够 → 消耗魔法值 → 生成怪物 → 销毁卡牌
3. 魔法值不足 → 显示提示 → 取消操作

**魔法值检查**：
```typescript
// RockCard中的检查
private canUseCard(): boolean {
    const gameManager = GameMainManager.getInstance();
    const currentMana = gameManager.getPlayerMana();
    
    if (currentMana < this.manaCost) {
        console.log(`魔法值不足！需要: ${this.manaCost}，当前: ${currentMana}`);
        return false;
    }
    
    return true;
}
```

**魔法值消耗**：
```typescript
// GameMainManager中的消耗逻辑
public consumeMana(amount: number): boolean {
    if (this.playerMana >= amount) {
        this.playerMana -= amount;
        console.log(`消耗魔法值 ${amount}，剩余: ${this.playerMana}/${this.playerMaxMana}`);
        return true;
    } else {
        console.log(`魔法值不足！需要: ${amount}，当前: ${this.playerMana}`);
        return false;
    }
}
```

## 🔧 系统架构

### 核心组件

1. **GameMainManager**：
   - 游戏流程总控制器
   - 管理玩家属性（魔法值）
   - 监控城堡状态
   - 处理游戏结束逻辑

2. **Castle**：
   - 城堡生命值管理
   - 阵营识别
   - 受伤和死亡处理

3. **CardManager**：
   - 卡牌生成和管理
   - 与GameMainManager集成魔法值系统

4. **RockCard**：
   - 卡牌点击处理
   - 魔法值检查
   - 怪物生成触发

### 数据流

```
玩家点击卡牌 → RockCard.canUseCard() → 检查魔法值
                ↓
            魔法值足够 → 生成怪物 → CardManager.onCardUsed()
                ↓
        GameMainManager.consumeMana() → 扣除魔法值
                ↓
            销毁卡牌 → 冷却 → 生成新卡牌
```

## 🎮 游戏循环

### 主要定时器

1. **魔法值恢复**：每2秒恢复1点魔法值
2. **城堡状态检查**：每1秒检查城堡是否被摧毁
3. **卡牌冷却**：使用卡牌后的冷却时间

### 状态管理

```typescript
// 游戏状态
private gameStarted: boolean = false;
private gameEnded: boolean = false;
private winner: string = ""; // "player" 或 "enemy"

// 玩家属性
public playerMana: number = 5;
public playerMaxMana: number = 10;
```

## 📊 配置参数

### 可调整的游戏参数

```typescript
// 魔法值系统
@property(Number)
public playerMaxMana: number = 10;          // 最大魔法值
@property(Number)
public manaRegenRate: number = 1;           // 恢复速度
@property(Number)
public manaRegenInterval: number = 2000;    // 恢复间隔

// 城堡系统
@property(Number)
public playerCastleMaxHP: number = 100;     // 玩家城堡生命值
@property(Number)
public enemyCastleMaxHP: number = 100;      // 敌方城堡生命值

// 卡牌系统（在CardConfig中）
manaCost: 3,  // Rock卡牌消耗3点魔法值
```

## 🎯 使用方法

### 1. 场景设置

确保场景中有以下节点：
- `castle-self`：玩家城堡（需要挂载Castle组件）
- `castle-enemy`：敌方城堡（需要挂载Castle组件）
- `CardBox`：卡牌容器（需要挂载CardManager组件）

### 2. 组件配置

**GameMainManager**：
- 挂载到场景根节点
- 配置魔法值和城堡生命值参数

**Castle组件**：
- 挂载到城堡节点
- 设置正确的阵营（isPlayerCamp）

### 3. 运行时行为

**正常游戏流程**：
1. 游戏开始，玩家有5点魔法值
2. 每2秒自动恢复1点魔法值（最大10点）
3. 点击卡牌消耗3点魔法值生成怪物
4. 怪物攻击敌方城堡
5. 任一城堡生命值归零时游戏结束

**魔法值不足时**：
- 卡牌无法使用
- 显示"魔法值不足"提示
- 等待魔法值恢复后可继续使用

**游戏结束时**：
- 停止所有定时器
- 显示胜负结果
- 禁用所有卡牌操作

## 🔍 调试信息

系统会输出详细的调试日志：

```
=== GameMainManager 初始化 ===
玩家属性初始化完成:
- 魔法值: 5/10
- 魔法值恢复: 1/秒，间隔2000ms
启动魔法值恢复系统
游戏状态检查已启动

魔法值恢复: 5 -> 6/10
消耗魔法值 3，剩余: 3/10
魔法值不足！需要: 3，当前: 2

=== 游戏结束 ===
敌方城堡被摧毁，玩家获胜！
游戏系统已停止
```

这个系统实现了完整的游戏流程管理，包括资源管理（魔法值）、胜负判定（城堡生命值）和游戏状态控制，为战术游戏提供了坚实的基础框架。

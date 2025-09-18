# 怪物AI系统使用指南

## 📋 系统概述

本系统实现了完整的怪物AI逻辑，包括：
- 城堡血量管理和阵营标记
- 怪物自动目标搜索和攻击
- 目标死亡后重新寻找目标
- 优先攻击怪物，其次攻击城堡

## 🏗️ 系统架构

### 核心组件

1. **Castle.ts** - 城堡脚本
   - 管理城堡血量、防御力、回血速度
   - 支持阵营标记（玩家/敌方）
   - 提供受伤、治疗、摧毁事件

2. **MonsterManager.ts** - 怪物管理器
   - 管理场景中所有怪物和城堡
   - 提供目标搜索功能
   - 自动注册/注销怪物和城堡

3. **BaseMonster.ts** - 怪物基类（已更新）
   - 支持攻击城堡和怪物
   - 自动注册到MonsterManager
   - 智能目标搜索逻辑

4. **RockMonster.ts** - Rock怪物（已更新）
   - 支持攻击不同类型目标
   - 继承完整AI行为

## 🎯 AI行为逻辑

### 目标搜索优先级
1. **优先攻击敌方怪物**
   - 按距离排序，攻击最近的敌方怪物
   - 怪物死亡后自动寻找下一个目标

2. **其次攻击敌方城堡**
   - 如果没有敌方怪物，攻击敌方城堡
   - 城堡被摧毁后停止攻击

### 状态机行为
- **IDLE**: 寻找目标
- **MOVING**: 向目标移动
- **ATTACKING**: 在攻击范围内攻击目标
- **DYING**: 死亡动画播放中

## 🚀 使用方法

### 1. 场景设置

在场景中创建以下节点：
```
Scene
├── BattleField
│   ├── spawnArea (玩家怪物生成区域)
│   └── Rock (怪物节点，挂载RockMonster脚本)
├── castle-self (玩家城堡，需要挂载Castle脚本)
├── castle-enemy (敌方城堡，需要挂载Castle脚本)
└── GameManager (挂载GameMainManager脚本)
```

### 2. 组件配置

#### Castle组件配置
```typescript
// 在场景中为城堡节点添加Castle脚本
// 玩家城堡
castle-self.isPlayerCamp = true;
castle-self.castleLevel = 1;

// 敌方城堡  
castle-enemy.isPlayerCamp = false;
castle-enemy.castleLevel = 1;
```

#### 怪物配置
```typescript
// RockMonster会自动注册到MonsterManager
// 设置阵营
rockMonster.isPlayerCamp = true; // 玩家阵营
// 或
rockMonster.isPlayerCamp = false; // 敌方阵营
```

### 3. 代码示例

#### 创建敌方怪物
```typescript
// 在RockCard或其他地方创建敌方怪物
const enemyRock = this.createRockMonster();
enemyRock.isPlayerCamp = false; // 设置为敌方
// MonsterManager会自动注册这个怪物
```

#### 手动设置目标
```typescript
// 如果需要手动设置目标
const manager = MonsterManager.getInstance();
const target = manager.findNearestEnemyTarget(monster);
if (target) {
    monster.setTarget(target);
}
```

## 🔧 系统特性

### 自动管理
- 怪物自动注册到MonsterManager
- 死亡的怪物自动从管理器中移除
- 摧毁的城堡自动从管理器中移除

### 智能目标搜索
- 优先攻击距离最近的敌方怪物
- 没有怪物时攻击敌方城堡
- 目标死亡后自动重新搜索

### 事件系统
- 怪物攻击事件：`MONSTER_ATTACK_PERFORMED`
- 怪物受伤事件：`MONSTER_DAMAGE_TAKEN`
- 怪物死亡事件：`MONSTER_DEATH`
- 城堡受伤事件：`CASTLE_DAMAGE_TAKEN`
- 城堡摧毁事件：`CASTLE_DESTROYED`

## 🧪 测试功能

GameMainManager包含测试方法：
- `testMonsterSystem()` - 测试基础怪物功能
- `testMonsterAI()` - 测试AI目标搜索功能

## 📊 调试信息

系统提供详细的控制台日志：
- 怪物注册/注销信息
- 目标搜索结果
- 攻击行为日志
- 状态切换信息

## ⚠️ 注意事项

1. **城堡组件配置**
   - 需要在场景中手动为城堡节点添加Castle脚本组件
   - 确保城堡节点名称为 `castle-self` 和 `castle-enemy`

2. **MonsterManager初始化**
   - MonsterManager会在GameMainManager中自动创建
   - 怪物会在创建时自动注册

3. **性能考虑**
   - 目标搜索有最大距离限制（默认2000像素）
   - 可以通过MonsterManager.maxSearchDistance调整

## 🔄 扩展性

### 添加新怪物类型
```typescript
@regClass()
export class SkeletonMonster extends BaseMonster {
    protected initializeMonster(): void {
        this.monsterStats = {
            speed: 120,
            attackPower: 15,
            attackSpeed: 1000,
            attackRange: 150,
            maxHealth: 80
        };
    }
    
    protected getAnimationManagerComponent(): any {
        return this.owner.getComponent(SkeletonAnimationManager);
    }
}
```

### 自定义AI行为
```typescript
// 重写目标搜索逻辑
protected findTarget(): BaseMonster | Castle | null {
    // 自定义搜索逻辑
    const manager = MonsterManager.getInstance();
    return manager.findNearestEnemyTarget(this);
}
```

## 🎮 游戏流程

1. 游戏开始时，MonsterManager初始化
2. 城堡自动注册到管理器
3. 玩家使用卡牌生成怪物
4. 怪物自动注册并开始寻找目标
5. 怪物按优先级攻击敌方单位
6. 目标死亡后重新搜索目标
7. 游戏继续直到一方城堡被摧毁

这个系统提供了完整的怪物AI功能，支持自动目标搜索、智能攻击行为和灵活的扩展性。

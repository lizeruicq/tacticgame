# 🎯 动画管理器继承系统使用指南

## 📋 系统架构

### 基类：BaseAnimationManager
- **位置**：`assets/resources/scripts/BaseAnimationManager.ts`
- **功能**：提供所有精灵动画的通用功能
- **特点**：抽象类，不能直接使用，必须被继承

### 子类示例
1. **RockAnimationManager** - Rock精灵动画管理器
2. **SkeletonAnimationManager** - 骷髅精灵动画管理器（示例）

## 🏗️ 创建新的精灵动画管理器

### 步骤1：创建子类文件

```typescript
// 例如：DragonAnimationManager.ts
const { regClass } = Laya;
import { BaseAnimationManager, IAnimationState, IAnimationConfig } from "./BaseAnimationManager";

export enum DragonAnimationState {
    IDLE = "idle",
    ATTACKING = "attacking", 
    FLYING = "flying",      // 龙特有的飞行状态
    BREATHING = "breathing", // 龙特有的喷火状态
    DYING = "dying"
}

@regClass()
export class DragonAnimationManager extends BaseAnimationManager {
    // 配置数据...
}
```

### 步骤2：配置动画资源和参数

```typescript
// 动画资源路径配置
private animationPaths = {
    [DragonAnimationState.IDLE]: "resources/images/ANI/dragon_idle.atlas",
    [DragonAnimationState.ATTACKING]: "resources/images/ANI/dragon_attacking.atlas", 
    [DragonAnimationState.FLYING]: "resources/images/ANI/dragon_flying.atlas",
    [DragonAnimationState.BREATHING]: "resources/images/ANI/dragon_breathing.atlas",
    [DragonAnimationState.DYING]: "resources/images/ANI/dragon_dying.atlas"
};

// 动画配置参数
private animationConfigs = {
    [DragonAnimationState.IDLE]: {
        interval: 150,
        wrapMode: 2, // PINGPONG 来回播放
        autoPlay: true,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0
    },
    [DragonAnimationState.BREATHING]: {
        interval: 80,
        wrapMode: 0,
        autoPlay: false,
        scale: 1.3,  // 喷火时放大
        offsetX: 10, // 向前突出
        offsetY: -20 // 向上偏移
    }
    // ... 其他状态配置
};
```

### 步骤3：设置构造函数

```typescript
constructor() {
    super();
    
    // 设置龙特有的属性
    this.defaultState = DragonAnimationState.IDLE;
    this.deathState = DragonAnimationState.DYING;
    this.atlasOriginalWidth = 1024;  // 龙的图集可能更大
    this.atlasOriginalHeight = 1024;
}
```

### 步骤4：实现抽象方法

```typescript
// ========== 实现抽象方法 ==========

protected getAnimationStates(): IAnimationState {
    return DragonAnimationState;
}

protected getAnimationPath(state: string): string {
    return this.animationPaths[state as DragonAnimationState] || "";
}

protected getAnimationConfig(state: string): IAnimationConfig | null {
    return this.animationConfigs[state as DragonAnimationState] || null;
}

protected handleAnimationComplete(state: string): void {
    switch (state) {
        case DragonAnimationState.ATTACKING:
            this.changeState(DragonAnimationState.IDLE);
            break;
            
        case DragonAnimationState.BREATHING:
            this.changeState(DragonAnimationState.IDLE);
            this.owner.event("DRAGON_BREATH_COMPLETE");
            break;
            
        case DragonAnimationState.DYING:
            this.onDeathComplete();
            break;
    }
}

private onDeathComplete(): void {
    console.log("龙死亡动画播放完成");
    this.owner.event("DRAGON_DEATH_COMPLETE");
}
```

### 步骤5：添加外部接口

```typescript
// ========== 龙特有的外部接口 ==========

public startAttack(): void {
    this.changeState(DragonAnimationState.ATTACKING);
}

public startFlying(): void {
    this.changeState(DragonAnimationState.FLYING);
}

public startBreathing(): void {
    this.changeState(DragonAnimationState.BREATHING);
}

public startDying(): void {
    this.changeState(DragonAnimationState.DYING);
}

// 状态查询方法
public isFlying(): boolean {
    return this.getCurrentState() === DragonAnimationState.FLYING;
}

public isBreathing(): boolean {
    return this.getCurrentState() === DragonAnimationState.BREATHING;
}
```

## 🎨 基类提供的通用功能

### 自动功能
- ✅ **智能尺寸适配**：自动计算合适的缩放比例
- ✅ **锚点设置**：自动设置为中心锚点
- ✅ **位置居中**：自动居中对齐到精灵
- ✅ **事件管理**：自动处理动画完成事件
- ✅ **状态保护**：死亡状态下无法切换到其他状态

### 通用方法
- `changeState(state)` - 切换动画状态
- `getCurrentState()` - 获取当前状态
- `getIsDying()` - 检查是否正在死亡
- `resetAnimationTransform()` - 重置动画变换

### 配置属性
- `defaultState` - 默认状态（通常是idle）
- `deathState` - 死亡状态（通常是dying）
- `atlasOriginalWidth/Height` - 图集原始尺寸

## 🔧 使用示例

### 在场景中使用

```typescript
// 在GameMainManager或其他管理器中
export class GameMainManager extends Laya.Script {
    
    private dragonAnimationManager: DragonAnimationManager;
    
    onAwake(): void {
        // 获取龙节点的动画管理器
        const dragonNode = this.owner.getChildByName("Dragon") as Laya.Sprite;
        this.dragonAnimationManager = dragonNode.getComponent(DragonAnimationManager);
    }
    
    private onEnemyApproach(): void {
        // 敌人接近时，龙开始飞行
        if (this.dragonAnimationManager) {
            this.dragonAnimationManager.startFlying();
        }
    }
    
    private onPlayerInRange(): void {
        // 玩家进入范围时，龙开始喷火
        if (this.dragonAnimationManager) {
            this.dragonAnimationManager.startBreathing();
        }
    }
}
```

### 监听动画事件

```typescript
onAwake(): void {
    // 监听龙的动画事件
    const dragonNode = this.owner.getChildByName("Dragon") as Laya.Sprite;
    dragonNode.on("DRAGON_BREATH_COMPLETE", this, this.onDragonBreathComplete);
    dragonNode.on("DRAGON_DEATH_COMPLETE", this, this.onDragonDeathComplete);
}

private onDragonBreathComplete(): void {
    console.log("龙喷火完成，造成范围伤害！");
    // 处理喷火效果...
}

private onDragonDeathComplete(): void {
    console.log("龙已死亡，掉落宝物！");
    // 处理死亡奖励...
}
```

## 🎯 最佳实践

### 1. 命名规范
- **类名**：`[精灵名]AnimationManager`
- **状态枚举**：`[精灵名]AnimationState`
- **事件名**：`[精灵名]_[动作]_COMPLETE`

### 2. 状态设计
- **基础状态**：idle, attacking, walking, dying
- **特殊状态**：根据精灵特点添加（如flying, casting, breathing等）
- **状态转换**：确保合理的状态转换逻辑

### 3. 配置优化
- **图集尺寸**：尽量使用2的幂次方尺寸
- **动画间隔**：根据动作类型调整（攻击快，死亡慢）
- **缩放偏移**：用于增强视觉效果

### 4. 性能考虑
- **资源预加载**：在场景加载时预加载所有动画图集
- **状态缓存**：避免频繁的状态切换
- **事件清理**：在onDestroy中清理所有事件监听

## 🚀 扩展功能

### 添加音效支持
```typescript
protected handleAnimationComplete(state: string): void {
    switch (state) {
        case DragonAnimationState.ATTACKING:
            // 播放攻击音效
            Laya.SoundManager.playSound("resources/sounds/dragon_attack.mp3");
            this.changeState(DragonAnimationState.IDLE);
            break;
    }
}
```

### 添加粒子效果
```typescript
public startBreathing(): void {
    this.changeState(DragonAnimationState.BREATHING);
    
    // 添加火焰粒子效果
    this.createFireParticles();
}
```

### 添加动画链
```typescript
public performComboAttack(): void {
    // 执行连击：攻击 -> 喷火 -> 飞行
    this.changeState(DragonAnimationState.ATTACKING);
    
    // 设置动画链
    this.animationChain = [
        DragonAnimationState.BREATHING,
        DragonAnimationState.FLYING,
        DragonAnimationState.IDLE
    ];
}
```

这个继承系统让你可以轻松为任何精灵创建专属的动画管理器，同时享受基类提供的所有通用功能！🎉

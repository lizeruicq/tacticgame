# 快速开始指南

## 场景切换流程

### 1. MainMenu → LevelSelect
✅ **已完成** - 点击开始按钮自动切换

### 2. LevelSelect → GameScene
✅ **已完成** - 选择关卡后点击开始按钮自动切换

**关键代码** (src/LevelSelectRT.ts):
```typescript
private onStartClick(): void {
    Laya.LocalStorage.setItem("selectedLevel", this.selectedLevel.toString());
    const sceneManager = SceneManager.getInstance();
    sceneManager.switchToGameScene();
}
```

## GameScene初始化流程

### 游戏进入时的自动流程

1. **游戏暂停** - Laya.timer.scale = 0
2. **显示说明面板** - 显示关卡指引和怪物种类
3. **等待玩家** - 玩家点击开始按钮
4. **游戏继续** - Laya.timer.scale = 1

### 关键代码 (assets/resources/scripts/GameMainManager.ts)

```typescript
private initializeGameStartPanel(): void {
    if (!this.uiManager) return;
    
    this.pauseGame();  // 暂停游戏
    this.uiManager.showGameStartPanel(this.selectedLevel, () => {
        this.resumeGame();  // 继续游戏
    });
}
```

## 在GameScene中配置游戏开始面板

### 步骤1: 创建UI节点

在GameScene场景编辑器中:

1. 创建一个Box节点，命名为 `GameStartPanel`
2. 在该Box中添加以下子节点:
   - Label: 命名为 `guideLabel` (显示关卡指引)
   - Label: 命名为 `monsterTypesLabel` (显示怪物类型)
   - Button: 命名为 `startButton` (开始按钮)

### 步骤2: 配置UIManager

在UIManager节点的属性中:
- 将 `GameStartPanel` Box节点关联到 `gameStartPanelBox` 属性

### 步骤3: 完成

系统会自动:
- 初始化GameStartPanel脚本
- 游戏进入时显示面板
- 玩家点击开始后继续游戏

## 关卡配置

### 查看现有关卡

文件: `assets/resources/scripts/CardConfig.ts`

```typescript
public static readonly LEVEL_CONFIGS: ILevelCardConfig[] = [
    {
        level: 1,
        guide: "第一关：熟悉基础操作\n击败敌方城堡来获得胜利！",
        monsterTypes: ["Rock - 防御型怪物", "Wizard - 魔法型怪物", "Pastor - 治疗型怪物"],
        // ...
    },
    // ...
]
```

### 添加新关卡

在LEVEL_CONFIGS数组中添加:

```typescript
{
    level: 3,
    playerCards: ["Rock", "Wizard", "Pastor"],
    enemyCards: ["Rock", "Wizard", "Pastor"],
    maxCards: 5,
    cooldownTime: 1500,
    guide: "第三关：终极挑战\n敌方实力大幅提升！",
    monsterTypes: ["Rock - 防御型怪物", "Wizard - 魔法型怪物", "Pastor - 治疗型怪物"],
    enemyWeights: {
        "Rock": 0.3,
        "Wizard": 0.4,
        "Pastor": 0.3
    }
}
```

## 常见问题

### Q: 游戏进入后没有显示说明面板？
A: 检查:
1. GameScene中是否创建了GameStartPanel Box节点
2. UIManager中gameStartPanelBox属性是否正确关联
3. 浏览器控制台是否有错误信息

### Q: 点击开始按钮后游戏没有继续？
A: 检查:
1. 开始按钮是否正确关联到startButton属性
2. 浏览器控制台是否有错误信息
3. Laya.timer.scale是否被正确设置为1

### Q: 如何修改关卡指引文本？
A: 编辑CardConfig.ts中对应关卡的guide字段

### Q: 如何修改怪物类型显示？
A: 编辑CardConfig.ts中对应关卡的monsterTypes数组

## 文件清单

### 新建文件
- `assets/resources/scripts/GameStartPanel.ts` - 游戏开始面板脚本

### 修改文件
- `src/SceneManager.ts` - 添加GameScene场景
- `src/LevelSelectRT.ts` - 实现场景切换
- `assets/resources/scripts/CardConfig.ts` - 扩展关卡配置
- `assets/resources/scripts/UIManager.ts` - 集成面板管理
- `assets/resources/scripts/GameMainManager.ts` - 实现初始化逻辑

## 编译状态

✅ 所有代码通过编译检查，无错误

## 测试建议

1. 运行游戏，从MainMenu进入LevelSelect
2. 选择关卡，点击开始
3. 验证是否成功切换到GameScene
4. 验证是否显示游戏开始面板
5. 点击开始按钮，验证游戏是否继续运行


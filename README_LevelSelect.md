# 关卡选择场景脚本使用说明

## 概述
`LevelSelectRT.ts` 是一个完整的关卡选择场景运行时脚本，实现了Tab切换、关卡列表、关卡选择和游戏启动等功能。

## 主要功能

### 1. Tab切换功能
- **组件要求**：场景中需要有一个名为 `item0Tab` 的Tab组件
- **功能**：点击Tab按钮实现不同面板的切换
- **支持扩展**：可以添加更多Tab按钮和对应的面板

### 2. 关卡列表功能
- **组件要求**：场景中需要有一个名为 `LevelList` 的List组件
- **功能**：显示关卡列表，每个关卡项包含：
  - 关卡编号（从1开始递增）
  - 背景皮肤（正常/选中状态）
- **状态管理**：自动管理关卡的选中状态

### 3. 关卡选择功能
- **交互方式**：点击关卡项进行选择
- **状态反馈**：选中的关卡会改变背景皮肤
- **数据记录**：自动记录当前选中的关卡ID

### 4. 游戏启动功能
- **开始游戏**：点击开始游戏按钮进入游戏场景
- **数据传递**：携带选中的关卡编号到游戏场景
- **数据保存**：关卡编号保存到本地存储中

## UI组件要求

### 必需组件
1. **`item0Tab`** (Laya.Tab)：Tab组件，用于切换不同面板
2. **`levelstack`** (Laya.ViewStack)：面板容器，与Tab关联
3. **`LevelList`** (Laya.List)：关卡列表组件

### 可选组件
4. **`Start`** (Laya.Button)：开始游戏按钮
5. **`Back`** (Laya.Button)：返回按钮

### 关卡列表项结构
每个关卡列表项(List Item)应包含以下子节点：
- **`listItemBG`** (Laya.Image)：背景图片，用于显示不同状态
- **`label`** (Laya.Label)：关卡编号标签

### Start和Back按钮
- 脚本会自动查找名为 `Start` 和 `Back` 的按钮
- `Start`按钮：点击开始游戏
- `Back`按钮：点击返回主菜单

## 皮肤资源

### 关卡背景皮肤
- `ui/level_normal.png`：正常状态
- `ui/level_selected.png`：选中状态

## 使用步骤

### 1. 场景设置
1. 在LayaAir编辑器中创建关卡选择场景 `LevelSelect.ls`
2. 添加必需的UI组件（Tab、ViewStack、List等）
3. 设置组件的名称和层级关系
4. 将 `LevelSelectRT` 脚本绑定到场景根节点

### 2. 脚本绑定
```typescript
// 脚本会自动注册到引擎
@regClass()
export class LevelSelectRT extends LevelSelectRTBase {
    // 继承自动生成的基类
}
```

### 3. 数据配置
目前不需要额外的数据配置，脚本会自动初始化20个关卡。

## API 参考

### 公共方法

#### `getSelectedLevelId(): number`
获取当前选中的关卡ID

#### `getSelectedLevel(): number`
获取当前选中的关卡ID（同上）

### 事件通知

#### `levelSelected` 事件
当玩家选择关卡时，会发送此事件
```typescript
Laya.stage.on("levelSelected", this, (levelId) => {
    console.log("选中关卡:", levelId);
});
```

## 数据存储

### 本地存储
- 选中的关卡ID保存在 `selectedLevel` 键中
- 可在游戏场景中通过以下方式获取：
```typescript
const selectedLevel = parseInt(Laya.LocalStorage.getItem("selectedLevel") || "1");
```

## 扩展说明

### 添加更多Tab
1. 在场景中添加新的Tab按钮
2. 在ViewStack中添加对应的面板
3. 修改 `loadChapterLevels()` 方法添加新章节逻辑

### 自定义关卡数据
可以修改 `initLevelData()` 方法来：
- 调整关卡数量
- 添加更多关卡属性

### 场景切换
可以修改 `switchToGameScene()` 方法来：
- 更改游戏场景路径
- 传递更多参数
- 添加场景切换动画

## 注意事项

1. **组件命名**：确保UI组件的名称与脚本中的名称完全一致
2. **资源路径**：确保皮肤资源路径正确，否则可能显示异常
3. **生命周期**：脚本使用标准的LayaAir生命周期方法
4. **错误处理**：脚本包含完善的错误检查和日志输出
5. **性能优化**：大量关卡时建议使用虚拟列表或分页加载

## 示例场景结构

```
LevelSelect (Scene)
├── item0Tab (Tab)
│   └── Tab按钮...
├── levelstack (ViewStack)  
│   └── item0 (Box)
│       └── LevelList (List)
│           └── 关卡项模板 (Box)
│               ├── listItemBG (Image)
│               └── label (Label)
└── startGameBtn (Button) [可选]
```

这个脚本提供了完整的关卡选择功能，可以直接在LayaAir项目中使用，同时也方便进行自定义扩展。
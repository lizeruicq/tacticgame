# 微信小游戏项目

这是一个使用LayaAir开发的微信小游戏项目，集成了微信用户信息获取功能。

## 🏗️ 项目结构

```
src/
├── Main.ts                 # 游戏主入口
├── MainMenuScene.ts        # 主菜单场景
├── WeChatManager.ts        # 微信API管理器（单例）
├── GameDataManager.ts      # 游戏数据管理器（单例）
├── SceneManager.ts         # 场景管理器
└── types/
    └── wechat.d.ts         # 微信API类型声明
```

## ⚡ 核心功能

### 1. 微信用户信息获取
- 自动检测微信环境
- 智能授权流程处理
- 用户头像和昵称获取
- 数据缓存和持久化

### 2. 单例管理器
- **WeChatManager**: 统一管理所有微信API调用
- **GameDataManager**: 管理游戏数据和用户数据

### 3. 跨场景数据共享
- 任何场景都可以通过 `getInstance()` 获取管理器
- 事件驱动的数据更新机制
- 自动数据同步和保存

## 🚀 快速使用

### 在场景中使用微信功能

```typescript
// 获取管理器实例
const weChatManager = WeChatManager.getInstance();
const gameDataManager = GameDataManager.getInstance();

// 获取用户信息
const userInfo = await weChatManager.getCachedUserInfo();

// 获取玩家显示名称
const playerName = gameDataManager.getPlayerDisplayName();

// 监听用户信息更新
weChatManager.addEventListener(WeChatEventType.USER_INFO_UPDATED, (userInfo) => {
    console.log('用户信息更新:', userInfo);
    this.updateUI(userInfo);
});
```

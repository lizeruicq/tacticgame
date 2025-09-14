const { regClass } = Laya;
import { WeChatManager, WeChatUserInfo, WeChatEventType } from './WeChatManager';

// 游戏数据接口
export interface GameData {
    playerLevel: number;
    playerExp: number;
    coins: number;
    achievements: string[];
    settings: {
        soundEnabled: boolean;
        musicEnabled: boolean;
        language: string;
    };
    lastPlayTime: number;
}

// 完整的玩家数据接口
export interface PlayerData {
    weChatUserInfo: WeChatUserInfo | null;
    gameData: GameData;
    isDataLoaded: boolean;
}

/**
 * 游戏数据管理器
 * 负责管理游戏数据和微信用户数据的整合
 */
@regClass()
export class GameDataManager {
    private static instance: GameDataManager;
    
    // 玩家数据
    private playerData: PlayerData;
    
    // 微信管理器
    private weChatManager: WeChatManager;
    
    // 存储键名
    private static readonly GAME_DATA_KEY = 'game_data';
    
    private constructor() {
        this.weChatManager = WeChatManager.getInstance();
        this.playerData = this.getDefaultPlayerData();
        this.initializeData();
        this.setupEventListeners();
    }
    
    /**
     * 获取单例实例
     */
    public static getInstance(): GameDataManager {
        if (!GameDataManager.instance) {
            GameDataManager.instance = new GameDataManager();
        }
        return GameDataManager.instance;
    }
    
    /**
     * 获取默认玩家数据
     */
    private getDefaultPlayerData(): PlayerData {
        return {
            weChatUserInfo: null,
            gameData: {
                playerLevel: 1,
                playerExp: 0,
                coins: 100,
                achievements: [],
                settings: {
                    soundEnabled: true,
                    musicEnabled: true,
                    language: 'zh_CN'
                },
                lastPlayTime: Date.now()
            },
            isDataLoaded: false
        };
    }
    
    /**
     * 初始化数据
     */
    private async initializeData() {
        try {
            // 加载游戏数据
            this.loadGameData();
            
            // 获取微信用户数据
            const weChatUserData = this.weChatManager.getUserData();
            this.playerData.weChatUserInfo = weChatUserData.userInfo;
            
            this.playerData.isDataLoaded = true;
            console.log('游戏数据初始化完成');
        } catch (error) {
            console.error('初始化游戏数据失败:', error);
        }
    }
    
    /**
     * 设置事件监听器
     */
    private setupEventListeners() {
        // 监听微信用户信息更新
        this.weChatManager.addEventListener(WeChatEventType.USER_INFO_UPDATED, (userInfo: WeChatUserInfo) => {
            this.playerData.weChatUserInfo = userInfo;
            this.saveGameData();
            console.log('玩家微信信息已更新');
        });
    }
    
    /**
     * 从本地存储加载游戏数据
     */
    private loadGameData() {
        try {
            const storedData = Laya.LocalStorage.getItem(GameDataManager.GAME_DATA_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // 合并数据，保留默认值
                this.playerData.gameData = { ...this.playerData.gameData, ...parsedData };
                console.log('游戏数据加载成功');
            }
        } catch (error) {
            console.error('加载游戏数据失败:', error);
        }
    }
    
    /**
     * 保存游戏数据到本地存储
     */
    private saveGameData() {
        try {
            const dataToSave = {
                ...this.playerData.gameData,
                lastPlayTime: Date.now()
            };
            Laya.LocalStorage.setItem(GameDataManager.GAME_DATA_KEY, JSON.stringify(dataToSave));
            console.log('游戏数据保存成功');
        } catch (error) {
            console.error('保存游戏数据失败:', error);
        }
    }
    
    /**
     * 获取完整的玩家数据
     */
    public getPlayerData(): PlayerData {
        return { ...this.playerData }; // 返回副本
    }
    
    /**
     * 获取玩家显示名称
     */
    public getPlayerDisplayName(): string {
        return this.playerData.weChatUserInfo?.nickName || `玩家${this.playerData.gameData.playerLevel}级`;
    }
    
    /**
     * 获取玩家头像URL
     */
    public getPlayerAvatarUrl(): string {
        return this.playerData.weChatUserInfo?.avatarUrl || '';
    }
    
    /**
     * 更新玩家等级
     */
    public updatePlayerLevel(level: number) {
        this.playerData.gameData.playerLevel = level;
        this.saveGameData();
    }
    
    /**
     * 更新玩家经验
     */
    public updatePlayerExp(exp: number) {
        this.playerData.gameData.playerExp = exp;
        this.saveGameData();
    }
    
    /**
     * 更新玩家金币
     */
    public updatePlayerCoins(coins: number) {
        this.playerData.gameData.coins = coins;
        this.saveGameData();
    }
    
    /**
     * 添加成就
     */
    public addAchievement(achievementId: string) {
        if (this.playerData.gameData.achievements.indexOf(achievementId) === -1) {
            this.playerData.gameData.achievements.push(achievementId);
            this.saveGameData();
            console.log(`获得新成就: ${achievementId}`);
        }
    }
    
    /**
     * 更新游戏设置
     */
    public updateSettings(settings: Partial<GameData['settings']>) {
        this.playerData.gameData.settings = { ...this.playerData.gameData.settings, ...settings };
        this.saveGameData();
    }
    
    /**
     * 获取游戏统计信息
     */
    public getGameStats() {
        return {
            playerLevel: this.playerData.gameData.playerLevel,
            playerExp: this.playerData.gameData.playerExp,
            coins: this.playerData.gameData.coins,
            achievementCount: this.playerData.gameData.achievements.length,
            hasWeChatInfo: !!this.playerData.weChatUserInfo,
            lastPlayTime: this.playerData.gameData.lastPlayTime
        };
    }
    
    /**
     * 重置游戏数据
     */
    public resetGameData() {
        this.playerData.gameData = this.getDefaultPlayerData().gameData;
        this.saveGameData();
        console.log('游戏数据已重置');
    }
    
    /**
     * 清除所有数据
     */
    public clearAllData() {
        Laya.LocalStorage.removeItem(GameDataManager.GAME_DATA_KEY);
        this.weChatManager.clearAllData();
        this.playerData = this.getDefaultPlayerData();
        console.log('所有数据已清除');
    }
    
    /**
     * 导出数据（用于备份）
     */
    public exportData(): string {
        return JSON.stringify({
            gameData: this.playerData.gameData,
            weChatUserInfo: this.playerData.weChatUserInfo,
            exportTime: Date.now()
        });
    }
    
    /**
     * 导入数据（用于恢复）
     */
    public importData(dataString: string): boolean {
        try {
            const importedData = JSON.parse(dataString);
            if (importedData.gameData) {
                this.playerData.gameData = { ...this.getDefaultPlayerData().gameData, ...importedData.gameData };
                this.saveGameData();
                console.log('数据导入成功');
                return true;
            }
        } catch (error) {
            console.error('数据导入失败:', error);
        }
        return false;
    }
    
    /**
     * 检查数据是否已加载
     */
    public isDataLoaded(): boolean {
        return this.playerData.isDataLoaded;
    }
    
    /**
     * 强制刷新所有数据
     */
    public async refreshAllData(): Promise<void> {
        try {
            // 刷新微信数据
            await this.weChatManager.refreshUserData();
            
            // 重新加载游戏数据
            this.loadGameData();
            
            // 更新微信用户信息
            const weChatUserData = this.weChatManager.getUserData();
            this.playerData.weChatUserInfo = weChatUserData.userInfo;
            
            console.log('所有数据刷新完成');
        } catch (error) {
            console.error('刷新数据失败:', error);
            throw error;
        }
    }
}

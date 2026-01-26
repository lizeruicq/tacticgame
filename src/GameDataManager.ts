const { regClass } = Laya;
import { WeChatManager, WeChatUserInfo, WeChatEventType } from './Wechat/WeChatManager';
import { CloudDatabaseManager } from './utils/CloudDatabaseManager';

// 游戏数据接口
export interface GameData {
    unlockedLevels: number[];  // 已解锁的关卡列表
    canEnemyMerge: boolean;    // 敌人是否可以合并
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

    // 云数据库管理器
    private cloudDatabaseManager: CloudDatabaseManager;

    // 玩家 openid
    private openid: string = '';

    // 存储键名
    private static readonly GAME_DATA_KEY = 'game_data';
    
    private constructor() {
        this.weChatManager = WeChatManager.getInstance();
        this.cloudDatabaseManager = CloudDatabaseManager.getInstance();
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
                unlockedLevels: [1],  // 初始只解锁第1关
                canEnemyMerge: false   // 默认开启敌人合并功能
            },
            isDataLoaded: false
        };
    }
    
    /**
     * 初始化数据
     */
    private async initializeData() {
        try {
            // 获取玩家 openid
            this.openid = await this.cloudDatabaseManager.getOpenid();
            console.log('✅ 获取 openid 成功:', this.openid);

            // 获取微信用户数据
            const weChatUserData = this.weChatManager.getUserData();
            this.playerData.weChatUserInfo = weChatUserData.userInfo;

            // 先加载本地游戏数据作为基础
            this.loadGameData();

            // 再从云端加载玩家数据，云端数据优先级更高
            await this.loadPlayerDataFromCloud();

            this.playerData.isDataLoaded = true;
            console.log('游戏数据初始化完成');
        } catch (error) {
            console.error('❌ 初始化数据失败:', error);
            // 降级处理：使用本地数据
            this.loadGameData();
            this.playerData.isDataLoaded = true;
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
            Laya.LocalStorage.setItem(GameDataManager.GAME_DATA_KEY, JSON.stringify(this.playerData.gameData));
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
        return this.playerData.weChatUserInfo?.nickName || '游戏玩家';
    }
    
    /**
     * 获取玩家头像URL
     */
    public getPlayerAvatarUrl(): string {
        return this.playerData.weChatUserInfo?.avatarUrl || '';
    }

    /**
     * 检查关卡是否已解锁
     */
    public isLevelUnlocked(levelNum: number): boolean {
        return this.playerData.gameData.unlockedLevels.indexOf(levelNum) !== -1;
    }

    /**
     * 解锁关卡
     */
    public async unlockLevel(levelNum: number): Promise<void> {
        if (!this.isLevelUnlocked(levelNum)) {
            this.playerData.gameData.unlockedLevels.push(levelNum);
            this.playerData.gameData.unlockedLevels.sort((a, b) => a - b);
            this.saveGameData();
            console.log(`关卡 ${levelNum} 已解锁`);

            // 同步到云端
            await this.savePlayerDataToCloud();
        }
    }

    /**
     * 获取已解锁的最高关卡
     */
    public getMaxUnlockedLevel(): number {
        const unlockedLevels = this.playerData.gameData.unlockedLevels;
        return unlockedLevels.length > 0 ? Math.max(...unlockedLevels) : 1;
    }

    /**
     * 获取所有已解锁的关卡
     */
    public getUnlockedLevels(): number[] {
        return [...this.playerData.gameData.unlockedLevels];
    }

    /**
     * 游戏胜利，解锁下一关
     */
    public async onLevelComplete(levelNum: number): Promise<void> {
        // 解锁下一关（会自动保存到本地和云端）
        await this.unlockLevel(levelNum + 1);
    }

    /**
     * 获取敌人是否可以合并的状态
     */
    public getCanEnemyMerge(): boolean {
        return this.playerData.gameData.canEnemyMerge;
    }

    /**
     * 设置敌人是否可以合并
     */
    public setCanEnemyMerge(canMerge: boolean): void {
        this.playerData.gameData.canEnemyMerge = canMerge;
        this.saveGameData();
    }

    /**
     * 重置游戏数据
     */
    public async resetGameData(): Promise<void> {
        if (this.playerData) {
            const defaultData = this.getDefaultPlayerData();
            this.playerData.gameData = defaultData.gameData;
            this.saveGameData();

            // 同步到云端
            await this.savePlayerDataToCloud();

            // 通知设置面板更新界面
            Laya.stage.event("GameDataReset");
        }
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
     * 等待数据加载完成
     * 用于确保在访问游戏数据前，云端数据已经加载
     */
    public async waitForDataLoaded(maxWaitTime: number = 10000): Promise<boolean> {
        const startTime = Date.now();

        while (!this.playerData.isDataLoaded) {
            // 检查是否超时
            if (Date.now() - startTime > maxWaitTime) {
                console.warn('⚠️ 等待数据加载超时，使用当前数据');
                return false;
            }

            // 等待100ms后再检查
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('✅ 数据加载完成，可以进入游戏');
        return true;
    }
    
    /**
     * 强制刷新所有数据
     */
    public async refreshAllData(): Promise<void> {
        try {
            // 刷新微信数据
            await this.weChatManager.refreshUserData();

            // 从云端刷新玩家数据（会自动同步到本地存储）
            await this.loadPlayerDataFromCloud();

            // 更新微信用户信息
            const weChatUserData = this.weChatManager.getUserData();
            this.playerData.weChatUserInfo = weChatUserData.userInfo;

            console.log('✅ 所有数据刷新完成，本地和云端已同步');
        } catch (error) {
            console.error('❌ 刷新数据失败:', error);
            throw error;
        }
    }

    /**
     * 从云端加载玩家数据
     */
    private async loadPlayerDataFromCloud(): Promise<void> {
        try {
            if (!this.openid) {
                console.warn('⚠️ openid 未设置，无法从云端加载数据');
                return;
            }

            const { exists, playerInfo } = await this.cloudDatabaseManager.checkPlayerExists(this.openid);

            if (exists && playerInfo) {
                // 云端数据优先级更高，直接覆盖本地数据
                this.playerData.gameData.unlockedLevels = playerInfo.unlockedLevels || [1];
                console.log('✅ 从云端加载玩家数据成功，已解锁关卡:', this.playerData.gameData.unlockedLevels);
            

                // 🔑 关键：同步更新本地存储，确保本地和云端数据一致
                this.saveGameData();
                console.log('✅ 已同步云端数据到本地存储');
            } else {
                await this.savePlayerDataToCloud();
                console.log('✅ 新玩家，已保存初始数据到云端');
            }
        } catch (error) {
            console.error('❌ 从云端加载玩家数据失败:', error);
        }
    }

    /**
     * 保存玩家数据到云端
     */
    private async savePlayerDataToCloud(): Promise<void> {
        try {
            if (!this.openid) {
                console.warn('⚠️ openid 未设置，无法保存数据到云端');
                return;
            }

            const playerInfo = {
                openid: this.openid,
                nickName: this.playerData.weChatUserInfo?.nickName || '游戏玩家',
                avatarUrl: this.playerData.weChatUserInfo?.avatarUrl || '',
                unlockedLevels: this.playerData.gameData.unlockedLevels,
                updatedAt: Date.now()
            };

            await this.cloudDatabaseManager.updatePlayerData(this.openid, playerInfo);
            console.log('✅ 玩家数据已保存到云端');
        } catch (error) {
            console.error('❌ 保存玩家数据到云端失败:', error);
        }
    }
}

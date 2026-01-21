/**
 * 云开发数据库管理器
 * 负责与微信云开发的交互
 */
declare const wx: any;

export class CloudDatabaseManager {
    private static instance: CloudDatabaseManager;

    private constructor() {}

    public static getInstance(): CloudDatabaseManager {
        if (!CloudDatabaseManager.instance) {
            CloudDatabaseManager.instance = new CloudDatabaseManager();
        }
        return CloudDatabaseManager.instance;
    }

    /**
     * 检查是否在微信环境
     */
    private isWeChatEnvironment(): boolean {
        return typeof wx !== 'undefined' && typeof wx.cloud !== 'undefined';
    }

    /**
     * 调用云函数
     */
    private async callCloudFunction(functionName: string, data: any): Promise<any> {
        if (!this.isWeChatEnvironment()) {
            console.warn('⚠️ 非微信环境，无法调用云函数');
            return null;
        }

        return new Promise((resolve, reject) => {
            (wx.cloud as any).callFunction({
                name: functionName,
                data: data,
                success: (res: any) => {
                    const result = res.result;
                    if (result.code === 0) {
                        resolve(result.data);
                    } else {
                        reject(new Error(result.message));
                    }
                },
                fail: (error: any) => {
                    console.error(`❌ 调用云函数 ${functionName} 失败:`, error);
                    reject(error);
                }
            });
        });
    }

    // /**
    //  * 保存玩家信息到云开发
    //  */
    // public async savePlayerInfo(playerInfo: {
    //     openid: string;
    //     nickName: string;
    //     avatarUrl: string;
    //     gender: number;
    //     city: string;
    //     province: string;
    //     country: string;
    //     language: string;
    // }): Promise<any> {
    //     try {
    //         console.log('☁️ 保存玩家信息到云开发...');
    //         const result = await this.callCloudFunction('savePlayerInfo', playerInfo);
    //         console.log('✅ 玩家信息保存成功');
    //         return result;
    //     } catch (error) {
    //         console.error('❌ 保存玩家信息失败:', error);
    //         throw error;
    //     }
    // }

    // /**
    //  * 从云开发获取玩家信息
    //  */
    // public async getPlayerInfo(openid: string): Promise<any> {
    //     try {
    //         console.log('☁️ 从云开发获取玩家信息...');
    //         const result = await this.callCloudFunction('getPlayerInfo', { openid });
    //         console.log('✅ 获取玩家信息成功');
    //         return result;
    //     } catch (error) {
    //         console.error('❌ 获取玩家信息失败:', error);
    //         throw error;
    //     }
    // }

    // /**
    //  * 保存游戏数据到云开发
    //  */
    // public async updateGameData(openid: string, gameData: any): Promise<any> {
    //     try {
    //         console.log('☁️ 保存游戏数据到云开发...');
    //         const result = await this.callCloudFunction('updateGameData', {
    //             openid,
    //             gameData
    //         });
    //         console.log('✅ 游戏数据保存成功');
    //         return result;
    //     } catch (error) {
    //         console.error('❌ 保存游戏数据失败:', error);
    //         throw error;
    //     }
    // }

    // /**
    //  * 从云开发获取游戏数据
    //  */
    // public async getGameData(openid: string): Promise<any> {
    //     try {
    //         console.log('☁️ 从云开发获取游戏数据...');
    //         const result = await this.callCloudFunction('getGameData', { openid });
    //         console.log('✅ 获取游戏数据成功');
    //         return result;
    //     } catch (error) {
    //         console.error('❌ 获取游戏数据失败:', error);
    //         throw error;
    //     }
    // }

    /**
     * 检查玩家是否存在
     */
    public async checkPlayerExists(openid: string): Promise<{ exists: boolean; playerInfo: any }> {
        try {
            console.log('☁️ 检查玩家是否存在...');
            const result = await this.callCloudFunction('checkPlayerExists', { openid });
            console.log('✅ 检查完成');
            return result;
        } catch (error) {
            console.error('❌ 检查玩家失败:', error);
            throw error;
        }
    }

    /**
     * 获取玩家的 openid
     */
    public async getOpenid(): Promise<string> {
        if (!this.isWeChatEnvironment()) {
            console.warn('⚠️ 非微信环境，无法获取 openid');
            return '';
        }

        return new Promise((resolve, reject) => {
            (wx.cloud as any).callFunction({
                name: 'login',
                data: {},
                success: (res: any) => {
                    console.log('✅ 获取 openid 成功:', res.result.openid);
                    resolve(res.result.openid);
                },
                fail: (error: any) => {
                    console.error('❌ 获取 openid 失败:', error);
                    reject(error);
                }
            });
        });
    }

    /**
     * 更新玩家数据
     */
    public async updatePlayerData(openid: string, playerInfo: any): Promise<any> {
        try {
            console.log('☁️ 更新玩家数据到云端...');
            const result = await this.callCloudFunction('updatePlayerData', {
                openid,
                playerInfo
            });
            console.log('✅ 玩家数据更新成功');
            return result;
        } catch (error) {
            console.error('❌ 更新玩家数据失败:', error);
            throw error;
        }
    }

    /**
     * 获取玩家数据
     */
    public async getPlayerData(openid: string): Promise<any> {
        try {
            console.log('☁️ 从云端获取玩家数据...');
            const result = await this.callCloudFunction('getPlayerData', { openid });
            console.log('✅ 获取玩家数据成功');
            return result;
        } catch (error) {
            console.error('❌ 获取玩家数据失败:', error);
            throw error;
        }
    }
}


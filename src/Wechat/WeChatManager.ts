const { regClass } = Laya;

// 微信用户信息接口
export interface WeChatUserInfo {
    nickName: string;
    avatarUrl: string;
    gender: number;
    city: string;
    province: string;
    country: string;
    language: string;
}

// 用户数据存储接口
export interface UserData {
    userInfo: WeChatUserInfo | null;
    isAuthorized: boolean;
    lastUpdateTime: number;
}

// 事件类型
export enum WeChatEventType {
    USER_INFO_UPDATED = 'userInfoUpdated',
    AUTHORIZATION_CHANGED = 'authorizationChanged'
}

// 事件回调接口
export interface WeChatEventCallback {
    (data: any): void;
}

/**
 * 微信API管理器单例
 * 负责所有微信相关接口的调用和数据管理
 */
@regClass()
export class WeChatManager {
    private static instance: WeChatManager;
    
    // 用户数据
    private userData: UserData = {
        userInfo: null,
        isAuthorized: false,
        lastUpdateTime: 0
    };
    
    // 事件监听器
    private eventListeners: Map<WeChatEventType, WeChatEventCallback[]> = new Map();
    
    // 存储键名
    private static readonly STORAGE_KEY = 'wechat_user_data';
    private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时缓存
    
    private constructor() {
        this.initEventListeners();
        this.loadUserDataFromStorage();
    }
    
    /**
     * 获取单例实例
     */
    public static getInstance(): WeChatManager {
        if (!WeChatManager.instance) {
            WeChatManager.instance = new WeChatManager();
        }
        return WeChatManager.instance;
    }
    
    /**
     * 初始化事件监听器
     */
    private initEventListeners(): void {
        this.eventListeners.set(WeChatEventType.USER_INFO_UPDATED, []);
        this.eventListeners.set(WeChatEventType.AUTHORIZATION_CHANGED, []);
    }
    
    /**
     * 检查是否在微信小游戏环境中
     */
    public isWeChatMiniGame(): boolean {
        return typeof wx !== 'undefined' && typeof wx.getSystemInfoSync === 'function';
    }
    

    
    /**
     * 检查用户授权状态
     */
    public async checkAuthorizationStatus(): Promise<boolean> {
        return new Promise((resolve) => {
            if (!this.isWeChatMiniGame()) {
                // 开发环境默认未授权
                this.userData.isAuthorized = false;
                resolve(false);
                return;
            }
            
            wx.getSetting({
                success: (res: any) => {
                    const isAuthorized = !!res.authSetting['scope.userInfo'];
                    this.userData.isAuthorized = isAuthorized;
                    this.saveUserDataToStorage();
                    this.emit(WeChatEventType.AUTHORIZATION_CHANGED, isAuthorized);
                    resolve(isAuthorized);
                },
                fail: (error: any) => {
                    // console.error('检查授权状态失败:', error);
                    this.userData.isAuthorized = false;
                    resolve(false);
                }
            });
        });
    }
    
    /**
     * 获取用户信息（需要已授权）
     */
    public async getUserInfo(): Promise<WeChatUserInfo> {
        return new Promise((resolve, reject) => {
            if (!this.isWeChatMiniGame()) {
                // 开发环境返回模拟数据
                const mockUserInfo: WeChatUserInfo = {
                    nickName: "测试玩家",
                    avatarUrl: "",
                    gender: 1,
                    city: "深圳",
                    province: "广东",
                    country: "中国",
                    language: "zh_CN"
                };
                this.updateUserInfo(mockUserInfo);
                resolve(mockUserInfo);
                return;
            }
            
            wx.getUserInfo({
                success: (res: any) => {
                    const userInfo: WeChatUserInfo = res.userInfo;
                    this.updateUserInfo(userInfo);
                    resolve(userInfo);
                },
                fail: (error: any) => {
                    // console.error('获取用户信息失败:', error);
                    reject(error);
                }
            });
        });
    }
    
    /**
     * 创建用户信息授权按钮
     */
    public createUserInfoButton(options: {
        x: number;
        y: number;
        width: number;
        height: number;
        text?: string;
        onSuccess?: (userInfo: WeChatUserInfo) => void;
        onFail?: (error: any) => void;
    }): any {
        if (!this.isWeChatMiniGame()) {
            // console.log('非微信环境，无法创建授权按钮');
            return null;
        }
        
        const button = wx.createUserInfoButton({
            type: 'text',
            text: options.text || '获取用户信息',
            style: {
                left: options.x,
                top: options.y,
                width: options.width,
                height: options.height,
                backgroundColor: '#007bff',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });
        
        button.onTap((res: any) => {
            try {
                const userInfo: WeChatUserInfo = res.userInfo;
                this.updateUserInfo(userInfo);
                this.userData.isAuthorized = true;
                this.saveUserDataToStorage();
                this.emit(WeChatEventType.AUTHORIZATION_CHANGED, true);
                
                if (options.onSuccess) {
                    options.onSuccess(userInfo);
                }
            } catch (error) {
                // console.error('授权按钮回调失败:', error);
                if (options.onFail) {
                    options.onFail(error);
                }
            }
        });
        
        return button;
    }
    
    /**
     * 更新用户信息
     */
    private updateUserInfo(userInfo: WeChatUserInfo): void {
        this.userData.userInfo = userInfo;
        this.userData.lastUpdateTime = Date.now();
        this.saveUserDataToStorage();
        this.emit(WeChatEventType.USER_INFO_UPDATED, userInfo);
    }
    
    /**
     * 显示微信提示框
     */
    public showModal(options: {
        title?: string;
        content: string;
        showCancel?: boolean;
        confirmText?: string;
        cancelText?: string;
    }): Promise<{ confirm: boolean; cancel: boolean }> {
        return new Promise((resolve) => {
            if (!this.isWeChatMiniGame()) {
                // 开发环境使用浏览器confirm
                const result = confirm(`${options.title || '提示'}\n${options.content}`);
                resolve({ confirm: result, cancel: !result });
                return;
            }
            
            wx.showModal({
                title: options.title || '提示',
                content: options.content,
                showCancel: options.showCancel !== false,
                confirmText: options.confirmText || '确定',
                cancelText: options.cancelText || '取消',
                success: (res: any) => {
                    resolve({ confirm: res.confirm, cancel: res.cancel });
                }
            });
        });
    }
    
    /**
     * 显示微信Toast提示
     */
    public showToast(options: {
        title: string;
        icon?: 'success' | 'loading' | 'none';
        duration?: number;
    }): void {
        if (!this.isWeChatMiniGame()) {
            // 开发环境使用console输出
            // console.log(`Toast: ${options.title}`);
            return;
        }
        
        wx.showToast({
            title: options.title,
            icon: options.icon || 'none',
            duration: options.duration || 2000
        });
    }
    
    /**
     * 从本地存储加载用户数据
     */
    private loadUserDataFromStorage(): void {
        try {
            const storedData = Laya.LocalStorage.getItem(WeChatManager.STORAGE_KEY);
            if (storedData) {
                const parsedData: UserData = JSON.parse(storedData);

                // 检查数据是否过期
                const now = Date.now();
                if (now - parsedData.lastUpdateTime < WeChatManager.CACHE_DURATION) {
                    this.userData = parsedData;
                    // console.log('从本地存储加载用户数据成功');
                } else {
                    // console.log('本地存储的用户数据已过期，将重新获取');
                    this.clearUserDataFromStorage();
                }
            }
        } catch (error) {
            // console.error('加载本地存储数据失败:', error);
            this.clearUserDataFromStorage();
        }
    }

    /**
     * 保存用户数据到本地存储
     */
    private saveUserDataToStorage(): void {
        try {
            const dataToStore = JSON.stringify(this.userData);
            Laya.LocalStorage.setItem(WeChatManager.STORAGE_KEY, dataToStore);
            // console.log('用户数据已保存到本地存储');
        } catch (error) {
            // console.error('保存用户数据到本地存储失败:', error);
        }
    }

    /**
     * 清除本地存储的用户数据
     */
    private clearUserDataFromStorage(): void {
        try {
            Laya.LocalStorage.removeItem(WeChatManager.STORAGE_KEY);
            this.userData = {
                userInfo: null,
                isAuthorized: false,
                lastUpdateTime: 0
            };
            // console.log('已清除本地存储的用户数据');
        } catch (error) {
            // console.error('清除本地存储数据失败:', error);
        }
    }

    /**
     * 添加事件监听器
     */
    public addEventListener(eventType: WeChatEventType, callback: WeChatEventCallback): void {
        const listeners = this.eventListeners.get(eventType);
        if (listeners) {
            listeners.push(callback);
        }
    }

    /**
     * 移除事件监听器
     */
    public removeEventListener(eventType: WeChatEventType, callback: WeChatEventCallback): void {
        const listeners = this.eventListeners.get(eventType);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * 触发事件
     */
    private emit(eventType: WeChatEventType, data: any): void {
        const listeners = this.eventListeners.get(eventType);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    // console.error(`事件回调执行失败 [${eventType}]:`, error);
                }
            });
        }
    }

    /**
     * 获取当前用户数据
     */
    public getUserData(): UserData {
        return { ...this.userData }; // 返回副本，防止外部修改
    }

    /**
     * 获取用户信息（从缓存或重新获取）
     */
    public async getCachedUserInfo(): Promise<WeChatUserInfo | null> {
        // 如果有缓存且未过期，直接返回
        if (this.userData.userInfo && this.isCacheValid()) {
            return this.userData.userInfo;
        }

        // 检查授权状态
        const isAuthorized = await this.checkAuthorizationStatus();
        if (!isAuthorized) {
            return null;
        }

        // 重新获取用户信息
        try {
            return await this.getUserInfo();
        } catch (error) {
            // console.error('获取用户信息失败:', error);
            return null;
        }
    }

    /**
     * 检查缓存是否有效
     */
    private isCacheValid(): boolean {
        const now = Date.now();
        return (now - this.userData.lastUpdateTime) < WeChatManager.CACHE_DURATION;
    }

    /**
     * 强制刷新用户数据
     */
    public async refreshUserData(): Promise<void> {
        try {
            // 检查授权状态
            const isAuthorized = await this.checkAuthorizationStatus();

            // 如果已授权，获取用户信息
            if (isAuthorized) {
                await this.getUserInfo();
            }

            // console.log('用户数据刷新完成');
        } catch (error) {
            // console.error('刷新用户数据失败:', error);
            throw error;
        }
    }

    /**
     * 清除所有数据
     */
    public clearAllData(): void {
        this.clearUserDataFromStorage();
        this.emit(WeChatEventType.USER_INFO_UPDATED, null);
        this.emit(WeChatEventType.AUTHORIZATION_CHANGED, false);
    }
}

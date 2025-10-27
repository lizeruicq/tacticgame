const { regClass, property } = Laya;
import { WeChatManager, WeChatUserInfo, WeChatEventType } from '../Wechat/WeChatManager';
import { GameDataManager } from '../GameDataManager';
import { SceneManager } from '../SceneManager';
import { ButtonAnimationUtils } from '../utils/ButtonAnimationUtils';
import { SoundManager } from '../utils/SoundManager';

@regClass()
export class MainMenuScene extends Laya.Script {

    @property(Laya.Button)
    startButton: Laya.Button;

    @property(Laya.Image)
    playerAvatar: Laya.Image;

    @property(Laya.Label)
    playerName: Laya.Label;
    
    // 管理器实例
    private weChatManager: WeChatManager;
    private gameDataManager: GameDataManager;
    
    onStart() {
        console.log("MainMenuScene started");

        // 获取管理器实例
        this.weChatManager = WeChatManager.getInstance();
        this.gameDataManager = GameDataManager.getInstance();

        // 初始化UI
        this.initUI();

        // 绑定事件
        this.bindEvents();

        // 设置微信事件监听
        this.setupWeChatEventListeners();

        // 初始化用户数据
        this.initializeUserData();
    }
    
    private initUI() {
        // 设置默认玩家信息
        if (this.playerName) {
            this.playerName.text = "游戏玩家";
        }
        console.log("UI initialized");
    }
    
    private bindEvents() {
        // 绑定开始游戏按钮点击事件
        if (this.startButton) {
            this.startButton.on(Laya.Event.CLICK, this, this.onStartButtonClick);
            // 添加按钮点击动画效果
            ButtonAnimationUtils.addButtonClickEffect(this.startButton);
            // 播放按钮点击音效
            // this.startButton.on(Laya.Event.CLICK, this, () => {
            //     SoundManager.getInstance().playButtonClickSound();
            // });
        }
    }
    
    /**
     * 设置微信事件监听器
     */
    private setupWeChatEventListeners() {
        // 监听用户信息更新
        this.weChatManager.addEventListener(WeChatEventType.USER_INFO_UPDATED, (userInfo: WeChatUserInfo) => {
            console.log('用户信息已更新:', userInfo);
            this.updatePlayerDisplay(userInfo);
        });
        
        // 监听授权状态变化
        this.weChatManager.addEventListener(WeChatEventType.AUTHORIZATION_CHANGED, (isAuthorized: boolean) => {
            console.log('授权状态变化:', isAuthorized);
        });
    }
    
    /**
     * 初始化用户数据
     */
    private async initializeUserData() {
        try {
            // 尝试从缓存获取用户信息
            const cachedUserInfo = await this.weChatManager.getCachedUserInfo();
            if (cachedUserInfo) {
                this.updatePlayerDisplay(cachedUserInfo);
                console.log('从缓存加载用户信息成功');
            }
        } catch (error) {
            console.error('初始化用户数据失败:', error);
        }
    }
    
    /**
     * 开始游戏按钮点击事件
     */
    private async onStartButtonClick() {
        console.log("开始游戏按钮被点击了！");

        // 执行登录流程（完全按照参考代码）
        this.doLogin();
    }
    
    /**
     * 执行登录流程（完全按照参考代码实现）
     */
    private doLogin() {
        if (!this.weChatManager.isWeChatMiniGame()) {
            console.log('非微信环境，直接开始游戏');
            this.useDefaultUserInfo();
            this.startGame();
            return;
        }

        wx.getSetting({
            success: (res) => {
                const authSetting = res.authSetting;
                if (authSetting['scope.userInfo'] === true) {
                    // 用户已授权，直接调用相关 API
                    wx.getUserInfo({
                        success: (res) => {
                            console.log('直接获取用户信息成功:', res.userInfo);
                            // 保存用户信息
                            this.weChatManager.getUserData().userInfo = res.userInfo;
                            this.weChatManager.getUserData().isAuthorized = true;
                            // 更新显示并开始游戏
                            this.updatePlayerDisplay(res.userInfo);
                            this.startGame();
                        },
                        fail: (error) => {
                            console.error('获取用户信息失败:', error);
                            this.useDefaultUserInfo();
                            this.startGame();
                        }
                    });
                } else if (authSetting['scope.userInfo'] === false) {
                    // 用户已拒绝授权，需要引导用户到设置页面打开授权开关
                    console.log('用户已拒绝授权，显示授权按钮');
                    this.addLoginBtn();
                } else {
                    // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                    console.log('未询问过用户授权，显示授权按钮');
                    this.addLoginBtn();
                }
            },
            fail: (error) => {
                console.error('获取设置失败:', error);
                this.useDefaultUserInfo();
                this.startGame();
            }
        });
    }

    /**
     * 添加登录按钮（完全按照参考代码实现）
     */
    private addLoginBtn() {
        const width = 200;  // 增大按钮尺寸
        const height = 60;

        console.log('创建授权按钮，屏幕尺寸:', window.innerWidth, window.innerHeight);

        const button = wx.createUserInfoButton({
            type: 'text',  // 先用text类型测试
            text: '登陆授权',
            style: {
                left: window.innerWidth / 2 - width / 2,
                top: window.innerHeight / 2 - height / 2,
                width,
                height,
                backgroundColor: '#07C160',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 18,
                borderRadius: 8,
                lineHeight: height
            }
        });

        console.log('授权按钮已创建，位置:', window.innerWidth / 2 - width / 2, window.innerHeight / 2 - height / 2);

        button.onTap((res: any) => {
            console.log('授权按钮被点击，完整响应:', res);

            if (res.errMsg && res.errMsg.indexOf(':ok') > -1) {
                // 授权成功
                console.log('用户授权成功');
                button.destroy();

                try {
                    const userInfo = JSON.parse(res.rawData);
                    console.log('解析用户信息成功:', userInfo);

                    // 保存用户信息
                    this.weChatManager.getUserData().userInfo = userInfo;
                    this.weChatManager.getUserData().isAuthorized = true;

                    // 更新显示并开始游戏
                    this.updatePlayerDisplay(userInfo);
                    this.startGame();
                } catch (e) {
                    console.error('解析用户信息失败:', e, res);
                    this.useDefaultUserInfo();
                    this.startGame();
                }
            } else {
                // 授权失败或取消
                console.log('用户取消授权或授权失败');
                wx.showToast({
                    title: '请授权开始游戏',
                    icon: 'none',
                    duration: 1500
                });
            }
        });
    }


    
    /**
     * 使用默认用户信息
     */
    private useDefaultUserInfo() {
        const defaultUserInfo: WeChatUserInfo = {
            nickName: "游戏玩家",
            avatarUrl: "",
            gender: 0,
            city: "",
            province: "",
            country: "",
            language: "zh_CN"
        };
        this.updatePlayerDisplay(defaultUserInfo);
    }
    
    /**
     * 更新玩家信息显示
     */
    private updatePlayerDisplay(userInfo: WeChatUserInfo) {
        console.log('开始更新玩家信息显示:', userInfo);

        // 更新玩家昵称 - 添加安全检查
        try {
            if (this.playerName && userInfo.nickName) {
                this.playerName.text = userInfo.nickName;
                console.log('昵称更新成功:', userInfo.nickName);
            }
        } catch (error) {
            console.error('更新昵称失败:', error);
        }

        // 更新玩家头像 - 添加安全检查
        try {
            if (this.playerAvatar && userInfo.avatarUrl) {
                this.loadAvatarImage(userInfo.avatarUrl);
            }
        } catch (error) {
            console.error('更新头像失败:', error);
        }

        console.log('玩家信息显示更新完成');
    }

    /**
     * 加载头像图片
     */
    private loadAvatarImage(avatarUrl: string) {
        if (!avatarUrl || !this.playerAvatar) return;

        console.log("开始加载头像:", avatarUrl);

        // 使用 Laya.loader.load 并指定为图片类型
        Laya.loader.load([{url: avatarUrl, type: Laya.Loader.IMAGE}], Laya.Handler.create(this, () => {
            const texture = Laya.loader.getRes(avatarUrl);
            if (texture && this.playerAvatar) {
                this.playerAvatar.texture = texture;
                console.log("头像加载成功");
            } else {
                console.log("头像加载失败");
                this.hideAvatar();
            }
        }));
    }

    /**
     * 隐藏头像
     */
    private hideAvatar() {
        if (this.playerAvatar) {
            this.playerAvatar.visible = false;
            console.log("头像已隐藏");
        }
    }



    /**
     * 开始游戏
     */
    private startGame() {
        const playerName = this.gameDataManager.getPlayerDisplayName();
        console.log("开始游戏，玩家:", playerName);
        
        // 显示欢迎提示
        this.weChatManager.showToast({
            title: `欢迎 ${playerName}`,
            icon: 'success',
            duration: 2000
        });
        
        // 切换到关卡选择场景
        const sceneManager = SceneManager.getInstance();
        sceneManager.switchToLevelSelect().then(() => {
            console.log("成功切换到关卡选择场景");
        }).catch((error) => {
            console.error("切换场景失败:", error);
        });
    }
    
    onDestroy() {
        // 清理事件监听
        if (this.startButton) {
            this.startButton.off(Laya.Event.CLICK, this, this.onStartButtonClick);
            // 移除按钮点击动画效果
            ButtonAnimationUtils.removeButtonClickEffect(this.startButton);
        }
    }
}
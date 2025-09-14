// 微信小游戏API类型声明

declare namespace wx {
    // 系统信息
    interface SystemInfo {
        brand: string;
        model: string;
        pixelRatio: number;
        screenWidth: number;
        screenHeight: number;
        windowWidth: number;
        windowHeight: number;
        statusBarHeight: number;
        language: string;
        version: string;
        system: string;
        platform: string;
        fontSizeSetting: number;
        SDKVersion: string;
        benchmarkLevel: number;
        albumAuthorized: boolean;
        cameraAuthorized: boolean;
        locationAuthorized: boolean;
        microphoneAuthorized: boolean;
        notificationAuthorized: boolean;
        notificationAlertAuthorized: boolean;
        notificationBadgeAuthorized: boolean;
        notificationSoundAuthorized: boolean;
        bluetoothEnabled: boolean;
        locationEnabled: boolean;
        wifiEnabled: boolean;
        safeArea: {
            left: number;
            right: number;
            top: number;
            bottom: number;
            width: number;
            height: number;
        };
    }

    // 用户信息
    interface UserInfo {
        nickName: string;
        avatarUrl: string;
        gender: number; // 0：未知、1：男、2：女
        city: string;
        province: string;
        country: string;
        language: string;
    }

    // 授权设置
    interface AuthSetting {
        'scope.userInfo'?: boolean;
        'scope.userLocation'?: boolean;
        'scope.address'?: boolean;
        'scope.invoiceTitle'?: boolean;
        'scope.werun'?: boolean;
        'scope.record'?: boolean;
        'scope.writePhotosAlbum'?: boolean;
        'scope.camera'?: boolean;
    }

    // 获取系统信息
    function getSystemInfoSync(): SystemInfo;
    
    // 获取用户信息
    interface GetUserInfoOption {
        success?: (result: { userInfo: UserInfo; rawData: string; signature: string; encryptedData: string; iv: string }) => void;
        fail?: (error: any) => void;
        complete?: () => void;
    }
    function getUserInfo(option: GetUserInfoOption): void;

    // 获取设置
    interface GetSettingOption {
        success?: (result: { authSetting: AuthSetting }) => void;
        fail?: (error: any) => void;
        complete?: () => void;
    }
    function getSetting(option: GetSettingOption): void;

    // 创建用户信息按钮
    interface UserInfoButtonStyle {
        left: number;
        top: number;
        width: number;
        height: number;
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        borderRadius?: number;
        color?: string;
        textAlign?: 'left' | 'center' | 'right';
        fontSize?: number;
        lineHeight?: number;
    }

    interface CreateUserInfoButtonOption {
        type: 'text' | 'image';
        text?: string;
        image?: string;
        style: UserInfoButtonStyle;
    }

    interface UserInfoButton {
        show(): void;
        hide(): void;
        destroy(): void;
        onTap(callback: (result: { userInfo: UserInfo; rawData: string; signature: string; encryptedData: string; iv: string }) => void): void;
        offTap(callback?: Function): void;
    }

    function createUserInfoButton(option: CreateUserInfoButtonOption): UserInfoButton;

    // 显示模态对话框
    interface ShowModalOption {
        title?: string;
        content?: string;
        showCancel?: boolean;
        cancelText?: string;
        cancelColor?: string;
        confirmText?: string;
        confirmColor?: string;
        success?: (result: { confirm: boolean; cancel: boolean }) => void;
        fail?: (error: any) => void;
        complete?: () => void;
    }
    function showModal(option: ShowModalOption): void;

    // 显示消息提示框
    interface ShowToastOption {
        title: string;
        icon?: 'success' | 'loading' | 'none';
        image?: string;
        duration?: number;
        mask?: boolean;
        success?: () => void;
        fail?: (error: any) => void;
        complete?: () => void;
    }
    function showToast(option: ShowToastOption): void;
}

// 全局wx对象
declare const wx: typeof wx;

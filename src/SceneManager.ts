const { regClass } = Laya;

/**
 * 场景管理器
 * 用于管理游戏中的场景切换
 */
@regClass()
export class SceneManager {
    private static instance: SceneManager;
    
    // 场景路径常量
    public static readonly SCENES = {
        MAIN_MENU: "assets/resources/scene/MainMenu.ls",
        // 可以在这里添加更多场景路径
        // GAME: "assets/resources/scene/Game.ls",
        // SETTINGS: "assets/resources/scene/Settings.ls",
    };
    
    // 场景资源ID常量（用于更快的加载）
    public static readonly SCENE_IDS = {
        MAIN_MENU: "res://f185fe1d-024e-49f7-bb50-d2ad1836c73a",
        // 可以在这里添加更多场景ID
    };
    
    private currentScene: string = "";
    private isLoading: boolean = false;
    
    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }
    
    /**
     * 切换到指定场景
     * @param scenePath 场景路径或资源ID
     * @param closeOther 是否关闭其他场景
     */
    public switchToScene(scenePath: string, closeOther: boolean = true): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isLoading) {
                console.warn("场景正在加载中，请稍后再试");
                reject(new Error("场景正在加载中"));
                return;
            }
            
            if (this.currentScene === scenePath) {
                console.log("已经在目标场景中");
                resolve();
                return;
            }
            
            this.isLoading = true;
            console.log(`开始切换到场景: ${scenePath}`);
            
            // 使用Laya的场景管理器打开场景
            Laya.Scene.open(scenePath, closeOther, null, Laya.Handler.create(this, (scene: any) => {
                this.isLoading = false;
                if (scene) {
                    this.currentScene = scenePath;
                    console.log(`场景切换成功: ${scenePath}`);
                    resolve();
                } else {
                    console.error(`场景切换失败: ${scenePath}`);
                    reject(new Error(`场景切换失败: ${scenePath}`));
                }
            }));
        });
    }
    
    /**
     * 切换到主菜单场景
     */
    public switchToMainMenu(): Promise<void> {
        return this.switchToScene(SceneManager.SCENE_IDS.MAIN_MENU);
    }
    
    /**
     * 预加载场景
     * @param scenePath 场景路径
     */
    public preloadScene(scenePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log(`开始预加载场景: ${scenePath}`);
            
            Laya.loader.load(scenePath, Laya.Handler.create(this, (success: any) => {
                if (success) {
                    console.log(`场景预加载成功: ${scenePath}`);
                    resolve();
                } else {
                    console.error(`场景预加载失败: ${scenePath}`);
                    reject(new Error(`场景预加载失败: ${scenePath}`));
                }
            }));
        });
    }
    
    /**
     * 获取当前场景
     */
    public getCurrentScene(): string {
        return this.currentScene;
    }
    
    /**
     * 是否正在加载场景
     */
    public getIsLoading(): boolean {
        return this.isLoading;
    }
    
    /**
     * 关闭指定场景
     * @param scenePath 场景路径
     */
    public closeScene(scenePath: string): void {
        Laya.Scene.close(scenePath);
        if (this.currentScene === scenePath) {
            this.currentScene = "";
        }
        console.log(`场景已关闭: ${scenePath}`);
    }
    
    /**
     * 关闭所有场景
     */
    public closeAllScenes(): void {
        Laya.Scene.closeAll();
        this.currentScene = "";
        console.log("所有场景已关闭");
    }
}

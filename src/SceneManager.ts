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
        MAIN_MENU: "resources/scene/MainMenu.ls",
        LEVEL_SELECT: "resources/scene/LevelSelect.ls",
        GAME: "resources/scene/GameScene.ls",
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
     * 切换到指定场景（带动画过渡）
     * @param scenePath 场景路径或资源ID
     * @param closeOther 是否关闭其他场景
     */
    public switchToScene(scenePath: string, closeOther: boolean = true): Promise<void> {
        // 默认使用500ms的过渡时间
        return this.switchToSceneWithTransition(scenePath, 500, closeOther);
    }
    
    /**
     * 带过渡效果的场景切换
     * @param scenePath 场景路径或资源ID
     * @param transitionDuration 过渡持续时间（毫秒）
     * @param closeOther 是否关闭其他场景
     */
    public switchToSceneWithTransition(
        scenePath: string, 
        transitionDuration: number = 500,
        closeOther: boolean = true
    ): Promise<void> {
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
            
            // this.isLoading = true;

            // 创建过渡遮罩
            const transitionMask = new Laya.Sprite();
            transitionMask.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
            transitionMask.alpha = 0;
            Laya.stage.addChild(transitionMask);

            // 淡出当前场景
            Laya.Tween.to(transitionMask, { alpha: 1 }, transitionDuration, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                // 淡出完成后加载新场景
                Laya.Scene.open(scenePath, closeOther, null, Laya.Handler.create(this, (scene: any) => {
                    if (scene) {
                        this.currentScene = scenePath;
                        
                        // 淡入新场景
                        Laya.Tween.to(transitionMask, { alpha: 0 }, transitionDuration, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                            // 清理过渡遮罩
                            transitionMask.destroy();
                            this.isLoading = false;
                            console.log(`场景切换成功: ${scenePath}`);
                            resolve();
                        }));
                    } else {
                        // 如果加载失败，也需要清理
                        transitionMask.destroy();
                        this.isLoading = false;
                        console.error(`场景切换失败: ${scenePath}`);
                        reject(new Error(`场景切换失败: ${scenePath}`));
                    }
                }));
            }));
        });
    }
    
    /**
     * 切换到关卡选择场景（带动画过渡）
     */
    public switchToLevelSelect(): Promise<void> {
        return this.switchToSceneWithTransition(SceneManager.SCENES.LEVEL_SELECT, 500);
    }

    /**
     * 切换到游戏场景（带动画过渡）
     */
    public switchToGameScene(): Promise<void> {
        return this.switchToSceneWithTransition(SceneManager.SCENES.GAME, 500);
    }

    /**
     * 重新开始游戏场景
     * 退出当前场景，再重新进入，这样会自动重新初始化所有属性
     */
    public restartGameScene(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isLoading) {
                console.warn("场景正在加载中，请稍后再试");
                reject(new Error("场景正在加载中"));
                return;
            }

            // this.isLoading = true;

            // 创建过渡遮罩
            const transitionMask = new Laya.Sprite();
            transitionMask.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
            transitionMask.alpha = 0;
            Laya.stage.addChild(transitionMask);

            // 淡出当前场景
            Laya.Tween.to(transitionMask, { alpha: 1 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                // 先关闭当前场景
                Laya.Scene.close(SceneManager.SCENES.GAME);

                // 延迟一帧确保场景完全卸载
                Laya.timer.frameOnce(1, this, () => {
                    // 重新加载游戏场景
                    Laya.Scene.open(SceneManager.SCENES.GAME, true, null, Laya.Handler.create(this, (scene: any) => {
                        if (scene) {
                            this.currentScene = SceneManager.SCENES.GAME;

                            // 淡入新场景
                            Laya.Tween.to(transitionMask, { alpha: 0 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                                // 清理过渡遮罩
                                transitionMask.destroy();
                                this.isLoading = false;
                                console.log("游戏场景重启成功");
                                resolve();
                            }));
                        } else {
                            // 如果加载失败，也需要清理
                            transitionMask.destroy();
                            this.isLoading = false;
                            console.error("游戏场景重启失败");
                            reject(new Error("游戏场景重启失败"));
                        }
                    }));
                });
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
     * 在场景或节点中安全地查找子节点（支持Main容器）
     * @param parent 父节点或场景
     * @param nodeName 节点名称
     * @returns 找到的节点，如果未找到则返回null
     */
    public static getChildSafe(parent: Laya.Node | Laya.Scene | Laya.Scene3D, nodeName: string): Laya.Node | null {
        // 先尝试直接获取
        let child = parent.getChildByName(nodeName);
        if (child) return child;

        // 如果没找到，尝试从Main容器中获取
        const mainBox = parent.getChildByName("Main") as Laya.Box;
        return mainBox ? mainBox.getChildByName(nodeName) : null;
    }
}
const { regClass, property } = Laya;
import { CloudResourceLoader } from "./utils/CloudResourceLoader";
import { SceneManager } from "./SceneManager";

/**
 * 加载场景脚本
 * 挂载位置：LoadingScreen.ls 场景的根节点
 * 功能：初始化云资源加载器、劫持资源加载、预加载资源、跳转到主菜单
 */
@regClass()
export class LoadingScreen extends Laya.Script {
    @property(Laya.ProgressBar)
    public progressBar: Laya.ProgressBar;

    @property(Laya.Label)
    public progressLabel: Laya.Label;

    @property(Laya.Label)
    public tipsLabel: Laya.Label;

    private static initialized = false;
    private cloudLoader: CloudResourceLoader;

    onAwake(): void {
        if (LoadingScreen.initialized) return;
        LoadingScreen.initialized = true;

        this.cloudLoader = CloudResourceLoader.getInstance();
        this.initUI();
        this.start();
    }

    private initUI(): void {
        if (this.progressBar) this.progressBar.value = 0;
        if (this.progressLabel) this.progressLabel.text = "0/0";
        if (this.tipsLabel) this.tipsLabel.text = "正在初始化...";
    }

    private async start(): Promise<void> {
        try {
            // 初始化云资源加载器（包含环境判断和加载劫持）
            await this.cloudLoader.init();

            // 预加载所有资源
            await this.cloudLoader.preloadAllCloudResources((loaded, total, path) => {
                this.updateProgress(loaded, total, path);
            });

            if (this.tipsLabel) this.tipsLabel.text = "加载完成，进入游戏...";
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 切换到主菜单场景
            await SceneManager.getInstance().switchToScene(SceneManager.SCENES.MAIN_MENU);
        } catch (error) {
            console.error("❌ 加载失败:", error);
            if (this.tipsLabel) this.tipsLabel.text = "加载失败，请重试";
        }
    }

    private updateProgress(loaded: number, total: number, path: string): void {
        const percent = total > 0 ? loaded / total : 0;
        if (this.progressBar) this.progressBar.value = percent;
        if (this.progressLabel) this.progressLabel.text = `${loaded}/${total}`;
        if (this.tipsLabel) {
            const fileName = path.split('/').pop() || path;
            this.tipsLabel.text = `加载中: ${fileName}`;
        }
    }
}


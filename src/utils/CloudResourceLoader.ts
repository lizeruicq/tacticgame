import { CloudResourceConfig } from "../config/CloudResourceConfig";

/**
 * 云资源加载器 - 简化版
 * 负责从微信云存储加载资源
 */
export class CloudResourceLoader {
    private static instance: CloudResourceLoader;
    private static readonly CLOUD_ENV_ID = 'cloud1-8g8n4rwc79d64d40';
    private static readonly CLOUD_BASE_PATH = 'game-resources';

    private tempURLCache = new Map<string, {url: string, expireTime: number}>();
    private loadedResources = new Set<string>();
    private cloudInitialized = false;
    private preloadCompleted = false;
    private originalLayaLoad: any = null;

    static getInstance(): CloudResourceLoader {
        if (!CloudResourceLoader.instance) {
            CloudResourceLoader.instance = new CloudResourceLoader();
        }
        return CloudResourceLoader.instance;
    }

    /**
     * 初始化云开发并劫持加载器
     */
    async init(): Promise<void> {
        if (typeof wx === 'undefined' || !wx.cloud) {
            console.warn('⚠️  非微信环境，将使用本地资源');
            return;
        }

        try {
            wx.cloud.init({ env: CloudResourceLoader.CLOUD_ENV_ID, traceUser: true });
            this.cloudInitialized = true;
            this.hijackLayaLoader();
            console.log('✅ 云开发初始化成功');
        } catch (error) {
            console.error('❌ 云开发初始化失败:', error);
        }
    }

    /**
     * 劫持 Laya.loader.load 方法
     */
    private hijackLayaLoader(): void {
        if (this.originalLayaLoad) return;

        this.originalLayaLoad = Laya.loader.load.bind(Laya.loader);
        const self = this;

        (Laya.loader.load as any) = function(url: any, ...args: any[]): Promise<any> {
            if (typeof url === 'string' && self.shouldLoadFromCloud(url) && self.cloudInitialized) {
                return self.loadFromCloudForLaya(url, args[0]);
            }
            return self.originalLayaLoad(url, ...args);
        };
    }

    /**
     * 从云端加载资源
     */
    private async loadFromCloudForLaya(url: string, type?: string): Promise<any> {
        try {
            if (this.loadedResources.has(url)) {
                return Promise.resolve(Laya.loader.getRes(url));
            }

            console.log(`☁️ 从云端加载资源: ${url}`);
            const tempURL = await this.getTempFileURL(this.getCloudPath(url));
            const result = await this.originalLayaLoad(tempURL, type);

            const resource = Laya.loader.getRes(tempURL);
            if (resource) {
                Laya.loader.cacheRes(url, resource);
                this.loadedResources.add(url);
                console.log(`✅ 云端资源加载成功: ${url}`);
            }

            return result;
        } catch (error) {
            console.error(`❌ 云端加载失败: ${url}`, error);
            return this.originalLayaLoad(url, type);
        }
    }

    private shouldLoadFromCloud(path: string): boolean {
        return CloudResourceConfig.shouldLoadFromCloud(path);
    }

    private getCloudPath(localPath: string): string {
        const relativePath = localPath.replace(/^resources\//, '');
        return `cloud://${CloudResourceLoader.CLOUD_ENV_ID}.636c-cloud1-8g8n4rwc79d64d40-1392708262/${CloudResourceLoader.CLOUD_BASE_PATH}/${relativePath}`;
    }

    /**
     * 获取临时文件URL（带缓存）
     */
    private async getTempFileURL(fileID: string): Promise<string> {
        const cached = this.tempURLCache.get(fileID);
        if (cached && cached.expireTime > Date.now()) {
            return cached.url;
        }

        return new Promise((resolve, reject) => {
            wx.cloud.getTempFileURL({
                fileList: [fileID],
                success: (res: any) => {
                    if (res.fileList?.[0]?.tempFileURL) {
                        const url = res.fileList[0].tempFileURL;
                        this.tempURLCache.set(fileID, {
                            url,
                            expireTime: Date.now() + (110 * 60 * 1000)
                        });
                        resolve(url);
                    } else {
                        reject(new Error('获取临时URL失败'));
                    }
                },
                fail: reject
            });
        });
    }

    /**
     * 预加载所有配置的云端资源
     */
    async preloadAllCloudResources(
        onProgress?: (loaded: number, total: number, path: string) => void
    ): Promise<void> {
        if (this.preloadCompleted || !this.cloudInitialized) return;

        const resources = CloudResourceConfig.getPreloadCloudResources();
        if (resources.length === 0) {
            this.preloadCompleted = true;
            return;
        }

        const startTime = Date.now();
        let loaded = 0;

        for (const path of resources) {
            try {
                if (!this.loadedResources.has(path)) {
                    console.log(`☁️ 预加载资源: ${path}`);
                    const tempURL = await this.getTempFileURL(this.getCloudPath(path));
                    await this.originalLayaLoad(tempURL);
                    const resource = Laya.loader.getRes(tempURL);
                    if (resource) {
                        Laya.loader.cacheRes(path, resource);
                        this.loadedResources.add(path);
                        console.log(`✅ 预加载成功: ${path}`);
                    }
                }
            } catch (error) {
                console.error(`❌ 预加载失败: ${path}`, error);
            }

            loaded++;
            onProgress?.(loaded, resources.length, path);
        }

        this.preloadCompleted = true;
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ 预加载完成！耗时: ${duration}秒，成功: ${this.loadedResources.size}/${resources.length}`);
    }

    // /**
    //  * 带进度的批量加载
    //  */
    // public async loadWithProgress(
    //     resourcePaths: string[],
    //     onProgress?: (loaded: number, total: number) => void
    // ): Promise<any[]> {
    //     const total = resourcePaths.length;
    //     let loaded = 0;

    //     const results: any[] = [];

    //     for (const path of resourcePaths) {
    //         const resource = await this.load(path);
    //         results.push(resource);
    //         loaded++;

    //         if (onProgress) {
    //             onProgress(loaded, total);
    //         }
    //     }

    //     return results;
    // }

    isPreloadCompleted(): boolean {
        return this.preloadCompleted;
    }

    getLoadedResourceCount(): number {
        return this.loadedResources.size;
    }

    clearLoadedCache(): void {
        this.loadedResources.clear();
        this.preloadCompleted = false;
    }
}


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
            if (typeof url === 'string' && self.cloudInitialized) {
                // 如果是本地 atlas 文件，加载后自动替换为云端 PNG
                if (!self.shouldLoadFromCloud(url) && url.endsWith('.atlas')) {
                    return self.loadLocalAtlasWithCloudPNG(url, args[0]);
                }
                // 如果需要从云端加载
                if (self.shouldLoadFromCloud(url)) {
                    return self.loadFromCloudForLaya(url, args[0]);
                }
            }
            return self.originalLayaLoad(url, ...args);
        };
    }

    /**
     * 加载本地 atlas 文件，然后用云端 PNG 替换
     * 这样可以避免 atlas 文件的云端获取问题，直接用本地 atlas 来指向云端的 PNG
     */
    private async loadLocalAtlasWithCloudPNG(url: string, type?: string): Promise<any> {
        try {
            console.log(`📦 加载本地 atlas: ${url}`);

            // 1. 先加载本地 atlas 文件
            const result = await this.originalLayaLoad(url, type);

            // 2. 获取对应的 PNG 路径
            const pngPath = url.replace(/\.atlas$/, '.png');

            // 3. 检查 PNG 是否需要从云端加载
            if (this.shouldLoadFromCloud(pngPath) && !this.loadedResources.has(pngPath)) {
                try {
                    console.log(`☁️ 预加载云端 PNG: ${pngPath}`);
                    const pngTempURL = await this.getTempFileURL(this.getCloudPath(pngPath));

                    // 4. 加载云端 PNG
                    await this.originalLayaLoad(pngTempURL);

                    // 5. 获取加载的资源
                    const pngResource = Laya.loader.getRes(pngTempURL);
                    if (pngResource) {
                        // 6. 将 PNG 资源缓存到 Laya，使用本地路径作为 key
                        // 这样 atlas 引用 PNG 时就会找到这个缓存
                        Laya.loader.cacheRes(pngPath, pngResource);
                        this.loadedResources.add(pngPath);
                        console.log(`✅ 云端 PNG 加载成功: ${pngPath}`);
                    }
                } catch (err) {
                    console.error(`⚠️ 预加载云端 PNG 失败: ${pngPath}`, err);
                }
            }

            this.loadedResources.add(url);
            return result;
        } catch (error) {
            console.error(`❌ 加载本地 atlas 失败: ${url}`, error);
            throw error;
        }
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


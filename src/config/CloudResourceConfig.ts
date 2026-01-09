/**
 * 云资源配置
 * 用于配置哪些资源需要从云端加载，哪些使用本地资源
 */

/**
 * 资源配置项
 */
export interface IResourceConfig {
    path: string;           // 资源路径
    loadFromCloud: boolean; // 是否从云端加载
    preload?: boolean;      // 是否在游戏启动时预加载（默认true）
}

/**
 * 云资源配置管理器
 */
export class CloudResourceConfig {
    
    /**
     * 资源配置列表
     * 
     * 配置说明：
     * - path: 资源路径（相对于resources目录）
     * - loadFromCloud: true=从云端加载, false=从本地加载
     * - preload: true=游戏启动时预加载, false=使用时才加载（默认true）
     */
    public static readonly RESOURCES: IResourceConfig[] = [
        // ==================== 图片资源 ====================
        
        // 背景图片 - 从云端加载
        { path: "resources/images/BG/mainbackground.jpg", loadFromCloud: true, preload: true },
        
        // 关卡背景图片 - 从云端加载
        { path: "resources/images/LEVEL/level-grass.jpeg", loadFromCloud: true, preload: true },
        { path: "resources/images/LEVEL/level-snow.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/LEVEL/level-mud.jpeg", loadFromCloud: true, preload: true },
        { path: "resources/images/LEVEL/level-dessert.jpeg", loadFromCloud: true, preload: true },
        { path: "resources/images/LEVEL/level-road.jpeg", loadFromCloud: true, preload: true },

        // 关卡故事背景图片 - 从云端加载
        { path: "resources/images/storys/level-1.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-2.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-3.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-4.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-5.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-6.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-7.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-8.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-9.jpg", loadFromCloud: true, preload: true },
        { path: "resources/images/storys/level-10.jpg", loadFromCloud: true, preload: true },
        
        // 卡牌图片 - 从云端加载
        { path: "resources/images/CARD/rock.png", loadFromCloud: true, preload: true },
        { path: "resources/images/CARD/wizard.png", loadFromCloud: true, preload: true },
        { path: "resources/images/CARD/pastor.png", loadFromCloud: true, preload: true },
        { path: "resources/images/CARD/goblin.png", loadFromCloud: true, preload: true },
        { path: "resources/images/CARD/necromance.png", loadFromCloud: true, preload: true },
        { path: "resources/images/CARD/skeleton.png", loadFromCloud: true, preload: true },
        { path: "resources/images/CARD/zombie.png", loadFromCloud: true, preload: true },
        { path: "resources/images/CARD/troll.png", loadFromCloud: true, preload: true },
    
        // UI图片 - 从本地加载（小文件，加载快）
        // 如果需要从云端加载，将 loadFromCloud 改为 true
        
        // ==================== 音频资源 ====================

        // BGM - 从云端加载
        { path: "resources/sound/forest.mp3", loadFromCloud: true, preload: true },
        { path: "resources/sound/calm.mp3", loadFromCloud: true, preload: true },
        { path: "resources/sound/shop.mp3", loadFromCloud: true, preload: true },
        { path: "resources/sound/kingdom.mp3", loadFromCloud: true, preload: true },
        { path: "resources/sound/victory.mp3", loadFromCloud: true, preload: true },
        { path: "resources/sound/town.mp3", loadFromCloud: true, preload: true },

        // 音效 - 从本地加载（小文件，加载快）
        // 如果需要从云端加载，将 loadFromCloud 改为 true
    ];
    
    /**
     * 资源路径映射表（用于快速查找）
     * key: 资源路径, value: 配置项
     */
    private static resourceMap: Map<string, IResourceConfig> | null = null;
    
    /**
     * 获取资源配置
     */
    public static getResourceConfig(path: string): IResourceConfig | undefined {
        if (!this.resourceMap) {
            this.buildResourceMap();
        }
        return this.resourceMap!.get(path);
    }
    
    /**
     * 判断资源是否需要从云端加载
     */
    public static shouldLoadFromCloud(path: string): boolean {
        const config = this.getResourceConfig(path);
        return config ? config.loadFromCloud : false;
    }
    
    /**
     * 获取所有需要预加载的云端资源
     */
    public static getPreloadCloudResources(): string[] {
        return this.RESOURCES
            .filter(config => config.loadFromCloud && (config.preload !== false))
            .map(config => config.path);
    }
    
    /**
     * 构建资源映射表
     */
    private static buildResourceMap(): void {
        this.resourceMap = new Map();
        for (const config of this.RESOURCES) {
            this.resourceMap.set(config.path, config);
        }
    }
}


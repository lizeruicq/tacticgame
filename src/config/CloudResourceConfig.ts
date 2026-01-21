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
        // { path: "resources/images/BG/mainbackground.jpg", loadFromCloud: true, preload: true },

        
        // 关卡背景图片 - 从云端加载
        // { path: "resources/images/LEVEL/level-grass.jpeg", loadFromCloud: true, preload: true },
        // { path: "resources/images/LEVEL/level-snow.jpg", loadFromCloud: true, preload: true },
        // { path: "resources/images/LEVEL/level-mud.jpeg", loadFromCloud: true, preload: true },
        // { path: "resources/images/LEVEL/level-dessert.jpeg", loadFromCloud: true, preload: true },
        // { path: "resources/images/LEVEL/level-road.jpeg", loadFromCloud: true, preload: true },

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
        // { path: "resources/images/CARD/rock.png", loadFromCloud: true, preload: true },
        // { path: "resources/images/CARD/wizard.png", loadFromCloud: true, preload: true },
        // { path: "resources/images/CARD/pastor.png", loadFromCloud: true, preload: true },
        // { path: "resources/images/CARD/goblin.png", loadFromCloud: true, preload: true },
        // { path: "resources/images/CARD/necromance.png", loadFromCloud: true, preload: true },
        // { path: "resources/images/CARD/skeleton.png", loadFromCloud: true, preload: true },
        // { path: "resources/images/CARD/zombie.png", loadFromCloud: true, preload: true },
        // { path: "resources/images/CARD/troll.png", loadFromCloud: true, preload: true },

        // ==================== 怪物动画图集 ====================
        // ANI目录下的所有怪物动画图集
        // 注意：.atlas 文件从本地加载，.png 文件从云端加载
        // 这样可以避免 atlas 文件的云端获取问题，直接用本地 atlas 来指向云端的 PNG

        // Rock 怪物动画
        { path: "resources/images/ANI/rock/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/rock/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/rock/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/rock/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/rock/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/rock/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/rock/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/rock/dying.png", loadFromCloud: true, preload: true },

        // Wizard 怪物动画
        { path: "resources/images/ANI/wizard/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/wizard/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/wizard/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/wizard/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/wizard/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/wizard/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/wizard/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/wizard/dying.png", loadFromCloud: true, preload: true },

        // Pastor 怪物动画
        { path: "resources/images/ANI/pastor/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/pastor/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/pastor/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/pastor/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/pastor/casting.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/pastor/casting.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/pastor/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/pastor/dying.png", loadFromCloud: true, preload: true },

        // Goblin 怪物动画
        { path: "resources/images/ANI/goblin/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/goblin/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/goblin/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/goblin/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/goblin/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/goblin/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/goblin/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/goblin/dying.png", loadFromCloud: true, preload: true },

        // Necromance 怪物动画
        { path: "resources/images/ANI/necromance/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/necromance/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/necromance/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/necromance/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/necromance/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/necromance/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/necromance/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/necromance/dying.png", loadFromCloud: true, preload: true },

        // Skeleton 怪物动画
        { path: "resources/images/ANI/skeleton/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/skeleton/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/skeleton/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/skeleton/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/skeleton/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/skeleton/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/skeleton/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/skeleton/dying.png", loadFromCloud: true, preload: true },

        // Zombie 怪物动画
        { path: "resources/images/ANI/zombie/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/zombie/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/zombie/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/zombie/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/zombie/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/zombie/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/zombie/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/zombie/dying.png", loadFromCloud: true, preload: true },

        // Archer 怪物动画
        { path: "resources/images/ANI/archer/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/archer/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/archer/attack.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/archer/attack.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/archer/walk.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/archer/walk.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/archer/die.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/archer/die.png", loadFromCloud: true, preload: true },

        // Knight 怪物动画
        { path: "resources/images/ANI/knight/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/knight/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/knight/attack.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/knight/attack.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/knight/walk.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/knight/walk.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/knight/die.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/knight/die.png", loadFromCloud: true, preload: true },

        // Fairy 怪物动画
        { path: "resources/images/ANI/fairy/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/fairy/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/fairy/casting.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/fairy/casting.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/fairy/walk.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/fairy/walk.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/fairy/die.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/fairy/die.png", loadFromCloud: true, preload: true },

        // ==================== 敌方阵营 - 缺少的怪物 ====================

        // Troll 怪物动画（敌方）
        { path: "resources/images/ANI/troll/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/troll/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/troll/attack.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/troll/attack.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/troll/walk.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/troll/walk.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/troll/die.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/troll/die.png", loadFromCloud: true, preload: true },

        // ==================== 我方阵营 - 缺少的怪物 ====================

        // SwordFe 怪物动画（我方）
        { path: "resources/images/ANI/swordfe/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/swordfe/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/swordfe/attack.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/swordfe/attack.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/swordfe/walk.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/swordfe/walk.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/swordfe/die.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/swordfe/die.png", loadFromCloud: true, preload: true },

        // Pirate 怪物动画（我方）
        { path: "resources/images/ANI/pirate/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/pirate/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/pirate/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/pirate/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/pirate/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/pirate/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/pirate/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/pirate/dying.png", loadFromCloud: true, preload: true },

        // Sailor 怪物动画（我方）
        { path: "resources/images/ANI/sailor/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/sailor/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/sailor/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/sailor/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/sailor/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/sailor/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/sailor/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/sailor/dying.png", loadFromCloud: true, preload: true },

        // Sword 怪物动画（我方）
        { path: "resources/images/ANI/sword/idle.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/sword/idle.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/sword/attacking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/sword/attacking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/sword/walking.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/sword/walking.png", loadFromCloud: true, preload: true },
        { path: "resources/images/ANI/sword/dying.atlas", loadFromCloud: false, preload: true },
        { path: "resources/images/ANI/sword/dying.png", loadFromCloud: true, preload: true },

        // UI图片 - 从本地加载（小文件，加载快）
        // 如果需要从云端加载，将 loadFromCloud 改为 true
        
        // ==================== 音频资源 ====================

        // BGM - 从云端加载
        // { path: "resources/sound/forest.mp3", loadFromCloud: true, preload: true },
        // { path: "resources/sound/calm.mp3", loadFromCloud: true, preload: true },
        // { path: "resources/sound/shop.mp3", loadFromCloud: true, preload: true },
        // { path: "resources/sound/kingdom.mp3", loadFromCloud: true, preload: true },
        // { path: "resources/sound/victory.mp3", loadFromCloud: true, preload: true },
        // { path: "resources/sound/town.mp3", loadFromCloud: true, preload: true },

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


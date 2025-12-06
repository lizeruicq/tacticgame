/**
 * 怪物显示配置
 * 用于管理不同怪物的图集尺寸和显示设置
 */

/**
 * 怪物图集尺寸配置接口
 */
export interface IMonsterAtlasConfig {
    originalWidth: number;   // 图集原始宽度
    originalHeight: number;  // 图集原始高度
    displayName: string;     // 显示名称
}

/**
 * 怪物显示配置类
 */
export class MonsterDisplayConfig {
    
    // 统一显示尺寸设置（基于实际图集分析优化）
    public static readonly UNIFIED_DISPLAY_WIDTH: number = 500;
    public static readonly UNIFIED_DISPLAY_HEIGHT: number = 500;
    
    // 是否启用统一尺寸模式
    public static readonly ENABLE_UNIFIED_SIZE: boolean = true;
    
    // 各种怪物的图集尺寸配置（基于实际atlas文件的sourceSize）
    private static readonly MONSTER_ATLAS_CONFIGS: { [key: string]: IMonsterAtlasConfig } = {
        "Rock": {
            originalWidth: 720,   // 来自rock/idle.atlas的sourceSize
            originalHeight: 480,
            displayName: "岩石怪"
        },
        "Wizard": {
            originalWidth: 1000,   // 来自wizard/idle.atlas的sourceSize
            originalHeight: 1000,
            displayName: "法师"
        },
        "Pastor": {
            originalWidth: 520,   // 来自pastor/idle.atlas的sourceSize
            originalHeight: 420,
            displayName: "牧师"
        },
        "SwordFe": {
            originalWidth: 1650,   // 来自SwordFe/idle.atlas的sourceSize
            originalHeight: 1000,
            displayName: "剑士"
        },
        "Goblin": {
            originalWidth: 900,   // 与Rock相同的尺寸
            originalHeight: 900,
            displayName: "哥布林"
        },
        "Necromance": {
            originalWidth: 900,   // 与Rock相同的尺寸
            originalHeight: 900,
            displayName: "亡灵法师"
        },
        "Skeleton": {
            originalWidth: 900,   // 与Rock相同的尺寸
            originalHeight: 900,
            displayName: "骷髅"
        },
        "Troll": {
            originalWidth: 700,   // 与Rock相同的尺寸
            originalHeight: 500,
            displayName: "巨魔"
        },
        "Zombie": {
            originalWidth: 900,   // 与Rock相同的尺寸
            originalHeight: 900,
            displayName: "僵尸"
        },
        "Archer": {
            originalWidth: 800,   // 与SwordFe相同的尺寸
            originalHeight: 400,
            displayName: "弓箭手"
        },
        "Fairy": {
            originalWidth: 800,   // 与SwordFe相同的尺寸
            originalHeight: 480,
            displayName: "精灵"
        },
        "Knight": {
            originalWidth: 700,   // 与SwordFe相同的尺寸
            originalHeight: 500,
            displayName: "骑士"
        },
        "Pirate": {
            originalWidth: 1550,   // 与SwordFe相同的尺寸
            originalHeight: 1293,
            displayName: "海盗"
        },
        "Sailor": {
            originalWidth: 1421,   // 与SwordFe相同的尺寸
            originalHeight: 1203,
            displayName: "水手"
        },
        "Sword": {
            originalWidth: 1100,   // 与SwordFe相同的尺寸
            originalHeight: 1100,
            displayName: "剑士"
        }
        // 可以继续添加更多怪物类型
    };
    
    /**
     * 获取指定怪物的图集配置
     */
    public static getMonsterAtlasConfig(monsterType: string): IMonsterAtlasConfig | null {
        return this.MONSTER_ATLAS_CONFIGS[monsterType] || null;
    }
    
    // /**
    //  * 获取所有支持的怪物类型
    //  */
    // public static getSupportedMonsterTypes(): string[] {
    //     return Object.keys(this.MONSTER_ATLAS_CONFIGS);
    // }
    
    // /**
    //  * 添加新的怪物图集配置
    //  */
    // public static addMonsterAtlasConfig(monsterType: string, config: IMonsterAtlasConfig): void {
    //     this.MONSTER_ATLAS_CONFIGS[monsterType] = config;
    //     // console.log(`添加怪物图集配置: ${monsterType}`, config);
    // }
    
    // /**
    //  * 计算指定怪物的缩放比例
    //  */
    // public static calculateMonsterScale(monsterType: string): number {
    //     const config = this.getMonsterAtlasConfig(monsterType);
    //     if (!config) {
    //         // console.warn(`未找到怪物 ${monsterType} 的图集配置，使用默认缩放`);
    //         return 1.0;
    //     }
        
    //     if (!this.ENABLE_UNIFIED_SIZE) {
    //         return 1.0; // 不启用统一尺寸时返回原始缩放
    //     }
        
    //     // 计算缩放比例
    //     const scaleX = this.UNIFIED_DISPLAY_WIDTH / config.originalWidth;
    //     const scaleY = this.UNIFIED_DISPLAY_HEIGHT / config.originalHeight;
        
    //     // 取较小的缩放值以保持比例
    //     const scale = Math.min(scaleX, scaleY);
        
    //     // console.log(`${monsterType} 缩放计算: 原始(${config.originalWidth}x${config.originalHeight}) → 目标(${this.UNIFIED_DISPLAY_WIDTH}x${this.UNIFIED_DISPLAY_HEIGHT}) = ${scale.toFixed(3)}`);
        
    //     return scale;
    // }
    
    /**
     * 获取统一显示尺寸
     */
    public static getUnifiedDisplaySize(): { width: number, height: number } {
        return {
            width: this.UNIFIED_DISPLAY_WIDTH,
            height: this.UNIFIED_DISPLAY_HEIGHT
        };
    }
    
    /**
     * 检查是否启用统一尺寸模式
     */
    public static isUnifiedSizeEnabled(): boolean {
        return this.ENABLE_UNIFIED_SIZE;
    }
    
    /**
    
    /**
     * 验证怪物类型是否支持
     */
    public static isMonsterTypeSupported(monsterType: string): boolean {
        return monsterType in this.MONSTER_ATLAS_CONFIGS;
    }


    
    // /**
    //  * 获取推荐的精灵容器尺寸
    //  * 当不使用统一尺寸模式时，可以用这个方法获取推荐的容器尺寸
    //  */
    // public static getRecommendedSpriteSize(monsterType: string): { width: number, height: number } {
    //     if (this.ENABLE_UNIFIED_SIZE) {
    //         return this.getUnifiedDisplaySize();
    //     }
        
    //     const config = this.getMonsterAtlasConfig(monsterType);
    //     if (!config) {
    //         return { width: 120, height: 120 }; // 默认尺寸
    //     }
        
    //     // 可以根据需要调整这个逻辑
    //     return {
    //         width: Math.min(config.originalWidth, 200),
    //         height: Math.min(config.originalHeight, 200)
    //     };
    // }
}

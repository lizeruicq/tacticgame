/**
 * 卡牌类型配置接口
 */
export interface ICardConfig {
    type: string;           // 卡牌类型（如"Rock"）
    prefabPath: string;     // 预制体路径
    componentClass: string; // 组件类名
    manaCost: number;       // 法力消耗
    level: number;          // 默认等级
}

/**
 * 关卡卡牌配置接口
 */
export interface ILevelCardConfig {
    level: number;          // 关卡编号
    playerCards: string[];  // 玩家可选卡牌类型
    enemyCards: string[];   // 敌方可选卡牌类型
    maxCards: number;       // 最大卡牌数量
    cooldownTime: number;   // 冷却时间（毫秒）
    enemyWeights?: { [key: string]: number }; // 敌方怪物召唤权重
    guide?: string;         // 关卡指引说明
    monsterTypes?: string[]; // 本关卡出现的怪物类型说明
    storyBackgroundImagePath?: string; // 关卡故事背景图片路径（StartPanel中显示）
    sceneBackgroundImagePath?: string; // 游戏场景背景图片路径（GameMainManager中显示）
}

/**
 * 卡牌配置管理器
 * 存储所有卡牌类型和关卡配置
 */
export class CardConfig {
    
    /**
     * 卡牌类型配置
     */
    public static readonly CARD_CONFIGS: { [key: string]: ICardConfig } = {
        "Rock": {
            type: "Rock",
            prefabPath: "prefabs/cards/card_rock.lh",
            componentClass: "RockCard",
            manaCost: 2,
            level: 1
        },

        "Wizard": {
            type: "Wizard",
            prefabPath: "prefabs/cards/card_wizard.lh",
            componentClass: "WizardCard",
            manaCost: 2,
            level: 1
        },

        "Pastor": {
            type: "Pastor",
            prefabPath: "prefabs/cards/card_pastor.lh",
            componentClass: "PastorCard",
            manaCost: 3,
            level: 1
        },

        // 石头人阵营 - 新怪物
        "Goblin": {
            type: "Goblin",
            prefabPath: "prefabs/cards/card_goblin.lh",
            componentClass: "GoblinCard",
            manaCost: 1,
            level: 1
        },

        "Necromance": {
            type: "Necromance",
            prefabPath: "prefabs/cards/card_necromance.lh",
            componentClass: "NecromanceCard",
            manaCost: 1,
            level: 1
        },

        "Skeleton": {
            type: "Skeleton",
            prefabPath: "prefabs/cards/card_skeleton.lh",
            componentClass: "SkeletonCard",
            manaCost: 1,
            level: 1
        },

        "Troll": {
            type: "Troll",
            prefabPath: "prefabs/cards/card_troll.lh",
            componentClass: "TrollCard",
            manaCost: 1,
            level: 1
        },

        "Zombie": {
            type: "Zombie",
            prefabPath: "prefabs/cards/card_zombie.lh",
            componentClass: "ZombieCard",
            manaCost: 1,
            level: 1
        },

        // 人类阵营
        "SwordFe": {
            type: "SwordFe",
            prefabPath: "prefabs/monster/card_SwordFe.lh",
            componentClass: "SwordFeCard",
            manaCost: 1,
            level: 1
        },

        "Archer": {
            type: "Archer",
            prefabPath: "prefabs/cards/card_archer.lh",
            componentClass: "ArcherCard",
            manaCost: 3,
            level: 1
        },

        "Fairy": {
            type: "Fairy",
            prefabPath: "prefabs/cards/card_fairy.lh",
            componentClass: "FairyCard",
            manaCost: 1,
            level: 1
        },

        "Knight": {
            type: "Knight",
            prefabPath: "prefabs/cards/card_knight.lh",
            componentClass: "KnightCard",
            manaCost: 1,
            level: 1
        },

        "Pirate": {
            type: "Pirate",
            prefabPath: "prefabs/cards/card_pirate.lh",
            componentClass: "PirateCard",
            manaCost: 1,
            level: 1
        },

        "Sailor": {
            type: "Sailor",
            prefabPath: "prefabs/cards/card_sailor.lh",
            componentClass: "SailorCard",
            manaCost: 1,
            level: 1
        },

        "Sword": {
            type: "Sword",
            prefabPath: "prefabs/cards/card_sword.lh",
            componentClass: "SwordCard",
            manaCost: 2,
            level: 1
        }

        // 可以在这里添加更多卡牌类型
        // "Warrior": {
        //     type: "Warrior",
        //     prefabPath: "prefabs/cards/card_warrior.lh",
        //     componentClass: "WarriorCard",
        //     manaCost: 5,
        //     level: 1
        // }
    };

    /**
     * 关卡配置
     */
    public static readonly LEVEL_CONFIGS: ILevelCardConfig[] = [
        {
            level: 1,
            playerCards: ["Rock","Wizard"],
            enemyCards: ["Sword"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第一关",
            monsterTypes: [" 宁静的石头人部落发现入侵者！\n 人类一股使用短剑的战士小队发起了进攻,指挥石头人与巫师阻止他们！\n 可使用单位：石头人与巫师 \n 石头人：近战单位，攻击力和移动速度中等，血量中等 \n 巫师：远程攻击单位，攻击力较低，血量较低，移动速度较低 "],
            storyBackgroundImagePath: "resources/images/storys/level-1.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                // "SwordFe": 0.5,
                // "Sword": 0.5,
            }
        },
        {
            level: 2,
            playerCards: [ "Rock","Wizard","Pastor"],
            enemyCards: ["Sword", "Archer"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第二关",
            monsterTypes: ["可远程攻击弓箭手加入支援人类，他们的弱点是防御力低下。\n 牧师已经赶到，召唤牧师对受伤的石头人施放治疗效果。\n 新可使用单位：牧师\n 牧师：远程治疗单位，无法攻击，但可随机治疗右方场上2名受伤单位。 "],
            storyBackgroundImagePath: "resources/images/storys/level-2.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
            }
        },
        {
            level: 3,
            playerCards: [ "Rock","Wizard","Pastor","Goblin"],
            enemyCards: ["Sword", "Archer","Fairy"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第三关",
            monsterTypes: ["人类阵营加入远程攻击单位：仙女。仙女攻击力较低，血量较低，攻击速度中等。但被仙女攻击后，移动和攻击速度会短暂变慢。\n 我方哥布林加入战斗过\n 新可使用单位：哥布林 \n 哥布林：近战单位，移动速度中等，攻击力较低，血量中等。"],
            storyBackgroundImagePath: "resources/images/storys/level-3.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
                "Fairy": 0.5,
            }

        },
        {
            level: 4,
            playerCards: [ "Skeleton","Wizard","Pastor","Goblin"],
            enemyCards: ["Sword", "Archer","Fairy","Pirate"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第四关",
            monsterTypes: ["人类阵营新单位海盗已登陆。海盗移动速度慢，血量高、攻击力高，攻击速度慢。\n 我方骷髅加入战斗\n 新可使用单位：骷髅 \n 骷髅：近战单位，移动速度较快，血量较低。"],
            storyBackgroundImagePath: "resources/images/storys/level-4.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
                "Fairy": 0.5,
                "Pirate": 1,
            }

        },
        {
            level: 5,
            playerCards: [ "Rock","Wizard","Pastor","Goblin"],
            enemyCards: ["Sword", "Sailor","Fairy","Pirate"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第五关",
            monsterTypes: ["人类阵营加入远程攻击单位：仙女。被仙女攻击后，移动和攻击速度会短暂变慢。\n 我方哥布林加入战斗过\n 新可使用单位：哥布林 \n 哥布林：近战单位，攻击速度和移动速度较快，血量较低。"],
            storyBackgroundImagePath: "resources/images/storys/level-5.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
                "Fairy": 0.5,
            }

        },
        {
            level: 6,
            playerCards: [ "Rock","Wizard","Pastor","Goblin"],
            enemyCards: ["Sword", "Archer","Fairy"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第六关",
            monsterTypes: ["人类阵营加入远程攻击单位：仙女。被仙女攻击后，移动和攻击速度会短暂变慢。\n 我方哥布林加入战斗过\n 新可使用单位：哥布林 \n 哥布林：近战单位，攻击速度和移动速度较快，血量较低。"],
            storyBackgroundImagePath: "resources/images/storys/level-6.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
                "Fairy": 0.5,
            }

        },
        {
            level: 7,
            playerCards: [ "Rock","Wizard","Pastor","Goblin"],
            enemyCards: ["Sword", "Archer","Fairy"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第七关",
            monsterTypes: ["人类阵营加入远程攻击单位：仙女。被仙女攻击后，移动和攻击速度会短暂变慢。\n 我方哥布林加入战斗过\n 新可使用单位：哥布林 \n 哥布林：近战单位，攻击速度和移动速度较快，血量较低。"],
            storyBackgroundImagePath: "resources/images/storys/level-7.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
                "Fairy": 0.5,
            }

        },
        {
            level: 8,
            playerCards: [ "Rock","Wizard","Pastor","Goblin"],
            enemyCards: ["Sword", "Archer","Fairy"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第八关",
            monsterTypes: ["人类阵营加入远程攻击单位：仙女。被仙女攻击后，移动和攻击速度会短暂变慢。\n 我方哥布林加入战斗过\n 新可使用单位：哥布林 \n 哥布林：近战单位，攻击速度和移动速度较快，血量较低。"],
            storyBackgroundImagePath: "resources/images/storys/level-8.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
                "Fairy": 0.5,
            }

        },
        {
            level: 9,
            playerCards: [ "Rock","Wizard","Pastor","Goblin"],
            enemyCards: ["Sword", "Archer","Fairy"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第九关",
            monsterTypes: ["人类阵营加入远程攻击单位：仙女。被仙女攻击后，移动和攻击速度会短暂变慢。\n 我方哥布林加入战斗过\n 新可使用单位：哥布林 \n 哥布林：近战单位，攻击速度和移动速度较快，血量较低。"],
            storyBackgroundImagePath: "resources/images/storys/level-9.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
                "Fairy": 0.5,
            }

        },
        {
            level: 10,
            playerCards: [ "Rock","Wizard","Pastor","Goblin"],
            enemyCards: ["Sword", "Archer","Fairy"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第十关",
            monsterTypes: ["人类阵营加入远程攻击单位：仙女。被仙女攻击后，移动和攻击速度会短暂变慢。\n 我方哥布林加入战斗过\n 新可使用单位：哥布林 \n 哥布林：近战单位，攻击速度和移动速度较快，血量较低。"],
            storyBackgroundImagePath: "resources/images/storys/level-10.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-grass.jpeg",
            enemyWeights: {
                "Sword": 0.5,
                "Archer": 0.5,
                "Fairy": 0.5,
            }

        }
    ];

    /**
     * 获取卡牌配置
     * @param cardType 卡牌类型
     * @returns 卡牌配置或null
     */
    public static getCardConfig(cardType: string): ICardConfig | null {
        return this.CARD_CONFIGS[cardType] || null;
    }

    /**
     * 获取关卡配置
     * @param level 关卡编号
     * @returns 关卡配置或null
     */
    public static getLevelConfig(level: number): ILevelCardConfig | null {
        return this.LEVEL_CONFIGS.find(config => config.level === level) || null;
    }

    /**
     * 获取所有可用的卡牌类型
     * @returns 卡牌类型数组
     */
    public static getAllCardTypes(): string[] {
        return Object.keys(this.CARD_CONFIGS);
    }

    /**
     * 获取最大关卡数
     * @returns 最大关卡编号
     */
    public static getMaxLevel(): number {
        return Math.max(...this.LEVEL_CONFIGS.map(config => config.level));
    }

    /**
     * 检查卡牌类型是否存在
     * @param cardType 卡牌类型
     * @returns 是否存在
     */
    public static hasCardType(cardType: string): boolean {
        return cardType in this.CARD_CONFIGS;
    }

    /**
     * 检查关卡是否存在
     * @param level 关卡编号
     * @returns 是否存在
     */
    public static hasLevel(level: number): boolean {
        return this.LEVEL_CONFIGS.some(config => config.level === level);
    }

    /**
     * 验证关卡配置的有效性
     * @param level 关卡编号
     * @returns 验证结果
     */
    public static validateLevelConfig(level: number): { valid: boolean; errors: string[] } {
        const config = this.getLevelConfig(level);
        const errors: string[] = [];

        if (!config) {
            errors.push(`关卡 ${level} 不存在`);
            return { valid: false, errors };
        }

        // 检查玩家卡牌配置
        for (const cardType of config.playerCards) {
            if (!this.hasCardType(cardType)) {
                errors.push(`玩家卡牌类型 "${cardType}" 不存在`);
            }
        }

        // 检查敌方卡牌配置
        for (const cardType of config.enemyCards) {
            if (!this.hasCardType(cardType)) {
                errors.push(`敌方卡牌类型 "${cardType}" 不存在`);
            }
        }

        // 检查卡牌数量限制
        if (config.playerCards.length < 2) {
            errors.push(`玩家卡牌类型数量不能少于2种`);
        }
        if (config.playerCards.length > 8) {
            errors.push(`玩家卡牌类型数量不能超过8种`);
        }

        return { valid: errors.length === 0, errors };
    }
}

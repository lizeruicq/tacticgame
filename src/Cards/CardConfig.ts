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
    bgmName?: string;       // 关卡BGM文件名（不包含扩展名）
    enemyDecisionInterval?: number; // 敌人AI决策间隔时间（毫秒）
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
            manaCost: 3,
            level: 1
        },

        "Skeleton": {
            type: "Skeleton",
            prefabPath: "prefabs/cards/card_skeleton.lh",
            componentClass: "SkeletonCard",
            manaCost: 3,
            level: 1
        },

        "Troll": {
            type: "Troll",
            prefabPath: "prefabs/cards/card_troll.lh",
            componentClass: "TrollCard",
            manaCost: 4,
            level: 1
        },

        "Zombie": {
            type: "Zombie",
            prefabPath: "prefabs/cards/card_zombie.lh",
            componentClass: "ZombieCard",
            manaCost: 2,
            level: 1
        },

        // 人类阵营
        "SwordFe": {
            type: "SwordFe",
            prefabPath: "prefabs/monster/card_SwordFe.lh",
            componentClass: "SwordFeCard",
            manaCost: 3,
            level: 1
        },

        "Archer": {
            type: "Archer",
            prefabPath: "prefabs/cards/card_archer.lh",
            componentClass: "ArcherCard",
            manaCost: 2,
            level: 1
        },

        "Fairy": {
            type: "Fairy",
            prefabPath: "prefabs/cards/card_fairy.lh",
            componentClass: "FairyCard",
            manaCost: 3,
            level: 1
        },

        "Knight": {
            type: "Knight",
            prefabPath: "prefabs/cards/card_knight.lh",
            componentClass: "KnightCard",
            manaCost: 4,
            level: 1
        },

        "Pirate": {
            type: "Pirate",
            prefabPath: "prefabs/cards/card_pirate.lh",
            componentClass: "PirateCard",
            manaCost: 3,
            level: 1
        },

        "Sailor": {
            type: "Sailor",
            prefabPath: "prefabs/cards/card_sailor.lh",
            componentClass: "SailorCard",
            manaCost: 3,
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
            bgmName: "forest.mp3",
            enemyDecisionInterval: 2700,
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
            bgmName: "forest.mp3",
            enemyDecisionInterval: 2500,
            enemyWeights: {

            }
        },
        {
            level: 3,
            playerCards: [ "Rock","Wizard","Pastor","Necromance"],
            enemyCards: ["Sword", "Archer","Fairy"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第三关",
            monsterTypes: ["人类阵营加入远程攻击单位：仙女。仙女攻击力较低，血量较低，攻击速度中等。但被仙女攻击后，移动和攻击速度会短暂停滞。\n 我方亡灵加入战线 \n 新可使用单位：亡灵 \n 亡灵：远程控制型单位，攻击力较低、血量偏少，攻击后能让敌人陷入停滞状态，可有效打断敌方攻势。"],
            storyBackgroundImagePath: "resources/images/storys/level-3.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-snow.jpeg",
            bgmName: "calm.mp3",
            enemyDecisionInterval: 2250,
            enemyWeights: {

            }

        },
        {
            level: 4,
            playerCards: [ "Skeleton","Wizard","Pastor","Necromance"],
            enemyCards: ["Sword", "Archer","Fairy","Pirate"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第四关",
            monsterTypes: ["人类阵营新单位海盗已登陆。海盗移动速度慢，血量高、攻击力高，攻击速度慢。\n 我方骷髅加入战斗\n 新可使用单位：骷髅 \n 骷髅：近战单位，移动速度较快，可以快速输出攻击，但血量较低。"],
            storyBackgroundImagePath: "resources/images/storys/level-4.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-mud.jpeg",
            bgmName: "shop.mp3",
            enemyDecisionInterval: 2000,
            enemyWeights: {

            }

        },
        {
            level: 5,
            playerCards: [ "Skeleton","Necromance","Pastor","Zombie"],
            enemyCards: ["Sword", "Sailor","Fairy","Pirate"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第五关",
            monsterTypes: ["人类阵营新增远程支援单位：水手。水手是远程单位，攻击力较低，血量较低，但攻击范围极广、移动速度快。 \n 我方僵尸加入战斗 \n 新可使用单位：僵尸 \n 僵尸：移动速度较慢的近战单位，攻击力中等、血量较高，击杀敌人后，敌人会转生为一只低血量僵尸，加入石头人阵营作战。"],
            storyBackgroundImagePath: "resources/images/storys/level-5.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-mud.jpeg",
            bgmName: "shop.mp3",
            enemyDecisionInterval: 2000,
            enemyWeights: {

            }

        },
        {
            level: 6,
            // ,"Wizard","Pastor","Goblin"
            playerCards: [ "Zombie","Wizard","Pastor","Goblin"],
            // "Archer","Fairy","SwordFe"
            enemyCards: ["Sword","Archer","Fairy","SwordFe"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第六关",
            monsterTypes: ["人类阵营派出近战精锐：女武士。\n 女武士是近战单位，攻击力强劲、移动速度快，血量中等，能快速突进我方战线。\n 我方哥布林加入战斗过\n 新可使用单位：哥布林 \n 哥布林：近战单位，移动迅速，攻击力较低，血量中等。"],
            storyBackgroundImagePath: "resources/images/storys/level-6.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-mud.jpeg",
            bgmName: "kingdom.mp3",
            enemyDecisionInterval: 2000,
            enemyWeights: {

            }

        },
        {
            level: 7,
            playerCards: [ "Zombie","Skeleton","Troll","Goblin"],
            enemyCards: ["Knight", "Pirate","Fairy","SwordFe"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第七关",
            monsterTypes: ["人类阵营的重装单位：骑士参战。\n 骑士是近战重装单位，攻击力高、血量厚实，综合战力强劲但移动速度偏慢。\n 我方巨魔加入作战\n 新可使用单位：巨魔\n 巨魔：近战重型单位，攻击力高、血量充足，能在前排承担伤害并输出高额攻击，是坚实的战线支柱。"],
            storyBackgroundImagePath: "resources/images/storys/level-7.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-dessert.jpeg",
            bgmName: "kingdom.mp3",
            enemyDecisionInterval: 2000,
            enemyWeights: {

            }

        },
        {
            level: 8,
            playerCards: [ "Rock","Skeleton","Pastor","Troll"],
            enemyCards: ["SwordFe", "Archer","Fairy","Knight"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第八关",
            monsterTypes: ["人类阵营派出女武士、弓箭手、仙女与骑士的混合编队，战术灵活性极强。\n 我方可依托石头人的坦度、骷髅的高机动性、牧师的群体治疗，配合巨魔的高额输出，形成攻防兼备的稳定战线。"],
            storyBackgroundImagePath: "resources/images/storys/level-8.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-dessert.jpeg",
            bgmName: "kingdom.mp3",
            enemyDecisionInterval: 2000,
            enemyWeights: {

            }

        },
        {
            level: 9,
            playerCards: [ "Goblin","Zombie","Wizard","Necromance"],
            enemyCards: ["Pirate","Sailor","Sword"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第九关",
            monsterTypes: ["人类阵营集结海盗、水手与战士的协同小队：海盗高攻高血负责突进，水手远程支援，战士则作为基础近战补充。\n 我方可利用亡灵的控制技能限制敌方走位、巫师的远程输出消耗，搭配僵尸的增殖能力与哥布林的机动，打乱敌方的远近协同节奏。"],
            storyBackgroundImagePath: "resources/images/storys/level-9.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-snow.jpeg",
            bgmName: "calm.mp3",
            enemyDecisionInterval: 2000,
            enemyWeights: {

            }

        },
        {
            level: 10,
            playerCards: [ "Skeleton","Zombie","Wizard","Necromance", "Troll","Rock","Pastor","Goblin"],
            // playerCards: [ "Zombie"],
            enemyCards: ["SwordFe", "Archer","Fairy","Knight","Pirate","Sailor","Sword"],
            // enemyCards: ["Knight"],
            maxCards: 4,
            cooldownTime: 2000,
            guide: "第十关",
            monsterTypes: ["最终决战开启！人类阵营集结了所有精锐单位，涵盖近战高攻、远程输出、控制辅助等全类型，攻势密集且战术组合多样。\n 我方已解锁全部作战单位，用石头人、哥布林、巨魔担任前排坦度，骷髅、僵尸负责突进与战线增殖，巫师、亡灵提供远程输出与控制，牧师保障队伍续航，构建全面的攻防体系。"],
            storyBackgroundImagePath: "resources/images/storys/level-10.jpg",
            sceneBackgroundImagePath: "resources/images/LEVEL/level-road.jpeg",
            bgmName: "victory.mp3",
            enemyDecisionInterval: 2000,
            enemyWeights: {

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
        if (config.playerCards.length < 1) {
            errors.push(`玩家卡牌类型数量不能少于1种`);
        }
        if (config.playerCards.length > 8) {
            errors.push(`玩家卡牌类型数量不能超过8种`);
        }

        return { valid: errors.length === 0, errors };
    }
}

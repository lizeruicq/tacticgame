const { regClass, property } = Laya;

/**
 * 音效管理器
 * 负责管理游戏中的背景音乐和音效
 * 可作为脚本挂载到场景节点上，支持场景切换时持久化
 *
 * 设计原则：
 * - 不使用开启/关闭标记，只使用音量控制
 * - 音效打开时，音量为 30%（0.3）
 * - 音效关闭时，音量为 0%（0）
 * - 通过调整音量来控制玩家是否能听到声音
 */
@regClass()
export class SoundManager extends Laya.Script {
    private static instance: SoundManager;
    private static readonly PERSISTENT_LAYER_NAME = "__PersistentLayer__";

    // 音效和音乐路径
    private static readonly SOUND_PATH = "resources/sound";

    // 音量控制
    private static readonly VOLUME_ON = 0.3;        // 音效打开时的音量（30%）
    private static readonly VOLUME_OFF = 0;         // 音效关闭时的音量（0%）

    private currentVolume: number = SoundManager.VOLUME_ON;  // 当前音量
    private currentBgMusic: string = "";            // 当前背景音乐
    private bgMusicChannel: Laya.SoundChannel = null;  // 背景音乐通道

    // 音效缓存
    private soundCache: Map<string, Laya.SoundChannel> = new Map();

    // BackgroundMusic 节点
    @property(Laya.SoundNode)
    private bgMusicNode: Laya.SoundNode = null;

    /**
     * 脚本初始化（当脚本挂载到节点时调用）
     */
    onAwake(): void {
        // 设置单例
        if (!SoundManager.instance) {
            SoundManager.instance = this;
            this.loadSettings();

            // 将 SoundManager 节点移到持久化层
            this.setupPersistentLayer();

            // 获取 BackgroundMusic 节点
            // this.findBackgroundMusicNode();

            console.log("SoundManager 已初始化");
        } else {
            // 如果已经存在实例，销毁重复的
            console.log("SoundManager 已存在，销毁重复实例");
            this.owner.destroy();
        }
    }

    /**
     * 设置持久化层
     */
    private setupPersistentLayer(): void {
        // 创建或获取持久化层
        let persistentLayer = Laya.stage.getChildByName(SoundManager.PERSISTENT_LAYER_NAME) as Laya.Sprite;

        if (!persistentLayer) {
            persistentLayer = new Laya.Sprite();
            persistentLayer.name = SoundManager.PERSISTENT_LAYER_NAME;
            Laya.stage.addChild(persistentLayer);
            console.log("创建持久化层");
        }

        // 将 SoundManager 节点移到持久化层
        if (this.owner.parent !== persistentLayer) {
            persistentLayer.addChild(this.owner);
            console.log("SoundManager 节点已添加到持久化层");
        }
    }

    /**
     * 查找 BackgroundMusic 节点
     */
    // private findBackgroundMusicNode(): void {
    //     // // 查找持久化层中的 BackgroundMusic 节点
    //     // const persistentLayer = Laya.stage.getChildByName("__PersistentLayer__");
    //     // if (persistentLayer) {
    //     //     this.bgMusicNode = persistentLayer.getChildByName("BackgroundMusic") as Laya.SoundNode;
    //     // }

    //     // 如果没找到，查找当前场景中的 BackgroundMusic 节点
    //     if (!this.bgMusicNode) {
    //         const scene = Laya.stage.getChildByName("Scene2D");
    //         if (scene) {
    //             this.bgMusicNode = scene.getChildByName("BackgroundMusic") as Laya.SoundNode;
    //         }
    //     }

    //     if (this.bgMusicNode) {
    //         console.log("BackgroundMusic 节点已找到");
    //     } else {
    //         console.warn("未找到 BackgroundMusic 节点");
    //     }
    // }

    /**
     * 获取单例实例
     */
    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            console.warn("SoundManager 未初始化，请确保在场景中挂载了 SoundManager 脚本");
        }
        return SoundManager.instance;
    }
    
    /**
     * 从本地存储加载设置
     */
    private loadSettings(): void {
        try {
            const settings = localStorage.getItem('sound_settings');
            if (settings) {
                const data = JSON.parse(settings);
                this.currentVolume = data.volume !== undefined ? data.volume : SoundManager.VOLUME_ON;
                console.log(`加载音效设置: 音量=${this.currentVolume}`);
            } else {
                // 首次运行，默认音量为 30%
                this.currentVolume = SoundManager.VOLUME_ON;
                this.saveSettings();
                console.log('首次运行，设置默认音量: 30%');
            }
        } catch (error) {
            console.error('加载音效设置失败:', error);
            // 出错时默认音量为 30%
            this.currentVolume = SoundManager.VOLUME_ON;
        }
    }
    
    /**
     * 保存设置到本地存储
     */
    private saveSettings(): void {
        try {
            const settings = {
                volume: this.currentVolume
            };
            localStorage.setItem('sound_settings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存音效设置失败:', error);
        }
    }
    
    /**
     * 切换音效和音乐的音量
     * 音量在 0（静音）和 0.3（30%）之间切换
     */
    public toggleSound(): void {
        // 在 0 和 0.3 之间切换
        this.currentVolume = this.currentVolume > 0 ? SoundManager.VOLUME_OFF : SoundManager.VOLUME_ON;

        // 应用音量到 BackgroundMusic 节点
        this.updateBackgroundMusicVolume(this.currentVolume);

        // 保存设置
        this.saveSettings();

        console.log(`音量已切换: ${this.currentVolume === SoundManager.VOLUME_ON ? '30%' : '0%'}`);
    }

    /**
     * 更新 BackgroundMusic 节点的音量
     */
    private updateBackgroundMusicVolume(volume: number): void {
        if (this.bgMusicNode && volume === 0)   {
            this.bgMusicNode.stop();
        }
        if (this.bgMusicNode && volume > 0)   {
            this.bgMusicNode.play();
        }
    }
    
    /**
     * 获取当前音量
     */
    public getVolume(): number {
        return this.currentVolume;
    }

    /**
     * 设置音量
     * @param volume 音量值（0-1）
     */
    public setVolume(volume: number): void {
        this.currentVolume = Math.max(0, Math.min(1, volume));
        this.updateBackgroundMusicVolume(this.currentVolume);
        this.saveSettings();
        console.log(`音量已设置: ${this.currentVolume}`);
    }

    /**
     * 检查音效是否打开（音量 > 0）
     */
    public isSoundEnabled(): boolean {
        return this.currentVolume > 0;
    }

   
    /**
     * 播放背景音乐节点
     */
    public playBackgroundMusic(): void {
        if (this.bgMusicNode && this.bgMusicNode.play) {
            this.bgMusicNode.play();
            console.log("背景音乐已播放");
        }
    }

    /**
     * 暂停背景音乐节点
     */
    public pauseBackgroundMusic(): void {
        if (this.bgMusicNode) {
            const soundNode = this.bgMusicNode as any;
            if (soundNode.pause) {
                soundNode.pause();
                console.log("背景音乐已暂停");
            }
        }
    }

    /**
     * 停止背景音乐节点
     */
    public stopBackgroundMusic(): void {
        if (this.bgMusicNode && this.bgMusicNode.stop) {
            this.bgMusicNode.stop();
            console.log("背景音乐已停止");
        }
    }
    
    /**
     * 播放背景音乐
    //  * @param musicName 音乐文件名（不包含扩展名）
    //  * @param loop 是否循环播放
     */
    // public playBgMusic(musicName: string, loop: boolean = true): void {
    //     if (!this.musicEnabled) {
    //         console.log('音乐已关闭，不播放背景音乐');
    //         return;
    //     }
        
    //     // 如果已有背景音乐在播放，先停止
    //     if (this.bgMusicChannel) {
    //         this.bgMusicChannel.stop();
    //     }
        
    //     const musicPath = `${SoundManager.MUSIC_PATH}${musicName}.mp3`;
    //     this.currentBgMusic = musicName;
        
    //     // 加载并播放背景音乐
    //     Laya.loader.load(musicPath, Laya.Handler.create(this, () => {
    //         const sound = Laya.loader.getRes(musicPath);
    //         if (sound) {
    //             this.bgMusicChannel = sound.play(0, loop ? 0 : 1);
    //             console.log(`背景音乐 ${musicName} 开始播放`);
    //         } else {
    //             console.error(`无法加载背景音乐: ${musicPath}`);
    //         }
    //     }));
    // }



    
    /**
     * 播放音效
     * @param soundName 音效文件名（不包含扩展名）
     */
    public playSound(soundName: string): void {
        const soundPath = `${SoundManager.SOUND_PATH}${soundName}.mp3`;

        // 加载并播放音效
        Laya.loader.load(soundPath, Laya.Handler.create(this, () => {
            const sound = Laya.loader.getRes(soundPath);
            if (sound) {
                const channel = sound.play(0, 1);
                // 应用当前音量
                if (channel) {
                    channel.volume = this.currentVolume;
                }
                console.log(`音效 ${soundName} 播放，音量: ${this.currentVolume}`);
            } else {
                console.error(`无法加载音效: ${soundPath}`);
            }
        }));
    }
    
    /**
     * 播放按钮点击音效
     */
    public playButtonClickSound(): void {
        this.playSound('button_click');
    }
    
    /**
     * 播放面板打开音效
     */
    public playPanelOpenSound(): void {
        this.playSound('panel_open');
    }
    
    /**
     * 播放面板关闭音效
     */
    public playPanelCloseSound(): void {
        this.playSound('panel_close');
    }
    
    /**
     * 播放怪物攻击音效
     */
    public playMonsterAttackSound(): void {
        this.playSound('monster_attack');
    }
    
    /**
     * 播放怪物受伤音效
     */
    public playMonsterHurtSound(): void {
        this.playSound('monster_hurt');
    }
    
    /**
     * 播放怪物死亡音效
     */
    public playMonsterDeathSound(): void {
        this.playSound('monster_death');
    }
    
    /**
     * 播放卡牌使用音效
     */
    public playCardUseSound(): void {
        this.playSound('card_use');
    }
    
    /**
     * 播放卡牌合成音效
     */
    public playCardMergeSound(): void {
        this.playSound('card_merge');
    }
    
    /**
     * 设置背景音乐音量
     * @param volume 音量（0-1）
     */
    public setBgMusicVolume(volume: number): void {
        if (this.bgMusicChannel) {
            this.bgMusicChannel.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    /**
     * 获取背景音乐音量
     */
    public getBgMusicVolume(): number {
        if (this.bgMusicChannel) {
            return this.bgMusicChannel.volume;
        }
        return 1;
    }
    
}


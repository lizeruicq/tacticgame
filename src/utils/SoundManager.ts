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
    private bgMusicChannel: Laya.SoundChannel | null = null;  // 背景音乐通道

    // // 音效缓存
    // private soundCache: Map<string, Laya.SoundChannel> = new Map();


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
            this.playDefaultBgm();

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

        // 如果是从静音切换到有声，则重新播放当前背景音乐
        if (this.currentVolume > 0 && this.currentBgMusic) {
            // 重新播放当前背景音乐
            this.bgMusicChannel = Laya.SoundManager.playMusic(this.currentBgMusic, 0);
            if (this.bgMusicChannel) {
                this.bgMusicChannel.volume = 0.3; // 使用最大音量，实际音量由currentVolume控制
            }
        } else if (this.currentVolume === 0 && this.bgMusicChannel) {
            // 如果切换到静音，停止播放背景音乐
            this.bgMusicChannel.stop();
            this.bgMusicChannel = null;
        }

        // 保存设置
        this.saveSettings();

        
    }

    /**
     * 更新 BackgroundMusic 的音量
     */
    private updateBackgroundMusicVolume(volume: number): void {
        // 控制playMusic播放的背景音乐
        if (this.bgMusicChannel) {
            this.bgMusicChannel.volume = volume > 0 ? 0.3 : 0;
        }
    }
    
    /**
     * 获取当前音量
     */
    public getVolume(): number {
        return this.currentVolume;
    }

    // /**
    //  * 设置音量
    //  * @param volume 音量值（0-1）
    //  */
    // public setVolume(volume: number): void {
    //     this.currentVolume = Math.max(0, Math.min(1, volume));
    //     this.updateBackgroundMusicVolume(this.currentVolume);
    //     this.saveSettings();
    //     console.log(`音量已设置: ${this.currentVolume}`);
    // }

    /**
     * 检查音效是否打开（音量 > 0）
     */
    public isSoundEnabled(): boolean {
        return this.currentVolume > 0;
    }


    // /**
    //  * 播放背景音乐节点
    //  */
    // public playBackgroundMusic(): void {
    //     if (this.bgMusicNode && this.bgMusicNode.play) {
    //         this.bgMusicNode.play();
    //         console.log("背景音乐已播放");
    //     }
    // }

    // /**
    //  * 暂停背景音乐节点
    //  */
    // public pauseBackgroundMusic(): void {
    //     if (this.bgMusicNode) {
    //         const soundNode = this.bgMusicNode as any;
    //         if (soundNode.pause) {
    //             soundNode.pause();
    //             console.log("背景音乐已暂停");
    //         }
    //     }
    // }

    // /**
    //  * 停止背景音乐节点
    //  */
    // public stopBackgroundMusic(): void {
    //     if (this.bgMusicNode && this.bgMusicNode.stop) {
    //         this.bgMusicNode.stop();
    //         console.log("背景音乐已停止");
    //     }
    // }

    /**
     * 切换关卡BGM
     * @param bgmName BGM文件名（包含扩展名，如 "forest.mp3"）
     */
    public playLevelBgm(bgmName: string): void {

        if (!bgmName) {
            console.warn("BGM名称为空，无法切换");
            return;
        }

        const bgmPath = `${SoundManager.SOUND_PATH}/${bgmName}`;
        console.log(`[SoundManager] 准备播放BGM: ${bgmPath}`);

        // 停止当前BGM
        if (this.bgMusicChannel) {
            this.bgMusicChannel.stop();
            this.bgMusicChannel = null;
        }

        // 使用playMusic播放背景音乐，循环播放(0表示无限循环)
        try {
            this.bgMusicChannel = Laya.SoundManager.playMusic(bgmPath, 0);
            if (this.bgMusicChannel) {
                // 根据当前音量设置播放音量
                this.bgMusicChannel.volume = this.currentVolume > 0 ? 0.3 : 0;
                this.currentBgMusic = bgmPath;
            }
            console.log(`[SoundManager] BGM播放成功: ${bgmPath}`);
        } catch (error) {
            console.error(`[SoundManager] BGM播放失败: ${bgmPath}`, error);
        }
    }

    /**
     * 恢复默认BGM
     */
    public playDefaultBgm(): void {
        this.playLevelBgm("town/town.mp3");
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
     * @param soundName 音效文件名
     */
    public playSound(soundName: string, volume = 0.8): void {
        // 如果音量已关闭，不播放音效
        if (this.currentVolume <= 0) {
            return;
        }
        const soundPath = `${SoundManager.SOUND_PATH}/${soundName}`;
        Laya.loader.load(soundPath).then(() => {
            const channel = Laya.SoundManager.playSound(soundPath);
            if (channel) {
                channel.volume = volume ;
            }
        }).catch((error) => {
            console.warn(`加载音效失败: ${soundPath}`, error);
        });
    }


}


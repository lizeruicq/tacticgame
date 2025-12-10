const { regClass, property } = Laya;
import { SoundManager } from '../utils/SoundManager';
import { ButtonAnimationUtils } from '../utils/ButtonAnimationUtils';

/**
 * 音效按钮脚本
 * 负责处理主菜单中的音效开关按钮
 */
@regClass()
export class SoundButton extends Laya.Script {
    
    @property(String)
    public soundOnImage: string = "resources/images/UI/sound.png";  // 音效开启时的图片
    
    @property(String)
    public soundOffImage: string = "resources/images/UI/sound_off.png";  // 音效关闭时的图片
    
    private soundManager: SoundManager;
    private button: Laya.Button;
    private image: Laya.Image;
    
    onAwake(): void {
        this.button = this.owner as Laya.Button;

        // 获取按钮内的图片组件
        if (this.button) {
            this.image = this.button.getChildByName('image') as Laya.Image;
            if (!this.image) {
                // 如果没有找到子节点，尝试直接使用按钮的图片
                this.image = this.button as any;
            }
        }

        // 绑定点击事件
        if (this.button) {
            this.button.on(Laya.Event.CLICK, this, this.onSoundButtonClick);
            // 添加按钮点击动画效果
            ButtonAnimationUtils.addButtonClickEffect(this.button);
        }

        console.log('SoundButton 初始化完成');
    }

    onStart(): void {
        // 在 onStart 中获取 SoundManager，确保它已经初始化
        this.soundManager = SoundManager.getInstance();

        if (this.soundManager) {
            // 初始化按钮状态
            this.updateButtonDisplay();
        } else {
            console.warn('SoundManager 未初始化');
        }
    }
    
    /**
     * 音效按钮点击事件
     */
    private onSoundButtonClick(): void {
        console.log('音效按钮被点击');

        if (!this.soundManager) {
            console.warn('SoundManager 未初始化');
            return;
        }

        // 切换音效状态
        this.soundManager.toggleSound();

        // 更新按钮显示
        this.updateButtonDisplay();

    }
    
    /**
     * 更新按钮显示
     */
    private updateButtonDisplay(): void {
        if (!this.soundManager) {
            console.warn('SoundManager 未初始化，无法更新按钮显示');
            return;
        }

        // 根据音量判断是否打开
        const isEnabled = this.soundManager.isSoundEnabled();

        if (this.image) {
            // 更新按钮图片
            const imagePath = isEnabled ? this.soundOnImage : this.soundOffImage;
            Laya.loader.load(imagePath, Laya.Handler.create(this, () => {
                const texture = Laya.loader.getRes(imagePath);
                if (texture && this.image) {
                    this.image.skin = imagePath;
                    console.log(`按钮图片已更新: ${imagePath}`);
                }
            }));
        }

       
        
    }
    
    onDisable(): void {
        if (this.button) {
            this.button.off(Laya.Event.CLICK, this, this.onSoundButtonClick);
            // 移除按钮点击动画效果
            ButtonAnimationUtils.removeButtonClickEffect(this.button);
        }
        console.log('SoundButton 已销毁');
    }
}


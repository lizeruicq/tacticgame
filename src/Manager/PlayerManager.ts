

const { regClass } = Laya;

@regClass()
export class PlayerManager extends Laya.Script {
    private static _instance: PlayerManager = null;

    // 玩家属性
    private playerMaxMana: number = 10;          // 玩家最大魔法值
    private playerMana: number = 10;             // 玩家当前魔法值
    private manaRegenRate: number = 1;           // 魔法值恢复速度（每秒）
    private manaRegenInterval: number = 2000;    // 魔法值恢复间隔（毫秒）

    // 玩家能量（Power）
    private playerPower: number = 0;             // 当前能量值（0-100）
    private readonly maxPlayerPower: number = 500; // 能量最大值

    // 游戏状态
    private gameEnded: boolean = false;

    onAwake(): void {
        PlayerManager._instance = this;
        this.initializePlayerAttributes();
        this.startManaRegeneration();
    }

    public static getInstance(): PlayerManager {
        return PlayerManager._instance;
    }

    /**
     * 初始化玩家属性
     */
    private initializePlayerAttributes(): void {
        // 初始化玩家魔法值
        this.playerMana = 10;
        this.playerMaxMana = 10;
        // console.log(`玩家初始魔法值: ${this.playerMana}/${this.playerMaxMana}`);
    }

    /**
     * 启动魔法值恢复系统
     */
    private startManaRegeneration(): void {
        // console.log("启动玩家魔法值恢复系统");

        // 使用定时器定期恢复魔法值
        Laya.timer.loop(this.manaRegenInterval, this, this.regenerateMana);
    }

    /**
     * 魔法值恢复
     */
    private regenerateMana(): void {
        if (this.gameEnded) {
            return; // 游戏结束后停止恢复
        }

        const oldMana = this.playerMana;
        this.playerMana = Math.min(this.playerMana + this.manaRegenRate, this.playerMaxMana);

        if (this.playerMana > oldMana) {
            // console.log(`玩家魔法值恢复: ${oldMana} -> ${this.playerMana}/${this.playerMaxMana}`);
        }
    }

    /**
     * 消耗玩家魔法值
     */
    public consumeMana(amount: number): boolean {
        if (this.gameEnded) {
            // console.log("游戏已结束，无法消耗魔法值");
            return false;
        }

        if (this.playerMana >= amount) {
            this.playerMana -= amount;
            // console.log(`消耗魔法值 ${amount}，剩余: ${this.playerMana}/${this.playerMaxMana}`);
            return true;
        } else {
            // console.log(`魔法值不足！需要: ${amount}，当前: ${this.playerMana}`);
            return false;
        }
    }

    /**
     * 获取玩家当前魔法值
     */
    public getPlayerMana(): number {
        return this.playerMana;
    }

    /**
     * 获取玩家最大魔法值
     */
    public getPlayerMaxMana(): number {
        return this.playerMaxMana;
    }
    /**
     * 增加玩家能量（Power）
     * @param amount 增加的能量值（与收到的伤害值相同）
     */
    public addPower(amount: number): void {
        if (amount <= 0) return;
        this.playerPower = Math.min(this.playerPower + amount, this.maxPlayerPower);
    }

    /**
     * 获取玩家当前能量值
     */
    public getPlayerPower(): number {
        return this.playerPower;
    }

    /**
     * 清空玩家能量值
     */
    public resetPower(): void {
        this.playerPower = 0;
    }

    /**
     * 设置游戏结束状态
     */
    public setGameEnded(ended: boolean): void {
        this.gameEnded = ended;

        if (this.gameEnded) {
            // 游戏结束时停止恢复
            Laya.timer.clear(this, this.regenerateMana);
        }
    }

    /**
     * 检查游戏是否结束
     */
    public isGameEnded(): boolean {
        return this.gameEnded;
    }

    /**
     * 计算关卡评分（星星数量）
     * 计算方法：
     * - 如果玩家失败：星星数量为0
     * - 如果玩家胜利，我方城堡血量小于30%：星星数量为1
     * - 如果玩家胜利，我方城堡血量为30%-70%之间：星星数量为2
     * - 如果玩家胜利，我方城堡血量>70%：星星数量为3
     *
     * @param isPlayerWin 玩家是否胜利
     * @param playerCastleHealthPercentage 玩家城堡血量百分比（0-1）
     * @returns 获得的星星数量（0-3）
     */
    public calculateLevelStars(isPlayerWin: boolean, playerCastleHealthPercentage: number): number {
        // 玩家失败，返回0星
        if (!isPlayerWin) {
            console.log("玩家失败，获得0星");
            return 0;
        }

        // 玩家胜利，根据城堡血量百分比计算星星数量
        if (playerCastleHealthPercentage > 0.7) {
            console.log(`玩家胜利，城堡血量 ${(playerCastleHealthPercentage * 100).toFixed(1)}% > 70%，获得3星`);
            return 3;
        } else if (playerCastleHealthPercentage >= 0.3) {
            console.log(`玩家胜利，城堡血量 ${(playerCastleHealthPercentage * 100).toFixed(1)}% 在 30%-70% 之间，获得2星`);
            return 2;
        } else {
            console.log(`玩家胜利，城堡血量 ${(playerCastleHealthPercentage * 100).toFixed(1)}% < 30%，获得1星`);
            return 1;
        }
    }

    /**
     * 脚本禁用时执行
     */
    onDisable(): void {
        // // console.log("PlayerManager 禁用");
        // 清理所有定时器
        Laya.timer.clearAll(this);

        // 清空单例引用
        PlayerManager._instance = null;
    }
}
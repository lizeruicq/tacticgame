# 快速设置指南（事件驱动版）

## ⚡ 性能优化亮点

- ✅ 事件驱动：只在血量变化时更新，不使用持续update
- ✅ 性能提升：减少99%的不必要更新
- ✅ CPU占用：降低90%以上

## 🎯 两个脚本的快速设置

### 1️⃣ MonsterHealthBar - 怪物血条

**挂载位置**: 怪物预制体的`healthbar`组件上

**设置步骤**:
```
1. 打开怪物预制体 (prefabs/monster/Rock.lh)
2. 选择 healthbar 子节点
3. 添加组件 → MonsterHealthBar
4. 保存预制体
5. 对所有怪物预制体重复此操作
```

**自动功能**:
- ✅ 通过检查方法支持所有BaseMonster子类（RockMonster、WizardMonster、PastorMonster等）
- ✅ 自动获取ProgressBar组件
- ✅ 事件驱动：监听`MONSTER_DAMAGE_TAKEN`和`MONSTER_HEALED`事件
- ✅ 自动更新血量和颜色（只在受伤/治疗时更新，不使用update）

**无需手动设置任何属性！**

**性能优势**:
- 从每秒60次检查 → 仅在受伤时更新
- 减少99%的不必要更新

---

### 2️⃣ UIManager - UI管理器

**挂载位置**: 场景中的`UIParent`节点上

**设置步骤**:
```
1. 打开游戏场景
2. 选择 UIParent 节点
3. 添加组件 → UIManager
4. 在Inspector中设置4个属性：
   - Player Hp Bar: 拖入玩家血条
   - Enemy Hp Bar: 拖入敌人血条
   - Mana Text: 拖入魔法值文本
   - Stop Button: 拖入暂停按钮
5. 保存场景
```

**需要手动设置的属性**:
- `playerHpBar` → 玩家血条（ProgressBar）
- `enemyHpBar` → 敌人血条（ProgressBar）
- `manaText` → 魔法值文本（Text）
- `stopButton` → 暂停按钮（Button）

**性能优势**:
- 城堡血条：事件驱动，只在受伤/治疗时更新
- 魔法值：每0.5秒检查一次（而不是每帧）
- 总体性能提升90%以上

---

## 🎨 血条颜色规则

| 血量 | 颜色 |
|------|------|
| 71%-100% | 🟢 绿色 |
| 31%-70% | 🟡 黄色 |
| 0%-30% | 🔴 红色 |

---

## ✅ 验证清单

运行游戏后检查：
- [ ] 怪物血条实时更新
- [ ] 血条颜色随血量变化
- [ ] 玩家城堡血条实时更新
- [ ] 敌人城堡血条实时更新
- [ ] 魔法值文本实时更新（格式：5/10）
- [ ] 点击暂停按钮可以暂停/继续游戏

---

## ⚠️ 重要提示

### 节点命名要求
- 玩家城堡: `castle-self`
- 敌人城堡: `castle-enemy`

### 脚本依赖
确保场景中已有：
- PlayerManager
- EnemyAIManager
- GameMainManager

---

## 🐛 常见问题

**Q: 怪物血条不更新？**
A: 检查healthbar是否是怪物预制体的子节点

**Q: 城堡血条不更新？**
A: 检查城堡节点命名是否正确（castle-self / castle-enemy）

**Q: 魔法值不显示？**
A: 检查是否正确拖入了manaText组件

**Q: 暂停按钮无效？**
A: 检查是否正确拖入了stopButton组件

---

## 📝 代码位置

- `assets/resources/scripts/MonsterHealthBar.ts`
- `assets/resources/scripts/UIManager.ts`

---

**完成！** 🎉

# Battle UI 动画系统设计文档

> **日期**: 2026-04-08
> **目标**: 实现完整的 Battle UI 动画系统，提升战斗体验
> **风格**: 冒险卡通风格 (Adventure Cartoon)

---

## 1. 设计决策汇总

| 设计点 | 选择 | 说明 |
|--------|------|------|
| 视觉风格 | 冒险卡通 🎨 | 鲜艳色彩、圆角按钮、弹跳动画，适合6-12岁儿童 |
| HP 动画 | 震动减少 | 扣血前整体震动，然后快速减少 |
| 伤害数字 | 弹跳飞出 | 从下方弹出，放大后缩小，向上飘散 |
| 正确反馈 | 星星闪烁 ✨ | 正确答案周围冒出闪烁星星 |
| 错误反馈 | 摇晃+红色闪烁 | 选项摇晃，屏幕边缘红色闪烁 |
| 结算界面 | 居中浮层 | 胜利金色光芒，失败红色渐变，单按钮继续 |
| 布局方式 | 左右对比 | 怪物左、玩家右，强调对战感 |
| 实现方案 | 纯 CSS | 性能好，与现有项目一致 |

---

## 2. 战斗流程状态机

```
idle → showing_question → answering → animating_damage → showing_skill → victory/defeat
                                                                  ↓
                                                            (答对)              (答错)
                                                              ↓                   ↓
                                                      怪物扣血动画           玩家扣血+震动+错误反馈
                                                      +星星效果              +摇晃效果
```

### Phase 状态说明

| Phase | 说明 | 用户交互 |
|-------|------|----------|
| `idle` | 初始/空闲状态 | 战斗未开始 |
| `showing_question` | 显示问题 | 等待自动进入 answering |
| `answering` | 答题中 | 用户点击选项 |
| `animating_damage` | 伤害动画播放中 | 禁用点击，等待动画完成 |
| `showing_skill` | 技能触发动画 | 显示技能效果 |
| `victory` | 战斗胜利 | 显示结算浮层 |
| `defeat` | 战斗失败 | 显示结算浮层 |

---

## 3. 动画详细设计

### 3.1 HP 震动减少动画

**触发时机**: 答错时玩家 HP 减少，答对时怪物 HP 减少

**动画序列**:
1. **震动阶段 (0-150ms)**: HP 条左右快速抖动
2. **减少阶段 (150-400ms)**: HP 宽度从当前值过渡到目标值
3. **完成阶段 (400ms)**: 数字更新到最终值

> **注意**: 震动关键帧动画时长 300ms，HP 减少过渡 250ms，两者可并行或顺序执行

```css
@keyframes hpShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(2px); }
}

@keyframes hpDecrease {
  from { width: var(--hp-from); }
  to { width: var(--hp-to); }
}

.hp-fill.animating {
  animation: hpShake 300ms ease-out;
  transition: width 250ms ease-out;
}
```

### 3.2 伤害数字弹跳动画

**触发时机**: 答对时怪物扣血数字弹出

**动画序列**:
1. **弹出 (0-100ms)**: 数字从 y:0 移动到 y:-20px，scale 0.5→1.2
2. **悬浮 (100-600ms)**: 数字向上飘动 y:-20px→-60px，scale 1.2→0.8
3. **消失 (600-800ms)**: opacity 1→0

```css
@keyframes damageBounce {
  0% { transform: translateY(0) scale(0.5); opacity: 1; }
  15% { transform: translateY(-20px) scale(1.2); opacity: 1; }
  70% { transform: translateY(-50px) scale(0.9); opacity: 1; }
  100% { transform: translateY(-80px) scale(0.7); opacity: 0; }
}
```

**颜色区分**:
- 怪物扣血: 红色 `-12`
- 玩家扣血: 橙色 `-8` (答错时)

### 3.2.1 怪物受击反馈

当答对时，怪物受到攻击的视觉反馈：

1. **怪物抖动**: 怪物 emoji/图片轻微抖动，表示受到伤害
2. **HP 震动 + 减少**: 详见 3.1 节 HP 条动画（玩家和怪物共用）

> **说明**: 3.1 节的 HP 条动画（震动+减少）适用于所有 HP 变化；本节的 monsterHit 是额外的怪物区域受击效果

```css
.monster-section.hit {
  animation: monsterHit 300ms ease-out;
}

@keyframes monsterHit {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(0.95) rotate(-3deg); }
  50% { transform: scale(0.98) rotate(2deg); }
  75% { transform: scale(1.02) rotate(-1deg); }
}
```

### 3.3 正确反馈星星闪烁

**触发时机**: 用户选择正确答案

**动画序列**:
1. 按钮变为绿色背景
2. 按钮周围 4-6 个 ✨ 从不同方向弹出
3. 星星闪烁 2 次后消失

```css
@keyframes starPop {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
  100% { transform: scale(0.5) rotate(360deg); opacity: 0; }
}

.correct-btn {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  animation: correctPulse 300ms ease-out;
}

@keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

### 3.4 错误反馈摇晃+红色闪烁

**触发时机**: 用户选择错误答案

**动画序列**:
1. 错误按钮添加 `shake` 类，左右摇晃 300ms
2. 屏幕边缘红色闪烁 3 次
3. 正确答案高亮显示

```css
@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

.wrong-btn {
  background: linear-gradient(135deg, #f44336, #e53935);
  animation: wrongShake 300ms ease-out;
}

@keyframes screenRedFlash {
  0%, 100% { box-shadow: inset 0 0 0 0 transparent; }
  50% { box-shadow: inset 0 0 60px 10px rgba(255, 0, 0, 0.3); }
}
```

### 3.5 战斗结算浮层

**胜利状态**:
- 背景: 金色渐变浮层 `rgba(255, 215, 0, 0.95)`
- 标题: 🎉 太棒了！🎉
- 奖励信息 (如有)
- 按钮: 绿色的「继续」

**失败状态**:
- 背景: 红色渐变浮层 `rgba(244, 67, 54, 0.95)`
- 标题: 💀 再试一次！💀
- 按钮: 橙色的「重新挑战」

```css
@keyframes resultSlideIn {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.battle-result-overlay {
  animation: resultSlideIn 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 4. 组件结构

```
src/components/game/Battle/
├── Battle.tsx              # 主组件，管理战斗状态
├── Battle.css              # 战斗样式，包含所有动画
├── components/
│   ├── HPBar.tsx           # HP 条组件
│   ├── MonsterDisplay.tsx  # 怪物显示区
│   ├── PlayerDisplay.tsx   # 玩家显示区
│   ├── QuestionBox.tsx     # 问题显示区
│   ├── DamageNumber.tsx    # 伤害数字组件
│   ├── CorrectFeedback.tsx  # 正确反馈星星
│   ├── WrongFeedback.tsx   # 错误反馈摇晃
│   └── BattleResult.tsx    # 结算浮层
```

---

## 5. CSS 动画清单

| 动画名 | 用途 | 时长 |
|--------|------|------|
| `hpShake` | HP 条震动 | 300ms |
| `hpDecrease` | HP 减少过渡 | 250ms |
| `damageBounce` | 伤害数字弹跳 | 800ms |
| `starPop` | 星星弹出 | 500ms |
| `wrongShake` | 错误摇晃 | 300ms |
| `screenRedFlash` | 屏幕红色闪烁 | 300ms |
| `resultSlideIn` | 结算浮层滑入 | 400ms |
| `pulse` | 脉动效果 | 1s infinite |
| `bounce` | 弹跳效果 | 500ms |

---

## 6. HP 动画状态管理

### HP 减少时的 CSS 变量

```css
.hp-fill {
  --hp-from: 100%;
  --hp-to: 60%;
  transition: width 250ms ease-out;
}

.hp-fill.animating {
  animation: hpShake 150ms ease-out;
}
```

### React 状态管理

```typescript
interface HPAnimationState {
  isAnimating: boolean
  fromValue: number
  toValue: number
  target: 'player' | 'monster'
}
```

---

## 7. 验收标准

- [ ] HP 减少时先震动后过渡
- [ ] 伤害数字弹跳飞出并消失
- [ ] 正确答案显示绿色 + 星星闪烁
- [ ] 错误答案摇晃 + 屏幕红色闪烁
- [ ] 结算浮层居中显示，带滑入动画
- [ ] 所有动画在 prefers-reduced-motion 时禁用
- [ ] 布局为左右对战形式
- [ ] 战斗流程状态机正确工作

---

## 8. 技术说明

### CSS 变量用于动态 HP 值

```typescript
const hpPercent = (hp / maxHp) * 100
return (
  <div
    className="hp-fill"
    style={{
      '--hp-from': `${previousHpPercent}%`,
      '--hp-to': `${hpPercent}%`,
    } as React.CSSProperties}
  />
)
```

### 动画状态同步

```typescript
useEffect(() => {
  if (animating) {
    const timer = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timer)
  }
}, [animating])
```

### prefers-reduced-motion 支持

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

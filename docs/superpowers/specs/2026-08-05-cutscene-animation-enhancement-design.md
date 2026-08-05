# 过场动画增强设计文档

> **日期**: 2026-08-05
> **来源**: Boss 需求「当前游戏的过场动画太过简单，需要结合不同的场景给出更贴合的动画效果」
> **分支**: `feature/cutscene-animation-enhancement`

---

## 1. 现状诊断

| # | 转场点 | 现状 |
|---|--------|------|
| 1 | title → world_map | 无动画，直接切换 |
| 2 | world_map → exploration | 无动画，直接切换 |
| 3 | 岛屿间航行 (sailing) | 有动画，但仅 minimal/cinematic 两种通用风格，未按大洋主题区分 |
| 4 | exploration → battle (遭遇/Boss 触发) | 无动画，直接切换 |
| 5 | battle → result | 无动画，直接切换 |
| 6 | result → 下一场景 | 无动画，直接切换 |

本设计覆盖 5 个子任务 (ANIM-01 ~ ANIM-05)，分别解决上述空白。

---

## 2. ANIM-01：大洋主题航行动画（5 种风格）

### 2.1 设计决策

`OceanSailingScene` 当前的 `style: 'minimal' | 'cinematic'` 二元区分保留不变（决定动画节奏/复杂度：普通岛屿 vs Boss 岛屿），新增维度 **`oceanTheme`** 用来决定视觉主题（背景渐变、天气特效、装饰元素）。两个维度正交组合，互不影响现有 `getAnimationStyle()` 契约和已有测试断言。

```typescript
export type OceanTheme = 'east' | 'west' | 'southHot' | 'northIce' | 'mysterious'

interface OceanSailingSceneProps {
  isActive: boolean
  style: 'minimal' | 'cinematic'   // 保持不变，向后兼容
  oceanTheme?: OceanTheme          // 新增，默认 'east'（向后兼容旧调用方）
  seed?: number
  onArrived: () => void
  isReducedMotion?: boolean
}
```

- `getAnimationStyle(areaId)` 导出函数签名/行为完全不变（继续给测试用）。
- 新增导出 `getOceanTheme(oceanId: string): OceanTheme`，做 5 值 union 的直通映射（防御性 fallback 到 `'east'`）。
- `ExplorationMap.tsx` 调用处新增 `oceanTheme={getOceanTheme(exploration.currentOcean)}` 传入。

### 2.2 五种主题视觉设计

| oceanTheme | 大洋 | 主题 | 背景渐变 | 天气/特效 | 装饰元素 |
|---|---|---|---|---|---|
| `east` | 东大洋 | 朝霞 (dawn) | `linear-gradient(180deg, #FFB88C 0%, #FF7E5F 45%, #4A90B8 100%)` | 3 只飞鸟剪影缓慢飘过 | 金色波光反射 |
| `west` | 西洋大洋 | 夕阳 (sunset) | `linear-gradient(180deg, #2C3E50 0%, #E74C3C 40%, #F39C12 100%)` | 大浪起伏（船体上下颠簸幅度更大） | 云层剪影 |
| `southHot` | 南热大洋 | 热带 (tropical) | `linear-gradient(180deg, #00C9A7 0%, #00A8CC 100%)` | 阳光光斑闪烁 + 椰子树剪影 | 热带鱼跃出水面 |
| `northIce` | 北冰大洋 | 冰雪 (ice-snow) | `linear-gradient(180deg, #B3E5FC 0%, #81D4FA 50%, #E1F5FE 100%)` | 飘雪粒子（复用 seeded random 生成雪花位置，10 片） | 浮冰剪影 |
| `mysterious` | 神秘大洋 | 迷雾 (fog) | `linear-gradient(180deg, #2C2C54 0%, #474787 50%, #1B1B2F 100%)` | 半透明雾层叠加动画（`fogDrift` keyframe，透明度/位移循环） | 若隐若现的神秘符文光点 |

- 保留原有 `minimal-scene` / `cinematic-scene` 的时长（4s，测试硬编码）与整体结构（帆船、状态文字、电影黑边等）；主题差异仅体现在**背景层 + 天气特效层 + 装饰元素层**这三块新增/替换内容，不改变现有 DOM 结构中被测试断言到的部分（`.ocean-sailing-scene`、`⛵`、`linear-gradient`、`.minimal-scene`）。
- 雪花/雾气等生成逻辑复用 `SeededRandom`，与现有 `generateStars` 模式一致，保证同 seed 可复现（沿用现有可复现性测试模式）。
- `isReducedMotion=true` 时，所有新增天气特效直接跳过渲染或使用静态终态（不新增 keyframe 动画）。

---

## 3. ANIM-02：Boss 专属动画增强

### 3.1 设计决策

在 `cinematic` 风格基础上，按 `bossMonsterId` 进一步定制「危险氛围」：替换/叠加背景与特效元素，仍然保留电影黑边、星空可选、状态文字等公共结构。

```typescript
export type BossTheme = 'jellyfish_king' | 'sea_serpent_king' | 'lava_dragon_king' | 'arctic_whale_king' | 'kraken_prime'

// 新增可选 prop
bossId?: string  // 传入 area.monsterId，仅在 style==='cinematic' 时生效
```

### 3.2 五种 Boss 危险氛围

| bossId | Boss | 大洋 | 危险氛围 | 视觉设计 |
|---|---|---|---|---|
| `jellyfish_king` | 水母国王 | east | 荧光水母群 | 背景叠加多个半透明发光水母剪影上浮，配合柔和青色光晕脉冲 |
| `sea_serpent_king` | 海蛇王 | west | 漩涡风暴 | 画面中心偏下方旋转漩涡（CSS `conic-gradient` + `rotate` 动画），船只轻微被"吸引"晃动 |
| `lava_dragon_king` | 熔岩巨龙 | southHot | 火山熔岩 | 背景改为暗红/橙黑熔岩渐变，底部熔岩裂纹发光线条，偶发火星粒子上升 |
| `arctic_whale_king` | 北极巨鲸 | northIce | 极光风暴 | 背景叠加极光飘动色带（多层半透明渐变横向波动），冰晶飘落加密 |
| `kraken_prime` | 深海巨妖 | mysterious | 深渊触手 | 画面边缘伸入若隐若现的触手剪影（`clip-path` 遮罩 + 缓慢伸缩动画），整体色调更暗 |

- 若 `bossId` 未提供或不在映射表中，回退到现有通用 `cinematic` 效果（保证向后兼容 & 测试不受影响，因为现有测试对 `cinematic` 的调用不传 `bossId`）。
- `isReducedMotion=true` 时禁用漩涡旋转、触手伸缩等强动效，仅保留静态氛围色。

---

## 4. ANIM-03：PhaseTransition 转场组件

### 4.1 组件设计

新建 `src/components/game/PhaseTransition.tsx`：

```typescript
type TransitionKind = 'fade-scale' | 'shake-vignette' | 'victory-burst' | 'defeat-fade' | 'none'

interface PhaseTransitionProps {
  transitionKey: string          // 每次切换传入不同值触发动画（如 gamePhase 字符串）
  kind: TransitionKind
  isReducedMotion?: boolean
  children: React.ReactNode
}
```

- 组件用 CSS 动画包裹 `children`，动画时长统一 ≤ 1s（满足验收标准），通过 `key={transitionKey}` 强制重新挂载触发动画重播。
- `isReducedMotion=true` 时所有 kind 退化为 `none`（无动画，立即显示）。

### 4.2 接入 `Game.tsx`

| 切换 | kind | 效果 |
|---|---|---|
| title → world_map | `fade-scale` | 淡入 + 从 0.95 缩放到 1 |
| world_map → exploration | `fade-scale` | 同上，复用 |
| exploration → battle | `shake-vignette` | 进入战斗瞬间短暂屏幕震动 + 边缘暗角淡入 |
| battle → result（胜利） | `victory-burst` | 短暂高光闪烁后淡入 |
| battle → result（失败） | `defeat-fade` | 短暂变暗后淡入 |
| result → 下一场景 | `fade-scale` | 复用 |

`Game.tsx` 结构调整为在 `switch` 外层包一层 `<PhaseTransition transitionKey={gamePhase + resultVariant} kind={...}>`，`kind` 由一个基于 `gamePhase` 及（当 `gamePhase==='result'` 时）`battle.phase==='victory'` 计算得出的小函数决定。`isReducedMotion` 来自 `useAccessibility()`。

---

## 5. ANIM-04：Boss 登场动画序列

### 5.1 设计决策

新建序列组件 `src/components/game/BossEntrance.tsx`，在 `ExplorationMap.tsx` 检测到 `area.type === 'boss'` 且即将 dispatch `START_BATTLE` 之前插入：

序列阶段（纯 CSS，总时长 ~1.8s，可通过 `isReducedMotion` 缩短为一次性淡入 0.3s）：

1. **silhouette**（0–600ms）：屏幕变暗，Boss sprite 以纯黑剪影形式居中淡入并放大。
2. **zoom-in**（600–1100ms）：剪影转为真实 sprite（去掉 `filter: brightness(0)`），继续放大到最终尺寸，伴随轻微镜头震动。
3. **name-reveal**（1100–1600ms）：Boss 名称文字从下方滑入 + 淡入，叠加显示在 sprite 下方。
4. **battle-start**（1600–1800ms）：整体淡出，随后触发原有 `START_BATTLE` dispatch。

```typescript
interface BossEntranceProps {
  isActive: boolean
  bossName: string
  bossSprite: string
  isReducedMotion?: boolean
  onComplete: () => void
}
```

`ExplorationMap.tsx` 中现有「战斗阶段 - 触发实际战斗」`useEffect`：当 `area.type === 'boss'` 时，先渲染 `<BossEntrance>` 并将原来直接调用的 `dispatch({ type: 'START_BATTLE', ... })` 移到 `onComplete` 回调里；非 boss 区域保持原有直接触发逻辑不变。

---

## 6. ANIM-05：结果转场特效

### 6.1 设计决策

增强 `src/components/game/Result.tsx`：

- **胜利**：新增粒子层——烟花/金币雨。采用固定数量（如 20 个）的 seeded-random 生成的粒子（复用 `SeededRandom`，seed 可用 `battle.monster.id` 的字符哈希），CSS 动画从顶部落下 / 从中心炸开，纯 CSS `@keyframes`，无第三方库。
- **失败**：整体应用 `filter: grayscale(0.7)` 渐变过渡 + 更柔和的鼓励文案渐入（新增一行如"没关系，再试一次一定可以战胜他！"）。
- `isReducedMotion=true` 时：胜利不渲染粒子层（仅保留原有文字+背景色变化），失败仅应用灰度无过渡动画。

---

## 7. 无障碍与验收对齐

- 所有新增动画均通过 `useAccessibility().isReducedMotion` 或显式 prop 透传实现降级，降级后动画时长为 0 或直接终态展示。
- `PhaseTransition` 动画时长硬编码 ≤ 1s，满足「转场流畅、≤1秒」验收标准。
- 现有 `OceanSailingScene` 4s 时长与测试断言不变，只做背景层扩展，不影响 `tests/components/OceanSailingScene.test.tsx` 现有断言。

---

## 8. 风险与兼容性

- `OceanSailingScene.tsx` 现存 3 处 `console.log('[DEBUG ...')`（`useEffect` 内），本次实现顺带清理，不属于新功能但避免噪音日志进入新分支。
- 新分支 `feature/cutscene-animation-enhancement` 从最新 `main`（579b5c6）切出，不包含 `feature/ui-questionbank-optimization` 的题库变更 —— 仅涉及本设计范围内文件，无交叉冲突风险。

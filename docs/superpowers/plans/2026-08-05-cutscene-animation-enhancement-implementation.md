# 过场动画增强实现计划

> **日期**: 2026-08-05
> **对应设计文档**: `docs/superpowers/specs/2026-08-05-cutscene-animation-enhancement-design.md`
> **分支**: `feature/cutscene-animation-enhancement`（从 `main` 切出）
> **执行方式**: SDD（每个 ANIM 任务视为一个可独立验证的子任务，完成后各自提交一次）

---

## 任务列表

### ANIM-01：大洋主题航行动画（5 种风格）
**文件**: `src/components/game/OceanSailingScene.tsx`, `src/components/game/ExplorationMap.tsx`, `tests/components/OceanSailingScene.test.tsx`

1. 在 `OceanSailingScene.tsx` 新增 `OceanTheme` 类型与 `getOceanTheme(oceanId)` 导出函数（含 fallback 到 `'east'`）。
2. 新增 `oceanTheme?: OceanTheme` prop（默认 `'east'`），向 `renderMinimalStyle` / `renderCinematicStyle` 传递。
3. 为 5 个主题分别实现背景渐变 + 天气特效 + 装饰元素（按设计文档表格 2.2），封装为每主题一个小型渲染辅助（如 `renderThemeBackdrop(theme, isReducedMotion)`），避免大 switch 塞进现有函数体内难以维护。
4. 雪花/雾气等特效使用 `SeededRandom`，与 `generateStars` 一致的模式实现确定性。
5. 顺手清理 3 处遗留 `console.log('[DEBUG OceanSailingScene] ...')`。
6. `ExplorationMap.tsx`：调用处新增 `oceanTheme={getOceanTheme(exploration.currentOcean || 'east')}` 传入，并将本地重复定义的 `getAnimationStyle` 保持不变（不影响其逻辑）。
7. 新增测试：5 个主题分别渲染时背景渐变/装饰元素存在性断言（可用 `container.innerHTML` 关键字判断，例如渐变色值或特效 class 名）；`isReducedMotion` 场景不渲染动效粒子层的断言。
8. 验证：`npx tsc --noEmit` 无新增错误；运行 `OceanSailingScene.test.tsx` 全绿（不修改现有既有断言，只新增）。
9. **提交**: `feat(anim): 实现5种大洋主题航行动画 (ANIM-01)`

### ANIM-02：Boss 专属动画增强
**文件**: `src/components/game/OceanSailingScene.tsx`, `src/components/game/ExplorationMap.tsx`

1. 新增 `bossId?: string` prop，仅在 `style === 'cinematic'` 时生效。
2. 实现 5 个 Boss 危险氛围渲染辅助函数（按设计文档表格 3.2），无匹配时 fallback 到通用 cinematic 效果。
3. `ExplorationMap.tsx` 调用处新增 `bossId={getAreaById(pendingAreaId || '')?.monsterId}` 传入。
4. `isReducedMotion` 时禁用旋转/伸缩等强动效。
5. 新增测试：5 个 bossId 分别渲染时特效标识存在性断言；未知/缺失 bossId 时 fallback 到通用效果的断言。
6. 验证：`npx tsc --noEmit`、相关测试全绿。
7. **提交**: `feat(anim): 实现Boss专属危险氛围动画 (ANIM-02)`

### ANIM-03：PhaseTransition 转场组件
**文件（新建）**: `src/components/game/PhaseTransition.tsx`；**文件（修改）**: `src/components/game/Game.tsx`；**测试（新建）**: `tests/components/PhaseTransition.test.tsx`

1. 实现 `PhaseTransition` 组件（见设计文档 4.1），5 种 `kind` + `none`，全部 CSS keyframe，时长 ≤ 1s。
2. `isReducedMotion` 时所有 kind 退化为 `none`。
3. `Game.tsx` 引入 `useAccessibility()` 获取 `isReducedMotion`；新增辅助函数 `getTransitionKind(gamePhase, battle)` 计算当前应使用的 `kind`（battle→result 需要区分 victory/defeat）。
4. 用 `<PhaseTransition transitionKey={...} kind={...} isReducedMotion={...}>` 包裹原有 `switch` 渲染结果。
5. 编写测试：验证每种 `gamePhase` 组合映射到期望的 `kind`；验证 `isReducedMotion=true` 时不产生动画 class。
6. 验证：`npx tsc --noEmit`、新测试 + 现有 `Game` 相关测试（如有）全绿。
7. **提交**: `feat(anim): 新增PhaseTransition转场组件并接入Game.tsx (ANIM-03)`

### ANIM-04：Boss 登场动画序列
**文件（新建）**: `src/components/game/BossEntrance.tsx`；**文件（修改）**: `src/components/game/ExplorationMap.tsx`；**测试（新建）**: `tests/components/BossEntrance.test.tsx`

1. 实现 `BossEntrance` 组件的 4 阶段序列（silhouette → zoom-in → name-reveal → battle-start），用 `setTimeout` 链或单一 CSS animation + `onAnimationEnd` 驱动阶段切换，最终调用 `onComplete`。
2. `isReducedMotion=true` 时退化为一次性淡入 0.3s 后直接调用 `onComplete`。
3. `ExplorationMap.tsx`：在「战斗阶段 - 触发实际战斗」`useEffect` 中，当 `area.type === 'boss'` 时先渲染 `<BossEntrance>`（不立即 dispatch），将原来的 `dispatch({ type: 'START_BATTLE', ... })` 移入 `onComplete`；非 boss 区域逻辑保持不变。
4. 使用 `vi.useFakeTimers()` 编写测试：验证阶段序列按时间推进；验证 `onComplete` 最终被调用；验证 `isReducedMotion` 缩短路径。
5. 验证：`npx tsc --noEmit`、新测试 + 现有 `ExplorationMap` 相关测试全绿（需重点确认未破坏现有 battle 触发逻辑与测试）。
6. **提交**: `feat(anim): 新增Boss登场动画序列 (ANIM-04)`

### ANIM-05：结果转场特效
**文件**: `src/components/game/Result.tsx`；**测试（新建或扩展）**: `tests/components/Result.test.tsx`

1. 胜利分支：新增粒子层（seeded-random 生成的 20 个粒子，纯 CSS 动画，无第三方库）。
2. 失败分支：新增灰度渐变 + 鼓励文案。
3. 引入 `useAccessibility()`，`isReducedMotion=true` 时胜利不渲染粒子层，失败无过渡动画。
4. 编写/扩展测试：验证胜利时粒子层元素存在、失败时灰度 class 存在；验证 reduced-motion 降级。
5. 验证：`npx tsc --noEmit`、`Result` 测试全绿。
6. **提交**: `feat(anim): 增强Result结果页胜利/失败特效 (ANIM-05)`

---

## 收尾验证（全部任务完成后）

1. `npx tsc --noEmit` — 全项目零错误。
2. `npm test -- --run` — 全部测试通过。
3. 手动检查：切换 `prefers-reduced-motion` 模拟，确认所有新增动画均正确降级。
4. `git push` 分支，发布 Multica 回复评论汇总本次交付内容。

---

## 明确不做的事（YAGNI）

- 不引入第三方动画库（如 framer-motion、gsap）——现有代码库全部使用手写 CSS keyframe，保持一致性与零新增依赖。
- 不重构现有 `getAnimationStyle`（本地 `ExplorationMap.tsx` 版本 与 导出版本）的重复定义问题——超出本次任务范围，不在验收标准内。
- 不为多人对战场景做额外过渡定制——当前 WBS 未要求，按现有单/双人共用逻辑处理即可。

# 航行动画 v2 设计文档

> **日期**: 2026-04-07
> **目标**: 优化探索岛屿过场动画，根据岛屿类型展示不同风格

---

## 1. 概述

### 设计决策
- **Boss 岛屿**: 电影感风格 (cinematic) - 夜间星空 + 月光 + 电影黑边
- **普通岛屿**: 极简快速风格 (minimal) - 快速淡入淡出，0.8秒完成

### 动画流程
1. 玩家点击岛屿 → 显示确认对话框
2. 确认后 → 进入 sailing 状态 → 根据岛屿类型选择动画风格
3. 航行动画播放 → 到达岛屿
4. 进入 arrived 状态 → 准备进入战斗

---

## 2. 视觉设计

### 2.1 极简快速风格 (minimal) - 普通岛屿

**时长**: 0.8 秒

**元素**:
- 渐变背景: `linear-gradient(180deg, #87CEEB 0%, #4A90B8 100%)`
- 帆船 ⛵: 左侧起始，右侧终点
- 目标岛屿: 右侧，棕色椭圆岛屿剪影
- 过渡: 淡入淡出

**动画**:
```css
@keyframes minimalSail {
  0% { opacity: 0; transform: translateX(-20px); }
  20% { opacity: 1; }
  100% { opacity: 1; transform: translateX(calc(100vw - 100px)); }
}
/* 总时长: 800ms */
/* animation-fill-mode: forwards 确保最终状态保持 */
```

---

### 2.2 电影感风格 (cinematic) - Boss 岛屿

**时长**: 4 秒

**元素**:
- **背景**: 深蓝渐变 `#1a1a2e` → `#16213e` → `#0f3460`
- **星空**: 8-12颗随机星星，使用 seeded random 保证可复现
- **月光**: 右上角径向渐变圆形，#f5f5f5 → #c0c0c0
- **岛屿剪影**: 右侧，黑色椭圆 + 树木剪影
- **帆船**: 左下角，带发光效果
- **电影黑边**: 上下 8px 黑色边框

**星空生成算法**:
```typescript
interface Star {
  x: number      // 百分比位置 (0-100)
  y: number      // 百分比位置 (0-50)
  size: number   // 2-3px
  twinkleDelay: number  // 闪烁延迟 (0-2000ms)，确定性随机
}

function generateStars(seed: number): Star[] {
  // 使用 seeded random 确保同一 seed 生成相同星空
  // 星星数量: 固定 10 颗 (确定性)
  // 位置: 画布上半部分 (y < 60%)
  // twinkleDelay 使用 seeded random 生成
}
```

**prefers-reduced-motion 处理**:
- **minimal**: 直接跳到最终位置
- **cinematic**: 静态显示（无帆船动画），星星不闪烁，月光保持

**动画**:
```css
@keyframes cinematicSail {
  0% { left: 5%; bottom: 30%; opacity: 0; }
  10% { opacity: 0.3; }
  20% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 75%; bottom: 35%; opacity: 0; }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

---

## 3. 组件设计

### 3.1 OceanSailingScene Props 扩展

```typescript
interface OceanSailingSceneProps {
  isActive: boolean
  onArrived: () => void
  isReducedMotion?: boolean
  // 新增:
  style: 'minimal' | 'cinematic'  // 动画风格
  seed?: number  // 用于星空生成的种子，默认使用 Date.now()
}
```

**注意**: 移除了未使用的 `startPosition` 和 `endPosition`，因为动画使用全屏覆盖方式。

### 3.2 ExplorationMap 集成

```typescript
// Seed 生成函数 - 基于 areaId 生成确定性 seed
function generateSailingSeed(areaId: string): number {
  // 使用简单的 hash 算法将 string 转为 number
  let hash = 0
  for (let i = 0; i < areaId.length; i++) {
    const char = areaId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash  // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// 选择岛屿时确定动画风格
const getAnimationStyle = (areaId: string): 'minimal' | 'cinematic' => {
  const area = getAreaById(areaId)
  if (area?.type === 'boss') return 'cinematic'
  return 'minimal'
}

// 使用
<OceanSailingScene
  isActive={isSailing}
  style={getAnimationStyle(pendingAreaId)}
  seed={generateSailingSeed(pendingAreaId)}
  onArrived={handleSailingArrived}
/>
```

---

## 4. 实现任务

### Task 1: 重构 OceanSailingScene
- 移除未使用的 `startPosition`/`endPosition` props
- 添加 `style` 和 `seed` props
- 根据 `style` 渲染不同视觉元素:
  - **minimal**: 简洁渐变背景 + 帆船 + 岛屿剪影
  - **cinematic**: 夜间星空 + 月光 + 电影黑边 + 岛屿剪影
- 实现 `generateStars(seed)` 函数 (确定性 10 颗星星)
- 实现 `generateSailingSeed(areaId)` 函数

### Task 2: ExplorationMap 集成
- 根据岛屿类型选择动画风格
- 传递 seed 给 OceanSailingScene

### Task 3: prefers-reduced-motion 支持
- minimal: 跳过动画，直接显示结果
- cinematic: 静态显示，禁用星星闪烁

### Task 4: 测试
- 验证 minimal 风格 0.8 秒完成
- 验证 cinematic 风格星空可复现 (同一 areaId 生成相同星空)
- 验证 Boss 岛屿使用 cinematic，普通岛屿使用 minimal

---

## 5. 验收标准

- [ ] 普通岛屿使用 minimal 风格，0.8 秒完成过渡
- [ ] Boss 岛屿使用 cinematic 风格，4 秒航行动画
- [ ] 星空使用 seeded random，同一 areaId 每次生成相同星空（10颗）
- [ ] prefers-reduced-motion 正确处理
- [ ] 动画流畅 (60fps)
- [ ] 移除未使用的 startPosition/endPosition props

---

## 6. 技术说明

### Seed 生成
```typescript
function generateSailingSeed(areaId: string): number {
  // 基于 areaId 生成确定性 seed
  // 保证同一岛屿每次进入生成相同星空
}
```

### 性能优化
- 使用 `transform` 和 `opacity` 动画 (GPU 加速)
- 星星使用 CSS `box-shadow` 而非多个 DOM 节点
- cinematic 模式下星空使用 `will-change: opacity`

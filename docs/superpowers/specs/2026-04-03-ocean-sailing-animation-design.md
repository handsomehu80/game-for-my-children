# 海洋航行动画设计文档

> **Part 1: 海洋场景 + 船只航行 + 登岛动画**

---

## 1. 概述

### 目标
在玩家选择岛屿后，显示船只沿路径点航行的动画效果，营造大航海时代的沉浸感。

### 动画流程
1. 玩家点击岛屿 → 显示确认对话框
2. 确认后 → 进入 sailing 状态 → 显示船只航行动画
3. 船只沿预设路径点移动 → 到达岛屿
4. 到达后 → 进入 arrived 状态 → 准备进入战斗

---

## 2. 视觉设计

### 2.1 海洋背景
- **渐变天空**: #87CEEB (天蓝) → #1E3A5F (深海蓝)
- **海洋层**: 底部 60% 为海洋，使用深蓝色渐变
- **波浪效果**: CSS animation 横向移动的波浪纹理

### 2.2 船只设计
- **emoji**: ⛵ (帆船)
- **尺寸**: 56px (比岛屿略小)
- **动画**:
  - 上下浮动 (sailRock): 模拟波浪上的船
  - 横向移动 (sailToIsland): 沿路径点移动
- **阴影**: drop-shadow 营造立体感

### 2.3 岛屿设计
- **形状**: 椭圆形岛屿主体 + 圆锥形树木
- **颜色**:
  - 陆地: #8B4513 (棕色) → #654321 (深棕)
  - 树木: #228B22 (绿色)
  - 沙滩: #F4D03F (浅黄) 点缀
- **尺寸**: 80x70px

### 2.4 路径点
- **形状**: 圆形虚线
- **颜色**: rgba(255,255,255,0.2)
- **数量**: 2-3 个路径点

### 2.5 其他装饰
- **云朵**: ☁️ emoji，随风轻微飘动
- **太阳**: 右上角，径向渐变圆形 + 发光效果

---

## 3. 动画规格

### 3.1 航行动画 (sailing)
```css
/* 船只横向移动 */
@keyframes sailToIsland {
  0% { left: 25%; bottom: 100px; }
  50% { left: 50%; bottom: 115px; }  /* 中途波浪效果 */
  100% { left: 70%; bottom: 100px; }
}
/* 航行时间: 3秒 */
/* 缓动: ease-in-out */
```

### 3.2 船只晃动 (idle)
```css
@keyframes shipRock {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}
/* 持续: 2秒，循环 */
```

### 3.3 波浪动画
```css
@keyframes waveSlide {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
/* 持续: 3秒，线性循环 */
```

---

## 4. 状态机设计

### 4.1 新增探索状态

```typescript
type ExplorationPhase =
  | 'exploring'        // 选择目的地
  | 'sailing'          // 航行中 (新增)
  | 'arrived'          // 已到达 (新增)
  | 'moving'           // 移动动画 (保留)
  | 'encounter'        // 遭遇判定
  | 'battle'           // 战斗中
  | ...
```

### 4.2 状态转换

```
exploring --[selectArea]--> sailing --[动画完成]--> arrived --[准备]--> moving --[moveComplete]--> encounter
```

### 4.3 动作

```typescript
type ExplorationAction =
  | { type: 'START_SAILING'; targetAreaId: string }
  | { type: 'SAILING_COMPLETE' }
  | { type: 'ARRIVED' }
  // ... existing actions
```

---

## 5. 组件结构

### 5.1 OceanSailingScene (新组件)
- 全屏海洋背景
- 包含船只、岛屿、路径点、云朵、太阳
- 接收 `isActive`, `targetPosition` props
- 航行完成后触发 `onArrived` callback

### 5.2 修改 ExplorationMap
- 添加 sailing 和 arrived 状态的 UI
- 使用 OceanSailingScene 替代静态岛屿显示
- 航行期间禁用其他交互

---

## 6. 实现任务

### Task 1.1: 状态机扩展
- 添加 `sailing` 和 `arrived` 状态
- 添加相关 action handlers

### Task 1.2: OceanSailingScene 组件
- 海洋背景 + 波浪动画
- 船只 + 晃动动画
- 岛屿渲染
- 路径点显示
- 航行动画

### Task 1.3: ExplorationMap 集成
- 状态触发显示 OceanSailingScene
- 航行完成回调处理

### Task 1.4: 测试
- 单元测试验证状态转换
- 集成测试验证动画流程

---

## 7. 验收标准

- [ ] 点击岛屿后显示海洋场景
- [ ] 船只沿路径点移动到岛屿
- [ ] 航行动画流畅 (60fps)
- [ ] 到达后正确触发下一状态
- [ ] prefers-reduced-motion 正确处理
- [ ] 测试通过

---

## 8. 技术说明

### CSS Animation 性能
- 使用 `transform` 和 `opacity` 动画 (GPU 加速)
- 避免动画 `width`, `height`, `top`, `left`
- `will-change` 提示浏览器优化

### reduced-motion 支持
```css
@media (prefers-reduced-motion: reduce) {
  .sailing-animation { animation: none; }
  /* 直接跳到最终位置 */
}
```

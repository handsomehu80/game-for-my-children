# P2 优化设计文档

> **目标：** 实现 P2-1（SVG性能）、P2-3（儿童确认面板）、P2-4（隐藏岛屿提示）

---

## 1. 设计系统

### 1.1 视觉风格：Claymorphism

**适用原因：** 圆润、柔软、玩具感强，适合儿童用户

| 属性 | 值 |
|------|-----|
| 圆角半径 | 16-24px |
| 边框宽度 | 3-4px |
| 阴影 | 双重阴影（外深内浅） |
| 按压反馈 | 200ms ease-out 缩放 0.95 |

### 1.2 色彩方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | #2563EB | 学习蓝 |
| 次色 | #3B82F6 | 海洋蓝 |
| CTA | #F97316 | 冒险橙 |
| 背景 | #F8FAFC | 浅灰白 |
| 文字 | #1E293B | 深灰 |
| 成功 | #22C55E | 绿色 |
| 危险 | #EF4444 | 红色 |
| 隐藏岛屿 | #6366F1 | 靛蓝紫 |

### 1.3 字体方案

| 用途 | 字体 | 说明 |
|------|------|------|
| 标题 | Baloo 2 | 圆润童趣 |
| 正文 | Comic Neue | 易读友好 |

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Comic+Neue:wght@400;700&display=swap');
```

### 1.4 无障碍设计

- **图案/纹理区分：** 除颜色外，每个岛屿类型添加独特 SVG 图标
  - 普通岛屿：圆形
  - Boss 岛屿：三角形
  - 隐藏岛屿：星星
  - 宝箱岛屿：方形+锁
- **高对比度模式：** 存储在 localStorage，支持开关切换
- **prefers-reduced-motion：** 动画遵循系统设置
- **aria-label：** 所有按钮标注
- **对比度：** ≥ 4.5:1

---

## 2. P2-3: 儿童确认面板

### 2.1 保护级别：中等

| 操作类型 | 保护级别 |
|----------|----------|
| 危险操作（退出游戏、删除进度） | 双重确认 |
| 关键操作（进入 Boss 岛） | 确认面板 |
| 普通操作（移动、探索） | 直接执行 |

### 2.2 组件规格

**确认面板：**
- 圆角：24px（Claymorphism）
- 内边距：32px
- 标题：Baloo 2, 24px, 居中
- 描述：Comic Neue, 16px, #64748b
- 按钮最小尺寸：宽 120px × 高 56px（触摸目标 ≥ 44px）
- 按钮字体：Baloo 2, 18px, 600

**危险操作确认（双重确认）：**
- 额外虚线边框提示框（3px dashed #ef4444）
- 重复文字：「确定退出游戏？确定吗？」

### 2.3 按钮样式

**普通按钮：**
```css
background: linear-gradient(135deg, #22c55e, #16a34a);
border-radius: 16px;
padding: 16px 32px;
box-shadow: 4px 4px 8px rgba(0,0,0,0.2);
```

**取消按钮：**
```css
background: linear-gradient(135deg, #94a3b8, #64748b);
```

**危险按钮：**
```css
background: linear-gradient(135deg, #ef4444, #dc2626);
```

### 2.4 交互反馈

| 状态 | 效果 |
|------|------|
| Default | 正常显示 |
| Hover | 亮度提升 10% |
| Press | scale(0.95), 200ms |
| Disabled | opacity: 0.5, cursor: not-allowed |

---

## 3. P2-4: 隐藏岛屿可见性提示

### 3.1 提示强度：微弱发光

**效果实现：**
```css
/* 基础态 */
box-shadow: 0 0 15px rgba(99, 102, 241, 0.3),
            6px 6px 12px rgba(0,0,0,0.3);

/* 动画态（2s alternate infinite） */
box-shadow: 0 0 25px rgba(99, 102, 241, 0.5),
            6px 6px 12px rgba(0,0,0,0.3);
```

**动画参数：**
- 时长：2s
- 缓动：ease-in-out
- 循环：infinite
- 变化：发光强度 0.3 ↔ 0.5

### 3.2 reduced-motion 支持

```css
@media (prefers-reduced-motion: reduce) {
  /* 禁用动画，只保留静态微弱发光 */
  animation: none;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.35);
}
```

---

## 4. P2-1: SVG 性能优化

### 4.1 SVG Sprite 系统

**实现方式：** 内联 SVG Symbol sprite

```html
<svg style="display: none;">
  <symbol id="island-normal" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" fill="currentColor"/>
  </symbol>
  <symbol id="island-boss" viewBox="0 0 24 24">
    <polygon points="12,2 22,22 2,22" fill="currentColor"/>
  </symbol>
  <symbol id="island-hidden" viewBox="0 0 24 24">
    <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" fill="currentColor"/>
  </symbol>
</svg>
```

**使用方式：**
```jsx
<svg><use href="#island-normal" /></svg>
```

### 4.2 CSS Containment

```css
.island-node {
  contain: layout style paint;
}
```

### 4.3 岛屿类型图案映射

| 类型 | 颜色 | SVG 图标 | 纹理 |
|------|------|----------|------|
| normal | #22C55E | 圆形 | 实心圆点 |
| boss | #EF4444 | 三角形 | 火焰纹理 |
| hidden | #6366F1 | 星星 | 闪光粒子 |
| treasure | #EAB308 | 方形+锁 | 闪光 |

---

## 5. 高对比度模式

### 5.1 存储

```typescript
// localStorage key: 'game_accessibility'
interface AccessibilitySettings {
  highContrast: boolean
}
```

### 5.2 高对比度配色

| 用途 | 普通模式 | 高对比度 |
|------|----------|----------|
| 岛屿A | #6366F1 | #FF0000（红）+ 白色边框 |
| 岛屿B | #22C55E | #00FF00（绿）+ 白色边框 |
| 岛屿C | #EAB308 | #FFFF00（黄）+ 黑色边框 |
| 文字 | #1E293B | #000000 |

### 5.3 图案增强

高对比度模式下，岛屿图标添加额外轮廓线：
```css
/* 高对比度图标 */
.icon-high-contrast {
  filter: drop-shadow(0 0 2px white) drop-shadow(0 0 2px white);
}
```

---

## 6. 组件清单

| 组件 | 文件位置 | 说明 |
|------|----------|------|
| IslandButton | components/game/IslandButton.tsx | 岛屿按钮（Claymorphism + 图案） |
| ConfirmDialog | components/game/ConfirmDialog.tsx | 确认对话框 |
| DangerConfirmDialog | components/game/DangerConfirmDialog.tsx | 双重确认危险操作 |
| AccessibilityToggle | components/game/AccessibilityToggle.tsx | 无障碍模式开关 |
| SVGSprite | assets/sprites/islands.svg | 岛屿 SVG sprite |

---

## 7. 实现优先级

1. **P2-3 儿童确认面板** - 最直接影响用户体验
2. **P2-4 隐藏岛屿提示** - 视觉效果，容易实现
3. **P2-1 SVG 性能优化** - 技术改进
4. **高对比度模式** - 无障碍支持

---

## 8. 测试检查点

- [ ] 确认面板按钮触摸目标 ≥ 44px
- [ ] 危险操作双重确认流程正确
- [ ] 隐藏岛屿发光动画流畅（60fps）
- [ ] prefers-reduced-motion 正确禁用动画
- [ ] 高对比度模式切换后立即生效
- [ ] 颜色对比度 ≥ 4.5:1
- [ ] SVG sprite 正确渲染

# 探索系统修复总结

> **日期**: 2026-04-07
> **项目**: 海上探险探索系统

---

## 一、核心问题修复

### 1. 岛屿可达性更新时机

**问题**: 岛屿可达性在战斗**开始**时更新，导致战斗失败后岛屿状态异常

**原因**: 原代码在 `SELECT_AREA` 或 `MOVE_COMPLETE` 阶段就更新了 `reachableAreas`

**修复**:
- `reachableAreas` 只在 `BATTLE_WIN` 时更新
- 战斗失败不会改变岛屿可达状态

**代码位置**: `ExplorationStateMachine.ts` - `BATTLE_WIN` 处理

```typescript
// BATTLE_WIN 时才添加新的可达岛屿
const finalReachable = [...state.reachableAreas, ...newReachable.filter(id => !state.reachableAreas.includes(id))]
```

---

### 2. 前置条件计算错误

**问题**: `treasure` 和 `hidden` 类型岛屿被错误地计入前置条件，导致正确的岛屿被错误判定为"不可达"

**原因**: `checkPrerequisites` 函数中使用了 `a.type !== 'boss'` 过滤，应该改为 `a.type === 'normal'`

**修复**:

```typescript
// 修复前（错误）
const lowerDifficultyAreas = areas.filter(
  a => a.knowledgeArea === area.knowledgeArea && a.difficulty < area.difficulty && a.type !== 'boss'
)

// 修复后（正确）
const lowerDifficultyAreas = areas.filter(
  a => a.knowledgeArea === area.knowledgeArea && a.difficulty < area.difficulty && a.type === 'normal'
)
```

---

### 3. 战斗失败后岛屿不可点击

**问题**: 战斗失败后，所有岛屿显示为不可点击（灰色）

**原因**: `isClickable` 函数在 `error` 阶段返回 `false`

**修复**: 在 `error` 阶段也检查 `reachableAreas`

```typescript
// 修复前
if (exploration.phase === 'exploring') {
  return exploration?.reachableAreas.includes(areaId) ?? false
}

// 修复后
if (exploration.phase === 'exploring' || exploration.phase === 'error') {
  return exploration?.reachableAreas.includes(areaId) ?? false
}
```

---

### 4. 没有传送门时无法返回地图

**问题**: 战斗胜利后如果没有生成传送门，会停留在 `portal_appear` 阶段，无法返回地图

**原因**: `GENERATE_PORTALS` 无论是否有传送门都进入 `portal_appear` 阶段

**修复**:

```typescript
case 'GENERATE_PORTALS':
  // 如果有传送门，进入 portal_appear 阶段选择传送门
  // 如果没有传送门，直接返回 exploring 阶段
  if (action.portals.length > 0) {
    return { ...state, phase: 'portal_appear', availablePortals: action.portals, portalSeed: action.seed }
  }
  return { ...state, phase: 'exploring' as ExplorationPhase, availablePortals: [], portalSeed: action.seed }
```

---

### 5. 隐藏岛屿完成后没有返回按钮

**问题**: 隐藏岛屿完成后没有显示返回按钮，宝藏岛屿有

**原因**:
- 宝藏岛屿通过 `OPEN_TREASURE` → `portal_appear`
- 隐藏岛屿通过 `BATTLE_WIN` → `victory` → `GENERATE_PORTALS`（无传送门）→ `exploring`

**修复**: 宝藏/隐藏岛屿战斗胜利后直接进入 `portal_appear` 阶段

```typescript
case 'BATTLE_WIN': {
  // ...
  const isTreasureOrHidden = currentArea && (currentArea.type === 'treasure' || currentArea.type === 'hidden')

  return {
    ...state,
    phase: isTreasureOrHidden ? 'portal_appear' : 'victory',
    // ...
  }
}
```

---

### 6. 传送门返回位置丢失

**问题**: 从宝藏/隐藏岛屿返回时，无法知道传送前所在的岛屿

**修复**: 添加 `portalReturnArea` 字段跟踪返回位置

```typescript
// 进入宝藏/隐藏岛屿时保存当前岛屿
case 'SELECT_PORTAL':
  if (action.portal.type === 'treasure' || action.portal.type === 'hidden') {
    return {
      ...state,
      portalReturnArea: state.currentArea,  // 保存返回位置
      // ...
    }
  }

// 关闭传送门时恢复返回位置
case 'CLOSE_PORTAL':
  return {
    ...state,
    currentArea: state.portalReturnArea ?? state.currentArea,  // 恢复岛屿
    portalReturnArea: null,
    // ...
  }
```

---

### 7. 宝藏/隐藏岛屿通过连接系统可达

**问题**: `reachableAreas` 中错误地包含了 `treasure` 和 `hidden` 类型岛屿

**修复**: `BATTLE_WIN` 时只添加 `normal` 类型岛屿

```typescript
// BATTLE_WIN 中过滤
if (!area || area.type === 'boss' || area.type === 'treasure' || area.type === 'hidden') return false
```

---

## 二、设计原则

### 岛屿分类

| 类型 | 可达方式 | 计入前置条件 | 示例 |
|------|----------|--------------|------|
| `normal` | 通过岛屿连接可达 | 是 | math_1, chinese_2 |
| `treasure` | 只通过传送门访问 | 否 | east_treasure_1 |
| `hidden` | 只通过传送门访问（需钥匙） | 否 | east_hidden_A |
| `boss` | 9个岛屿完成后解锁 | 否 | east_boss |

### 阶段转换图

```
exploring ←──────────────────────────────┐
  ↑                                       │
  │ SELECT_AREA                           │ CLOSE_PORTAL
  ↓                                       │
sailing → arrived → moving → encounter ──┤
                                      ↓
                              ┌──────────┴──────────┐
                              ↓                     ↓
                          battle               hidden_area
                              ↓                     ↓
                           victory              portal_appear
                              ↓                     ↑
                    ┌─────────┴─────────┐   SELECT_PORTAL
                    ↓                   ↓         (treasure/hidden)
              portal_appear     GENERATE_PORTALS
                    ↑                   ↓
                    └───(有传送门)─────┘  (无传送门)
                              ↓
                        exploring
```

### 传送门返回逻辑

1. 选择宝藏/隐藏传送门 → 保存 `portalReturnArea = 当前岛屿`
2. 完成宝藏/隐藏岛屿 → 进入 `portal_appear` 阶段
3. 关闭传送门 → `currentArea = portalReturnArea`，返回原岛屿

---

## 三、关键文件

| 文件 | 职责 |
|------|------|
| `ExplorationStateMachine.ts` | 探索状态机，核心逻辑 |
| `ExplorationMap.tsx` | 探索地图 UI 组件 |
| `AreaNode.tsx` | 岛屿节点渲染 |
| `areas/index.ts` | 岛屿数据定义 |

---

## 四、测试验证

所有 155 个测试通过，包括：

- `ExplorationStateMachine` 状态转换测试
- `AreaNode` 岛屿可达性测试
- `gameStore` 集成测试

### 验证场景

1. **击败 math_1 后**: `reachableAreas` 应包含 `math_2`, `chinese_1`, `english_1`
2. **击败 math_2 后**: `reachableAreas` 应包含 `math_3`（math_1 + math_2 已完成）
3. **进入隐藏岛屿**: `portalReturnArea` 正确保存返回位置
4. **关闭传送门**: 正确返回传送前的岛屿

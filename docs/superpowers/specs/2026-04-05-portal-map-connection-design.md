# 传送门与地图连接系统解耦设计

## 概述

将地图连接和传送门系统解耦，明确各自职责：
- **地图连接** = 主线岛屿的主要访问路径
- **传送门** = 特殊路径（仅用于宝藏/隐藏岛屿和跨大洋）

## 设计原则

1. **职责分离**：地图连接管理主线岛屿访问，传送门管理特殊场景
2. **简化逻辑**：移除复杂的可达性算法，改为明确的规则驱动
3. **清晰反馈**：玩家始终知道可以通过什么方式访问哪些岛屿

## 传送门出现规则

| 触发条件 | 传送门内容 | 概率 | 钥匙要求 |
|---------|----------|------|---------|
| 首次进入大洋 | 通往第一个入门岛屿（难度1普通岛屿） | 100% | 无 |
| 普通岛屿胜利 | 通往需要钥匙的隐藏/宝藏岛屿 | 30% 随机 | 持有钥匙 |
| Boss 岛屿胜利 | 通往下一个大洋 | 100% | 无 |

### 详细说明

**首次进入大洋**
- 玩家第一次进入某个大洋时，显示通往第一个入门岛屿的传送门
- 入门岛屿定义：`type === 'normal' && difficulty === 1`
- 大洋顺序：east → west → southHot → northIce → mysterious

**普通岛屿胜利 + 持有钥匙**
- 战斗胜利后，如果 `collectedKeys > 0`，30% 概率出现传送门
- 传送门目标：所有 `requiredKeys > 0` 且未完成的隐藏/宝藏岛屿
- 如果没有符合条件的岛屿，不显示传送门

**Boss 岛屿胜利**
- 打败 Boss 后，100% 显示通往下一个大洋的传送门
- 如果没有更多大洋，显示通往已完成岛屿的传送门作为备选

## 岛屿访问规则（地图连接）

### 可点击岛屿
玩家在地图上只能点击满足以下条件的岛屿：
1. 在当前岛屿的 `connections` 列表中
2. 未被完成（不在 `defeatedMiniBosses` 中）
3. 不是 Boss 岛屿（Boss 通过完成所有岛屿解锁）

### 岛屿状态显示
- **可点击**：高亮显示，表示可以访问
- **不可点击**：灰显显示，表示前置条件未满足
- **已完成**：特殊标记（如打勾），表示已完成

### 访问流程
```
地图界面 → 点击可点击岛屿 → SELECT_AREA → sailing → battle
```

## 状态机流程

```
exploring (地图选择)
    ↓ SELECT_AREA (点击连接的岛屿)
sailing → arrived → moving → encounter → battle
    ↓ BATTLE_WIN
victory → portal_appear (传送门仅显示宝藏/隐藏/新大洋)
    ↓ (无传送门或关闭传送门)
返回 exploring
```

## 数据流

### ExplorationState 关键字段

```typescript
interface ExplorationState {
  phase: ExplorationPhase
  currentOcean: string | null
  currentArea: string | null
  defeatedMiniBosses: string[]      // 已完成岛屿
  unlockedAreas: string[]            // 已解锁区域（钥匙）
  collectedKeys: number              // 持有钥匙数量
  availablePortals: Portal[]         // 当前可选传送门
}
```

### Portal 类型

```typescript
interface Portal {
  id: string
  targetAreaId: string  // 岛屿ID 或 oceanId（跨洋传送门）
  type: 'normal' | 'hidden' | 'treasure' | 'ocean_portal'
}
```

## 文件变更

### 修改文件

| 文件 | 变更内容 |
|-----|---------|
| `src/store/gameStore.ts` | 重写 `generatePortals()` 逻辑 |
| `src/components/game/ExplorationMap.tsx` | 更新岛屿可点击状态逻辑 |

### generatePortals() 简化逻辑

```typescript
// 新逻辑
if (currentArea.type === 'boss') {
  // Boss胜利 → 100% 通往新大洋
  portals.push({ type: 'ocean_portal', targetAreaId: nextOceanId })
} else if (collectedKeys > 0 && rng.chance(0.3)) {
  // 持有钥匙 → 30% 通往钥匙岛屿
  const keyIslands = areas.filter(a =>
    a.requiredKeys > 0 && !defeatedMiniBosses.includes(a.id)
  )
  portals.push({ type: 'hidden', targetAreaId: rng.pick(keyIslands) })
}
// 否则不显示传送门，玩家通过地图连接访问岛屿
```

### 岛屿可点击状态判断

```typescript
// 在 ExplorationMap.tsx 中
const isClickable = (areaId: string): boolean => {
  const area = getAreaById(areaId)
  if (!area) return false
  if (defeatedMiniBosses.includes(areaId)) return false
  if (area.type === 'boss') return false  // Boss 不通过连接访问
  return currentArea?.connections.includes(areaId)
}
```

## 测试用例

### 传送门测试

| 场景 | 初始状态 | 预期结果 |
|-----|---------|---------|
| 首次进入 east | defeated=[], keys=0 | 显示通往 east_math_1 的传送门 |
| 击败 math_1，有钥匙 | defeated=[math_1], keys=1 | 30% 显示通往 east_hidden_A |
| 击败 math_1，无钥匙 | defeated=[math_1], keys=0 | 不显示传送门 |
| 击败 east_boss | defeated=[...9个岛屿], type=boss | 显示通往 west 的传送门 |

### 地图连接测试

| 场景 | 当前岛屿 | 预期可点击 |
|-----|---------|-----------|
| 击败 math_1 | east_math_1 | math_2, chinese_1, english_1 |
| 击败 chinese_2 | east_chinese_2 | chinese_3, math_2, english_2 |
| 击败 math_3 | east_math_3 | Boss (需9个岛屿) |

## 实施计划

1. **Phase 1**: 重写 `generatePortals()` 函数
2. **Phase 2**: 更新岛屿可点击状态逻辑
3. **Phase 3**: 更新 UI 显示（灰显/高亮）
4. **Phase 4**: 添加/更新测试用例
5. **Phase 5**: 手动测试验证

## 风险与缓解

| 风险 | 缓解措施 |
|-----|---------|
| 玩家不知道可以访问哪些岛屿 | UI 明确显示可点击/不可点击状态 |
| 没有传送门时玩家卡住 | 地图连接始终可用，不会完全锁死 |
| 钥匙岛屿难以发现 | 添加视觉提示（微弱发光） |

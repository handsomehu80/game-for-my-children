# 传送门与地图连接系统解耦设计

## 概述

将地图连接和传送门系统解耦，明确各自职责：
- **地图连接** = 主线岛屿的主要访问路径（玩家在地图上点击）
- **传送门** = 特殊路径（仅用于钥匙岛屿和跨大洋）

## 设计原则

1. **职责分离**：地图连接管理主线岛屿访问，传送门管理特殊场景
2. **简化逻辑**：移除复杂的可达性算法，改为明确的规则驱动
3. **清晰反馈**：玩家始终知道可以通过什么方式访问哪些岛屿

## 传送门出现规则

| 触发条件 | 传送门内容 | 概率 | 钥匙要求 |
|---------|----------|------|---------|
| 首次进入大洋 | 通往第一个入门岛屿（难度1普通岛屿） | 100% | 无 |
| 普通岛屿胜利 | 通往已解锁的隐藏/宝藏岛屿 | 70% 随机 | 持有钥匙 |
| Boss 岛屿胜利 | 通往下一个大洋 | 100% | 无 |

### 详细说明

**首次进入大洋**
- 触发条件：`defeatedMiniBosses.length === 0 && visitedAreas.length <= 1`
- 显示通往第一个入门岛屿的传送门
- 入门岛屿定义：`type === 'normal' && difficulty === 1`
- 大洋顺序：east → west → southHot → northIce → mysterious

**普通岛屿胜利 + 持有钥匙**
- 战斗胜利后，如果 `collectedKeys > 0`，70% 概率出现传送门
- 传送门目标：从已解锁的钥匙岛屿中选择（`unlockedAreas` 中且未完成）
- 如果没有已解锁的钥匙岛屿，不显示传送门
- **注意**：使用传送门不消耗额外钥匙（钥匙在 UNLOCK_AREA 时已消耗）

**Boss 岛屿胜利**
- 打败 Boss 后，100% 显示通往下一个大洋的传送门
- 如果没有更多大洋，显示通往已完成岛屿的传送门作为备选

### 钥匙岛屿访问流程

```
1. 玩家获得钥匙（战斗掉落）
2. 在 portal_appear 阶段，选择 UNLOCK_AREA 解锁隐藏岛屿
3. 解锁后，该岛屿加入 unlockedAreas
4. 下次战斗胜利后，70% 概率传送门通往已解锁的钥匙岛屿
```

## 岛屿访问规则（地图连接）

### 可点击岛屿
玩家在地图上只能点击满足以下条件的岛屿：
1. 在当前岛屿的 `connections` 列表中
2. 未被完成（不在 `defeatedMiniBosses` 中）
3. 不是 Boss 岛屿（Boss 通过完成9个岛屿解锁）

### 岛屿状态显示
- **可点击**：高亮显示，表示可以访问
- **不可点击**：灰显显示，表示前置条件未满足
- **已完成**：特殊标记（如打勾），表示已完成
- **锁定**：显示钥匙图标，表示需要钥匙解锁

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
victory → portal_appear
    ↓
    ├─ SELECT_PORTAL → 前往宝藏/钥匙岛屿 或 新大洋
    ├─ UNLOCK_AREA → 解锁岛屿（消耗钥匙）
    └─ (无传送门或关闭) → CLOSE_PORTAL → 返回 exploring
```

### 关键动作

| 动作 | 触发阶段 | 说明 |
|-----|---------|------|
| `GENERATE_PORTALS` | victory | 生成传送门列表 |
| `SELECT_PORTAL` | portal_appear | 选择传送门前往目标 |
| `UNLOCK_AREA` | portal_appear | 解锁岛屿（消耗钥匙） |
| `CLOSE_PORTAL` | portal_appear | 关闭传送门，返回地图 |
| `SELECT_AREA` | portal_appear | 直接选择连接的岛屿 |

## 数据流

### ExplorationState 关键字段

```typescript
interface ExplorationState {
  phase: ExplorationPhase
  currentOcean: string | null
  currentArea: string | null
  visitedAreas: string[]             // 已访问岛屿
  defeatedMiniBosses: string[]       // 已完成岛屿
  unlockedAreas: string[]            // 已解锁区域（消耗钥匙后）
  collectedKeys: number              // 持有钥匙数量
  availablePortals: Portal[]        // 当前可选传送门
}
```

### Portal 类型

```typescript
interface Portal {
  id: string
  targetAreaId: string  // 岛屿ID 或 oceanId（跨洋传送门）
  type: 'normal' | 'hidden' | 'treasure' | 'event' | 'ocean_portal'
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
if (isFirstEntry) {
  // 首次进入大洋 → 100% 通往入门岛屿
  const firstIsland = areas.find(a => a.type === 'normal' && a.difficulty === 1)
  if (firstIsland) {
    portals.push({ id: genId(), targetAreaId: firstIsland.id, type: 'normal' })
  }
} else if (currentArea.type === 'boss') {
  // Boss胜利 → 100% 通往新大洋
  portals.push({ id: genId(), targetAreaId: nextOceanId, type: 'ocean_portal' })
} else if (collectedKeys > 0) {
  // 持有钥匙 → 70% 通往已解锁的钥匙岛屿
  const keyIslands = areas.filter(a =>
    a.requiredKeys > 0 &&
    state.unlockedAreas.includes(a.id) &&  // 必须已解锁
    !state.defeatedMiniBosses.includes(a.id)
  )
  if (keyIslands.length > 0 && rng.chance(0.7)) {
    const target = rng.pick(keyIslands)
    portals.push({ id: genId(), targetAreaId: target.id, type: target.type })
  }
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
  if (area.type === 'boss') return false  // Boss 需要9个岛屿完成
  return currentArea?.connections.includes(areaId)
}

const isLocked = (areaId: string): boolean => {
  const area = getAreaById(areaId)
  if (!area) return false
  return area.requiredKeys > 0 && !unlockedAreas.includes(areaId)
}
```

## 测试用例

### 传送门测试

| 场景 | 初始状态 | 预期结果 |
|-----|---------|---------|
| 首次进入 east | defeated=[], keys=0, visited=[] | 显示通往 east_math_1 的传送门 |
| 击败 math_1，有钥匙，已解锁 east_hidden_A | defeated=[math_1], keys=1, unlocked=[east_hidden_A] | 70% 显示通往 east_hidden_A |
| 击败 math_1，有钥匙，未解锁任何 | defeated=[math_1], keys=1, unlocked=[] | 不显示传送门 |
| 击败 east_boss | defeated=[...9个岛屿], type=boss | 显示通往 west 的传送门 |
| 击败 east_boss（最后一个） | defeated=[...], type=boss, nextOcean=undefined | 显示通往已完成岛屿的传送门 |

### 地图连接测试

| 场景 | 当前岛屿 | 预期可点击 |
|-----|---------|-----------|
| 击败 math_1 | east_math_1 | math_2, chinese_1, english_1 |
| 击败 chinese_2 | east_chinese_2 | chinese_3, math_2, english_2 |
| 击败 math_3 | east_math_3 | Boss (需9个岛屿都已完成) |
| math_3 未完成 | east_math_3 | chinese_3, english_3 (同级连接) |

### Boss 解锁条件

- 需要 `defeatedMiniBosses.length >= 9` 才能挑战 Boss
- Boss 岛屿不在 connections 中，通过完成所有岛屿自然解锁

## 实施计划

1. **Phase 1**: 重写 `generatePortals()` 函数
2. **Phase 2**: 更新岛屿可点击状态逻辑（添加灰显/锁定状态）
3. **Phase 3**: 更新 UI 显示（不同状态不同样式）
4. **Phase 4**: 添加 `CLOSE_PORTAL` 动作处理
5. **Phase 5**: 添加/更新测试用例
6. **Phase 6**: 手动测试验证

## 风险与缓解

| 风险 | 缓解措施 |
|-----|---------|
| 玩家不知道可以访问哪些岛屿 | UI 明确显示可点击/不可点击状态 |
| 没有传送门时玩家卡住 | 地图连接始终可用，不会完全锁死 |
| 钥匙岛屿难以发现 | 添加视觉提示（微弱发光/钥匙图标） |
| Boss 解锁条件不清晰 | 在 UI 上显示进度（X/9 岛屿完成） |

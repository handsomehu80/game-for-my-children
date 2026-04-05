# P0/P1 问题修复文档

## 基线版本
- Tag: `baseline-before-p0-p1-fixes`
- Branch: `fix/p0-p1-issues`
- Commit: `bb746db`

## P0 问题 (必须修复)

### P0-1: 重复的 Action Type 定义
**文件**: `src/game/types.ts`
**问题**: `RESET_VICTORY_COUNTER` 和 `INCREMENT_VICTORY_COUNTER` 各定义了两次
**修复**: 移除重复的定义

### P0-2: UNLOCK_AREA 不检查是否已解锁
**文件**: `src/game/ExplorationStateMachine.ts`
**问题**: 已解锁区域仍消耗钥匙
**修复**: 添加已解锁检查，如果已解锁则直接返回原状态

## P1 问题 (重要修复)

### P1-1: handleBattleWin 绕过状态机
**文件**: `src/components/game/ExplorationMap.tsx`
**问题**: 直接调用 `generatePortals()` 绕过状态机动作流程
**修复**: 移除直接调用，由 useEffect 监听 victory 阶段触发

### P1-2: boss_appearing 无入口 (待定)
**文件**: `src/game/ExplorationStateMachine.ts`
**问题**: boss_appearing 状态定义了但没有动作触发进入
**分析**: 当前设计中 Boss 战斗通过 encounter -> battle 直接处理，不需要单独的 boss_appearing 阶段
**决策**: 保留状态定义但标记为预留，不做修改

## 修复后验证
- [x] npm run build 通过
- [x] npm test 通过 (124 tests)

## 修复提交
- Commit: `39f3b23`
- Files changed: 7 files, +59/-24 lines

### 修复详情

#### P0-1: 移除重复 Action Type 定义
```typescript
// Before (duplicate):
| { type: 'RESET_VICTORY_COUNTER' }
| { type: 'INCREMENT_VICTORY_COUNTER' }
| { type: 'RESET_VICTORY_COUNTER' }  // 重复
| { type: 'INCREMENT_VICTORY_COUNTER' }  // 重复

// After (fixed):
| { type: 'RESET_VICTORY_COUNTER' }
| { type: 'INCREMENT_VICTORY_COUNTER' }
```

#### P0-2: UNLOCK_AREA 检查是否已解锁
```typescript
case 'UNLOCK_AREA':
  // 如果区域已经解锁，不消耗钥匙
  if (state.unlockedAreas.includes(action.areaId)) {
    return state
  }
  // ...
```

#### P1-1: handleBattleWin 遵循状态机流程
```typescript
// 移除了 generatePortals() 的直接调用
// useEffect 现在使用 exploration 直接状态而非 ref：
useEffect(() => {
  if (exploration?.phase === 'victory') {
    generatePortals()
  }
}, [exploration, generatePortals])
```

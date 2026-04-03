const STORAGE_KEY_PREFIX = 'ocean_game_'
const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024 // 4.5MB buffer (localStorage is ~5MB)
const CLEANUP_THRESHOLD = 0.8 // 80% capacity triggers cleanup
const CLEANUP_PERCENTAGE = 0.3 // Remove oldest 30% of entries

interface StorageInfo {
  used: number
  available: number
  keys: string[]
}

/**
 * Get all ocean_game_ prefixed keys from localStorage
 */
function getOceanGameKeys(): string[] {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      keys.push(key)
    }
  }
  return keys
}

/**
 * Calculate total storage used by ocean_game_ prefixed keys in bytes
 */
function calculateStorageUsed(keys: string[]): number {
  let total = 0
  for (const key of keys) {
    const value = localStorage.getItem(key)
    if (value) {
      // Key length in bytes (UTF-16) + value length in bytes
      total += key.length * 2 + value.length * 2
    }
  }
  return total
}

/**
 * Get storage information for ocean_game_ prefixed items
 */
export function getStorageInfo(): StorageInfo {
  const keys = getOceanGameKeys()
  const used = calculateStorageUsed(keys)
  return {
    used,
    available: MAX_STORAGE_SIZE - used,
    keys,
  }
}

/**
 * Check if storage capacity is within acceptable limits
 */
export function checkStorageCapacity(): { ok: boolean; info: StorageInfo } {
  const info = getStorageInfo()
  return {
    ok: info.available > 0,
    info,
  }
}

/**
 * Get the timestamp metadata key for a given storage key
 * Assumes timestamps are stored as key + '_ts'
 */
function getTimestampKey(key: string): string {
  return `${key}_ts`
}

/**
 * Get creation/modification timestamp for a storage key
 * Returns 0 if no timestamp exists
 */
function getEntryTimestamp(key: string): number {
  const tsKey = getTimestampKey(key)
  const ts = localStorage.getItem(tsKey)
  return ts ? parseInt(ts, 10) : 0
}

/**
 * Set timestamp for a storage key
 */
function setEntryTimestamp(key: string): void {
  const tsKey = getTimestampKey(key)
  localStorage.setItem(tsKey, Date.now().toString())
}

/**
 * Check if a key is a timestamp key (ends with _ts)
 */
function isTimestampKey(key: string): boolean {
  return key.endsWith('_ts')
}

/**
 * Cleanup oldest entries when storage is over 80% capacity
 * Removes oldest 30% of data entries (not timestamp keys)
 */
export function cleanupOldData(): void {
  const allKeys = getOceanGameKeys()
  const info = getStorageInfo()

  // Only cleanup if over threshold
  if (info.used < MAX_STORAGE_SIZE * CLEANUP_THRESHOLD) {
    return
  }

  // Filter to only data keys (not timestamp keys) and sort by timestamp
  const dataKeys = allKeys.filter(key => !isTimestampKey(key))

  const keysWithTimestamps = dataKeys.map(key => ({
    key,
    timestamp: getEntryTimestamp(key),
  })).sort((a, b) => a.timestamp - b.timestamp)

  // Calculate how many to remove (30% of data entries)
  const removeCount = Math.ceil(keysWithTimestamps.length * CLEANUP_PERCENTAGE)

  // Remove oldest data entries and their timestamps
  for (let i = 0; i < removeCount; i++) {
    const keyToRemove = keysWithTimestamps[i].key
    localStorage.removeItem(keyToRemove)
    localStorage.removeItem(getTimestampKey(keyToRemove))
  }
}

/**
 * Safe wrapper for localStorage.setItem that checks capacity and auto-cleanups
 * Returns true if successful, false if value is too large
 */
export function safeSetItem(key: string, value: string): boolean {
  const fullKey = STORAGE_KEY_PREFIX + key
  const valueSize = value.length * 2
  const keySize = fullKey.length * 2

  // Check if single item exceeds max storage
  if (keySize + valueSize > MAX_STORAGE_SIZE) {
    console.warn(`[storage] Item ${key} is too large (${keySize + valueSize} bytes)`)
    return false
  }

  // Check if adding this item would exceed capacity
  const info = getStorageInfo()
  if (info.available < keySize + valueSize) {
    // Try cleanup first
    cleanupOldData()
    const infoAfterCleanup = getStorageInfo()
    if (infoAfterCleanup.available < keySize + valueSize) {
      console.warn(`[storage] Insufficient storage space for ${key} even after cleanup`)
      return false
    }
  }

  // Set the timestamp for this entry (used for cleanup prioritization)
  setEntryTimestamp(fullKey)
  localStorage.setItem(fullKey, value)
  return true
}

/**
 * Safe wrapper for localStorage.getItem
 * Returns null if key doesn't exist
 */
export function safeGetItem(key: string): string | null {
  const fullKey = STORAGE_KEY_PREFIX + key
  return localStorage.getItem(fullKey)
}

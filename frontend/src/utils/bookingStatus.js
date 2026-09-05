const STORAGE_KEY = 'booking_status'
const STATS_SNAPSHOT_KEY = 'stats_snapshots'

export const BOOKING_STATUS = {
  PENDING: 'pending',
  DONE: 'done',
  CANCELLED: 'cancelled',
}

function readMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeMap(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* storage unavailable - ignore */
  }
}

function readSnapshots() {
  try {
    const raw = localStorage.getItem(STATS_SNAPSHOT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeSnapshots(snapshots) {
  try {
    localStorage.setItem(STATS_SNAPSHOT_KEY, JSON.stringify(snapshots))
  } catch {
    /* storage unavailable - ignore */
  }
}

export function getBookingStatus(id) {
  const map = readMap()
  return map[id] || BOOKING_STATUS.PENDING
}

export function getBookingStatusMap() {
  return readMap()
}

export function setBookingStatus(id, status) {
  const map = readMap()
  map[id] = status
  writeMap(map)
}

export function saveStatsSnapshot(data) {
  const snapshots = readSnapshots()
  const snapshot = {
    timestamp: new Date().toISOString(),
    totals: data.totals,
    revenue: data.revenue,
    services: data.services,
  }
  snapshots.push(snapshot)
  if (snapshots.length > 52) {
    snapshots.splice(0, snapshots.length - 52)
  }
  writeSnapshots(snapshots)
}

export function getStatsSnapshots() {
  return readSnapshots()
}

export function getLatestSnapshot() {
  const snapshots = readSnapshots()
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null
}

export function clearStatsSnapshots() {
  writeSnapshots([])
}

export function exportAllData() {
  return {
    bookingStatuses: getBookingStatusMap(),
    statsSnapshots: getStatsSnapshots(),
    exportDate: new Date().toISOString(),
  }
}

export function importAllData(data) {
  if (data.bookingStatuses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.bookingStatuses))
  }
  if (data.statsSnapshots) {
    writeSnapshots(data.statsSnapshots)
  }
}

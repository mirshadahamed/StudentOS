const globalCache = globalThis;

if (!globalCache.studentOsFocusSessions) {
  globalCache.studentOsFocusSessions = [];
}

export function getFocusSessions() {
  return globalCache.studentOsFocusSessions;
}

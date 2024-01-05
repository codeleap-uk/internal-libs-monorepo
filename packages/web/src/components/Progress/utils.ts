export function formatProgress(value) {
  return `${value.toFixed(value % 1 != 0 && !isNaN(value % 1) ? 2 : 0)}%`
}

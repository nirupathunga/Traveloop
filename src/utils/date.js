export function calculateDays(start, end) {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.max(1, Math.floor((endDate - startDate) / msPerDay) + 1)
}

export function formatHours(hoursStr) {
  if (!hoursStr || isNaN(parseFloat(hoursStr))) return "0h";
  const hours = parseFloat(hoursStr);
  if (hours <= 0) return "0h";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatTimestamp(timestamp: bigint): string {
  // Motoko timestamps are in nanoseconds
  const ms = Number(timestamp / BigInt(1_000_000));
  const date = new Date(ms);
  // Sanity check: if year is unreasonable, treat as seconds
  if (date.getFullYear() < 2000 || date.getFullYear() > 2100) {
    const msFromSeconds = Number(timestamp) * 1000;
    const d2 = new Date(msFromSeconds);
    return d2.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

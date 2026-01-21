export function getCountdown(validity) {
  if (!validity) return null;

  // Match "till HH:mm UTC"
  const match = validity.match(/till\s(\d{2}:\d{2})\sUTC/i);
  if (!match) return null;

  const [h, m] = match[1].split(":").map(Number);

  const now = new Date();
  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    h,
    m,
    0
  ));

  const diffMs = end - now;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 0) return { expired: true };

  return {
    expired: false,
    minutes: diffMin,
    hours: Math.floor(diffMin / 60),
    mins: diffMin % 60
  };
}

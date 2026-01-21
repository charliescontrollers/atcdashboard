export function getCATFromVisibility(vis) {
  if (!vis || isNaN(vis)) return "UNKNOWN";

  if (vis >= 5500) return "CAT-I";
  if (vis >= 3000) return "CAT-II";
  return "CAT-III";
}

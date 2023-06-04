export function thrownToString(x: unknown) {
  if (x instanceof Error) return `${x.message} (${x.name})`;
  return String(x);
}

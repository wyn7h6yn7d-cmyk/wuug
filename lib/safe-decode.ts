/** Avoid URIError when query params contain broken % escapes (common with echoed error text). */
export function safeDecodeURIComponent(value: string | string[] | undefined): string | null {
  if (value == null) return null;
  const s = Array.isArray(value) ? value[0] : value;
  if (typeof s !== "string") return null;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

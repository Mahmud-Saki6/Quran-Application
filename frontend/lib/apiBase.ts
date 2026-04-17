/**
 * Base URL for API requests. Empty = same origin (Next.js rewrites `/api/*` to the backend).
 * Set `NEXT_PUBLIC_API_URL` when the API is hosted separately (must allow CORS from the app origin).
 */
export function getPublicApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
}

/** Build an absolute or same-origin URL for `/api/...` routes. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getPublicApiBase();
  return base ? `${base}${normalized}` : normalized;
}

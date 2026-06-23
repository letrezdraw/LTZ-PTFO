/** Resolve a path under `public/` for any Vite `base` (e.g. GitHub project pages). */
export function publicAsset(relativePath) {
  const base = import.meta.env.BASE_URL || '/';
  const clean = String(relativePath).replace(/^\/+/, '');
  // URL-encode each segment of the path separately to preserve forward slashes
  const encoded = clean
    .split('/')
    .map(segment => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');
  return `${base}${encoded}`.replace(/\/{2,}/g, '/');
}

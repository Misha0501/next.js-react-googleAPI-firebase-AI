export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL

  const value = (raw ?? "homfli.com").trim().replace(/\/$/, "")

  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      return new URL(value).origin
    } catch {
      // fall through to manual protocol detection
    }
  }

  const isLocal =
    value.startsWith("localhost") ||
    value.startsWith("127.0.0.1") ||
    value.startsWith("[::1]")

  return `${isLocal ? "http" : "https"}://${value}`
}

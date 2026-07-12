// 公開ニュース一覧の軽量インメモリキャッシュ。呼び出し元が実際の形を知っているため
// ここではジェネリックに保持し、詳細な型は呼び出し側（news/public route）に委ねる。
let cachedAnnouncements: unknown[] | null = null;
let cachedAnnouncementsExpiry = 0;

export function getCachedNews<T = unknown>(): T[] | null {
  const now = Date.now();
  if (cachedAnnouncements !== null && now < cachedAnnouncementsExpiry) {
    return cachedAnnouncements as T[];
  }
  return null;
}

export function setCachedNews<T>(announcements: T[]): void {
  cachedAnnouncements = announcements;
  cachedAnnouncementsExpiry = Date.now() + 60000; // Cache for 1 minute
}

export function clearNewsCache() {
  cachedAnnouncements = null;
  cachedAnnouncementsExpiry = 0;
}

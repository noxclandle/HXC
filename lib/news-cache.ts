let cachedAnnouncements: any = null;
let cachedAnnouncementsExpiry = 0;

export function getCachedNews() {
  const now = Date.now();
  if (cachedAnnouncements !== null && now < cachedAnnouncementsExpiry) {
    return cachedAnnouncements;
  }
  return null;
}

export function setCachedNews(announcements: any) {
  cachedAnnouncements = announcements;
  cachedAnnouncementsExpiry = Date.now() + 60000; // Cache for 1 minute
}

export function clearNewsCache() {
  cachedAnnouncements = null;
  cachedAnnouncementsExpiry = 0;
}

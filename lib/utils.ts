export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  // 本番環境のカスタムドメインを最優先にする
  return "https://virtual-business-card.hexa-relation.com";
}

// RSS Reader辅助函数

/**
 * 从URL中提取域名
 */
export function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch (e) {
    return ""
  }
}

/**
 * 获取网站favicon的URL
 */
export function getFaviconUrl(siteUrl: string): string {
  const domain = extractDomainFromUrl(siteUrl)
  if (!domain) return ""
  
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
} 
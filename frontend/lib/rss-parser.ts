// Simple RSS parser using DOMParser
export async function parseFeed(xml: string) {
  try {
    const parser = new DOMParser()
    const dom = parser.parseFromString(xml, "application/xml")

    // Check for parsing errors
    const parserError = dom.querySelector("parsererror")
    if (parserError) {
      throw new Error("XML parsing error")
    }

    // Determine if this is RSS or Atom
    const isRSS = !!dom.querySelector("rss, channel")
    const isAtom = !!dom.querySelector("feed")

    let feedTitle = ""
    let feedDescription = ""
    let items: any[] = []

    if (isRSS) {
      // Parse RSS
      const channel = dom.querySelector("channel")
      if (channel) {
        feedTitle = channel.querySelector("title")?.textContent || ""
        feedDescription = channel.querySelector("description")?.textContent || ""

        const itemElements = Array.from(dom.querySelectorAll("item"))
        items = itemElements.map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          description: item.querySelector("description")?.textContent || "",
          content:
            item.querySelector("content\\:encoded, content")?.textContent ||
            item.querySelector("description")?.textContent ||
            "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
          guid: item.querySelector("guid")?.textContent || "",
          author: item.querySelector("author, dc\\:creator")?.textContent || "",
          enclosure: item.querySelector("enclosure")
            ? {
                url: item.querySelector("enclosure")?.getAttribute("url") || "",
                type: item.querySelector("enclosure")?.getAttribute("type") || "",
                length: item.querySelector("enclosure")?.getAttribute("length") || "",
              }
            : null,
        }))
      }
    } else if (isAtom) {
      // Parse Atom
      const feed = dom.querySelector("feed")
      if (feed) {
        feedTitle = feed.querySelector("title")?.textContent || ""
        feedDescription = feed.querySelector("subtitle")?.textContent || ""

        const entryElements = Array.from(dom.querySelectorAll("entry"))
        items = entryElements.map((entry) => {
          // Handle Atom content
          let content = ""
          const contentElement = entry.querySelector("content")
          if (contentElement) {
            const type = contentElement.getAttribute("type")
            if (type === "html" || type === "xhtml") {
              content = contentElement.textContent || ""
            } else {
              content = contentElement.textContent || ""
            }
          }

          // Get link (prefer alternate link)
          let link = ""
          const links = entry.querySelectorAll("link")
          for (const linkEl of Array.from(links)) {
            const rel = linkEl.getAttribute("rel")
            if (!rel || rel === "alternate") {
              link = linkEl.getAttribute("href") || ""
              break
            }
          }

          return {
            title: entry.querySelector("title")?.textContent || "",
            link,
            description: entry.querySelector("summary")?.textContent || "",
            content,
            pubDate: entry.querySelector("published")?.textContent || entry.querySelector("updated")?.textContent || "",
            guid: entry.querySelector("id")?.textContent || "",
            author: entry.querySelector("author name")?.textContent || "",
            enclosure: null, // Atom uses different mechanism for enclosures
          }
        })
      }
    }

    return {
      title: feedTitle,
      description: feedDescription,
      items,
    }
  } catch (error) {
    console.error("Error parsing feed:", error)
    throw error
  }
}

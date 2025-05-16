import { DOMParser } from "xmldom";

// Helper functions for parsing
function getElementTextContent(element: Element | undefined | null, tagName: string): string {
    if (!element) return "";
    const nodes = element.getElementsByTagName(tagName);
    return nodes[0]?.textContent?.trim() || "";
}

function getElementTextContentByOrder(element: Element | undefined | null, tagNames: string[]): string {
    if (!element) return "";
    for (const tagName of tagNames) {
        const nodes = element.getElementsByTagName(tagName);
        if (nodes[0]?.textContent) {
            return nodes[0].textContent.trim();
        }
    }
    return "";
}

// Simple RSS parser using DOMParser
export async function parseFeed(xml: string) {
  try {
    const parser = new DOMParser({
        errorHandler: function(level, msg) {
            if (level === 'error' || level === 'fatalError') {
                throw new Error(`XML Parsing Error (${level}): ${msg}`);
            }
            // Optionally log warnings:
            // else if (level === 'warning') { console.warn(`DOMParser warning: ${msg}`); }
        }
    });
    const dom = parser.parseFromString(xml, "application/xml");

    // Fallback check for parsing errors if errorHandler didn't throw or for other issues
    const parserErrorElements = dom.getElementsByTagName("parsererror");
    if (parserErrorElements.length > 0) {
        const errorContent = parserErrorElements[0]?.textContent;
        throw new Error(`XML parsing error (found parsererror tag): ${errorContent || "Unknown error"}`);
    }

    // Determine if this is RSS or Atom
    const isRSS = dom.getElementsByTagName("rss").length > 0 || dom.getElementsByTagName("channel").length > 0;
    const isAtom = dom.getElementsByTagName("feed").length > 0;

    let feedTitle = "";
    let feedDescription = "";
    let items: any[] = [];

    if (isRSS) {
      // Parse RSS
      const channelElements = dom.getElementsByTagName("channel");
      const channel = channelElements.length > 0 ? channelElements[0] : null;
      if (channel) {
        feedTitle = getElementTextContent(channel, "title");
        feedDescription = getElementTextContent(channel, "description");

        const itemElements = Array.from(dom.getElementsByTagName("item"));
        items = itemElements.map((item) => {
          const enclosureEl = item.getElementsByTagName("enclosure")[0];
          return {
            title: getElementTextContent(item, "title"),
            link: getElementTextContent(item, "link"),
            description: getElementTextContent(item, "description"),
            content:
              getElementTextContentByOrder(item, ["content:encoded", "content"]) ||
              getElementTextContent(item, "description"), // Fallback to description
            pubDate: getElementTextContent(item, "pubDate"),
            guid: getElementTextContent(item, "guid"),
            author: getElementTextContentByOrder(item, ["author", "dc:creator"]),
            enclosure: enclosureEl
              ? {
                  url: enclosureEl.getAttribute("url") || "",
                  type: enclosureEl.getAttribute("type") || "",
                  length: enclosureEl.getAttribute("length") || "",
                }
              : null,
          };
        });
      }
    } else if (isAtom) {
      // Parse Atom
      const feedElements = dom.getElementsByTagName("feed");
      const feed = feedElements.length > 0 ? feedElements[0] : null;

      if (feed) {
        feedTitle = getElementTextContent(feed, "title");
        feedDescription = getElementTextContent(feed, "subtitle"); // Atom uses subtitle

        const entryElements = Array.from(dom.getElementsByTagName("entry"));
        items = entryElements.map((entry) => {
          // Handle Atom content
          let content = "";
          const contentElement = entry.getElementsByTagName("content")[0];
          if (contentElement) {
            // const type = contentElement.getAttribute("type"); // type attribute not directly used in logic here
            content = contentElement.textContent?.trim() || "";
          }

          // Get link (prefer alternate link)
          let link = "";
          const linkElements = Array.from(entry.getElementsByTagName("link"));
          for (const linkEl of linkElements) {
            const rel = linkEl.getAttribute("rel");
            if (!rel || rel === "alternate") {
              link = linkEl.getAttribute("href") || "";
              break;
            }
          }

          // Author for Atom: <author><name>...</name></author>
          let authorName = "";
          const authorElement = entry.getElementsByTagName("author")[0];
          if (authorElement) {
            authorName = getElementTextContent(authorElement, "name");
          }
          if (!authorName) { // Fallback if <author><name> not found, try top-level author text
             authorName = getElementTextContent(entry, "author");
          }


          return {
            title: getElementTextContent(entry, "title"),
            link,
            description: getElementTextContent(entry, "summary"), // Atom uses summary
            content: content || getElementTextContent(entry, "summary"), // Use parsed content, or fallback to summary
            pubDate: getElementTextContentByOrder(entry, ["published", "updated"]),
            guid: getElementTextContent(entry, "id"),
            author: authorName,
            enclosure: null, // Atom uses different mechanism for enclosures
          };
        });
      }
    }

    return {
      title: feedTitle,
      description: feedDescription,
      items,
    };
  } catch (error) {
    // console.error("Error parsing feed:", error); // Original console log
    // Re-throw the error to be handled by the caller
    if (error instanceof Error) { // Ensure it's an error object
        console.error(`Error in parseFeed: ${error.message}`);
        throw new Error(`Failed to parse feed: ${error.message}`);
    }
    throw new Error(`Failed to parse feed: Unknown error occurred`);
  }
}


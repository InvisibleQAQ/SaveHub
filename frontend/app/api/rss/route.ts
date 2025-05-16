import { type NextRequest, NextResponse } from "next/server"
import { parseFeed } from "@/lib/rss-parser"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch RSS feed")

    const xml = await response.text()
    const feed = await parseFeed(xml)

    return NextResponse.json(feed)
  } catch (error) {
    console.error("Error fetching or parsing RSS feed:", error)
    return NextResponse.json({ error: "Failed to fetch or parse RSS feed" }, { status: 500 })
  }
}

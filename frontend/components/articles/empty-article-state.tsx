import { Newspaper } from "lucide-react"

export default function EmptyArticleState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
      <Newspaper className="h-12 w-12 text-slate-300 mb-4" />
      <h3 className="text-lg font-medium mb-2">No articles found</h3>
      <p className="text-sm text-slate-500 max-w-xs">
        This list doesn't have any articles yet. Try adding some feeds to this list.
      </p>
    </div>
  )
}

import { Badge } from "@/components/ui/badge"

export function PriorityBadge({ priority }: { priority: string }) {
  if (priority === 'high') {
    return <Badge className="bg-red-100 text-red-700">High</Badge>
  }

  if (priority === 'medium') {
    return <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
  }

  return <Badge className="bg-green-200 text-green-700">Low</Badge>
}

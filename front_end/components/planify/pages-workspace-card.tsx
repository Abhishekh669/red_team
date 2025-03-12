import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageModel } from "@/types"
import { format } from "date-fns"

interface WorkspaceCardProps {
  workspace: PageModel
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-red-600">{workspace.title}</CardTitle>
            <CardDescription className="text-slate-400 mt-1">Created on {format(new Date(workspace.createdAt), "MMM d, yyyy")}</CardDescription>
          </div>
         
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-300">{workspace.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/planify/pages/${workspace._id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full bg-red-600 border-slate-700 text-white hover:bg-slate-800 hover:text-red-500"
          >
            Visit Workspace
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


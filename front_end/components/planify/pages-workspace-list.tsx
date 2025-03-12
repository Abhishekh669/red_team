import { PageModel } from "@/types"
import { WorkspaceCard } from "./pages-workspace-card"

interface WorkspaceListProps {
  workspaces ?: PageModel[]
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces && workspaces?.map((workspace) => (
        <WorkspaceCard key={workspace._id} workspace={workspace} />
      ))}
    </div>
  )
}


"use client"

import * as React from "react"
import {
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }
}) {

  return (
    <>
      <SidebarMenuButton
              size="lg"
              className="flex  gap-x-4 "
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <teams.logo className="size-4"  />
              </div>
                <span>{teams.name}</span>
          </SidebarMenuButton>

    </>
    // <SidebarMenu>
    //   <SidebarMenuItem>
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <SidebarMenuButton
    //           size="lg"
    //           className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    //         >
    //           <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
    //             <activeTeam.logo className="size-4" />
    //           </div>

    //           <ChevronsUpDown className="ml-auto" />
    //         </SidebarMenuButton>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent
    //         className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
    //         align="start"
    //         side={isMobile ? "bottom" : "right"}
    //         sideOffset={4}
    //       >
    //         <DropdownMenuLabel className="text-xs text-muted-foreground">
    //           Teams
    //         </DropdownMenuLabel>
    //         {teams.map((team, index) => (
    //           <DropdownMenuItem
    //             key={team.name}
    //             onClick={() => setActiveTeam(team)}
    //             className="gap-2 p-2"
    //           >
    //             <div className="flex size-6 items-center justify-center rounded-sm border">
    //               <team.logo className="size-4 shrink-0" />
    //             </div>
    //             {team.name}
    //             <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
    //           </DropdownMenuItem>
    //         ))}
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem className="gap-2 p-2">
    //           <div className="flex size-6 items-center justify-center rounded-md border bg-background">
    //             <Plus className="size-4" />
    //           </div>
    //           <div className="font-medium text-muted-foreground">Add team</div>
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   </SidebarMenuItem>
    // </SidebarMenu>
  )
}
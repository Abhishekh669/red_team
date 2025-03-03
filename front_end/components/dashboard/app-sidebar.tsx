"use client"

import * as React from "react"
import {
  BookOpen,
  Clock,
  GalleryVerticalEnd,
  Key,
  LayoutDashboardIcon,
  ListTodo,
  Loader,
  MessageSquareIcon,
  Settings2,
  UserRoundCheck,
  Users,
  Users2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "../ui/separator"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { UserType } from "../authorize/authorize-user"

const data = {
  teams: 
    {
      name: "Red_Team",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  navMain: [
    
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboardIcon,
      
    },
    {
      title: "Chats",
      url: "chat",
      icon: MessageSquareIcon,
      
    },
    {
      title: "Manage Users",
      url: "manage-users",
      icon: Users2,
      isAdmin : true
    },
    {
      title: "Timer",
      url: "timer",
      icon: Clock,
    },
    {
      title: "Students",
      url: "students",
      icon: Users,
      
    },
   
    {
      title: "Subjects",
      url: "subjects",
      icon: BookOpen,
      
    },
    {
      title: "Attendance",
      url: "attendance",
      icon: UserRoundCheck,
      isAdmin : true,
      
    },
    {
      title: "Absent",
      url: "absent",
      icon: UserRoundCheck,
      
    },
    {
      title: "Todo",
      url: "todo",
      icon: ListTodo,
      
    },
    {
      title: "Authorize",
      url: "authorize",
      icon: Key,
      isAdmin : true,
      
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
    },
   
  ],
 
}

export function AppSidebar({user, user_loading ,isAdmin, ...props }: React.ComponentProps<typeof Sidebar> & {user : UserType} & {user_loading : boolean} & {isAdmin : boolean}) {

  
  
  const new_data = {
    ...data,
    user: {
      name: user?.name as string,
      email: user?.email as string,
      avatar: user?.image as string,
    },
    navMain: data.navMain.filter((item) => {
      return !item.isAdmin || (item.isAdmin && user?.isAdmin && isAdmin);
    }),
  };

 
  return (
      <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator />
      <SidebarContent >
        
        
        <>
        {user_loading ? (
           <div className=" h-full w-full flex justify-center items-center">
           <Loader className="size-5 animate-spin text-muted-foreground" />
         </div>
        ) : (
          <NavMain items={new_data.navMain} />
        )}
        </>
      </SidebarContent>
      <SidebarFooter className="bg-black">

        <NavUser user={new_data.user}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
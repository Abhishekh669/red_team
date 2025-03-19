"use client";

import { cn } from "@/lib/utils";
import { type IconType } from "react-icons/lib";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";

interface SubRouteType {
  title: string;
  url: string;
  icon: LucideIcon | IconType;
  item?: {
    title: string;
    url: string;
    icon: LucideIcon | IconType;
  }[];
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | IconType;
    isAdmin?: boolean;
    items?: SubRouteType[];
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Prefetch pages when the component mounts
    items.forEach((item) => {
      router.prefetch(`/${item.url}`);
    });
  }, [items, router]);

  return (
    <SidebarGroup className="bg-black">
      <SidebarGroupLabel className="text-rose-700">
        Features :{" "}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.url}
            asChild
            defaultOpen={pathname.includes(item.url)}
            className="group/collapsible"
          >
            <SidebarMenuItem
              className={cn(
                "flex relative text-red-600 items-center pr-2 rounded-md"
              )}
            >
              {item?.items ? (
                <div className="w-full">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "hover:bg-red-600/80 w-full h-full  hover:text-white p-0 m-0   group-data-[state=open]/collasible:mb-0",
                        pathname.includes(item.url) &&
                          "bg-red-600 text-white"
                      )}
                    >
                      <div className="flex  gap-x-2 relative  w-full px-2 py-1 hover:bg-red-600/80 hover:text-white group-data-[state=open]/collasible:bg-red-600/80">
                          {item.icon && <item.icon className="size-5" />} 
                          <span >{item.title}</span> 
                        {/* Rotating Chevron Icon */}
                        <ChevronRight className=" absolute right-1 ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          {subItem.item ? (
                            <Collapsible
                              asChild
                              className="group/subcollapsible"
                            >
                              <div>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton
                                    tooltip={subItem.title}
                                    className={cn(
                                      "hover:bg-red-600/80 text-red-600 w-full h-full p-0 m-0",
                                      pathname.includes(subItem.url) &&
                                        "bg-red-600/80 text-white"
                                    )}
                                  >
                                    <div className=" w-full h-full  py-1 px-2 flex justify-between  hover:bg-red-600/80 hover:text-white ">
                                      <div className="flex gap-x-3 ml-2">
                                        {subItem.icon && (
                                          <subItem.icon className="size-4" />
                                        )}
                                        <span>{subItem.title}</span>
                                      </div>

                                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90" />
                                    </div>
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent asChild>
                                  <SidebarMenuSub>
                                    {subItem.item.map((i) => (
                                      <SidebarMenuSubItem
                                        key={`${subItem.title}-${i.title}`}
                                        onMouseEnter={() =>
                                          router.prefetch(`/planify/${subItem.url}/${i.url}`)
                                        }
                                        onClick={()=>router.push(`/planify/${subItem.url}/${i.url}`)}
                                      >
                                        <SidebarMenuSubButton
                                          asChild
                                          className={cn(
                                            "hover:bg-red-600/80 text-red-600",
                                            
                                          )}
                                        >
                                          <Button
                                            className={cn(" w-full my-[2px] bg-transparent border-none hover:bg-red-600/80 hover:text-white",
                                              pathname.includes(i.url) &&
                                              "bg-red-600 text-white"
                                              
                                            )}
                                            variant={"outline"}
                                          >
                                            <div className="flex  w-full gap-x-3">
                                              {i.icon && (
                                                <i.icon className="" />
                                              )}
                                              <span>{i.title}</span>
                                            </div>
                                          </Button>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          ) : (
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "hover:bg-red-600/80 p-0 m-0  text-red-600",
                                pathname.includes(subItem.url) &&
                                  "bg-red-600/80 text-white"
                              )}
                              onMouseEnter={() =>
                                router.prefetch(`/${item.url}`)
                              }
                              onClick={() =>router.push(`/${item.url}/${subItem.url}`)}
                            >
                              
                              <Button className={cn("w-full ml-2  my-[2px] bg-transparent h-full justify-start border-none",
                                 pathname.includes(subItem.url) &&
                                 "bg-red-600/80 text-white"
                              )} variant={"outline"}>
                                <div className="flex w-full gap-x-2 hover:text-white hover:bg-red-600/80 jusitfy-between px-2 py-1 ">
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                                </div>
                              </Button>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  onMouseEnter={() => router.prefetch(`/${item.url}`)} // Prefetch on hover
                  onClick={() => {
                    router.push(`/${item.url}`);
                  }}
                  className={cn(
                    "hover:bg-red-600/80 shrink-0 text-red-600 hover:text-white",
                    pathname.includes(item.url) &&
                      "text-white bg-red-600 border"
                  )}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

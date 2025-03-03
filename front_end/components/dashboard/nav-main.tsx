"use client";

import { cn } from "@/lib/utils";
import { type IconType } from "react-icons/lib";
import { type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | IconType;
    isAdmin?: boolean;
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
          <SidebarMenuItem
            key={item.title}
            className={cn(
              "flex relative text-red-600 items-center pr-2 rounded-md   "
            )}
          >
            <SidebarMenuButton
              tooltip={item.title}
              onMouseEnter={() => router.prefetch(`/${item.url}`)} // Prefetch on hover
              onClick={() => {
                router.push(`/${item.url}`);
              }}
              className={cn(
                "hover:bg-red-600/80 shrink-0 hover:text-white ",
                pathname.includes(item.url) && "text-white bg-red-600 border"
              )}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

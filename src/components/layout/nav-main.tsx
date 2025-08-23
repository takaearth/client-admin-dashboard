"use client";
import { usePathname } from "next/navigation";
//ui
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { ChevronRight, type LucideIcon } from "lucide-react";
//custom ui
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isSubItemActive = isLinkActive(subItem.url);
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url} className={cn(isSubItemActive && "bg-sidebar-primary text-sidebar-primary-foreground font-medium")}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );

  function isLinkActive(url: string): boolean {
    // Split the URL by '/', filter out empty segments to handle multiple slashes and trailing slashes
    const segmentsArr = url.split("/").filter((segment) => segment !== "");
    const pathnameArr = pathname.split("/").filter((segment) => segment !== "");

    if (segmentsArr.length >= 3 && pathnameArr.length >= 3) {
      // validate shortended versions
      let segments = segmentsArr.slice(0, 2).join("/");
      let pathnameSeg = pathnameArr.slice(0, 2).join("/");

      if (segments === pathnameSeg) {
        return true;
      }
    } else {
      if (pathname === url) {
        return true;
      }
    }

    return false;
  }
}

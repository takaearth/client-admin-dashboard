"use client";
import * as React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AudioWaveform, BookOpen, Bot, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";
//ui
import { NavUser } from "@/components/layout/nav-user";
import { NavMain } from "@/components/layout/nav-main";
import { NavProjects } from "@/components/layout/nav-projects";
import { CountrySwitcher } from "@/components/layout/country-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

// Static parts of the data
const staticData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  countries: [
    {
      name: "Taka Kenya",
      logo: GalleryVerticalEnd,
      plan: "Kenya (+254)",
    },
    {
      name: "Taka Indonesia",
      logo: AudioWaveform,
      plan: "Indonesia (+62)",
    },
    {
      name: "Taka Rwanda",
      logo: Bot,
      plan: "Rwanda (+250)",
    },
  ],
  projects: [
    {
      name: "Country Overview",
      url: "/dashboard",
      icon: Frame,
    },
    {
      name: "Smartbins Overview",
      url: "/dashboard/smartbins",
      icon: Frame,
    },
    {
      name: "Customer Care",
      url: "#",
      icon: Map,
    },
    {
      name: "Pickups & Requests",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navMainItems = React.useMemo(() => {
    const dataTablesBaseUrl = "/dashboard";
    return [
      {
        title: "Data Tables",
        url: dataTablesBaseUrl,
        icon: SquareTerminal,
        isActive: pathname.startsWith(dataTablesBaseUrl),
        items: [
          {
            title: "Users",
            url: `${dataTablesBaseUrl}/users`,
          },
          {
            title: "Events",
            url: `${dataTablesBaseUrl}/events`,
          },
          {
            title: "Clients",
            url: `${dataTablesBaseUrl}/clients`,
          },
          {
            title: "Transactions",
            url: `${dataTablesBaseUrl}/transactions`,
          },
          {
            title: "Smartbins",
            url: `${dataTablesBaseUrl}/smartbins/data`,
          },
          {
            title: "Smartbin Drops",
            url: `${dataTablesBaseUrl}/smartbins-drops`,
          },
          {
            title: "Pickup Requests",
            url: `${dataTablesBaseUrl}/requests`,
          },
          {
            title: "Pickup Drops",
            url: `${dataTablesBaseUrl}/pickups`,
          },
          {
            title: "Casuals",
            url: `${dataTablesBaseUrl}/casuals`,
          },
        ],
      },
      {
        title: "Documentation",
        url: "#", // Placeholder URL
        icon: BookOpen,
        isActive: pathname.startsWith("/documentation"),
        items: [
          {
            title: "Terms of Use",
            url: "#",
          },
          {
            title: "Privacy Policy",
            url: "#",
          },
          {
            title: "Terms of Service",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#", // Placeholder URL
        icon: Settings2,
        isActive: pathname.startsWith("/settings"),
        items: [
          {
            title: "General",
            url: "#",
          },
        ],
      },
    ];
  }, [pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CountrySwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={staticData.projects} />
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

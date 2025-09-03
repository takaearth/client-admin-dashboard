"use client";
import { useMemo } from "react";
//ui
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
//custom ui
import { SmartbinsStatsSection } from "@/components/sections/smartbins-stats";
import { SmartbinsChartsSection } from "@/components/sections/smartbins-charts";
//custom
import { Smartbin, SmartbinDrop } from "@/lib/types";
import { useGetSmartbins, useGetSmartbinsDrops } from "@/data/smartbins";

export default function SmartbinsPage() {
  const { data: smartbins, error: smartbinsError, isFetched: smartbinsFetched } = useGetSmartbins();
  const { data: smartbinsDrops, error: smartbinsDropsError, isFetched: smartbinsDropsFetched } = useGetSmartbinsDrops();

  const smartbinStats = useMemo(() => {
    if (!smartbinsFetched) return null;
    let deployed = 0;
    let clientCounts: Record<string, number> = {},
      statusCounts: Record<string, number> = {};

    smartbins?.forEach((bin: Smartbin) => {
      if (bin.status === "deployed") deployed++;
      // Ensure bin.client is a object with id and name, provide a fallback for undefined/null clients
      const client = typeof bin.client === "object" && bin.client.id && bin.client.name ? bin.client : { id: "Unassigned", name: "Unassigned" };
      clientCounts[client.name] = (clientCounts[client.name] || 0) + 1;
      // Ensure bin.status is a string, provide a fallback for undefined/null sources
      const status = typeof bin.status === "string" && bin.status.trim() !== "" ? bin.status : "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Compute derived stats here
    return {
      total: smartbins?.length || 0,
      deployed,
      clientCounts,
      statusCounts,
    };
  }, [smartbinsFetched, smartbins]);

  const smartbinDropsStats = useMemo(() => {
    if (!smartbinsDropsFetched) return null;

    let plastic = 0,
      other = 0,
      claimed = 0,
      unclaimed = 0,
      expired = 0,
      pending = 0;
    let sourceCounts: Record<string, number> = {},
      syncCounts: Record<string, number> = {},
      wasteCounts: Record<string, number> = {};

    smartbinsDrops?.forEach((drop: SmartbinDrop) => {
      if (drop.status === "claimed") claimed++;
      if (drop.status === "unclaimed") unclaimed++;
      if (drop.status === "expired") expired++;
      if (drop.status === "pending") pending++;
      // Ensure drop.source is a string, provide a fallback for undefined/null sources
      const source = typeof drop.source === "string" && drop.source.trim() !== "" ? drop.source : "Unknown";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      // Ensure drop.sync_source is a string, provide a fallback for undefined/null sources
      const sync = typeof drop.sync_source === "string" && drop.sync_source.trim() !== "" ? drop.sync_source : "Unclaimed";
      syncCounts[sync] = (syncCounts[sync] || 0) + 1;
      wasteCounts.plastic = (wasteCounts.plastic || 0) + (drop?.plastic || 0);
      wasteCounts.other = (wasteCounts.other || 0) + (drop?.other || 0);
    });

    // Compute derived stats here
    return {
      total: smartbinsDrops?.length || 0,
      claimed,
      unclaimed,
      expired,
      pending,
      sourceCounts,
      syncCounts,
      wasteCounts,
    };
  }, [smartbinsDropsFetched, smartbinsDrops]);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Smartbins Overview</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SmartbinsStatsSection
          loading={!smartbinsFetched || !smartbinsDropsFetched}
          error={smartbinsError || smartbinsDropsError}
          smartbins={smartbinStats}
          smartbinDrops={smartbinDropsStats}
        />
        <SmartbinsChartsSection
          loading={!smartbinsFetched || !smartbinsDropsFetched}
          error={smartbinsError || smartbinsDropsError}
          smartbins={smartbinStats}
          smartbinDrops={smartbinDropsStats}
        />
      </div>
    </SidebarInset>
  );
}

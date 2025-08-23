"use client";
import { useState, useEffect } from "react";
//ui
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
//custom ui
import SmartbinsMap from "@/components/maps/smartbins";
import { PieChartCard } from "@/components/charts/pie-chart";
//custom
import useFirebaseSmartbins from "@/hooks/firebase-smartbins";
import useFirebaseSmartbinsDrops from "@/hooks/firebase-smartbins-drops";

function CardSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <Skeleton className="h-4 w-[120px] mb-2" /> {/* For CardDescription */}
        <Skeleton className="h-8 w-[70px]" /> {/* For CardTitle */}
      </CardHeader>
    </Card>
  );
}

export function SmartbinsChartsSection() {
  const { smartbins, loading: smartbinsLoading, error: smartbinsError } = useFirebaseSmartbins();
  const { smartbinsDrops, loading: smartbinsDropsLoading, error: smartbinsDropsError } = useFirebaseSmartbinsDrops();

  const [clientData, setClientData] = useState<Record<string, number>>({});
  const [statusData, setStatusData] = useState<Record<string, number>>({});
  const [sourceData, setSourceData] = useState<Record<string, number>>({});
  const [syncData, setSyncData] = useState<Record<string, number>>({});

  useEffect(() => {
    if (smartbinsDrops && smartbinsDrops.length > 0) {
      // Calculate distribution stats
      const sourceCounts: Record<string, number> = {};
      const syncCounts: Record<string, number> = {};

      smartbinsDrops.forEach((drop) => {
        // Ensure drop.source is a string, provide a fallback for undefined/null sources
        const source = typeof drop.source === "string" && drop.source.trim() !== "" ? drop.source : "Unknown";
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        // Ensure drop.sync_source is a string, provide a fallback for undefined/null sources
        const sync = typeof drop.sync_source === "string" && drop.sync_source.trim() !== "" ? drop.sync_source : "Unclaimed";
        syncCounts[sync] = (syncCounts[sync] || 0) + 1;
      });

      setSourceData(sourceCounts);
      setSyncData(syncCounts);
    }
  }, [smartbinsDrops]);

  useEffect(() => {
    if (smartbins && smartbins.length > 0) {
      // Calculate distribution stats
      const clientCounts: Record<string, number> = {};
      const statusCounts: Record<string, number> = {};

      smartbins.forEach((bin) => {
        // Ensure bin.client is a object with id and name, provide a fallback for undefined/null clients
        const client = typeof bin.client === "object" && bin.client.id && bin.client.name ? bin.client : { id: "Unassigned", name: "Unassigned" };
        clientCounts[client.name] = (clientCounts[client.name] || 0) + 1;
        // Ensure bin.status is a string, provide a fallback for undefined/null sources
        const status = typeof bin.status === "string" && bin.status.trim() !== "" ? bin.status : "Unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      setClientData(clientCounts);
      setStatusData(statusCounts);
    }
  }, [smartbins]);

  if (smartbinsLoading || smartbinsDropsLoading) {
    return (
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 dark:*:data-[slot=card]:bg-card lg:px-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (smartbinsError || smartbinsDropsError) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
        <div className="col-span-full flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-destructive bg-destructive/10 p-8 shadow-sm">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold tracking-tight text-destructive">Error Loading Card Data</h3>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            {smartbinsError && <p className="text-sm text-muted-foreground">{smartbinsError.message || "An unexpected error occurred. Please try again later."}</p>}
            {smartbinsDropsError && <p className="text-sm text-muted-foreground">{smartbinsDropsError.message || "An unexpected error occurred. Please try again later."}</p>}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 @xl/main:grid-cols-3 gap-4 *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card px-4 lg:px-6">
      <SmartbinsMap className="@xl/main:col-span-2 @xl/main:row-span-2" />
      <PieChartCard id="smartbins-status-pie-chart" title="Smartbins Status Distribution" description="Shows the distribution of smartbin statuses." stats={statusData} />
      <PieChartCard id="smartbins-client-pie-chart" title="Smartbins Clients Distribution" description="Shows the distribution of smartbin clients." stats={clientData} />
      <PieChartCard id="smartbins-sync-pie-chart" title="Drop Sync Source Distribution" description="Shows the distribution of drop sync sources." stats={syncData} />
      <PieChartCard id="smartbins-sources-pie-chart" title="Drop Sources Distribution" description="Shows the distribution of drop sources." stats={sourceData} />
      <PieChartCard id="smartbins-sync-pie-chart" title="Drop Sync Source Distribution" description="Shows the distribution of drop sync sources." stats={syncData} />
    </div>
  );
}

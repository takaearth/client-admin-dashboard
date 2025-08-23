"use client";
import { useState, useEffect } from "react";
//ui
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
//custom ui
import SmartbinMap from "@/components/maps/smartbin";
import { PieChartCard } from "@/components/charts/pie-chart";
//custom
import { Smartbin, SmartbinDrop } from "@/lib/types";

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

export function SmartbinChartsSection({
  smartbin,
  loading,
  error,
  smartbinDrops,
}: {
  smartbin: Smartbin | undefined;
  loading: boolean;
  error: any;
  smartbinDrops: SmartbinDrop[];
}) {
  const [sourceData, setSourceData] = useState<Record<string, number>>({});
  const [syncData, setSyncData] = useState<Record<string, number>>({});

  useEffect(() => {
    if (smartbinDrops && smartbinDrops.length > 0) {
      // Calculate source distribution stats
      const sourceCounts: Record<string, number> = {};
      const syncCounts: Record<string, number> = {};

      smartbinDrops.forEach((drop) => {
        // Ensure drop.source is a string, provide a fallback for undefined/null sources
        const source = typeof drop.source === "string" && drop.source.trim() !== "" ? drop.source : "Unknown";
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        // Ensure drop.source is a string, provide a fallback for undefined/null sources
        const sync = typeof drop.sync_source === "string" && drop.sync_source.trim() !== "" ? drop.sync_source : "Unclaimed";
        syncCounts[sync] = (syncCounts[sync] || 0) + 1;
      });

      setSourceData(sourceCounts);
      setSyncData(syncCounts);
    }
  }, [smartbinDrops]);

  useEffect(() => {
    if (smartbinDrops.length > 0) {
    }
  }, [smartbinDrops]);

  if (loading) {
    return (
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 dark:*:data-[slot=card]:bg-card lg:px-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
        <div className="col-span-full flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-destructive bg-destructive/10 p-8 shadow-sm">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold tracking-tight text-destructive">Error Loading Card Data</h3>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            {error.message || "An unexpected error occurred while fetching data for the cards. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 @xl/main:grid-cols-3 gap-4 *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <SmartbinMap smartbin={smartbin} />
      <PieChartCard id="smartbin-sync-pie-chart" title="Drop Sync Source Distribution" description="Shows the distribution of drop sync sources." stats={syncData} />
      <PieChartCard id="smartbin-sources-pie-chart" title="Drop Sources Distribution" description="Shows the distribution of drop sources." stats={sourceData} />
    </div>
  );
}

"use client";
//ui
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
//custom ui
import SmartbinsMap from "@/components/maps/smartbins";
import { PieChartCard } from "@/components/charts/pie-chart";
//custom

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

export function SmartbinsChartsSection({ loading, error, smartbins, smartbinDrops }: { loading: boolean; error: any; smartbins: any; smartbinDrops: any }) {
  console.log("SmartbinsChartsSection props:", { loading, error, smartbins, smartbinDrops });
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
            {error && <p className="text-sm text-muted-foreground">{error.message || "An unexpected error occurred. Please try again later."}</p>}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 @xl/main:grid-cols-3 gap-4 *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card px-4 lg:px-6">
      <SmartbinsMap className="@xl/main:col-span-2 @xl/main:row-span-2" />
      <PieChartCard id="smartbins-status-pie-chart" title="Smartbins Status" description="Shows the distribution of smartbin statuses." stats={smartbins.statusCounts} />
      <PieChartCard id="smartbins-client-pie-chart" title="Smartbins Clients" description="Shows the distribution of smartbin clients." stats={smartbins.clientCounts} />
      <PieChartCard id="smartbins-waste-chart" title="Waste Types" description="Shows the distribution of waste types." stats={smartbinDrops.wasteCounts} />
      <PieChartCard id="smartbins-sources-pie-chart" title="Drop Sources" description="Shows the distribution of drop sources." stats={smartbinDrops.sourceCounts} />
      <PieChartCard id="smartbins-sync-pie-chart" title="Drop Sync Source" description="Shows the distribution of drop sync sources." stats={smartbinDrops.syncCounts} />
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
//ui
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUpIcon, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//custom ui
import { RadialChartCard } from "@/components/charts/radial-chart";
//custom
import { formatDate } from "@/lib";
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

export function SmartbinStatsSection({ loading, error, smartbin, smartbinDrops }: { loading: boolean; error: any; smartbin: Smartbin | undefined; smartbinDrops: SmartbinDrop[] }) {
  const [containerStats, setContainerStats] = useState({
    plastic: 0,
    other: 0,
  });
  const [pointsStats, setPointsStats] = useState({
    completed: 0,
    pending: 0,
    expired: 0,
  });

  useEffect(() => {
    if (smartbinDrops.length > 0) {
      const plastic = smartbinDrops.reduce((total, drop) => total + drop?.plastic, 0);
      const other = smartbinDrops.reduce((total, drop) => total + drop?.other, 0);
      const completed = smartbinDrops.filter((drop) => drop.status === "complete").length;
      const pending = smartbinDrops.filter((drop) => drop.status === "pending").length;
      const expired = smartbinDrops.filter((drop) => drop.status === "expired").length;

      setContainerStats({ plastic, other });
      setPointsStats({ completed, pending, expired });
    }
  }, [smartbinDrops]);

  const smartbinDbSync = smartbin?.dbSync ? formatDate(smartbin?.dbSync) : "Never";
  const smartbinImgSync = smartbin?.imgSync ? formatDate(smartbin?.imgSync) : "Never";

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
    <div className="@xl/main:grid-cols-2 grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardDescription>Assigned Client</CardDescription>
          <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums">{smartbin?.client?.name || "No Client"}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">Shows Client smartbin is assigned to</div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardTitle className="@[250px]/card:text-lg text-xl font-semibold tabular-nums">Smartbin Status</CardTitle>
        </CardHeader>
        <CardContent>
          {smartbin?.status === "deployed" ? (
            <div className="flex gap-3 items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400" /> <p>Deployed</p>
            </div>
          ) : smartbin?.status === "maintenance" ? (
            <div className="flex gap-3 items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400" /> <p>Under Maintainance</p>
            </div>
          ) : smartbin?.status === "storage" ? (
            <div className="flex gap-3 items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 dark:bg-purple-400" /> <p>Storage</p>
            </div>
          ) : (
            smartbin?.status === "deactivated" && (
              <div className="flex gap-3 items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400" /> <p>Deactivated</p>
              </div>
            )
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-sm">Can be changed using the edit button.</CardFooter>
      </Card>
      <RadialChartCard id="redemption-radial-chart" title="Points Status" description="Shows status of drop assigned points." stats={pointsStats} totalLabel="Drops" />
      <RadialChartCard
        id="redemption-radial-chart"
        title="Item Waste Types"
        description="Shows the waste type distribution for items dropped."
        stats={containerStats}
        totalLabel="Containers"
      />
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardDescription>Last DB Sync</CardDescription>
          <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums">{smartbinDbSync}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">Last time smartbin synced database data</div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardDescription>Last Image Sync</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{smartbinImgSync}</CardTitle>
          <div className="absolute right-4 top-0">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +15%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">Last time smartbin synced images data</div>
        </CardFooter>
      </Card>
    </div>
  );
}

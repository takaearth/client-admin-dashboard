"use client";
//ui
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUpIcon, AlertTriangle } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//custom
import { Smartbin, SmartbinDrop } from "@/lib/types";

function CardSkeleton() {
  return (
    <Card className="@container/card gap-2">
      <CardHeader>
        <Skeleton className="h-4 w-[120px] mb-2" /> {/* For CardDescription */}
        <Skeleton className="h-8 w-[70px]" /> {/* For CardTitle */}
      </CardHeader>
    </Card>
  );
}

export function SmartbinsStatsSection({ loading, error, smartbins, smartbinDrops }: { loading: boolean; error: any; smartbins: any; smartbinDrops: any }) {

  if (loading) {
    return (
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
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
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardDescription>Total Smartbins</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{smartbins?.total}</CardTitle>
          <div className="absolute right-4 top-0">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +15%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardDescription>Total Deployed Smartbins</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{smartbins?.deployed}</CardTitle>
          <div className="absolute right-4 top-0">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +15%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardDescription>Total Drops</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{smartbinDrops?.total}</CardTitle>
          <div className="absolute right-4 top-0">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +15%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardDescription>Total Claimed Drops</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{smartbinDrops?.claimed}</CardTitle>
          <div className="absolute right-4 top-0">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +15%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}

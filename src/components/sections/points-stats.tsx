"use client";
import { useEffect, useState } from "react";
//ui
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, HandCoins, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//custom ui
import { PieChartCard } from "@/components/charts/pie-chart";
//custom
import { useGetUsers } from "@/data/users";
import { useGetTransactions } from "@/data/transactions";
import { Transaction, User } from "@/lib/types";

function CardSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <Skeleton className="h-4 w-[120px] mb-2" /> {/* For CardDescription */}
        <Skeleton className="h-8 w-[70px]" /> {/* For CardTitle */}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1">
        {" "}
        {/* Mimicking original footer classes */}
        <Skeleton className="h-4 w-full" /> {/* For first line of text */}
        <Skeleton className="h-4 w-4/5" /> {/* For second line of text */}
      </CardFooter>
    </Card>
  );
}

export function PointsStatsSection() {
  const { data: users, error, isFetched } = useGetUsers();
  const { data: transactions, error: errorTransactions, isFetched: isFetchedTransactions } = useGetTransactions();

  const [totalEarned, setTotalEarned] = useState(0);
  const [totalRedeemed, setTotalRedeemed] = useState(0);

  useEffect(() => {
    if (isFetched && !error && users) {
      //count total user points
      const earned = users.reduce((total: number, user: User) => total + (user?.points || 0), 0);
      setTotalEarned(earned);
    }
  }, [users, isFetched, error]);

  useEffect(() => {
    if (isFetchedTransactions && !errorTransactions) {
      //count total redeemed points
      const redeemed = transactions.reduce((total: number, transaction: Transaction) => total + (parseInt(transaction?.paid_amount || "0") || 0), 0);
      setTotalRedeemed(redeemed);
    }
  }, [transactions, isFetchedTransactions, errorTransactions]);

  if (!isFetched) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
        <CardSkeleton /> {/* Skeleton for Total Events card */}
        <CardSkeleton /> {/* Skeleton for Total Accounts card */}
        <div className="@xl/main:col-span-2 @5xl/main:col-span-4">
          {" "}
          {/* Wrapper for chart skeleton to span columns */}
          <CardSkeleton /> {/* Skeleton for PointsChart card */}
        </div>
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
    <div className="grid grid-cols-1 gap-4 @5xl/main:grid-cols-3 px-4 lg:px-6 *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-1 gap-4">
        <Card data-slot="card" className="@container/card gap-2">
          <CardHeader className="relative">
            <CardDescription className="flex justify-between items-center gap-1">
              <span>Total Redeemed Taka Points</span> <HandCoins />{" "}
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">KES {totalRedeemed}</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              {" "}
              Total points redeemed by users: <span className="font-bold">{totalRedeemed / 2}</span>{" "}
            </div>
          </CardFooter>
        </Card>
        <Card data-slot="card" className="@container/card gap-2">
          <CardHeader className="relative">
            <CardDescription className="flex justify-between items-center gap-1">
              <span>Total Earned Taka Points</span> <Wallet />{" "}
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">KES {totalEarned * 2}</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              {" "}
              Total points earned by users: <span className="font-bold">{totalEarned}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
      <PieChartCard
        className="@xl/main:col-span-2"
        id="points-pie-chart"
        title="Points Pie Chart"
        description="Distribution of user points in KES"
        stats={{ redeemed: totalRedeemed / 2, held: totalEarned * 2 - totalRedeemed / 2 }}
      />
    </div>
  );
}
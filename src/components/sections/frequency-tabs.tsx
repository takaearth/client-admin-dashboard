"use client";
import React, { use, useEffect, useState } from "react";
//ui
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
//custom ui
import { DataTable } from "@/components/tables/data-tables";
import { userFrequencyTableColumns } from "@/components/tables/schemas/user-frequency";
//custom
import { SmartbinDrop, Transaction, UserFrequency } from "@/lib/types";
import useFirebaseUsers from "@/hooks/firebase-users";
import { useGetSmartbinsDrops } from "@/data/smartbins";
import { useGetTransactions } from "@/data/transactions";

export default function FrequencyTabsSection() {
  const { users, loading: usersLoading, error: usersError } = useFirebaseUsers();
  const { data: transactions, error: transactionsError, isFetched: transactionsFetched } = useGetTransactions();
  const { data: smartbinsDrops, error: smartbinsDropsError, isFetched: smartbinsDropsFetched } = useGetSmartbinsDrops();

  const [dropFrequencyData, setDropFrequencyData] = useState<UserFrequency[]>([]);
  const [transactionsFrequencyData, setTransactionsFrequencyData] = useState<UserFrequency[]>([]);

  useEffect(() => {
    // Clear data if still loading or if there's an error
    if (usersLoading || usersError || !transactionsFetched || transactionsError) {
      setTransactionsFrequencyData([]);
      return;
    }

    // Proceed if all data is loaded successfully
    if (transactions && users) {
      const completedTransactions = transactions.filter((trans: Transaction) => trans.status?.toLocaleLowerCase() === "completed");

      const countsByUserIdentifier: Record<string, number> = {};
      completedTransactions.forEach((transaction: Transaction) => {
        let userIdentifier: string | undefined;

        // Attempt to get user identifier from transaction.user directly if it's a string
        const tUser = transaction.userId as any; // Use 'any' for flexibility if type is unknown/mixed
        if (tUser && typeof tUser === "string") {
          userIdentifier = tUser;
        }

        if (userIdentifier) {
          countsByUserIdentifier[userIdentifier] = (countsByUserIdentifier[userIdentifier] || 0) + 1;
        }
      });

      const processedData: UserFrequency[] = Object.entries(countsByUserIdentifier).map(([phoneNumber, count]) => {
        const user = users.find((u) => u.id === phoneNumber);
        return {
          phoneNumber,
          count,
          name: user?.name || "Unknown",
          state: user?.state || "Unknown",
        };
      });
      setTransactionsFrequencyData(processedData);
    } else {
      // Clear data if loading, error, or no transactions
      setTransactionsFrequencyData([]);
    }
  }, [transactions, transactionsFetched, transactionsError, users, usersLoading, usersError]);

  useEffect(() => {
    // Clear data if still loading or if there's an error
    if (usersLoading || usersError || !smartbinsDropsFetched || smartbinsDropsError) {
      setDropFrequencyData([]);
      return;
    }

    // Proceed if all data is loaded successfully
    if (smartbinsDrops && users) {
      const syncedDrops = smartbinsDrops.filter((drop: SmartbinDrop) => drop.status?.toLocaleLowerCase() === "claimed");

      const countsByUserIdentifier: Record<string, number> = {};
      syncedDrops.forEach((drop: SmartbinDrop) => {
        let userIdentifier: string | undefined;

        const dUser = drop.userId as any;
        if (dUser && typeof dUser === "string") {
          userIdentifier = dUser;
        }

        if (userIdentifier) {
          countsByUserIdentifier[userIdentifier] = (countsByUserIdentifier[userIdentifier] || 0) + 1;
        }
      });

      const processedData: UserFrequency[] = Object.entries(countsByUserIdentifier).map(([phoneNumber, count]) => {
        const user = users.find((u) => u.id === phoneNumber);
        return {
          phoneNumber,
          count,
          name: user?.name || "Unknown",
          state: user?.state || "Unknown",
        };
      });
      setDropFrequencyData(processedData);
    } else {
      // Clear data if loading, error, or no transactions
      setDropFrequencyData([]);
    }
  }, [smartbinsDrops, smartbinsDropsFetched, smartbinsDropsError, users, usersLoading, usersError]);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card gap-2">
        <CardHeader className="relative">
          <CardTitle className="@[250px]/card:text-xl text-lg font-semibold tabular-nums">Frequency Tables</CardTitle>
          <CardDescription>Shows interactions as frequency tables</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="drops" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="drops">Smartbin Drops</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="pickups">Pickups</TabsTrigger>
            </TabsList>
            <TabsContent value="drops">
              {!smartbinsDropsFetched || usersLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : smartbinsDropsError || usersError ? (
                <p className="text-destructive">Error loading data: {smartbinsDropsError?.message || usersError?.message || "An error occurred."}</p>
              ) : dropFrequencyData.length > 0 ? (
                <DataTable
                  sort={[
                    {
                      id: "count",
                      desc: true,
                    },
                  ]}
                  defaultSize={10}
                  data={dropFrequencyData}
                  columns={userFrequencyTableColumns}
                />
              ) : (
                <p>No completed smartbin drops data available to display frequency.</p>
              )}
            </TabsContent>
            <TabsContent value="transactions">
              {!transactionsFetched || usersLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : transactionsError || usersError ? (
                <p className="text-destructive">Error loading data: {transactionsError?.message || usersError?.message || "An error occurred."}</p>
              ) : transactionsFrequencyData.length > 0 ? (
                <DataTable
                  sort={[
                    {
                      id: "count",
                      desc: true,
                    },
                  ]}
                  defaultSize={10}
                  data={transactionsFrequencyData}
                  columns={userFrequencyTableColumns}
                />
              ) : (
                <p>No completed transaction data available to display frequency.</p>
              )}
            </TabsContent>
            <TabsContent value="pickups">
              <p>No completed pickups data available to display frequency.</p>
            </TabsContent>
            <TabsContent value="requests">
              <p>No completed requests data available to display frequency.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

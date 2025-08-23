"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
//ui
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
//custom ui
import { DataTable } from "@/components/tables/data-tables";
//custom
import { User, Transaction, SmartbinDrop, Pickup, Request } from "@/lib/types";

import useFirebaseUsers from "@/hooks/firebase-users";
import useFirebasePickups from "@/hooks/firebase-pickups";
import useFirebaseRequests from "@/hooks/firebase-requests";
import useFirebaseTransactions from "@/hooks/firebase-transactions";
import useFirebaseSmartbinDrops from "@/hooks/firebase-smartbins-drops";

import { pickupColumns } from "@/components/tables/schemas/pickups";
import { requestColumns } from "@/components/tables/schemas/requests";
import { transactionColumns } from "@/components/tables/schemas/transactions";
import { smartbinsDropColumns } from "@/components/tables/schemas/smartbins-drops";

export default function UserPage() {
  const params = useParams();
  const userIdEncoded = params.userId as string;
  const userId = decodeURIComponent(userIdEncoded);

  const { users, loading: usersLoading, error: usersError } = useFirebaseUsers();
  const { pickups, loading: pickupsLoading, error: pickupsError } = useFirebasePickups();
  const { requests, loading: requestsLoading, error: requestsError } = useFirebaseRequests();
  const { transactions, loading: transactionsLoading, error: transactionsError } = useFirebaseTransactions();
  const { smartbinsDrops, loading: smartbinsDropsLoading, error: smartbinsDropsError } = useFirebaseSmartbinDrops();

  const [user, setUser] = useState<User | undefined>();
  const [userPickups, setUserPickups] = useState<Pickup[]>([]);
  const [userRequests, setUserRequests] = useState<Request[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [userSmartbinsDrops, setUserSmartbinsDrops] = useState<SmartbinDrop[]>([]);

  useEffect(() => {
    if (userId) {
      //find smartbin
      const usr = users.find((user) => user.id === userId);
      setUser(usr);
    }
  }, [users, userId]);

  useEffect(() => {
    if (userId && smartbinsDrops.length > 0) {
      //filter drops
      const drops = smartbinsDrops.filter((drop) => drop.userId === userId);
      setUserSmartbinsDrops(drops);
    }
  }, [smartbinsDrops, userId]);

  useEffect(() => {
    if (userId && transactions.length > 0) {
      //filter transactions
      const trans = transactions.filter((transaction) => transaction.userId === userId);
      setUserTransactions(trans);
    }
  }, [transactions, userId]);

  useEffect(() => {
    if (userId && pickups.length > 0) {
      //filter pickups
      const picks = pickups.filter((pickup) => pickup.userId === userId);
      setUserPickups(picks);
    }
  }, [pickups, userId]);

  useEffect(() => {
    if (userId && requests.length > 0) {
      //filter requests
      const reqs = requests.filter((request) => request.userId === userId);
      setUserRequests(reqs);
    }
  }, [requests, userId]);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Data Tables</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Users </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>User Data </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2 px-4">
        <Tabs defaultValue="drops" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="drops">Drops</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="pickups">Pickups</TabsTrigger>
          </TabsList>
          <TabsContent value="drops">
            {smartbinsDropsLoading || usersLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : smartbinsDropsError || usersError ? (
              <p className="text-destructive">Error loading data: {smartbinsDropsError?.message || usersError?.message || "An error occurred."}</p>
            ) : userSmartbinsDrops.length > 0 ? (
              <DataTable
                sort={[
                  {
                    id: "count",
                    desc: true,
                  },
                ]}
                defaultSize={10}
                data={userSmartbinsDrops}
                columns={smartbinsDropColumns}
              />
            ) : (
              <p>No completed smartbin drops data available to display frequency.</p>
            )}
          </TabsContent>
          <TabsContent value="transactions">
            {transactionsLoading || usersLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : transactionsError || usersError ? (
              <p className="text-destructive">Error loading data: {transactionsError?.message || usersError?.message || "An error occurred."}</p>
            ) : userTransactions.length > 0 ? (
              <DataTable
                sort={[
                  {
                    id: "count",
                    desc: true,
                  },
                ]}
                defaultSize={10}
                data={userTransactions}
                columns={transactionColumns}
              />
            ) : (
              <p>No completed transaction data available to display frequency.</p>
            )}
          </TabsContent>
          <TabsContent value="requests">
            {requestsLoading || usersLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : requestsError || usersError ? (
              <p className="text-destructive">Error loading data: {requestsError?.message || usersError?.message || "An error occurred."}</p>
            ) : userRequests.length > 0 ? (
              <DataTable
                sort={[
                  {
                    id: "count",
                    desc: true,
                  },
                ]}
                defaultSize={10}
                data={userRequests}
                columns={requestColumns}
              />
            ) : (
              <p>No completed transaction data available to display frequency.</p>
            )}
          </TabsContent>
          <TabsContent value="pickups">
            {pickupsLoading || usersLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : pickupsError || usersError ? (
              <p className="text-destructive">Error loading data: {pickupsError?.message || usersError?.message || "An error occurred."}</p>
            ) : userPickups.length > 0 ? (
              <DataTable
                sort={[
                  {
                    id: "count",
                    desc: true,
                  },
                ]}
                defaultSize={10}
                data={userPickups}
                columns={pickupColumns}
              />
            ) : (
              <p>No completed transaction data available to display frequency.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}

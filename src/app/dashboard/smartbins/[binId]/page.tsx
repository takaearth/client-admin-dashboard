"use client";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
//ui
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle, SquarePenIcon } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
//custom ui
import { DataTable } from "@/components/tables/data-tables";
import { SmartbinStatsSection } from "@/components/sections/smartbin-stats";
import { SmartbinChartsSection } from "@/components/sections/smartbin-charts";
import { smartbinsDropColumns } from "@/components/tables/schemas/smartbins-drops";
//custom
import { Smartbin, SmartbinDrop } from "@/lib/types";
import useFirebaseSmartbins from "@/hooks/firebase-smartbins";
import useFirebaseSmartbinsDrops from "@/hooks/firebase-smartbins-drops";

export default function SmartbinPage() {
  const params = useParams();
  const binId = params.binId as string;

  const { smartbins, loading: smartbinsLoading, error: smartbinsError } = useFirebaseSmartbins();
  const { smartbinsDrops, loading: smartbinDropsLoading, error: smartbinDropsError } = useFirebaseSmartbinsDrops();

  const [smartbin, setSmartbin] = useState<Smartbin | undefined>();
  const [smartbinDrops, setSmartbinDrops] = useState<SmartbinDrop[]>([]);

  useEffect(() => {
    if (binId) {
      //find smartbin
      const bin = smartbins.find((sb) => sb.id === binId);
      setSmartbin(bin);
    }
  }, [smartbins, binId]);

  useEffect(() => {
    if (binId && smartbin?.name && smartbinsDrops && smartbinsDrops.length > 0) {
      //filter drops
      const drops = smartbinsDrops.filter((drop) => drop.binId === smartbin?.name);
      setSmartbinDrops(drops);
    }
  }, [smartbinsDrops, smartbin]);

  if (smartbinsLoading || smartbinDropsLoading) {
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
                  <BreadcrumbPage>Smartbins </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Smartbin Data </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-12">
          <div className="flex flex-col items-center gap-2 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <h3 className="text-lg font-semibold tracking-tight text-muted-foreground">Loading smartbin data...</h3>
            <p className="text-sm text-muted-foreground">Please wait while we fetch the data.</p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (smartbinsError || smartbinDropsError) {
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
                  <BreadcrumbPage>Smartbins </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Smartbin Data </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-destructive shadow-sm py-12">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <h3 className="text-lg font-semibold tracking-tight text-destructive">Error loading smartbin data.</h3>
            {smartbinsError && <p className="text-sm text-muted-foreground">{smartbinsError.message || "An unexpected error occurred. Please try again later."}</p>}
            {smartbinDropsError && <p className="text-sm text-muted-foreground">{smartbinDropsError.message || "An unexpected error occurred. Please try again later."}</p>}
          </div>
        </div>
      </SidebarInset>
    );
  }

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
                <BreadcrumbPage>Smartbins </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Smartbin Data </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="@container/main flex flex-1 flex-col gap-6 px-4">
        <div className="w-full grid @4xl/main:grid-cols-4 gap-6">
          <Card className="flex flex-col px-0 pb-0">
            <CardHeader>
              <CardTitle>Smartbin Data </CardTitle>
              <CardDescription>View data for each smartbin.</CardDescription>
              <Link href={`/dashboard/smartbins/${smartbin?.id}/edit`}>
                <Button variant="outline" className="w-full">
                  <SquarePenIcon className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="relative w-full h-full">
                <Image fill src="/images/smartbin.webp" alt="Smartbin" className="object-contain" />
              </div>
            </CardContent>
          </Card>
          <div className="@4xl/main:col-span-3">
            <SmartbinStatsSection
              loading={smartbinsLoading || smartbinDropsLoading}
              error={smartbinsError || smartbinDropsError}
              smartbin={smartbin}
              smartbinDrops={smartbinDrops}
            />
          </div>
          <div className="@4xl/main:col-span-4">
            <SmartbinChartsSection
              smartbin={smartbin}
              loading={smartbinsLoading || smartbinDropsLoading}
              error={smartbinsError || smartbinDropsError}
              smartbinDrops={smartbinDrops}
            />
          </div>
        </div>
        <div className="@container/main flex flex-1 flex-col gap-2 px-4">
        <DataTable
          visibility={{
            id: false,
          }}
          defaultSize={10}
          data={smartbinDrops}
          columns={smartbinsDropColumns}
        />
        </div>
      </div>
    </SidebarInset>
  );
}

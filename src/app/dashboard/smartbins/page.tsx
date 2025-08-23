"use client";
//ui
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
//custom ui
import { SmartbinsStatsSection } from "@/components/sections/smartbins-stats";
import { SmartbinsChartsSection } from "@/components/sections/smartbins-charts";
//custom
import useFirebaseSmartbins from "@/hooks/firebase-smartbins";
import useFirebaseSmartbinsDrops from "@/hooks/firebase-smartbins-drops";

export default function SmartbinsPage() {
  const { smartbins, loading: smartbinsLoading, error: smartbinsError } = useFirebaseSmartbins();
  const { smartbinsDrops, loading: smartbinDropsLoading, error: smartbinDropsError } = useFirebaseSmartbinsDrops();

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
            loading={smartbinsLoading || smartbinDropsLoading}
            error={smartbinsError || smartbinDropsError}
            smartbins={smartbins}
            smartbinDrops={smartbinsDrops}
          />
          <SmartbinsChartsSection />
      </div>
    </SidebarInset>
  );
}

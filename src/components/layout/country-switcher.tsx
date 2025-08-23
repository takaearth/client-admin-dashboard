"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactCountryFlag from "react-country-flag";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
//custom
import { useCountry } from "@/context/country-context";

export function CountrySwitcher() {
  const { isMobile } = useSidebar();
  const { countries, selectedCountry, setSelectedCountry } = useCountry();

  if (!selectedCountry) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex w-12 h-9 items-center justify-center rounded-lg">
                <ReactCountryFlag
                  countryCode={selectedCountry.code}
                  svg
                  style={{
                    width: "2em",
                    height: "2em",
                  }}
                  title={selectedCountry.code}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Taka Earth {selectedCountry.name}</span>
                <span className="truncate text-xs">Code: {selectedCountry.code}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="start" side={isMobile ? "bottom" : "right"} sideOffset={4}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">Countries</DropdownMenuLabel>
            {countries.map((country, index) => (
              <DropdownMenuItem key={country.name} onClick={() => setSelectedCountry(country)} className="gap-2 p-2">
                <div className="flex w-7 h-5 items-center justify-center border">
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    style={{
                      width: "2em",
                      height: "2em",
                    }}
                    title={country.code}
                  />
                </div>
                Taka Earth {country.name}
                <DropdownMenuShortcut>{country.code}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

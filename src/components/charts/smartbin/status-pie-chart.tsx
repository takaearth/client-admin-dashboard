"use client";
import * as React from "react";
import { Cell, Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { defaultColors, capitalizeFirstLetter } from "@/lib";

export function SmartbinStatusPieChart({ stats }: { stats: Record<string, number> }) {
  const id = "smartbin-status-pie";

  const chartData = React.useMemo(() => {
    if (!stats || Object.keys(stats).length === 0) {
      return [];
    }
    return Object.entries(stats)
      .map(([name, value], index) => ({
        name: name,
        value: value,
        fill: defaultColors[index % defaultColors.length], 
      }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  const dynamicChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item) => {
      config[item.name] = {
        label: capitalizeFirstLetter(item.name), 
        color: item.fill, 
      };
    });
    return config;
  }, [chartData]);

  const [activeClient, setActiveClient] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (chartData.length > 0) {
      // If activeClient is not set, or not in current chartData, set to first item's name
      if (!activeClient || !chartData.find((item) => item.name === activeClient)) {
        setActiveClient(chartData[0].name);
      }
    } else {
      // If chartData is empty, clear activeClient
      setActiveClient(undefined);
    }
  }, [chartData, activeClient]);

  const activeIndex = React.useMemo(() => chartData.findIndex((item) => item.name === activeClient), [chartData, activeClient]);

  const currentActiveItem = activeIndex !== -1 && chartData[activeIndex] ? chartData[activeIndex] : null;
  const totalValue = React.useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData]);

  if (chartData.length === 0) {
    return (
      <Card data-slot="card" className="@container/card @xl/main:col-span-2 gap-3">
        <CardHeader>
          <CardTitle>Smartbin Status Distribution</CardTitle>
          <CardDescription>No data available for drop status.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center items-center min-h-[250px]">
          {" "}
          {/* Added min-h for consistency */}
          <p className="text-muted-foreground">No status data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-slot="card" data-chart={id} className="@container/card gap-3">
      <ChartStyle id={id} config={dynamicChartConfig} />
      <CardHeader className="flex flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Smartbin Status Distribution</CardTitle>
          <CardDescription>Shows the distribution of smartbin statuses.</CardDescription>
        </div>
        <Select value={activeClient} onValueChange={setActiveClient}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5 z-10" aria-label="Select a value">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {chartData.map((item) => {
              const configEntry = dynamicChartConfig[item.name];
              if (!configEntry) {
                return null;
              }
              return (
                <SelectItem key={item.name} value={item.name} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: configEntry.color,
                      }}
                    />
                    {configEntry?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        <ChartContainer id={id} config={dynamicChartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <PieChart>
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 5} />
                  <Sector {...props} outerRadius={outerRadius + 20} innerRadius={outerRadius + 10} />
                </g>
              )}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    if (currentActiveItem) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                            {currentActiveItem.value.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            {currentActiveItem.name}
                          </tspan>
                        </text>
                      );
                    } else if (chartData.length > 0) {
                      // Fallback to total if no specific item is active
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-foreground text-2xl font-bold">
                            {totalValue.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className="fill-muted-foreground">
                            Total Drops
                          </tspan>
                        </text>
                      );
                    }
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

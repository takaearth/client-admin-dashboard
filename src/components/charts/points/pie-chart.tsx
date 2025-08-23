"use client";
import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const chartConfig = {
  points: {
    label: "Points",
  },
  redeemed: {
    label: "Redeemed",
    color: "var(--color-chart-1)",
  },
  held: {
    label: "Held",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;
export function PointsPieChart({ totalEarned, totalRedeemed }: { totalEarned: number; totalRedeemed: number }) {
  const id = "pie-interactive";
  const pointsData = React.useMemo(() => {
    return [
      {
        section: "redeemed",
        points: totalRedeemed,
        fill: "var(--color-redeemed)",
      },
      {
        section: "held",
        points: totalEarned - totalRedeemed,
        fill: "var(--color-held)",
      },
    ];
  }, [totalEarned, totalRedeemed]);
  const [activeMonth, setActiveMonth] = React.useState(pointsData[0].section);
  const activeIndex = React.useMemo(() => pointsData.findIndex((item) => item.section === activeMonth), [activeMonth]);
  const sections = React.useMemo(() => pointsData.map((item) => item.section), []);

  return (
    <Card data-slot="card" data-chart={id} className="@container/card @xl/main:col-span-2 gap-3">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Points Pie Chart</CardTitle>
          <CardDescription>Distribution of user points in KES</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5 z-10" aria-label="Select a value">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {sections.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];
              if (!config) {
                return null;
              }
              return (
                <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={pointsData}
              dataKey="points"
              nameKey="section"
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
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          {pointsData[activeIndex].points.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          KES
                        </tspan>
                      </text>
                    );
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

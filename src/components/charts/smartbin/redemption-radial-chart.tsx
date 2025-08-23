"use client";
import * as React from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { defaultColors, capitalizeFirstLetter } from "@/lib";

export function SmartbinRedemptionRadialChart({
  stats,
}: {
  stats: {
    total: number;
    completed: number;
    pending: number;
    expired: number;
  };
}) {
  const chartKeys = ["completed", "pending", "expired"] as const;
  type ChartKey = typeof chartKeys[number];

  const dynamicChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartKeys.forEach((key, index) => {
      config[key] = {
        label: capitalizeFirstLetter(key),
        color: defaultColors[index % defaultColors.length],
      };
    });
    return config;
  }, [chartKeys]); 

  const smartbinData = React.useMemo(() => {
    return [
      {
        completed: stats.completed,
        pending: stats.pending,
        expired: stats.expired,
      },
    ];
  }, [stats.completed, stats.pending, stats.expired]);

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Points Status</CardTitle>
        <CardDescription>Shows status of drop assigned points.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer config={dynamicChartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart data={smartbinData} endAngle={180} innerRadius={80} outerRadius={130}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          {stats.total.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                          Drops
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            {chartKeys.map((key) => (
              <RadialBar
                key={key}
                dataKey={key}
                stackId="a"
                cornerRadius={5}
                fill={`var(--color-${key})`} // Or use dynamicChartConfig[key].color if CSS variables are set up that way
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm -mt-20">
        <div className="leading-none text-muted-foreground text-center">Chart comparing the status of the points assigned to the users for items dropped.</div>
      </CardFooter>
    </Card>
  );
}

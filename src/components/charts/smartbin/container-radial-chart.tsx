"use client";
import * as React from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { defaultColors } from "@/lib";

export function SmartbinContainersRadialChart({
  stats,
}: {
  stats: {
    total: number;
    plastic: number;
    other: number;
  };
}) {
  const chartKeys = ["plastic", "other"] as const;
  type ChartKey = (typeof chartKeys)[number];

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
        plastic: stats.plastic,
        other: stats.other,
      },
    ];
  }, [stats.plastic, stats.other]);

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Item Waste Types</CardTitle>
        <CardDescription>Shows the waste type distribution for items dropped.</CardDescription>
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
                          Containers
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
                fill={dynamicChartConfig[key]?.color || `var(--color-${key})`} // Use color from config, fallback if needed
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm -mt-24">
        <div className="leading-none text-muted-foreground text-center">Chart comparing the waste type for items dropped in the smart bin.</div>
      </CardFooter>
    </Card>
  );
}

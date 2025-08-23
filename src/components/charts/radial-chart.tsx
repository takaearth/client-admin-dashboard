"use client";
import * as React from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
//custom
import { cn } from "@/lib/utils";
import { defaultColors, capitalizeFirstLetter } from "@/lib";

interface RadialChartCardProps extends React.ComponentProps<"div"> {
  id: string;
  stats?: Record<string, number>;
  title?: string;
  description?: string;
  totalLabel?: string; // Label for the sum in the center, e.g., "Total Items"
}

export function RadialChartCard({ className, id, stats, title, description, totalLabel = "Total", ...props }: RadialChartCardProps) {
  const chartKeys = React.useMemo(() => {
    return stats ? Object.keys(stats) : [];
  }, [stats]);

  const chartData = React.useMemo(() => {
    if (!stats || chartKeys.length === 0) {
      return [];
    }
    // RadialBarChart expects data as an array of objects.
    // For stacked bars from a single dataset, it's typically [{ key1: val1, key2: val2 }]
    return [stats];
  }, [stats, chartKeys]);

  const dynamicChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    if (stats) {
      chartKeys.forEach((key, index) => {
        config[key] = {
          label: capitalizeFirstLetter(key),
          color: defaultColors[index % defaultColors.length],
        };
      });
    }
    return config;
  }, [stats, chartKeys]);

  const totalValue = React.useMemo(() => {
    if (!stats) {
      return 0;
    }
    return Object.values(stats).reduce((sum, value) => sum + value, 0);
  }, [stats]);

  if (!stats || chartKeys.length === 0) {
    return (
      <Card data-slot="card" data-chart={id} className={cn("@container/card gap-3", className)} {...props}>
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center items-center min-h-[250px]">
          <p className="text-muted-foreground">No data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-slot="card" data-chart={id} className={cn("@container/card", className)} {...props}>
      <ChartStyle id={id} config={dynamicChartConfig} />
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-0">
        <ChartContainer config={dynamicChartConfig} className="mx-auto w-full max-w-[250px] aspect-[2/1]">
          <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={130} cy="75%">
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                          {totalLabel}
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
                fill={dynamicChartConfig[key]?.color || defaultColors[0]} // Fallback to a default color if somehow not in config
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

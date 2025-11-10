"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState } from "react"

const chartData = {
  "1D": [
    { time: "9:00", value: 47200 },
    { time: "10:00", value: 47450 },
    { time: "11:00", value: 47300 },
    { time: "12:00", value: 47800 },
    { time: "1:00", value: 48100 },
    { time: "2:00", value: 47900 },
    { time: "3:00", value: 48392 },
  ],
  "1W": [
    { time: "Mon", value: 45200 },
    { time: "Tue", value: 46100 },
    { time: "Wed", value: 45800 },
    { time: "Thu", value: 47200 },
    { time: "Fri", value: 48392 },
  ],
  "1M": [
    { time: "Week 1", value: 42000 },
    { time: "Week 2", value: 43500 },
    { time: "Week 3", value: 45200 },
    { time: "Week 4", value: 48392 },
  ],
  "1Y": [
    { time: "Jan", value: 38500 },
    { time: "Feb", value: 39200 },
    { time: "Mar", value: 40100 },
    { time: "Apr", value: 41500 },
    { time: "May", value: 42800 },
    { time: "Jun", value: 43200 },
    { time: "Jul", value: 44100 },
    { time: "Aug", value: 45600 },
    { time: "Sep", value: 46200 },
    { time: "Oct", value: 47100 },
    { time: "Nov", value: 47800 },
    { time: "Dec", value: 48392 },
  ],
}

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function PortfolioChart() {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1W")

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Performance</h3>
          <p className="text-sm text-muted-foreground">Track your portfolio value over time</p>
        </div>
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
          <TabsList>
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={chartData[timeframe]}>
          <defs>
            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => `$${Number(value).toLocaleString()}`} />
          <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#fillValue)" strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 108 },
  { month: "Mar", value: 115 },
  { month: "Apr", value: 112 },
  { month: "May", value: 125 },
  { month: "Jun", value: 132 },
  { month: "Jul", value: 128 },
  { month: "Aug", value: 142 },
  { month: "Sep", value: 155 },
  { month: "Oct", value: 168 },
  { month: "Nov", value: 182 },
  { month: "Dec", value: 195 },
]

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function PerformanceChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Portfolio Performance</h3>
        <p className="text-sm text-muted-foreground">12-month growth trajectory</p>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}%`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#fillValue)" strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}

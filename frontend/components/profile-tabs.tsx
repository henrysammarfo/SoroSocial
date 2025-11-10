"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TradeHistoryList } from "@/components/trade-history-list"
import { PerformanceChart } from "@/components/performance-chart"
import { PortfolioHoldings } from "@/components/portfolio-holdings"

interface ProfileTabsProps {
  traderAddress?: string
  isOwnProfile?: boolean
}

export function ProfileTabs({ traderAddress, isOwnProfile = false }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="trades" className="p-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="trades">Trades</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
      </TabsList>
      <TabsContent value="trades" className="mt-6">
        <TradeHistoryList traderAddress={traderAddress} />
      </TabsContent>
      <TabsContent value="performance" className="mt-6">
        <PerformanceChart traderAddress={traderAddress} />
      </TabsContent>
      <TabsContent value="portfolio" className="mt-6">
        <PortfolioHoldings traderAddress={traderAddress} />
      </TabsContent>
    </Tabs>
  )
}

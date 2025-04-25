import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentOrders } from "@/components/recent-orders"
import { InventoryOverview } from "@/components/inventory-overview"
import { DeliveryMap } from "@/components/delivery-map"
import { SubscriptionStats } from "@/components/subscription-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <StatsOverview />
      </Suspense>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<CardSkeleton />}>
          <InventoryOverview />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <RecentOrders />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<CardSkeleton />}>
          <SubscriptionStats />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <DeliveryMap />
        </Suspense>
      </div>
    </div>
  )
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
    </div>
  )
}

function CardSkeleton() {
  return <Skeleton className="h-[400px] w-full" />
}

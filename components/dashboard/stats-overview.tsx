"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, CheckCircle2, Clock, DollarSign, ShoppingCart, Truck, Users } from "lucide-react"

interface StatsData {
  totalProducts: number
  lowStockProducts: number
  totalCustomers: number
  activeSubscriptions: number
  pendingDeliveries: number
  completedDeliveries: number
  totalRevenue: number
  revenueChange: number
}

export function StatsOverview() {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
    activeSubscriptions: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    totalRevenue: 0,
    revenueChange: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // En un sistema real, esto sería una llamada a la API
        // Por ahora, usamos datos simulados
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    // Simulamos datos para la demostración
    setStats({
      totalProducts: 125,
      lowStockProducts: 12,
      totalCustomers: 48,
      activeSubscriptions: 24,
      pendingDeliveries: 6,
      completedDeliveries: 3,
      totalRevenue: 45231.89,
      revenueChange: 20.1,
    })
    setLoading(false)

    // loadStats()
  }, [])

  if (loading) {
    return <div>Cargando estadísticas...</div>
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />+{stats.revenueChange}%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Suscripciones</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{stats.activeSubscriptions}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +12.2%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos en Inventario</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-rose-500 flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              {stats.lowStockProducts}
            </span>{" "}
            productos con stock bajo
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entregas Hoy</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingDeliveries + stats.completedDeliveries}</div>
          <div className="flex flex-wrap items-center pt-1">
            <span className="flex items-center text-xs text-emerald-500 mr-2 mb-1">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {stats.completedDeliveries} completadas
            </span>
            <span className="mx-2 text-xs text-muted-foreground hidden sm:inline">•</span>
            <span className="flex items-center text-xs text-amber-500">
              <Clock className="mr-1 h-3 w-3" />
              {stats.pendingDeliveries} en progreso
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

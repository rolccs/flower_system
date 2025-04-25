"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, TrendingUp, Clock, MapPin, Download, BarChart, Fuel, DollarSign } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function DriverStats() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("today")

  useEffect(() => {
    // Simular carga de datos
    setIsLoading(true)

    const timer = setTimeout(() => {
      // Datos de ejemplo
      const mockStats = {
        today: {
          deliveries: {
            total: 5,
            completed: 2,
            inProgress: 3,
            cancelled: 0,
          },
          distance: 28.5, // km
          time: 125, // minutos
          earnings: 45.0, // USD
          avgTimePerDelivery: 25, // minutos
          fuelConsumption: 2.3, // litros
        },
        week: {
          deliveries: {
            total: 32,
            completed: 30,
            inProgress: 2,
            cancelled: 1,
          },
          distance: 187.3, // km
          time: 840, // minutos
          earnings: 320.0, // USD
          avgTimePerDelivery: 28, // minutos
          fuelConsumption: 15.8, // litros
        },
        month: {
          deliveries: {
            total: 124,
            completed: 120,
            inProgress: 3,
            cancelled: 4,
          },
          distance: 725.8, // km
          time: 3250, // minutos
          earnings: 1250.0, // USD
          avgTimePerDelivery: 27, // minutos
          fuelConsumption: 62.5, // litros
        },
      }

      setStats(mockStats)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const downloadReport = () => {
    toast({
      title: "Descargando reporte",
      description: `El reporte de ${
        timeRange === "today" ? "hoy" : timeRange === "week" ? "esta semana" : "este mes"
      } se está descargando`,
    })
  }

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const currentStats = stats[timeRange]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="week">Esta Semana</TabsTrigger>
            <TabsTrigger value="month">Este Mes</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm" onClick={downloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Descargar Reporte
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="mr-2 h-4 w-4 text-primary" />
              Entregas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.deliveries.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {currentStats.deliveries.completed} completadas • {currentStats.deliveries.inProgress} en progreso •{" "}
              {currentStats.deliveries.cancelled} canceladas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              Distancia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.distance.toFixed(1)} km</div>
            <div className="text-xs text-muted-foreground mt-1">
              {(currentStats.distance / currentStats.deliveries.total).toFixed(1)} km por entrega en promedio
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Tiempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(currentStats.time / 60)}h {currentStats.time % 60}m
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {currentStats.avgTimePerDelivery} minutos por entrega en promedio
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-primary" />
              Ganancias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentStats.earnings.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              ${(currentStats.earnings / currentStats.deliveries.total).toFixed(2)} por entrega en promedio
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-primary" />
              Eficiencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((currentStats.deliveries.completed / currentStats.deliveries.total) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Tasa de entregas completadas</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Fuel className="mr-2 h-4 w-4 text-primary" />
              Combustible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.fuelConsumption.toFixed(1)} L</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((currentStats.fuelConsumption / currentStats.distance) * 100).toFixed(1)} L/100km en promedio
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Actividad</CardTitle>
          <CardDescription>Análisis de tus entregas y rendimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
            <div className="text-center">
              <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Gráfico de actividad disponible en la versión completa</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

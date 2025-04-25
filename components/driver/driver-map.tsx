"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Navigation,
  AlertTriangle,
  Info,
  Truck,
  Package,
  Clock,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Layers,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TrafficAlert {
  id: string
  type: "accident" | "construction" | "closure" | "congestion"
  location: string
  description: string
  time: string
  severity: "low" | "medium" | "high"
}

export function DriverMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficAlert[]>([])
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([])
  const [mapView, setMapView] = useState<"traffic" | "satellite" | "standard">("standard")

  useEffect(() => {
    // Simular carga del mapa
    const timer = setTimeout(() => {
      setIsLoading(false)

      // Datos de ejemplo para alertas de tráfico
      setTrafficAlerts([
        {
          id: "alert1",
          type: "accident",
          location: "I-95 Norte, cerca de la salida 10",
          description: "Accidente con múltiples vehículos. Carril derecho bloqueado.",
          time: "Hace 15 minutos",
          severity: "high",
        },
        {
          id: "alert2",
          type: "construction",
          location: "Brickell Avenue",
          description: "Trabajos de construcción. Tráfico lento.",
          time: "Comenzó hace 2 horas",
          severity: "medium",
        },
        {
          id: "alert3",
          type: "congestion",
          location: "Downtown Miami",
          description: "Tráfico intenso debido a evento deportivo.",
          time: "Actual",
          severity: "medium",
        },
      ])

      // Datos de ejemplo para entregas activas
      setActiveDeliveries([
        {
          id: "del1",
          customer: "Florería Bella Rosa",
          address: "123 Ocean Drive, Miami Beach, FL",
          status: "En ruta",
          eta: "15 minutos",
          items: "2 bonches de Rosas Rojas",
          coordinates: { lat: 25.782551, lng: -80.131912 },
        },
        {
          id: "del2",
          customer: "Hotel Magnolia",
          address: "456 Collins Ave, Miami Beach, FL",
          status: "Próxima",
          eta: "30 minutos",
          items: "5 bonches de Lirios Blancos",
          coordinates: { lat: 25.775084, lng: -80.134035 },
        },
        {
          id: "del3",
          customer: "Eventos Elegantes",
          address: "789 Washington Ave, Miami Beach, FL",
          status: "Próxima",
          eta: "45 minutos",
          items: "3 bonches de Tulipanes Amarillos",
          coordinates: { lat: 25.77631, lng: -80.133651 },
        },
      ])
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const refreshMap = () => {
    setIsLoading(true)
    toast({
      title: "Actualizando mapa",
      description: "Obteniendo información de tráfico en tiempo real...",
    })

    // Simular actualización del mapa
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Mapa actualizado",
        description: "La información de tráfico ha sido actualizada.",
      })
    }, 1500)
  }

  const changeMapView = (view: "traffic" | "satellite" | "standard") => {
    setMapView(view)
    toast({
      title: "Vista de mapa cambiada",
      description: `Vista cambiada a: ${view === "traffic" ? "Tráfico" : view === "satellite" ? "Satélite" : "Estándar"}`,
    })
  }

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return "bg-yellow-500"
      case "medium":
        return "bg-orange-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAlertIcon = (type: "accident" | "construction" | "closure" | "congestion") => {
    switch (type) {
      case "accident":
        return <AlertTriangle className="h-4 w-4" />
      case "construction":
        return <Truck className="h-4 w-4" />
      case "closure":
        return <AlertTriangle className="h-4 w-4" />
      case "congestion":
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Mapa de Entregas y Tráfico</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshMap} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <Tabs value={mapView} onValueChange={(v) => changeMapView(v as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="standard" className="text-xs px-2 h-7">
                    Estándar
                  </TabsTrigger>
                  <TabsTrigger value="traffic" className="text-xs px-2 h-7">
                    Tráfico
                  </TabsTrigger>
                  <TabsTrigger value="satellite" className="text-xs px-2 h-7">
                    Satélite
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-[400px] bg-gray-100 relative"
              style={{
                backgroundImage:
                  mapView === "satellite"
                    ? "url('/map-satellite.jpg')"
                    : mapView === "traffic"
                      ? "url('/map-traffic.jpg')"
                      : "url('/map-standard.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p>Cargando mapa...</p>
                  </div>
                </div>
              )}

              {/* Marcadores de entregas */}
              {!isLoading &&
                activeDeliveries.map((delivery, index) => (
                  <div
                    key={delivery.id}
                    className={`absolute z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                      delivery.status === "En ruta"
                        ? "bg-green-500 border-2 border-white animate-pulse"
                        : "bg-blue-500 border-2 border-white"
                    }`}
                    style={{
                      top: `${100 + index * 50}px`,
                      left: `${150 + index * 80}px`,
                    }}
                    title={`${delivery.customer}: ${delivery.address}`}
                  >
                    {index + 1}
                  </div>
                ))}

              {/* Marcador de posición actual */}
              <div
                className="absolute z-20 w-10 h-10 rounded-full bg-primary border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  top: "200px",
                  left: "200px",
                }}
              >
                <Truck className="h-5 w-5 text-white" />
              </div>

              {/* Controles del mapa */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <Layers className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Navigation className="h-4 w-4 mr-1" />
            Mi Ubicación
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <MapPin className="h-4 w-4 mr-1" />
            Próxima Entrega
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Package className="h-4 w-4 mr-1" />
            Ver Todas las Entregas
          </Button>
        </CardFooter>
      </Card>

      {/* Alertas de Tráfico */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            Alertas de Tráfico
          </CardTitle>
          <CardDescription>Información en tiempo real sobre el tráfico en tu ruta</CardDescription>
        </CardHeader>
        <CardContent>
          {trafficAlerts.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No hay alertas de tráfico en este momento</p>
          ) : (
            <div className="space-y-3">
              {trafficAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`rounded-full p-2 ${getSeverityColor(alert.severity)} text-white`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{alert.location}</h4>
                      <Badge variant="outline" className="text-xs">
                        {alert.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Ver Todas las Alertas
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

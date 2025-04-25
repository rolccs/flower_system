"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPlaceholder } from "@/components/map-placeholder"

export function DeliveryMap() {
  const mapLocations = deliveries.map((delivery) => ({
    id: delivery.id,
    name: delivery.customer,
    address: delivery.address,
    status: delivery.status,
  }))

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Mapa de Entregas</CardTitle>
        <CardDescription>Visualiza las entregas programadas para hoy</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map">
          <TabsList className="mb-4">
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
          <TabsContent value="map">
            <MapPlaceholder locations={mapLocations} height="400px" />
          </TabsContent>
          <TabsContent value="list">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deliveries.map((delivery) => (
                  <Card key={delivery.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{delivery.customer}</CardTitle>
                      <CardDescription>{delivery.address}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hora:</span>
                          <span>{delivery.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estado:</span>
                          <Badge variant={getDeliveryVariant(delivery.status)}>{delivery.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Conductor:</span>
                          <span>{delivery.driver}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function getDeliveryVariant(status: string) {
  switch (status) {
    case "Completado":
      return "success"
    case "En ruta":
      return "warning"
    case "Pendiente":
      return "default"
    default:
      return "outline"
  }
}

const deliveries = [
  {
    id: "DEL-001",
    customer: "Florería Bella Rosa",
    address: "123 Main St, Miami, FL",
    time: "10:30 AM",
    status: "En ruta",
    driver: "Carlos Méndez",
  },
  {
    id: "DEL-002",
    customer: "Eventos Elegantes",
    address: "456 Oak Ave, Miami Beach, FL",
    time: "11:15 AM",
    status: "Pendiente",
    driver: "María González",
  },
  {
    id: "DEL-003",
    customer: "Jardines Modernos",
    address: "789 Pine St, Coral Gables, FL",
    time: "1:45 PM",
    status: "Pendiente",
    driver: "Juan Pérez",
  },
  {
    id: "DEL-004",
    customer: "Hotel Magnolia",
    address: "101 Cedar Blvd, Brickell, FL",
    time: "2:30 PM",
    status: "Completado",
    driver: "Ana Rodríguez",
  },
  {
    id: "DEL-005",
    customer: "Decoraciones Primavera",
    address: "202 Elm St, Doral, FL",
    time: "3:15 PM",
    status: "Completado",
    driver: "Roberto Sánchez",
  },
  {
    id: "DEL-006",
    customer: "Floristería Azul",
    address: "303 Maple Dr, Wynwood, FL",
    time: "4:00 PM",
    status: "Completado",
    driver: "Laura Torres",
  },
]

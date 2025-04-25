"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Navigation,
  AlertCircle,
  ChevronRight,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface Delivery {
  id: string
  customer: {
    name: string
    phone: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  order: {
    id: string
    items: string[]
    total: number
    paymentMethod: string
    specialInstructions?: string
  }
  status: "pending" | "in_progress" | "completed" | "cancelled"
  eta: string
  assignedAt: string
  completedAt?: string
}

export function DeliveryList() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [activeTab, setActiveTab] = useState("active")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      // Datos de ejemplo
      const mockDeliveries: Delivery[] = [
        {
          id: "del1",
          customer: {
            name: "Florería Bella Rosa",
            phone: "(305) 555-1234",
            address: "123 Ocean Drive, Miami Beach, FL 33139",
            coordinates: { lat: 25.782551, lng: -80.131912 },
          },
          order: {
            id: "ORD-2023-1001",
            items: ["2 bonches de Rosas Rojas Premium", "1 bonche de Lirios Blancos"],
            total: 85.99,
            paymentMethod: "Tarjeta de crédito",
            specialInstructions: "Entregar en la puerta trasera",
          },
          status: "in_progress",
          eta: "15 minutos",
          assignedAt: "2023-04-15T10:30:00Z",
        },
        {
          id: "del2",
          customer: {
            name: "Hotel Magnolia",
            phone: "(305) 555-5678",
            address: "456 Collins Ave, Miami Beach, FL 33139",
            coordinates: { lat: 25.775084, lng: -80.134035 },
          },
          order: {
            id: "ORD-2023-1002",
            items: ["5 bonches de Lirios Blancos", "3 bonches de Orquídeas"],
            total: 210.5,
            paymentMethod: "Cuenta empresarial",
          },
          status: "pending",
          eta: "30 minutos",
          assignedAt: "2023-04-15T10:45:00Z",
        },
        {
          id: "del3",
          customer: {
            name: "Eventos Elegantes",
            phone: "(305) 555-9012",
            address: "789 Washington Ave, Miami Beach, FL 33139",
            coordinates: { lat: 25.77631, lng: -80.133651 },
          },
          order: {
            id: "ORD-2023-1003",
            items: ["3 bonches de Tulipanes Amarillos", "2 bonches de Girasoles"],
            total: 120.75,
            paymentMethod: "Tarjeta de crédito",
          },
          status: "pending",
          eta: "45 minutos",
          assignedAt: "2023-04-15T11:00:00Z",
        },
        {
          id: "del4",
          customer: {
            name: "Restaurante La Marina",
            phone: "(305) 555-3456",
            address: "101 Brickell Ave, Miami, FL 33131",
            coordinates: { lat: 25.765869, lng: -80.18951 },
          },
          order: {
            id: "ORD-2023-1004",
            items: ["4 bonches de Rosas Blancas", "2 bonches de Claveles Rojos"],
            total: 95.25,
            paymentMethod: "Efectivo",
          },
          status: "completed",
          eta: "0 minutos",
          assignedAt: "2023-04-15T09:15:00Z",
          completedAt: "2023-04-15T09:45:00Z",
        },
        {
          id: "del5",
          customer: {
            name: "Spa Serenidad",
            phone: "(305) 555-7890",
            address: "202 Biscayne Blvd, Miami, FL 33131",
            coordinates: { lat: 25.773546, lng: -80.189401 },
          },
          order: {
            id: "ORD-2023-1005",
            items: ["3 bonches de Orquídeas", "2 bonches de Lirios Blancos"],
            total: 175.0,
            paymentMethod: "Tarjeta de crédito",
          },
          status: "completed",
          eta: "0 minutos",
          assignedAt: "2023-04-15T08:30:00Z",
          completedAt: "2023-04-15T09:10:00Z",
        },
      ]

      setDeliveries(mockDeliveries)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const startDelivery = (deliveryId: string) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === deliveryId ? { ...delivery, status: "in_progress" as const } : delivery,
      ),
    )

    toast({
      title: "Entrega iniciada",
      description: "Has comenzado la entrega. La navegación está lista.",
    })
  }

  const completeDelivery = (deliveryId: string) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              status: "completed" as const,
              completedAt: new Date().toISOString(),
            }
          : delivery,
      ),
    )

    toast({
      title: "Entrega completada",
      description: "La entrega ha sido marcada como completada.",
    })
  }

  const activeDeliveries = deliveries.filter((d) => d.status === "pending" || d.status === "in_progress")
  const completedDeliveries = deliveries.filter((d) => d.status === "completed")
  const cancelledDeliveries = deliveries.filter((d) => d.status === "cancelled")

  const getStatusBadge = (status: Delivery["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pendiente
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            En Progreso
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completada
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelada
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Activas ({activeDeliveries.length})</TabsTrigger>
          <TabsTrigger value="completed">Completadas ({completedDeliveries.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas ({cancelledDeliveries.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {activeDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No hay entregas activas</p>
                <p className="text-sm text-muted-foreground">Las entregas asignadas aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            activeDeliveries.map((delivery) => (
              <Card key={delivery.id} className={delivery.status === "in_progress" ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{delivery.customer.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {delivery.customer.address}
                      </CardDescription>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Pedido:</span> {delivery.order.id}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Productos:</span>
                      <ul className="list-disc list-inside ml-1 mt-1 text-muted-foreground">
                        {delivery.order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    {delivery.order.specialInstructions && (
                      <div className="text-sm flex items-start">
                        <AlertCircle className="h-4 w-4 mr-1 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="font-medium">Instrucciones especiales:</span>{" "}
                          {delivery.order.specialInstructions}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>ETA: {delivery.eta}</span>
                      </div>
                      <div className="font-medium">Total: ${delivery.order.total.toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex flex-wrap w-full gap-2">
                    <Button
                      variant={delivery.status === "in_progress" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => (delivery.status === "pending" ? startDelivery(delivery.id) : null)}
                      disabled={delivery.status === "in_progress"}
                    >
                      {delivery.status === "pending" ? (
                        <>
                          <Navigation className="mr-1 h-4 w-4" />
                          Iniciar
                        </>
                      ) : (
                        <>
                          <Navigation className="mr-1 h-4 w-4" />
                          En Ruta
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`tel:${delivery.customer.phone}`}>
                        <Phone className="mr-1 h-4 w-4" />
                        Llamar
                      </Link>
                    </Button>
                    {delivery.status === "in_progress" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => completeDelivery(delivery.id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Completar
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/driver/delivery/${delivery.id}`}>Ver Detalles</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/driver/scan/${delivery.id}`}>Escanear QR</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Reportar Problema</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No hay entregas completadas</p>
                <p className="text-sm text-muted-foreground">Las entregas completadas aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            completedDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{delivery.customer.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {delivery.customer.address}
                      </CardDescription>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Pedido:</span> {delivery.order.id}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Productos:</span>
                      <ul className="list-disc list-inside ml-1 mt-1 text-muted-foreground">
                        {delivery.order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span>Completado: {new Date(delivery.completedAt || "").toLocaleTimeString()}</span>
                      </div>
                      <div className="font-medium">Total: ${delivery.order.total.toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex flex-wrap w-full gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/driver/delivery/${delivery.id}`}>
                        <ChevronRight className="mr-1 h-4 w-4" />
                        Ver Detalles
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6 space-y-4">
          {cancelledDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No hay entregas canceladas</p>
                <p className="text-sm text-muted-foreground">Las entregas canceladas aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            cancelledDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{delivery.customer.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {delivery.customer.address}
                      </CardDescription>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Pedido:</span> {delivery.order.id}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Productos:</span>
                      <ul className="list-disc list-inside ml-1 mt-1 text-muted-foreground">
                        {delivery.order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex flex-wrap w-full gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/driver/delivery/${delivery.id}`}>
                        <ChevronRight className="mr-1 h-4 w-4" />
                        Ver Detalles
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

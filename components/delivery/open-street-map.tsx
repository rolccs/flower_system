"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, Route, Truck, Search, Plus, Minus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Interfaz para las ubicaciones
interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  status: string
}

// Interfaz para las rutas
interface DeliveryRoute {
  id: string
  name: string
  locations: Location[]
}

export function OpenStreetMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [routes, setRoutes] = useState<DeliveryRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [searchAddress, setSearchAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Datos de ejemplo para las rutas
  const mockRoutes: DeliveryRoute[] = [
    {
      id: "route1",
      name: "Ruta Norte - Miami Beach",
      locations: [
        {
          id: "loc1",
          name: "Florería Bella Rosa",
          address: "123 Ocean Drive, Miami Beach, FL",
          lat: 25.782551,
          lng: -80.131912,
          status: "Pendiente",
        },
        {
          id: "loc2",
          name: "Hotel Magnolia",
          address: "456 Collins Ave, Miami Beach, FL",
          lat: 25.775084,
          lng: -80.134035,
          status: "En Ruta",
        },
        {
          id: "loc3",
          name: "Eventos Elegantes",
          address: "789 Washington Ave, Miami Beach, FL",
          lat: 25.77631,
          lng: -80.133651,
          status: "Completado",
        },
      ],
    },
    {
      id: "route2",
      name: "Ruta Sur - Downtown Miami",
      locations: [
        {
          id: "loc4",
          name: "Jardines Modernos",
          address: "101 Brickell Ave, Miami, FL",
          lat: 25.765869,
          lng: -80.18951,
          status: "Pendiente",
        },
        {
          id: "loc5",
          name: "Decoraciones Primavera",
          address: "202 Biscayne Blvd, Miami, FL",
          lat: 25.773546,
          lng: -80.189401,
          status: "Pendiente",
        },
      ],
    },
  ]

  // Inicializar el mapa cuando el componente se monta
  useEffect(() => {
    // Cargar OpenStreetMap solo en el cliente
    if (typeof window !== "undefined" && mapRef.current && !map) {
      // Simular la carga de la biblioteca de OpenStreetMap
      // En un sistema real, se cargaría la biblioteca Leaflet o OpenLayers
      console.log("Inicializando mapa...")

      // Simular un objeto de mapa
      const mockMap = {
        setView: (center: [number, number], zoom: number) => {
          console.log(`Mapa centrado en ${center} con zoom ${zoom}`)
        },
        addMarker: (location: Location) => {
          console.log(`Marcador añadido en ${location.lat}, ${location.lng} para ${location.name}`)
          return { id: location.id, location }
        },
        drawRoute: (locations: Location[]) => {
          console.log(`Ruta dibujada con ${locations.length} ubicaciones`)
        },
        clearRoutes: () => {
          console.log("Rutas eliminadas")
        },
        zoomIn: () => {
          console.log("Zoom in")
        },
        zoomOut: () => {
          console.log("Zoom out")
        },
      }

      setMap(mockMap)

      // Cargar rutas de ejemplo
      setRoutes(mockRoutes)
    }
  }, [map])

  // Función para buscar una dirección
  const searchForAddress = async () => {
    if (!searchAddress.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa una dirección para buscar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // En un sistema real, esto sería una llamada a la API de geocodificación
      // const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`)
      // const data = await response.json()

      // Simular una respuesta de geocodificación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Datos de ejemplo
      const mockLocation: Location = {
        id: `loc${Date.now()}`,
        name: "Nueva Ubicación",
        address: searchAddress,
        lat: 25.761681,
        lng: -80.191788,
        status: "Nueva",
      }

      // Añadir marcador al mapa
      if (map) {
        const newMarker = map.addMarker(mockLocation)
        setMarkers([...markers, newMarker])
      }

      toast({
        title: "Ubicación encontrada",
        description: `Se ha encontrado la dirección: ${searchAddress}`,
      })

      // Limpiar el campo de búsqueda
      setSearchAddress("")
    } catch (error) {
      console.error("Error al buscar dirección:", error)
      toast({
        title: "Error",
        description: "No se pudo encontrar la dirección especificada",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para mostrar una ruta en el mapa
  const showRoute = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId)

    if (!route) {
      toast({
        title: "Error",
        description: "Ruta no encontrada",
        variant: "destructive",
      })
      return
    }

    // Limpiar rutas anteriores
    if (map) {
      map.clearRoutes()

      // Añadir marcadores para cada ubicación
      const newMarkers = route.locations.map((location) => map.addMarker(location))
      setMarkers(newMarkers)

      // Dibujar la ruta
      map.drawRoute(route.locations)

      // Centrar el mapa en la primera ubicación
      if (route.locations.length > 0) {
        map.setView([route.locations[0].lat, route.locations[0].lng], 13)
      }
    }

    setSelectedRoute(routeId)

    toast({
      title: "Ruta cargada",
      description: `Se ha cargado la ruta: ${route.name}`,
    })
  }

  // Función para optimizar una ruta
  const optimizeRoute = async (routeId: string) => {
    const route = routes.find((r) => r.id === routeId)

    if (!route) {
      toast({
        title: "Error",
        description: "Ruta no encontrada",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // En un sistema real, esto sería una llamada a la API de optimización de rutas
      // const response = await fetch(`/api/delivery/optimize-route/${routeId}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ locations: route.locations }),
      // })
      // const data = await response.json()

      // Simular una respuesta de optimización
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reordenar las ubicaciones (simulación)
      const optimizedLocations = [...route.locations].sort(() => Math.random() - 0.5)

      // Actualizar la ruta
      const updatedRoutes = routes.map((r) => {
        if (r.id === routeId) {
          return { ...r, locations: optimizedLocations }
        }
        return r
      })

      setRoutes(updatedRoutes)

      // Actualizar el mapa
      if (map) {
        map.clearRoutes()
        const newMarkers = optimizedLocations.map((location) => map.addMarker(location))
        setMarkers(newMarkers)
        map.drawRoute(optimizedLocations)
      }

      toast({
        title: "Ruta optimizada",
        description: `Se ha optimizado la ruta: ${route.name}`,
      })
    } catch (error) {
      console.error("Error al optimizar ruta:", error)
      toast({
        title: "Error",
        description: "No se pudo optimizar la ruta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sistema de Navegación para Delivery</CardTitle>
        <CardDescription>Gestiona y optimiza las rutas de entrega utilizando OpenStreetMap</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="routes">Rutas</TabsTrigger>
            <TabsTrigger value="search">Búsqueda</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            {/* Mapa */}
            <div
              ref={mapRef}
              className="w-full h-[400px] bg-gray-100 rounded-md border relative overflow-hidden"
              style={{
                backgroundImage: "url('/openstreetmap-landscape.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Marcadores simulados */}
              {selectedRoute &&
                routes
                  .find((r) => r.id === selectedRoute)
                  ?.locations.map((location, index) => (
                    <div
                      key={location.id}
                      className={`absolute z-10 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                        location.status === "Completado"
                          ? "bg-green-500 border-2 border-white"
                          : location.status === "En Ruta"
                            ? "bg-amber-500 border-2 border-white animate-pulse"
                            : "bg-rose-500 border-2 border-white"
                      }`}
                      style={{
                        top: `${(location.lat - 25.76) * 10000 + 200}px`,
                        left: `${(location.lng + 80.18) * 10000 - 300}px`,
                      }}
                      title={`${location.name}: ${location.address}`}
                    >
                      {index + 1}
                    </div>
                  ))}

              {/* Línea de ruta simulada */}
              {selectedRoute && routes.find((r) => r.id === selectedRoute)?.locations.length > 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d={routes
                      .find((r) => r.id === selectedRoute)
                      ?.locations.map((location, index) => {
                        const x = (location.lng + 80.18) * 10000 - 300
                        const y = (location.lat - 25.76) * 10000 + 200
                        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
                      })
                      .join(" ")}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>
              )}

              {/* Controles del mapa */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button variant="secondary" size="icon" onClick={() => map?.zoomIn()}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" onClick={() => map?.zoomOut()}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Información de la ruta seleccionada */}
            {selectedRoute && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">{routes.find((r) => r.id === selectedRoute)?.name}</h3>
                <div className="space-y-2">
                  {routes
                    .find((r) => r.id === selectedRoute)
                    ?.locations.map((location, index) => (
                      <div key={location.id} className="flex items-start gap-2 text-sm">
                        <div
                          className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            location.status === "Completado"
                              ? "bg-green-500"
                              : location.status === "En Ruta"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-muted-foreground">{location.address}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="routes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((route) => (
                <Card key={route.id} className={selectedRoute === route.id ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{route.name}</CardTitle>
                    <CardDescription>{route.locations.length} ubicaciones</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-rose-500 mt-1"></div>
                        <div>{route.locations.filter((l) => l.status === "Pendiente").length} pendientes</div>
                      </div>
                      <div className="flex gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-amber-500 mt-1"></div>
                        <div>{route.locations.filter((l) => l.status === "En Ruta").length} en ruta</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500 mt-1"></div>
                        <div>{route.locations.filter((l) => l.status === "Completado").length} completados</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={selectedRoute === route.id ? "default" : "outline"}
                      className="w-full"
                      onClick={() => showRoute(route.id)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {selectedRoute === route.id ? "Ruta Activa" : "Ver Ruta"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {selectedRoute && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => optimizeRoute(selectedRoute)} disabled={isLoading}>
                  <Route className="mr-2 h-4 w-4" />
                  {isLoading ? "Optimizando..." : "Optimizar Ruta"}
                </Button>
                <Button variant="outline">
                  <Truck className="mr-2 h-4 w-4" />
                  Iniciar Navegación
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Buscar Dirección</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    placeholder="Ingresa una dirección..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                  />
                  <Button onClick={searchForAddress} disabled={isLoading}>
                    <Search className="mr-2 h-4 w-4" />
                    {isLoading ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Resultados Recientes</Label>
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">1100 Biscayne Blvd, Miami, FL</div>
                      <div className="text-sm text-muted-foreground">Encontrado hace 2 horas</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">800 Ocean Drive, Miami Beach, FL</div>
                      <div className="text-sm text-muted-foreground">Encontrado hace 5 horas</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">350 Lincoln Road, Miami Beach, FL</div>
                      <div className="text-sm text-muted-foreground">Encontrado ayer</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <Navigation className="mr-2 h-4 w-4" />
          Mi Ubicación
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ruta
        </Button>
      </CardFooter>
    </Card>
  )
}

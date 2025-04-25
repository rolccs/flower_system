"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, MapPin, Navigation, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Importar OpenLayers cuando estamos en el cliente
let ol: any
if (typeof window !== "undefined") {
  ol = require("openlayers")
  require("openlayers/css/ol.css")
}

interface DeliveryStop {
  id: string
  address: string
  customerName: string
  orderNumber: string
  status: string
  coordinates: [number, number] // [longitud, latitud]
}

interface RoutePlannerProps {
  routeId: string
  initialStops?: DeliveryStop[]
}

export function RoutePlanner({ routeId, initialStops = [] }: RoutePlannerProps) {
  const [stops, setStops] = useState<DeliveryStop[]>(initialStops)
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [mapView, setMapView] = useState<string>("standard")
  const mapRef = useRef<HTMLDivElement>(null)
  const olMapRef = useRef<any>(null)

  // Cargar datos de la ruta
  useEffect(() => {
    async function loadRouteData() {
      if (initialStops.length > 0) {
        setStops(initialStops)
        setLoading(false)
        return
      }

      try {
        // En un sistema real, esto sería una llamada a la API
        // Simulamos datos para la demostración
        const mockStops: DeliveryStop[] = [
          {
            id: "1",
            address: "123 Main St, Miami, FL",
            customerName: "Florería Bella Rosa",
            orderNumber: "ORD-001",
            status: "Pendiente",
            coordinates: [-80.1918, 25.7617], // Miami
          },
          {
            id: "2",
            address: "456 Ocean Dr, Miami Beach, FL",
            customerName: "Hotel Magnolia",
            orderNumber: "ORD-002",
            status: "Pendiente",
            coordinates: [-80.1301, 25.7867], // Miami Beach
          },
          {
            id: "3",
            address: "789 Brickell Ave, Miami, FL",
            customerName: "Eventos Elegantes",
            orderNumber: "ORD-003",
            status: "Pendiente",
            coordinates: [-80.1918, 25.7617], // Brickell
          },
        ]

        setStops(mockStops)
      } catch (error) {
        console.error("Error al cargar datos de la ruta:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la ruta",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRouteData()
  }, [initialStops, routeId])

  // Inicializar el mapa cuando los datos están cargados
  useEffect(() => {
    if (loading || !mapRef.current || !ol || stops.length === 0) return

    // Crear el mapa si no existe
    if (!olMapRef.current) {
      // Crear el mapa
      olMapRef.current = new ol.Map({
        target: mapRef.current,
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM(),
          }),
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat(stops[0].coordinates),
          zoom: 12,
        }),
      })
    }

    // Limpiar capas existentes excepto el mapa base
    const layers = olMapRef.current.getLayers().getArray()
    for (let i = layers.length - 1; i > 0; i--) {
      olMapRef.current.removeLayer(layers[i])
    }

    // Crear capa de vectores para las paradas
    const vectorSource = new ol.source.Vector()

    // Añadir marcadores para cada parada
    stops.forEach((stop, index) => {
      const marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(stop.coordinates)),
        name: stop.customerName,
        address: stop.address,
        orderNumber: stop.orderNumber,
        status: stop.status,
        index: index + 1,
      })

      // Estilo para el marcador
      marker.setStyle(
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({ color: "#4f46e5" }),
            stroke: new ol.style.Stroke({ color: "#ffffff", width: 2 }),
          }),
          text: new ol.style.Text({
            text: (index + 1).toString(),
            fill: new ol.style.Fill({ color: "#ffffff" }),
            font: "bold 12px Arial",
          }),
        }),
      )

      vectorSource.addFeature(marker)
    })

    // Crear capa de vectores
    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
    })

    // Añadir capa al mapa
    olMapRef.current.addLayer(vectorLayer)

    // Ajustar la vista para mostrar todas las paradas
    if (stops.length > 1) {
      const extent = vectorSource.getExtent()
      olMapRef.current.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 15,
      })
    }

    // Añadir interacción de popup
    const element = document.createElement("div")
    element.className = "ol-popup"
    element.style.backgroundColor = "white"
    element.style.padding = "10px"
    element.style.borderRadius = "4px"
    element.style.boxShadow = "0 1px 4px rgba(0,0,0,0.2)"
    element.style.position = "absolute"
    element.style.bottom = "12px"
    element.style.left = "-50px"
    element.style.minWidth = "200px"

    const popup = new ol.Overlay({
      element: element,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    })
    olMapRef.current.addOverlay(popup)

    // Mostrar popup al hacer clic en un marcador
    olMapRef.current.on("click", (evt: any) => {
      const feature = olMapRef.current.forEachFeatureAtPixel(evt.pixel, (feature: any) => feature)

      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates()
        popup.setPosition(coordinates)
        element.innerHTML = `
          <div>
            <strong>${feature.get("name")}</strong><br>
            Orden: ${feature.get("orderNumber")}<br>
            Dirección: ${feature.get("address")}<br>
            Estado: ${feature.get("status")}<br>
            Parada #${feature.get("index")}
          </div>
        `
        element.style.display = "block"
      } else {
        element.style.display = "none"
      }
    })

    // Cambiar el cursor al pasar sobre un marcador
    olMapRef.current.on("pointermove", (e: any) => {
      const pixel = olMapRef.current.getEventPixel(e.originalEvent)
      const hit = olMapRef.current.hasFeatureAtPixel(pixel)
      olMapRef.current.getViewport().style.cursor = hit ? "pointer" : ""
    })

    // Limpiar al desmontar
    return () => {
      // No destruimos el mapa aquí para evitar recrearlo en cada renderizado
    }
  }, [loading, stops])

  // Cambiar el tipo de mapa
  useEffect(() => {
    if (!olMapRef.current || !ol) return

    const layers = olMapRef.current.getLayers().getArray()
    const baseLayer = layers[0]

    // Cambiar la fuente del mapa base según la selección
    switch (mapView) {
      case "standard":
        baseLayer.setSource(new ol.source.OSM())
        break
      case "satellite":
        // En un sistema real, aquí se usaría una fuente de imágenes satelitales
        // Para la demostración, usamos una imagen estática
        baseLayer.setSource(
          new ol.source.XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          }),
        )
        break
      case "traffic":
        // En un sistema real, aquí se usaría una fuente con datos de tráfico
        baseLayer.setSource(
          new ol.source.XYZ({
            url: "https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
          }),
        )
        break
    }
  }, [mapView])

  // Optimizar ruta
  const optimizeRoute = async () => {
    setOptimizing(true)

    try {
      // En un sistema real, esto sería una llamada a la API
      // Simulamos la optimización para la demostración
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reordenar las paradas (simulación)
      const optimizedStops = [...stops].sort(() => Math.random() - 0.5)

      setStops(optimizedStops)
      toast({
        title: "Ruta optimizada",
        description: "La ruta ha sido optimizada correctamente",
      })
    } catch (error) {
      console.error("Error al optimizar ruta:", error)
      toast({
        title: "Error",
        description: "No se pudo optimizar la ruta",
        variant: "destructive",
      })
    } finally {
      setOptimizing(false)
    }
  }

  // Actualizar estado de una parada
  const updateStopStatus = async (stopId: string, newStatus: string) => {
    try {
      // En un sistema real, esto sería una llamada a la API
      // Simulamos la actualización para la demostración
      const updatedStops = stops.map((stop) => (stop.id === stopId ? { ...stop, status: newStatus } : stop))

      setStops(updatedStops)
      toast({
        title: "Estado actualizado",
        description: `La parada ha sido marcada como ${newStatus}`,
      })
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la parada",
        variant: "destructive",
      })
    }
  }

  // Obtener variante de estado
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completada":
        return "success"
      case "En Proceso":
        return "warning"
      case "Pendiente":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planificador de Ruta</CardTitle>
          <CardDescription>Gestiona y optimiza la ruta de entrega</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Select value={mapView} onValueChange={setMapView}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de mapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Estándar</SelectItem>
                    <SelectItem value="satellite">Satélite</SelectItem>
                    <SelectItem value="traffic">Tráfico</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={optimizeRoute} disabled={optimizing || loading || stops.length < 2}>
                  {optimizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizando...
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-4 w-4" />
                      Optimizar Ruta
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {stops.length} paradas | {stops.filter((s) => s.status === "Completada").length} completadas
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-[400px] bg-muted rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[400px] bg-muted rounded-md relative" ref={mapRef}></div>
            )}

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Paradas Programadas</h3>
              <div className="space-y-2">
                {stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{stop.customerName}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {stop.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(stop.status)}>{stop.status}</Badge>
                      {stop.status === "Pendiente" && (
                        <Button size="sm" variant="outline" onClick={() => updateStopStatus(stop.id, "En Proceso")}>
                          Iniciar
                        </Button>
                      )}
                      {stop.status === "En Proceso" && (
                        <Button size="sm" variant="outline" onClick={() => updateStopStatus(stop.id, "Completada")}>
                          Completar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

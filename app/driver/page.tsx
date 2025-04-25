"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DriverHeader } from "@/components/driver/driver-header"
import { DriverMap } from "@/components/driver/driver-map"
import { DeliveryList } from "@/components/driver/delivery-list"
import { DriverStats } from "@/components/driver/driver-stats"
import { DriverOfflineMode } from "@/components/driver/driver-offline-mode"
import { toast } from "@/components/ui/use-toast"

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [activeDeliveries, setActiveDeliveries] = useState(0)
  const [completedDeliveries, setCompletedDeliveries] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setActiveDeliveries(3)
      setCompletedDeliveries(2)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline)
    toast({
      title: isOnline ? "Modo Offline activado" : "Modo Online activado",
      description: isOnline
        ? "Ahora estás en modo offline. Los datos se sincronizarán cuando vuelvas a estar online."
        : "Ahora estás en modo online. Todos los datos están sincronizados.",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DriverHeader isOnline={isOnline} toggleOnlineStatus={toggleOnlineStatus} />

      <main className="flex-1 container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Driver Status Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/avatar-1.png" alt="Driver" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">¡Bienvenido, Juan!</h2>
                      <p className="text-muted-foreground">
                        Estado:{" "}
                        <Badge variant={isOnline ? "default" : "outline"}>{isOnline ? "Online" : "Offline"}</Badge>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={toggleOnlineStatus} variant={isOnline ? "outline" : "default"}>
                      {isOnline ? "Cambiar a Offline" : "Cambiar a Online"}
                    </Button>
                    <Button asChild>
                      <Link href="/driver/scan">Escanear QR</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="map">Mapa</TabsTrigger>
                <TabsTrigger value="deliveries">Entregas ({activeDeliveries})</TabsTrigger>
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                <TabsTrigger value="offline">Modo Offline</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-6">
                <DriverMap />
              </TabsContent>

              <TabsContent value="deliveries" className="mt-6">
                <DeliveryList />
              </TabsContent>

              <TabsContent value="stats" className="mt-6">
                <DriverStats />
              </TabsContent>

              <TabsContent value="offline" className="mt-6">
                <DriverOfflineMode />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  )
}

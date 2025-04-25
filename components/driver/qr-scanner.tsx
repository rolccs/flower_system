"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Package, CheckCircle, RefreshCw, AlertCircle, Truck, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function QrScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<any | null>(null)
  const [scanHistory, setScanHistory] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("scanner")

  const startScanner = () => {
    setIsScanning(true)
    toast({
      title: "Escáner activado",
      description: "Apunta la cámara al código QR del paquete",
    })

    // Simular escaneo después de 3 segundos
    setTimeout(() => {
      const mockDeliveryData = {
        id: "del1",
        orderId: "ORD-2023-1001",
        customer: {
          name: "Florería Bella Rosa",
          address: "123 Ocean Drive, Miami Beach, FL 33139",
          phone: "(305) 555-1234",
        },
        items: ["2 bonches de Rosas Rojas Premium", "1 bonche de Lirios Blancos"],
        total: 85.99,
        status: "Pendiente",
        eta: "15 minutos",
        scannedAt: new Date().toISOString(),
      }

      setScannedData(mockDeliveryData)
      setScanHistory((prev) => [mockDeliveryData, ...prev])
      setIsScanning(false)

      toast({
        title: "Código QR escaneado",
        description: `Pedido ${mockDeliveryData.orderId} identificado`,
      })
    }, 3000)
  }

  const resetScanner = () => {
    setScannedData(null)
    setIsScanning(false)
  }

  const confirmPickup = () => {
    if (!scannedData) return

    toast({
      title: "Recogida confirmada",
      description: `Has recogido el pedido ${scannedData.orderId}`,
    })

    // Actualizar el estado del pedido escaneado
    setScannedData({
      ...scannedData,
      status: "En Ruta",
    })

    // Actualizar el historial
    setScanHistory((prev) => prev.map((item) => (item.id === scannedData.id ? { ...item, status: "En Ruta" } : item)))
  }

  const confirmDelivery = () => {
    if (!scannedData) return

    toast({
      title: "Entrega confirmada",
      description: `Has entregado el pedido ${scannedData.orderId}`,
    })

    // Actualizar el estado del pedido escaneado
    setScannedData({
      ...scannedData,
      status: "Entregado",
      deliveredAt: new Date().toISOString(),
    })

    // Actualizar el historial
    setScanHistory((prev) =>
      prev.map((item) =>
        item.id === scannedData.id ? { ...item, status: "Entregado", deliveredAt: new Date().toISOString() } : item,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner">Escáner QR</TabsTrigger>
          <TabsTrigger value="history">Historial ({scanHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Escanear Código QR</CardTitle>
              <CardDescription>
                Escanea el código QR del paquete para verificar la información de entrega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isScanning ? (
                  <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-0 bg-black/5"
                      style={{
                        backgroundImage: "url('/qr-scanner-overlay.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white p-4 text-center">
                      <p>Escaneando... Mantén la cámara estable</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                    {scannedData ? (
                      <div className="p-4 w-full">
                        <div className="flex items-center justify-center mb-4">
                          <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Código QR Escaneado
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Pedido:</span>
                            <span>{scannedData.orderId}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Cliente:</span>
                            <span>{scannedData.customer.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Estado:</span>
                            <Badge
                              variant={
                                scannedData.status === "Entregado"
                                  ? "success"
                                  : scannedData.status === "En Ruta"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {scannedData.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Productos:</span>
                            <span>{scannedData.items.length} items</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total:</span>
                            <span>${scannedData.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Escaneado:</span>
                            <span>{new Date(scannedData.scannedAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Listo para escanear</p>
                        <p className="text-sm text-muted-foreground text-center max-w-xs mt-2">
                          Presiona el botón "Iniciar Escáner" para comenzar a escanear códigos QR
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {isScanning ? (
                <Button variant="outline" className="w-full" onClick={resetScanner}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Cancelar Escaneo
                </Button>
              ) : scannedData ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={resetScanner}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Escanear Otro
                  </Button>
                  {scannedData.status === "Pendiente" && (
                    <Button className="flex-1" onClick={confirmPickup}>
                      <Package className="mr-2 h-4 w-4" />
                      Confirmar Recogida
                    </Button>
                  )}
                  {scannedData.status === "En Ruta" && (
                    <Button className="flex-1" onClick={confirmDelivery}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmar Entrega
                    </Button>
                  )}
                </>
              ) : (
                <Button className="w-full" onClick={startScanner}>
                  <Camera className="mr-2 h-4 w-4" />
                  Iniciar Escáner
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Escaneos</CardTitle>
              <CardDescription>Registro de todos los códigos QR escaneados durante tu turno</CardDescription>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No hay historial de escaneos</p>
                  <p className="text-sm text-muted-foreground mt-1">Los códigos QR escaneados aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div
                        className={`rounded-full p-2 ${
                          scan.status === "Entregado"
                            ? "bg-green-100 text-green-600"
                            : scan.status === "En Ruta"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {scan.status === "Entregado" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : scan.status === "En Ruta" ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{scan.orderId}</h4>
                          <Badge
                            variant={
                              scan.status === "Entregado"
                                ? "success"
                                : scan.status === "En Ruta"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {scan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{scan.customer.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(scan.scannedAt).toLocaleTimeString()} -
                            {scan.deliveredAt
                              ? ` Entregado: ${new Date(scan.deliveredAt).toLocaleTimeString()}`
                              : " Pendiente de entrega"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("scanner")}>
                <Camera className="mr-2 h-4 w-4" />
                Volver al Escáner
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

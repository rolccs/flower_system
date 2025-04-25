"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Download, Printer, Scan } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface QRCodeGeneratorProps {
  orderId: string
  orderNumber: string
  customerName: string
  deliveryAddress: string
}

export function QRCodeGenerator({ orderId, orderNumber, customerName, deliveryAddress }: QRCodeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  // Función para generar el código QR
  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      // En un sistema real, esto sería una llamada a la API
      // const response = await fetch(`/api/delivery/qr-code/${orderId}`)
      // if (!response.ok) throw new Error("Error al generar el código QR")
      // const data = await response.json()
      // setQrCodeUrl(data.qrCodeUrl)

      // Simulamos la generación del código QR
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // URL de ejemplo para el código QR
      const mockQrCodeUrl = `/placeholder.svg?height=200&width=200&query=QR%20Code%20for%20Order%20${orderNumber}`
      setQrCodeUrl(mockQrCodeUrl)

      toast({
        title: "Código QR generado",
        description: `Se ha generado el código QR para la orden ${orderNumber}`,
      })
    } catch (error) {
      console.error("Error al generar el código QR:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el código QR",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para descargar el código QR
  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qr-code-order-${orderNumber}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Código QR descargado",
      description: `Se ha descargado el código QR para la orden ${orderNumber}`,
    })
  }

  // Función para imprimir el código QR
  const printQRCode = () => {
    if (!qrCodeUrl) return

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Código QR - Orden ${orderNumber}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              .qr-container {
                margin: 20px auto;
              }
              .order-details {
                margin-top: 20px;
                text-align: left;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
              }
              .order-details p {
                margin: 5px 0;
              }
              @media print {
                button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <h1>Código QR para Entrega</h1>
            <div class="qr-container">
              <img src="${qrCodeUrl}" alt="Código QR" style="width: 200px; height: 200px;" />
            </div>
            <div class="order-details">
              <p><strong>Orden:</strong> ${orderNumber}</p>
              <p><strong>Cliente:</strong> ${customerName}</p>
              <p><strong>Dirección:</strong> ${deliveryAddress}</p>
            </div>
            <button onclick="window.print()">Imprimir</button>
          </body>
        </html>
      `)
      printWindow.document.close()
    }

    toast({
      title: "Preparando impresión",
      description: "Se ha abierto una nueva ventana para imprimir el código QR",
    })
  }

  // Función para simular el escaneo del código QR
  const scanQRCode = async () => {
    toast({
      title: "Escaneando código QR",
      description: "Por favor, utilice un escáner de códigos QR o la cámara del dispositivo",
    })

    // En un sistema real, esto activaría la cámara o el escáner
    // Por ahora, simulamos un escaneo exitoso después de un breve retraso
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Código QR escaneado",
      description: `Orden ${orderNumber} verificada correctamente`,
      variant: "success",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Código QR para Entrega</CardTitle>
        <CardDescription>
          Genera, imprime o escanea el código QR para validar la entrega de la orden {orderNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {qrCodeUrl ? (
          <div className="flex flex-col items-center">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="Código QR" className="w-48 h-48 mb-4" />
            <div className="text-center mb-4">
              <p className="font-medium">Orden: {orderNumber}</p>
              <p className="text-sm text-muted-foreground">Cliente: {customerName}</p>
              <p className="text-sm text-muted-foreground">Dirección: {deliveryAddress}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-10 w-48 h-48 mb-4">
            <QrCode className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">Genera el código QR para la orden {orderNumber}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center gap-2">
        {!qrCodeUrl ? (
          <Button onClick={generateQRCode} disabled={isGenerating}>
            <QrCode className="mr-2 h-4 w-4" />
            {isGenerating ? "Generando..." : "Generar Código QR"}
          </Button>
        ) : (
          <>
            <Button onClick={downloadQRCode}>
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
            <Button onClick={printQRCode}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={scanQRCode} variant="outline">
              <Scan className="mr-2 h-4 w-4" />
              Escanear
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

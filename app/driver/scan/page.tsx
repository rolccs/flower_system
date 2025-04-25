"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DriverHeader } from "@/components/driver/driver-header"
import { QrScanner } from "@/components/driver/qr-scanner"
import { ArrowLeft } from "lucide-react"

export default function ScanPage() {
  const [isOnline, setIsOnline] = useState(true)

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DriverHeader isOnline={isOnline} toggleOnlineStatus={toggleOnlineStatus} />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/driver" className="flex items-center text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Escanear Código QR</CardTitle>
            <CardDescription>
              Escanea el código QR de un paquete para verificar la información de entrega o confirmar la
              recogida/entrega
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Utiliza la cámara de tu dispositivo para escanear el código QR. Asegúrate de que el código esté bien
              iluminado y centrado en el marco.
            </p>
          </CardContent>
        </Card>

        <QrScanner />
      </main>
    </div>
  )
}

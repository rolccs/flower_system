import { DeliveryRoutes } from "@/components/delivery/delivery-routes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileDown, Plus, MapPin } from "lucide-react"

export default function DeliveryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sistema de Delivery</h1>
          <p className="text-muted-foreground">Gestiona todas las rutas y entregas del sistema.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/delivery/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Ruta
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <MapPin className="mr-2 h-4 w-4" />
            Ver Mapa General
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <DeliveryRoutes />
    </div>
  )
}

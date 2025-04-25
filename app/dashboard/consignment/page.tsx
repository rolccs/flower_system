import { ConsignmentList } from "@/components/consignment/consignment-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileDown, Plus, FileText } from "lucide-react"

export default function ConsignmentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Consignaciones</h1>
          <p className="text-muted-foreground">Gestiona todas las consignaciones de productos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/consignment/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Consignación
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <ConsignmentList />
    </div>
  )
}

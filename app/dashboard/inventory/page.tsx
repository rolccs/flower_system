import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductList } from "@/components/inventory/product-list"
import { PlusCircle, FileDown, Printer } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Inventario</h1>
          <p className="text-muted-foreground">Administra tu inventario de flores y productos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/inventory/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Etiquetas
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <ProductList />
    </div>
  )
}

import { ArrowDownIcon, ArrowUpIcon, CheckCircle2, Clock, DollarSign, ShoppingCart, Truck, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryData } from "@/lib/types"

export function DashboardCards({ inventoryData }: { inventoryData: InventoryData[] }) {
  // Calcular estadísticas del inventario
  const totalProducts = inventoryData.length
  const lowStockProducts = inventoryData.filter((item) => {
    const stock = Number.parseInt(item.Stock)
    const minStock = item["Stock Mínimo"] ? Number.parseInt(item["Stock Mínimo"]) : 10
    return stock <= minStock
  }).length

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +20.1%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Suscripciones</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+24</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +12.2%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos en Inventario</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-rose-500 flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              {lowStockProducts}
            </span>{" "}
            productos con stock bajo
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entregas Hoy</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">9</div>
          <div className="flex flex-wrap items-center pt-1">
            <span className="flex items-center text-xs text-emerald-500 mr-2 mb-1">
              <CheckCircle2 className="mr-1 h-3 w-3" />3 completadas
            </span>
            <span className="mx-2 text-xs text-muted-foreground hidden sm:inline">•</span>
            <span className="flex items-center text-xs text-amber-500">
              <Clock className="mr-1 h-3 w-3" />6 en progreso
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

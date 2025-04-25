import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Obtener estadísticas de productos
    const totalProducts = await prisma.product.count()
    const lowStockProducts = await prisma.product.count({
      where: {
        stock: {
          lte: prisma.product.fields.minStock,
        },
      },
    })

    // Obtener estadísticas de clientes
    const totalCustomers = await prisma.customer.count()

    // Obtener estadísticas de suscripciones
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        status: "Activa",
      },
    })

    // Obtener estadísticas de entregas (simuladas por ahora)
    const pendingDeliveries = 6
    const completedDeliveries = 3

    // Obtener estadísticas de ingresos (simuladas por ahora)
    const totalRevenue = 45231.89
    const revenueChange = 20.1

    return NextResponse.json({
      totalProducts,
      lowStockProducts,
      totalCustomers,
      activeSubscriptions,
      pendingDeliveries,
      completedDeliveries,
      totalRevenue,
      revenueChange,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas", details: (error as Error).message },
      { status: 500 },
    )
  }
}

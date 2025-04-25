import { NextResponse } from "next/server"
import { getProductStats } from "@/lib/services/inventory-service"

export async function GET() {
  try {
    const stats = await getProductStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas de inventario:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas", details: (error as Error).message },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { getCategories, createCategory } from "@/lib/services/inventory-service"
import { z } from "zod"

// Esquema de validación para crear una categoría
const createCategorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json(
      { error: "Error al obtener categorías", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar los datos
    const validatedData = createCategorySchema.parse(body)

    // Crear la categoría
    const category = await createCategory(validatedData)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error al crear categoría:", error)

    // Si es un error de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos de categoría inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Error al crear categoría", details: (error as Error).message }, { status: 500 })
  }
}

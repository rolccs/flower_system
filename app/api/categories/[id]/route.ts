import { NextResponse } from "next/server"
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/services/inventory-service"
import { z } from "zod"

// Esquema de validación para actualizar una categoría
const updateCategorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  description: z.string().optional(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const category = await getCategoryById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error al obtener categoría:", error)
    return NextResponse.json(
      { error: "Error al obtener categoría", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validar los datos
    const validatedData = updateCategorySchema.parse(body)

    // Verificar si la categoría existe
    const existingCategory = await getCategoryById(params.id)
    if (!existingCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    // Actualizar la categoría
    const category = await updateCategory(params.id, validatedData)

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error al actualizar categoría:", error)

    // Si es un error de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos de categoría inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Error al actualizar categoría", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar si la categoría existe
    const existingCategory = await getCategoryById(params.id)
    if (!existingCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    // Eliminar la categoría
    await deleteCategory(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return NextResponse.json(
      { error: "Error al eliminar categoría", details: (error as Error).message },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/inventory-service"
import { z } from "zod"

// Esquema de validación para actualizar un producto
const updateProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  description: z.string().optional(),
  sku: z.string().min(3, "El SKU debe tener al menos 3 caracteres").optional(),
  barcode: z.string().optional(),
  gtin: z.string().optional(),
  qrCode: z.string().optional(),
  price: z.number().min(0, "El precio no puede ser negativo").optional(),
  price50cm: z.number().optional(),
  price60cm: z.number().optional(),
  price70cm: z.number().optional(),
  stock: z.number().int().min(0, "El stock no puede ser negativo").optional(),
  minStock: z.number().int().min(0, "El stock mínimo no puede ser negativo").optional(),
  color: z.string().optional(),
  image: z.string().optional(),
  metadata: z.string().optional(),
  categoryId: z.string().optional(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id)

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ error: "Error al obtener producto", details: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validar los datos
    const validatedData = updateProductSchema.parse(body)

    // Verificar si el producto existe
    const existingProduct = await getProductById(params.id)
    if (!existingProduct) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    // Actualizar el producto
    const product = await updateProduct(params.id, validatedData)

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error al actualizar producto:", error)

    // Si es un error de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos de producto inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Error al actualizar producto", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar si el producto existe
    const existingProduct = await getProductById(params.id)
    if (!existingProduct) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    // Eliminar el producto
    await deleteProduct(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json(
      { error: "Error al eliminar producto", details: (error as Error).message },
      { status: 500 },
    )
  }
}

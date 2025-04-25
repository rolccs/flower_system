import { NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/services/inventory-service"
import { z } from "zod"

// Esquema de validación para crear un producto
const createProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  sku: z.string().min(3, "El SKU debe tener al menos 3 caracteres"),
  barcode: z.string().optional(),
  gtin: z.string().optional(),
  qrCode: z.string().optional(),
  price: z.number().min(0, "El precio no puede ser negativo"),
  price50cm: z.number().optional(),
  price60cm: z.number().optional(),
  price70cm: z.number().optional(),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  minStock: z.number().int().min(0, "El stock mínimo no puede ser negativo").optional(),
  color: z.string().optional(),
  image: z.string().optional(),
  metadata: z.string().optional(),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const search = searchParams.get("search") || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    const result = await getProducts({
      categoryId,
      search,
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json(
      { error: "Error al obtener productos", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar los datos
    const validatedData = createProductSchema.parse(body)

    // Crear el producto
    const product = await createProduct(validatedData)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)

    // Si es un error de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos de producto inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Error al crear producto", details: (error as Error).message }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { generateInvoiceNumber, createInvoice, getInvoices } from "@/lib/services/billing-service"
import { z } from "zod"

// Esquema de validación para crear una factura
const createInvoiceSchema = z.object({
  customerId: z.string().min(1, "El cliente es obligatorio"),
  userId: z.string().min(1, "El usuario es obligatorio"),
  type: z.string().min(1, "El tipo de factura es obligatorio"),
  total: z.number().min(0, "El total no puede ser negativo"),
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentDetails: z.string().optional(),
  orderIds: z.array(z.string()).optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const customerId = searchParams.get("customerId") || undefined
    const type = searchParams.get("type") || undefined
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    const result = await getInvoices({
      status,
      customerId,
      type,
      startDate,
      endDate,
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al obtener facturas:", error)
    return NextResponse.json({ error: "Error al obtener facturas", details: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar los datos
    const validatedData = createInvoiceSchema.parse(body)

    // Generar número de factura si no se proporciona
    if (!body.invoiceNumber) {
      body.invoiceNumber = await generateInvoiceNumber()
    }

    // Crear la factura
    const invoice = await createInvoice(body)

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Error al crear factura:", error)

    // Si es un error de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos de factura inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Error al crear factura", details: (error as Error).message }, { status: 500 })
  }
}

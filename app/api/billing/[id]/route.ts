import { NextResponse } from "next/server"
import { getInvoiceById, updateInvoice } from "@/lib/services/billing-service"
import { z } from "zod"

// Esquema de validación para actualizar una factura
const updateInvoiceSchema = z.object({
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentDetails: z.string().optional(),
  total: z.number().min(0, "El total no puede ser negativo").optional(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const invoice = await getInvoiceById(params.id)

    if (!invoice) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error al obtener factura:", error)
    return NextResponse.json({ error: "Error al obtener factura", details: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validar los datos
    const validatedData = updateInvoiceSchema.parse(body)

    // Actualizar la factura
    const invoice = await updateInvoice(params.id, validatedData)

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error al actualizar factura:", error)

    // Si es un error de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos de factura inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Error al actualizar factura", details: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // En un sistema de facturación real, normalmente no se eliminan facturas
  // Se marcan como canceladas o anuladas
  return NextResponse.json(
    { error: "No se permite eliminar facturas. Use PUT para cambiar su estado a 'Cancelada'." },
    { status: 405 },
  )
}

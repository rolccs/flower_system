import { notFound } from "next/navigation"
import { getInvoiceById } from "@/lib/services/billing-service"
import { InvoiceDetails } from "@/components/billing/invoice-details"

interface InvoicePageProps {
  params: {
    id: string
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const invoice = await getInvoiceById(params.id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Detalles de Factura</h1>
      <InvoiceDetails invoice={invoice} />
    </div>
  )
}

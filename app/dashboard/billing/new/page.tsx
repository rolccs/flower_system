import { InvoiceForm } from "@/components/billing/invoice-form"

export default function NewInvoicePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Factura</h1>
      <InvoiceForm />
    </div>
  )
}

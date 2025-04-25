import { QRCodeGenerator } from "@/components/delivery/qr-code-generator"
import { LabelGenerator } from "@/components/inventory/label-generator"
import { OpenStreetMap } from "@/components/delivery/open-street-map"
import { InvoiceGenerator } from "@/components/billing/invoice-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Herramientas del Sistema</h1>
        <p className="text-muted-foreground">
          Accede a herramientas especializadas para gestionar tu negocio de flores mayorista.
        </p>
      </div>

      <Tabs defaultValue="qr" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="qr">Códigos QR</TabsTrigger>
          <TabsTrigger value="labels">Etiquetas</TabsTrigger>
          <TabsTrigger value="maps">Mapas</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="mt-6">
          <QRCodeGenerator
            orderId="order-123"
            orderNumber="ORD-2304-001"
            customerName="Florería Bella Rosa"
            deliveryAddress="123 Main St, Miami, FL 33101"
          />
        </TabsContent>

        <TabsContent value="labels" className="mt-6">
          <LabelGenerator />
        </TabsContent>

        <TabsContent value="maps" className="mt-6">
          <OpenStreetMap />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoiceGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

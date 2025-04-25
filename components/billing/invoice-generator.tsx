"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FileText, Printer, Download, Mail, Eye, Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  total: number
}

interface Customer {
  id: string
  name: string
  email: string
  address: string
  taxId?: string
}

export function InvoiceGenerator() {
  const [activeTab, setActiveTab] = useState("details")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("30")
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [notes, setNotes] = useState("")
  const [includeShipping, setIncludeShipping] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)

  // Datos de ejemplo para clientes
  const customers: Customer[] = [
    {
      id: "1",
      name: "Florería Bella Rosa",
      email: "info@bellarosa.com",
      address: "123 Main St, Miami, FL 33101",
      taxId: "12-3456789",
    },
    {
      id: "2",
      name: "Eventos Elegantes",
      email: "contacto@eventoselegantes.com",
      address: "456 Oak Ave, Miami Beach, FL 33139",
      taxId: "98-7654321",
    },
    {
      id: "3",
      name: "Jardines Modernos",
      email: "info@jardinesmodernos.com",
      address: "789 Pine St, Coral Gables, FL 33134",
    },
    {
      id: "4",
      name: "Hotel Magnolia",
      email: "reservas@hotelmagnolia.com",
      address: "101 Cedar Blvd, Brickell, FL 33131",
      taxId: "45-6789012",
    },
    {
      id: "5",
      name: "Decoraciones Primavera",
      email: "info@decoracionesprimavera.com",
      address: "202 Elm St, Doral, FL 33122",
    },
  ]

  // Inicializar valores por defecto
  useState(() => {
    // Generar número de factura
    const today = new Date()
    const year = today.getFullYear().toString().slice(-2)
    const month = (today.getMonth() + 1).toString().padStart(2, "0")
    const day = today.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    setInvoiceNumber(`INV-${year}${month}${day}-${random}`)

    // Establecer fecha de factura
    setInvoiceDate(today.toISOString().split("T")[0])

    // Establecer fecha de vencimiento (30 días después)
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + 30)
    setDueDate(dueDate.toISOString().split("T")[0])
  })

  // Función para añadir un nuevo ítem
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 8.5,
      total: 0,
    }
    setItems([...items, newItem])
  }

  // Función para actualizar un ítem
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // Recalcular el total
        if (field === "quantity" || field === "unitPrice") {
          const quantity = field === "quantity" ? Number(value) : item.quantity
          const unitPrice = field === "unitPrice" ? Number(value) : item.unitPrice
          updatedItem.total = quantity * unitPrice
        }

        return updatedItem
      }
      return item
    })

    setItems(updatedItems)
  }

  // Función para eliminar un ítem
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Calcular subtotal
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)

  // Calcular impuestos
  const taxes = items.reduce((sum, item) => sum + (item.total * item.taxRate) / 100, 0)

  // Calcular total
  const total = subtotal + taxes + (includeShipping ? shippingCost : 0)

  // Función para generar la factura
  const generateInvoice = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un cliente",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, añade al menos un ítem a la factura",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // En un sistema real, esto sería una llamada a la API
      // const response = await fetch("/api/billing/generate-invoice", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     invoiceNumber,
      //     invoiceDate,
      //     dueDate,
      //     customerId: selectedCustomer,
      //     paymentTerms,
      //     items,
      //     notes,
      //     includeShipping,
      //     shippingCost,
      //   }),
      // })
      // if (!response.ok) throw new Error("Error al generar la factura")
      // const data = await response.json()
      // setInvoiceUrl(data.invoiceUrl)

      // Simular la generación de la factura
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // URL de ejemplo para la factura
      const mockInvoiceUrl = `/placeholder.svg?height=800&width=600&query=Invoice%20${invoiceNumber}%20PDF`
      setInvoiceUrl(mockInvoiceUrl)

      toast({
        title: "Factura generada",
        description: `Se ha generado la factura ${invoiceNumber}`,
      })

      // Cambiar a la pestaña de vista previa
      setActiveTab("preview")
    } catch (error) {
      console.error("Error al generar factura:", error)
      toast({
        title: "Error",
        description: "No se pudo generar la factura",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para imprimir la factura
  const printInvoice = () => {
    if (!invoiceUrl) return

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Factura ${invoiceNumber}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              @media print {
                button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <img src="${invoiceUrl}" alt="Factura" style="width: 100%;" />
            <button onclick="window.print()">Imprimir</button>
          </body>
        </html>
      `)
      printWindow.document.close()
    }

    toast({
      title: "Preparando impresión",
      description: "Se ha abierto una nueva ventana para imprimir la factura",
    })
  }

  // Función para descargar la factura
  const downloadInvoice = () => {
    if (!invoiceUrl) return

    const link = document.createElement("a")
    link.href = invoiceUrl
    link.download = `factura-${invoiceNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Factura descargada",
      description: `Se ha descargado la factura ${invoiceNumber}`,
    })
  }

  // Función para enviar la factura por correo
  const emailInvoice = () => {
    if (!invoiceUrl || !selectedCustomer) return

    const customer = customers.find((c) => c.id === selectedCustomer)

    toast({
      title: "Factura enviada",
      description: `Se ha enviado la factura ${invoiceNumber} a ${customer?.email}`,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generador de Facturas</CardTitle>
        <CardDescription>Crea y personaliza facturas para tus clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="items">Ítems</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Número de Factura</Label>
                <Input id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Cliente</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Fecha de Factura</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Términos de Pago</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger id="paymentTerms">
                    <SelectValue placeholder="Selecciona términos de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Pago inmediato</SelectItem>
                    <SelectItem value="7">7 días</SelectItem>
                    <SelectItem value="15">15 días</SelectItem>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="60">60 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="shipping">Incluir Envío</Label>
                  <Switch id="shipping" checked={includeShipping} onCheckedChange={setIncludeShipping} />
                </div>
                {includeShipping && (
                  <Input
                    type="number"
                    placeholder="Costo de envío"
                    value={shippingCost || ""}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                  />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Añade notas o términos adicionales..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {selectedCustomer && (
              <div className="border rounded-md p-4 mt-4">
                <h3 className="font-medium mb-2">Información del Cliente</h3>
                <div className="text-sm">
                  <p className="font-medium">{customers.find((c) => c.id === selectedCustomer)?.name}</p>
                  <p>{customers.find((c) => c.id === selectedCustomer)?.address}</p>
                  <p>Email: {customers.find((c) => c.id === selectedCustomer)?.email}</p>
                  {customers.find((c) => c.id === selectedCustomer)?.taxId && (
                    <p>ID Fiscal: {customers.find((c) => c.id === selectedCustomer)?.taxId}</p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <Button onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Ítem
            </Button>

            {items.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No hay ítems en la factura</p>
                <p className="text-sm text-muted-foreground">Haz clic en "Añadir Ítem" para comenzar</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Descripción</th>
                      <th className="text-right p-2">Cantidad</th>
                      <th className="text-right p-2">Precio Unitario</th>
                      <th className="text-right p-2">Impuesto (%)</th>
                      <th className="text-right p-2">Total</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2">
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            placeholder="Descripción del ítem"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                            className="text-right"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={item.unitPrice || ""}
                            onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                            className="text-right"
                            step="0.01"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={item.taxRate || ""}
                            onChange={(e) => updateItem(item.id, "taxRate", Number(e.target.value))}
                            className="text-right"
                            step="0.1"
                          />
                        </td>
                        <td className="p-2 text-right font-medium">${item.total.toFixed(2)}</td>
                        <td className="p-2">
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td colSpan={4} className="p-2 text-right font-medium">
                        Subtotal:
                      </td>
                      <td className="p-2 text-right font-medium">${subtotal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-2 text-right font-medium">
                        Impuestos:
                      </td>
                      <td className="p-2 text-right font-medium">${taxes.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    {includeShipping && (
                      <tr>
                        <td colSpan={4} className="p-2 text-right font-medium">
                          Envío:
                        </td>
                        <td className="p-2 text-right font-medium">${shippingCost.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={4} className="p-2 text-right font-bold">
                        Total:
                      </td>
                      <td className="p-2 text-right font-bold">${total.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {invoiceUrl ? (
              <div className="flex flex-col items-center">
                <div className="border rounded-md p-4 w-full overflow-auto">
                  <img
                    src={invoiceUrl || "/placeholder.svg"}
                    alt="Vista previa de factura"
                    className="max-w-full h-auto"
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Button onClick={printInvoice}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button onClick={downloadInvoice}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                  <Button onClick={emailInvoice} variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar por Email
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay vista previa disponible</h3>
                <p className="text-muted-foreground mb-4">
                  Completa los detalles de la factura y genera una vista previa
                </p>
                <Button onClick={generateInvoice} disabled={isGenerating}>
                  <Eye className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generando..." : "Generar Vista Previa"}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab(activeTab === "details" ? "items" : "details")}>
          {activeTab === "items" ? "Volver a Detalles" : activeTab === "preview" ? "Volver a Ítems" : ""}
        </Button>
        {activeTab !== "preview" ? (
          <Button onClick={generateInvoice} disabled={isGenerating}>
            <FileText className="mr-2 h-4 w-4" />
            {isGenerating ? "Generando..." : "Generar Factura"}
          </Button>
        ) : (
          <Button
            onClick={() => {
              setInvoiceUrl(null)
              setActiveTab("details")
            }}
            variant="outline"
          >
            Nueva Factura
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

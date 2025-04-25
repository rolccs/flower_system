"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Barcode, QrCode, Printer, Download, Settings } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  sku: string
  price: number
  category: string
}

export function LabelGenerator() {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [labelType, setLabelType] = useState<"barcode" | "qr">("barcode")
  const [labelSize, setLabelSize] = useState<string>("medium")
  const [quantity, setQuantity] = useState<number>(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [labelUrl, setLabelUrl] = useState<string | null>(null)

  // Datos de ejemplo para productos
  const products: Product[] = [
    { id: "1", name: "Rosa Roja Premium", sku: "RR-001", price: 2.99, category: "Rosas" },
    { id: "2", name: "Tulipán Holandés", sku: "TH-002", price: 3.49, category: "Tulipanes" },
    { id: "3", name: "Lirio Blanco", sku: "LB-003", price: 4.99, category: "Lirios" },
    { id: "4", name: "Girasol Grande", sku: "GG-004", price: 5.99, category: "Girasoles" },
    { id: "5", name: "Orquídea Exótica", sku: "OE-005", price: 15.99, category: "Orquídeas" },
  ]

  // Función para generar la etiqueta
  const generateLabel = async () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un producto",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // En un sistema real, esto sería una llamada a la API
      // const response = await fetch(`/api/inventory/label`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     productId: selectedProduct,
      //     labelType,
      //     labelSize,
      //     quantity,
      //   }),
      // })
      // if (!response.ok) throw new Error("Error al generar la etiqueta")
      // const data = await response.json()
      // setLabelUrl(data.labelUrl)

      // Simulamos la generación de la etiqueta
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const product = products.find((p) => p.id === selectedProduct)

      // URL de ejemplo para la etiqueta
      const mockLabelUrl = `/placeholder.svg?height=200&width=300&query=${labelType === "barcode" ? "Barcode" : "QR"}%20for%20${product?.name}%20${product?.sku}`
      setLabelUrl(mockLabelUrl)

      toast({
        title: "Etiqueta generada",
        description: `Se ha generado la etiqueta para ${product?.name}`,
      })
    } catch (error) {
      console.error("Error al generar la etiqueta:", error)
      toast({
        title: "Error",
        description: "No se pudo generar la etiqueta",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para imprimir la etiqueta
  const printLabel = () => {
    if (!labelUrl) return

    const product = products.find((p) => p.id === selectedProduct)

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Etiqueta - ${product?.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              .label-container {
                margin: 20px auto;
                border: 1px dashed #ccc;
                padding: 10px;
                display: inline-block;
              }
              .product-details {
                margin-top: 10px;
                text-align: center;
              }
              .product-details p {
                margin: 2px 0;
                font-size: 12px;
              }
              .product-name {
                font-weight: bold;
                font-size: 14px;
              }
              .product-price {
                font-weight: bold;
                font-size: 16px;
              }
              @media print {
                button {
                  display: none;
                }
                .label-container {
                  border: none;
                }
              }
            </style>
          </head>
          <body>
            ${Array(quantity)
              .fill(0)
              .map(
                () => `
              <div class="label-container">
                <img src="${labelUrl}" alt="Etiqueta" style="width: ${labelSize === "small" ? "150px" : labelSize === "medium" ? "200px" : "300px"};" />
                <div class="product-details">
                  <p class="product-name">${product?.name}</p>
                  <p>SKU: ${product?.sku}</p>
                  <p class="product-price">$${product?.price.toFixed(2)}</p>
                </div>
              </div>
            `,
              )
              .join("")}
            <button onclick="window.print()">Imprimir</button>
          </body>
        </html>
      `)
      printWindow.document.close()
    }

    toast({
      title: "Preparando impresión",
      description: "Se ha abierto una nueva ventana para imprimir las etiquetas",
    })
  }

  // Función para descargar la etiqueta
  const downloadLabel = () => {
    if (!labelUrl) return

    const product = products.find((p) => p.id === selectedProduct)

    const link = document.createElement("a")
    link.href = labelUrl
    link.download = `label-${product?.sku}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Etiqueta descargada",
      description: `Se ha descargado la etiqueta para ${product?.name}`,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generador de Etiquetas</CardTitle>
        <CardDescription>Genera etiquetas con códigos de barras o QR para tus productos de inventario</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generar Etiquetas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product">Producto</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="labelType">Tipo de Etiqueta</Label>
                <Select value={labelType} onValueChange={(value) => setLabelType(value as "barcode" | "qr")}>
                  <SelectTrigger id="labelType">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="barcode">Código de Barras</SelectItem>
                    <SelectItem value="qr">Código QR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="labelSize">Tamaño de Etiqueta</Label>
                <Select value={labelSize} onValueChange={setLabelSize}>
                  <SelectTrigger id="labelSize">
                    <SelectValue placeholder="Selecciona un tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeño (1.5" x 1")</SelectItem>
                    <SelectItem value="medium">Mediano (2" x 1.25")</SelectItem>
                    <SelectItem value="large">Grande (3" x 2")</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              {labelUrl ? (
                <div className="flex flex-col items-center">
                  <img
                    src={labelUrl || "/placeholder.svg"}
                    alt="Etiqueta generada"
                    className="border p-4 rounded-lg mb-4"
                    style={{
                      width: labelSize === "small" ? "150px" : labelSize === "medium" ? "200px" : "300px",
                    }}
                  />
                  <div className="text-center mb-4">
                    <p className="font-medium">{products.find((p) => p.id === selectedProduct)?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {products.find((p) => p.id === selectedProduct)?.sku}
                    </p>
                    <p className="font-medium">${products.find((p) => p.id === selectedProduct)?.price.toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-10 w-64 h-40">
                  {labelType === "barcode" ? (
                    <Barcode className="h-10 w-10 text-muted-foreground mb-2" />
                  ) : (
                    <QrCode className="h-10 w-10 text-muted-foreground mb-2" />
                  )}
                  <p className="text-sm text-muted-foreground text-center">
                    Selecciona un producto y genera una etiqueta
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="printerType">Tipo de Impresora</Label>
                <Select defaultValue="thermal">
                  <SelectTrigger id="printerType">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thermal">Impresora Térmica</SelectItem>
                    <SelectItem value="laser">Impresora Láser</SelectItem>
                    <SelectItem value="inkjet">Impresora de Inyección</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="labelTemplate">Plantilla de Etiqueta</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="labelTemplate">
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Estándar</SelectItem>
                    <SelectItem value="compact">Compacta</SelectItem>
                    <SelectItem value="detailed">Detallada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcodeType">Tipo de Código de Barras</Label>
                <Select defaultValue="code128">
                  <SelectTrigger id="barcodeType">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code128">Code 128</SelectItem>
                    <SelectItem value="ean13">EAN-13</SelectItem>
                    <SelectItem value="upc">UPC</SelectItem>
                    <SelectItem value="code39">Code 39</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qrVersion">Versión de QR</Label>
                <Select defaultValue="2">
                  <SelectTrigger id="qrVersion">
                    <SelectValue placeholder="Selecciona una versión" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Versión 1</SelectItem>
                    <SelectItem value="2">Versión 2</SelectItem>
                    <SelectItem value="3">Versión 3</SelectItem>
                    <SelectItem value="4">Versión 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2">
        <Button onClick={generateLabel} disabled={isGenerating || !selectedProduct}>
          {labelType === "barcode" ? <Barcode className="mr-2 h-4 w-4" /> : <QrCode className="mr-2 h-4 w-4" />}
          {isGenerating ? "Generando..." : "Generar Etiqueta"}
        </Button>
        {labelUrl && (
          <>
            <Button onClick={printLabel} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir ({quantity})
            </Button>
            <Button onClick={downloadLabel} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

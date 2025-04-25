"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Download, Printer } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Esquema de validación para reportes de ventas
const salesReportSchema = z.object({
  reportType: z.string().min(1, { message: "El tipo de reporte es obligatorio" }),
  startDate: z.date({ required_error: "La fecha de inicio es obligatoria" }),
  endDate: z.date({ required_error: "La fecha de fin es obligatoria" }),
  groupBy: z.string().min(1, { message: "El agrupamiento es obligatorio" }),
  customerId: z.string().optional(),
  format: z.string().min(1, { message: "El formato es obligatorio" }),
})

// Esquema de validación para reportes de inventario
const inventoryReportSchema = z.object({
  reportType: z.string().min(1, { message: "El tipo de reporte es obligatorio" }),
  categoryId: z.string().optional(),
  stockStatus: z.string().optional(),
  format: z.string().min(1, { message: "El formato es obligatorio" }),
})

// Esquema de validación para reportes de clientes
const customerReportSchema = z.object({
  reportType: z.string().min(1, { message: "El tipo de reporte es obligatorio" }),
  startDate: z.date({ required_error: "La fecha de inicio es obligatoria" }),
  endDate: z.date({ required_error: "La fecha de fin es obligatoria" }),
  customerType: z.string().optional(),
  format: z.string().min(1, { message: "El formato es obligatorio" }),
})

export function ReportGenerator() {
  const [activeTab, setActiveTab] = useState("sales")
  const [generatingReport, setGeneratingReport] = useState(false)

  // Formulario para reportes de ventas
  const salesForm = useForm<z.infer<typeof salesReportSchema>>({
    resolver: zodResolver(salesReportSchema),
    defaultValues: {
      reportType: "sales_summary",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
      groupBy: "day",
      format: "pdf",
    },
  })

  // Formulario para reportes de inventario
  const inventoryForm = useForm<z.infer<typeof inventoryReportSchema>>({
    resolver: zodResolver(inventoryReportSchema),
    defaultValues: {
      reportType: "inventory_status",
      format: "pdf",
    },
  })

  // Formulario para reportes de clientes
  const customerForm = useForm<z.infer<typeof customerReportSchema>>({
    resolver: zodResolver(customerReportSchema),
    defaultValues: {
      reportType: "customer_activity",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
      format: "pdf",
    },
  })

  // Manejar generación de reporte de ventas
  function onSubmitSalesReport(data: z.infer<typeof salesReportSchema>) {
    setGeneratingReport(true)

    // Simulamos la generación del reporte
    setTimeout(() => {
      setGeneratingReport(false)
      toast({
        title: "Reporte generado",
        description: `El reporte de ventas ha sido generado en formato ${data.format.toUpperCase()}.`,
      })
      console.log("Sales report data:", data)
    }, 2000)
  }

  // Manejar generación de reporte de inventario
  function onSubmitInventoryReport(data: z.infer<typeof inventoryReportSchema>) {
    setGeneratingReport(true)

    // Simulamos la generación del reporte
    setTimeout(() => {
      setGeneratingReport(false)
      toast({
        title: "Reporte generado",
        description: `El reporte de inventario ha sido generado en formato ${data.format.toUpperCase()}.`,
      })
      console.log("Inventory report data:", data)
    }, 2000)
  }

  // Manejar generación de reporte de clientes
  function onSubmitCustomerReport(data: z.infer<typeof customerReportSchema>) {
    setGeneratingReport(true)

    // Simulamos la generación del reporte
    setTimeout(() => {
      setGeneratingReport(false)
      toast({
        title: "Reporte generado",
        description: `El reporte de clientes ha sido generado en formato ${data.format.toUpperCase()}.`,
      })
      console.log("Customer report data:", data)
    }, 2000)
  }

  return (
    <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sales">Ventas</TabsTrigger>
        <TabsTrigger value="inventory">Inventario</TabsTrigger>
        <TabsTrigger value="customers">Clientes</TabsTrigger>
      </TabsList>

      {/* Reportes de Ventas */}
      <TabsContent value="sales">
        <Card>
          <CardHeader>
            <CardTitle>Reportes de Ventas</CardTitle>
            <CardDescription>Genera reportes detallados sobre las ventas, ingresos y tendencias.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...salesForm}>
              <form onSubmit={salesForm.handleSubmit(onSubmitSalesReport)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={salesForm.control}
                    name="reportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Reporte</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo de reporte" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sales_summary">Resumen de Ventas</SelectItem>
                            <SelectItem value="sales_by_product">Ventas por Producto</SelectItem>
                            <SelectItem value="sales_by_customer">Ventas por Cliente</SelectItem>
                            <SelectItem value="sales_by_payment">Ventas por Método de Pago</SelectItem>
                            <SelectItem value="tax_report">Reporte de Impuestos</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={salesForm.control}
                    name="groupBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agrupar Por</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un agrupamiento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="day">Día</SelectItem>
                            <SelectItem value="week">Semana</SelectItem>
                            <SelectItem value="month">Mes</SelectItem>
                            <SelectItem value="quarter">Trimestre</SelectItem>
                            <SelectItem value="year">Año</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={salesForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Inicio</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={salesForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Fin</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={salesForm.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un formato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={generatingReport}>
                    {generatingReport ? "Generando..." : "Generar Reporte"}
                  </Button>
                  <Button type="button" variant="outline" disabled={generatingReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button type="button" variant="outline" disabled={generatingReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Reportes de Inventario */}
      <TabsContent value="inventory">
        <Card>
          <CardHeader>
            <CardTitle>Reportes de Inventario</CardTitle>
            <CardDescription>Genera reportes sobre el estado del inventario, productos y movimientos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...inventoryForm}>
              <form onSubmit={inventoryForm.handleSubmit(onSubmitInventoryReport)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={inventoryForm.control}
                    name="reportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Reporte</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo de reporte" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="inventory_status">Estado del Inventario</SelectItem>
                            <SelectItem value="low_stock">Productos con Bajo Stock</SelectItem>
                            <SelectItem value="inventory_movements">Movimientos de Inventario</SelectItem>
                            <SelectItem value="product_performance">Rendimiento de Productos</SelectItem>
                            <SelectItem value="inventory_valuation">Valoración del Inventario</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={inventoryForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Todas las categorías" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            <SelectItem value="1">Rosas</SelectItem>
                            <SelectItem value="2">Tulipanes</SelectItem>
                            <SelectItem value="3">Lirios</SelectItem>
                            <SelectItem value="4">Girasoles</SelectItem>
                            <SelectItem value="5">Orquídeas</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={inventoryForm.control}
                    name="stockStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado de Stock</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="in_stock">En Stock</SelectItem>
                            <SelectItem value="low_stock">Bajo Stock</SelectItem>
                            <SelectItem value="out_of_stock">Sin Stock</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={inventoryForm.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un formato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={generatingReport}>
                    {generatingReport ? "Generando..." : "Generar Reporte"}
                  </Button>
                  <Button type="button" variant="outline" disabled={generatingReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button type="button" variant="outline" disabled={generatingReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Reportes de Clientes */}
      <TabsContent value="customers">
        <Card>
          <CardHeader>
            <CardTitle>Reportes de Clientes</CardTitle>
            <CardDescription>
              Genera reportes sobre la actividad de los clientes, suscripciones y comportamiento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...customerForm}>
              <form onSubmit={customerForm.handleSubmit(onSubmitCustomerReport)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={customerForm.control}
                    name="reportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Reporte</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo de reporte" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="customer_activity">Actividad de Clientes</SelectItem>
                            <SelectItem value="customer_subscriptions">Suscripciones de Clientes</SelectItem>
                            <SelectItem value="top_customers">Mejores Clientes</SelectItem>
                            <SelectItem value="customer_retention">Retención de Clientes</SelectItem>
                            <SelectItem value="customer_acquisition">Adquisición de Clientes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="customerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Cliente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Todos los tipos" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Todos los tipos</SelectItem>
                            <SelectItem value="Individual">Individual</SelectItem>
                            <SelectItem value="Empresa">Empresa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Inicio</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Fin</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Selecciona una fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={customerForm.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un formato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={generatingReport}>
                    {generatingReport ? "Generando..." : "Generar Reporte"}
                  </Button>
                  <Button type="button" variant="outline" disabled={generatingReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button type="button" variant="outline" disabled={generatingReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Esquema de validación para el formulario
const formSchema = z.object({
  customerId: z.string().min(1, "El cliente es obligatorio"),
  type: z.string().min(1, "El tipo de factura es obligatorio"),
  total: z.coerce.number().min(0, "El total no puede ser negativo"),
  status: z.string().default("Pendiente"),
  paymentMethod: z.string().optional(),
  paymentDetails: z.string().optional(),
  orderIds: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Customer {
  id: string
  name: string
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
}

export function InvoiceForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")

  // Inicializar el formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Pendiente",
      type: "Venta Directa",
      total: 0,
    },
  })

  // Cargar clientes
  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch("/api/customers")
        if (!response.ok) throw new Error("Error al cargar clientes")
        const data = await response.json()
        setCustomers(data.customers || [])
      } catch (error) {
        console.error("Error al cargar clientes:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes",
          variant: "destructive",
        })
      }
    }

    loadCustomers()
  }, [])

  // Cargar órdenes cuando se selecciona un cliente
  useEffect(() => {
    if (!selectedCustomer) {
      setOrders([])
      return
    }

    async function loadOrders() {
      try {
        const response = await fetch(`/api/orders?customerId=${selectedCustomer}&status=Entregado`)
        if (!response.ok) throw new Error("Error al cargar órdenes")
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("Error al cargar órdenes:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las órdenes del cliente",
          variant: "destructive",
        })
      }
    }

    loadOrders()
  }, [selectedCustomer])

  // Manejar cambio de cliente
  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value)
    form.setValue("customerId", value)
  }

  // Manejar envío del formulario
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      // Añadir el ID del usuario actual (en un sistema real, esto vendría de la sesión)
      const userId = "user_1" // Ejemplo, en producción usar el ID real del usuario autenticado

      const response = await fetch("/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear la factura")
      }

      const result = await response.json()

      toast({
        title: "Factura creada",
        description: `La factura ${result.invoiceNumber} ha sido creada correctamente`,
      })

      // Redireccionar a la página de facturas
      router.push("/dashboard/billing")
    } catch (error) {
      console.error("Error al crear factura:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "No se pudo crear la factura",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Factura</CardTitle>
        <CardDescription>Crea una nueva factura para un cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={handleCustomerChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Factura</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Venta Directa">Venta Directa</SelectItem>
                      <SelectItem value="Suscripción">Suscripción</SelectItem>
                      <SelectItem value="Consignación">Consignación</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>Monto total de la factura</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Pagada">Pagada</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pago</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un método de pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="Transferencia Bancaria">Transferencia Bancaria</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles de Pago</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalles adicionales sobre el pago" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Factura
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

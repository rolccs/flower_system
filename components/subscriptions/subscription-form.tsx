"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Esquema de validación para el formulario
const subscriptionSchema = z.object({
  customerId: z.string().min(1, { message: "El cliente es obligatorio" }),
  plan: z.string().min(1, { message: "El plan es obligatorio" }),
  frequency: z.string().min(1, { message: "La frecuencia es obligatoria" }),
  price: z.coerce.number().min(0, { message: "El precio no puede ser negativo" }),
  startDate: z.date({ required_error: "La fecha de inicio es obligatoria" }),
  nextDelivery: z.date({ required_error: "La próxima entrega es obligatoria" }),
  deliveryInstructions: z.string().optional(),
  status: z.string().default("Activa"),
})

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>

interface Customer {
  id: string
  name: string
}

interface SubscriptionFormProps {
  subscriptionId?: string
}

export function SubscriptionForm({ subscriptionId }: SubscriptionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const isEditing = !!subscriptionId

  // Formulario con valores por defecto
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      customerId: "",
      plan: "",
      frequency: "",
      price: 0,
      startDate: new Date(),
      nextDelivery: new Date(),
      deliveryInstructions: "",
      status: "Activa",
    },
  })

  // Cargar clientes
  useEffect(() => {
    async function loadCustomers() {
      try {
        // En un sistema real, esto sería una llamada a la API
        // const response = await fetch("/api/customers")
        // if (!response.ok) throw new Error("Error al cargar clientes")
        // const data = await response.json()

        // Datos de ejemplo para la demostración
        const mockCustomers = [
          { id: "1", name: "Florería Bella Rosa" },
          { id: "2", name: "Eventos Elegantes" },
          { id: "3", name: "Jardines Modernos" },
          { id: "4", name: "Hotel Magnolia" },
          { id: "5", name: "Decoraciones Primavera" },
        ]

        setCustomers(mockCustomers)
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

  // Cargar datos de la suscripción si estamos editando
  useEffect(() => {
    if (subscriptionId) {
      setLoading(true)
      async function loadSubscription() {
        try {
          // En un sistema real, esto sería una llamada a la API
          // const response = await fetch(`/api/subscriptions/${subscriptionId}`)
          // if (!response.ok) throw new Error("Error al cargar suscripción")
          // const subscription = await response.json()

          // Datos de ejemplo para la demostración
          const mockSubscription = {
            id: "1",
            customerId: "1",
            plan: "Premium Semanal",
            frequency: "Semanal",
            price: 450.0,
            startDate: new Date("2023-04-01"),
            nextDelivery: new Date("2023-04-24"),
            deliveryInstructions: "Entregar en recepción",
            status: "Activa",
          }

          // Establecer valores en el formulario
          form.reset({
            customerId: mockSubscription.customerId,
            plan: mockSubscription.plan,
            frequency: mockSubscription.frequency,
            price: mockSubscription.price,
            startDate: new Date(mockSubscription.startDate),
            nextDelivery: new Date(mockSubscription.nextDelivery),
            deliveryInstructions: mockSubscription.deliveryInstructions,
            status: mockSubscription.status,
          })
        } catch (error) {
          console.error("Error al cargar suscripción:", error)
          toast({
            title: "Error",
            description: "No se pudo cargar la suscripción",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      loadSubscription()
    }
  }, [subscriptionId, form])

  async function onSubmit(data: SubscriptionFormValues) {
    setIsSubmitting(true)
    try {
      // En un sistema real, esto sería una llamada a la API
      // const url = isEditing ? `/api/subscriptions/${subscriptionId}` : "/api/subscriptions"
      // const method = isEditing ? "PUT" : "POST"
      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.error || "Error al guardar la suscripción")
      // }

      // Simulamos una respuesta exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditing ? "Suscripción actualizada" : "Suscripción creada",
        description: isEditing
          ? "La suscripción ha sido actualizada correctamente"
          : "La suscripción ha sido creada correctamente",
      })

      router.push("/dashboard/subscriptions")
      router.refresh()
    } catch (error) {
      console.error("Error al guardar suscripción:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar la suscripción",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div>Cargando suscripción...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            name="plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Básico Semanal">Básico Semanal</SelectItem>
                    <SelectItem value="Básico Quincenal">Básico Quincenal</SelectItem>
                    <SelectItem value="Básico Mensual">Básico Mensual</SelectItem>
                    <SelectItem value="Estándar Semanal">Estándar Semanal</SelectItem>
                    <SelectItem value="Estándar Quincenal">Estándar Quincenal</SelectItem>
                    <SelectItem value="Estándar Mensual">Estándar Mensual</SelectItem>
                    <SelectItem value="Premium Semanal">Premium Semanal</SelectItem>
                    <SelectItem value="Premium Quincenal">Premium Quincenal</SelectItem>
                    <SelectItem value="Premium Mensual">Premium Mensual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frecuencia*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una frecuencia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Semanal">Semanal</SelectItem>
                    <SelectItem value="Quincenal">Quincenal</SelectItem>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio ($)*</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nextDelivery"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Próxima Entrega*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                    <SelectItem value="Activa">Activa</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryInstructions"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Instrucciones de Entrega</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Instrucciones específicas para la entrega"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

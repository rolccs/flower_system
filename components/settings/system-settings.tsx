"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// Esquema de validación para la configuración general
const generalSettingsSchema = z.object({
  companyName: z.string().min(2, { message: "El nombre de la empresa es obligatorio" }),
  companyAddress: z.string().min(5, { message: "La dirección de la empresa es obligatoria" }),
  companyPhone: z.string().min(5, { message: "El teléfono de la empresa es obligatorio" }),
  companyEmail: z.string().email({ message: "El email debe ser válido" }),
  companyLogo: z.string().optional(),
  defaultCurrency: z.string().min(1, { message: "La moneda predeterminada es obligatoria" }),
  defaultLanguage: z.string().min(1, { message: "El idioma predeterminado es obligatorio" }),
})

// Esquema de validación para la configuración de impuestos
const taxSettingsSchema = z.object({
  defaultTaxRate: z.coerce.number().min(0, { message: "La tasa de impuesto no puede ser negativa" }),
  taxIdentifier: z.string().min(1, { message: "El identificador fiscal es obligatorio" }),
  enableStateTaxes: z.boolean(),
  enableLocalTaxes: z.boolean(),
  taxExemptCategories: z.string().optional(),
})

// Esquema de validación para la configuración de delivery
const deliverySettingsSchema = z.object({
  defaultDeliveryFee: z.coerce.number().min(0, { message: "La tarifa de entrega no puede ser negativa" }),
  minOrderForFreeDelivery: z.coerce.number().min(0, { message: "El monto mínimo no puede ser negativo" }),
  maxDeliveryDistance: z.coerce.number().min(0, { message: "La distancia máxima no puede ser negativa" }),
  enableRealTimeTracking: z.boolean(),
  enableDeliveryNotifications: z.boolean(),
  openStreetMapApiKey: z.string().optional(),
})

// Esquema de validación para la configuración de integración
const integrationSettingsSchema = z.object({
  enableEcommerceIntegration: z.boolean(),
  shopifyApiKey: z.string().optional(),
  shopifyApiSecret: z.string().optional(),
  wooCommerceApiKey: z.string().optional(),
  wooCommerceApiSecret: z.string().optional(),
  stripeApiKey: z.string().optional(),
  stripeWebhookSecret: z.string().optional(),
  doorDashApiKey: z.string().optional(),
  uberEatsApiKey: z.string().optional(),
})

// Esquema de validación para la configuración de backup
const backupSettingsSchema = z.object({
  enableAutomaticBackups: z.boolean(),
  backupFrequency: z.string().min(1, { message: "La frecuencia de backup es obligatoria" }),
  backupRetentionDays: z.coerce.number().min(1, { message: "Los días de retención deben ser al menos 1" }),
  backupLocation: z.string().min(1, { message: "La ubicación de backup es obligatoria" }),
  enableExternalStorage: z.boolean(),
  externalStoragePath: z.string().optional(),
})

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general")

  // Formulario para configuración general
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "Flores Mayoristas Inc.",
      companyAddress: "123 Main St, Miami, FL 33101",
      companyPhone: "(305) 555-1234",
      companyEmail: "info@floresmayoristas.com",
      companyLogo: "",
      defaultCurrency: "USD",
      defaultLanguage: "es",
    },
  })

  // Formulario para configuración de impuestos
  const taxForm = useForm<z.infer<typeof taxSettingsSchema>>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues: {
      defaultTaxRate: 8.5,
      taxIdentifier: "123456789",
      enableStateTaxes: true,
      enableLocalTaxes: false,
      taxExemptCategories: "Plantas vivas, Semillas",
    },
  })

  // Formulario para configuración de delivery
  const deliveryForm = useForm<z.infer<typeof deliverySettingsSchema>>({
    resolver: zodResolver(deliverySettingsSchema),
    defaultValues: {
      defaultDeliveryFee: 15,
      minOrderForFreeDelivery: 150,
      maxDeliveryDistance: 50,
      enableRealTimeTracking: true,
      enableDeliveryNotifications: true,
      openStreetMapApiKey: "",
    },
  })

  // Formulario para configuración de integración
  const integrationForm = useForm<z.infer<typeof integrationSettingsSchema>>({
    resolver: zodResolver(integrationSettingsSchema),
    defaultValues: {
      enableEcommerceIntegration: false,
      shopifyApiKey: "",
      shopifyApiSecret: "",
      wooCommerceApiKey: "",
      wooCommerceApiSecret: "",
      stripeApiKey: "",
      stripeWebhookSecret: "",
      doorDashApiKey: "",
      uberEatsApiKey: "",
    },
  })

  // Formulario para configuración de backup
  const backupForm = useForm<z.infer<typeof backupSettingsSchema>>({
    resolver: zodResolver(backupSettingsSchema),
    defaultValues: {
      enableAutomaticBackups: true,
      backupFrequency: "daily",
      backupRetentionDays: 30,
      backupLocation: "/backups",
      enableExternalStorage: false,
      externalStoragePath: "",
    },
  })

  // Manejar envío de formulario general
  function onSubmitGeneral(data: z.infer<typeof generalSettingsSchema>) {
    toast({
      title: "Configuración guardada",
      description: "La configuración general ha sido actualizada correctamente.",
    })
    console.log("General settings:", data)
  }

  // Manejar envío de formulario de impuestos
  function onSubmitTax(data: z.infer<typeof taxSettingsSchema>) {
    toast({
      title: "Configuración guardada",
      description: "La configuración de impuestos ha sido actualizada correctamente.",
    })
    console.log("Tax settings:", data)
  }

  // Manejar envío de formulario de delivery
  function onSubmitDelivery(data: z.infer<typeof deliverySettingsSchema>) {
    toast({
      title: "Configuración guardada",
      description: "La configuración de delivery ha sido actualizada correctamente.",
    })
    console.log("Delivery settings:", data)
  }

  // Manejar envío de formulario de integración
  function onSubmitIntegration(data: z.infer<typeof integrationSettingsSchema>) {
    toast({
      title: "Configuración guardada",
      description: "La configuración de integración ha sido actualizada correctamente.",
    })
    console.log("Integration settings:", data)
  }

  // Manejar envío de formulario de backup
  function onSubmitBackup(data: z.infer<typeof backupSettingsSchema>) {
    toast({
      title: "Configuración guardada",
      description: "La configuración de backup ha sido actualizada correctamente.",
    })
    console.log("Backup settings:", data)
  }

  return (
    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="tax">Impuestos</TabsTrigger>
        <TabsTrigger value="delivery">Delivery</TabsTrigger>
        <TabsTrigger value="integration">Integración</TabsTrigger>
        <TabsTrigger value="backup">Backup</TabsTrigger>
      </TabsList>

      {/* Configuración General */}
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
            <CardDescription>
              Configura la información básica de tu empresa y las preferencias generales del sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={generalForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Empresa</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de la Empresa</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="companyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono de la Empresa</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección de la Empresa</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="defaultCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda Predeterminada</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una moneda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                            <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma Predeterminado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">Inglés</SelectItem>
                            <SelectItem value="fr">Francés</SelectItem>
                            <SelectItem value="pt">Portugués</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="companyLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo de la Empresa</FormLabel>
                        <FormControl>
                          <Input type="file" className="cursor-pointer" />
                        </FormControl>
                        <FormDescription>Sube el logo de tu empresa en formato PNG o JPG (máx. 2MB)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Guardar Configuración</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Configuración de Impuestos */}
      <TabsContent value="tax">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Impuestos</CardTitle>
            <CardDescription>
              Configura las tasas de impuestos y otras configuraciones fiscales para tu negocio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...taxForm}>
              <form onSubmit={taxForm.handleSubmit(onSubmitTax)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={taxForm.control}
                    name="defaultTaxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tasa de Impuesto Predeterminada (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>
                          Tasa de impuesto que se aplicará por defecto a todos los productos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taxForm.control}
                    name="taxIdentifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identificador Fiscal</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Número de identificación fiscal de tu empresa (EIN, RFC, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taxForm.control}
                    name="enableStateTaxes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Habilitar Impuestos Estatales</FormLabel>
                          <FormDescription>
                            Aplicar diferentes tasas de impuestos según el estado de entrega
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taxForm.control}
                    name="enableLocalTaxes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Habilitar Impuestos Locales</FormLabel>
                          <FormDescription>
                            Aplicar impuestos adicionales según la ciudad o condado de entrega
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taxForm.control}
                    name="taxExemptCategories"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Categorías Exentas de Impuestos</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingresa las categorías separadas por comas"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Categorías de productos que están exentas de impuestos</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Guardar Configuración</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Configuración de Delivery */}
      <TabsContent value="delivery">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Delivery</CardTitle>
            <CardDescription>Configura las opciones de entrega, tarifas y servicios de delivery.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...deliveryForm}>
              <form onSubmit={deliveryForm.handleSubmit(onSubmitDelivery)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={deliveryForm.control}
                    name="defaultDeliveryFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tarifa de Entrega Predeterminada ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Tarifa base que se cobrará por cada entrega</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
                    name="minOrderForFreeDelivery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto Mínimo para Entrega Gratuita ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Monto mínimo de compra para ofrecer entrega gratuita</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
                    name="maxDeliveryDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distancia Máxima de Entrega (km)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>Distancia máxima a la que se realizarán entregas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
                    name="openStreetMapApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key de OpenStreetMap</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Clave API para integración con OpenStreetMap (opcional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
                    name="enableRealTimeTracking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Habilitar Seguimiento en Tiempo Real</FormLabel>
                          <FormDescription>Permitir a los clientes seguir sus entregas en tiempo real</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
                    name="enableDeliveryNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Habilitar Notificaciones de Entrega</FormLabel>
                          <FormDescription>
                            Enviar notificaciones automáticas sobre el estado de las entregas
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Guardar Configuración</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Configuración de Integración */}
      <TabsContent value="integration">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Integración</CardTitle>
            <CardDescription>
              Configura las integraciones con plataformas de e-commerce, pagos y servicios de delivery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...integrationForm}>
              <form onSubmit={integrationForm.handleSubmit(onSubmitIntegration)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={integrationForm.control}
                    name="enableEcommerceIntegration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Habilitar Integración con E-commerce</FormLabel>
                          <FormDescription>Conectar con plataformas de comercio electrónico</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={integrationForm.control}
                    name="shopifyApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key de Shopify</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Clave API para integración con Shopify</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={integrationForm.control}
                    name="shopifyApiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Secret de Shopify</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>Clave secreta para integración con Shopify</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={integrationForm.control}
                    name="wooCommerceApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key de WooCommerce</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Clave API para integración con WooCommerce</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={integrationForm.control}
                    name="wooCommerceApiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Secret de WooCommerce</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>Clave secreta para integración con WooCommerce</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={integrationForm.control}
                    name="stripeApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key de Stripe</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Clave API para procesamiento de pagos con Stripe</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={integrationForm.control}
                    name="stripeWebhookSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook Secret de Stripe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>Clave secreta para webhooks de Stripe</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={integrationForm.control}
                    name="doorDashApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key de DoorDash</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Clave API para integración con DoorDash</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={integrationForm.control}
                    name="uberEatsApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key de Uber Eats</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Clave API para integración con Uber Eats</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Guardar Configuración</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Configuración de Backup */}
      <TabsContent value="backup">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Backup</CardTitle>
            <CardDescription>Configura las opciones de respaldo y recuperación de datos del sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...backupForm}>
              <form onSubmit={backupForm.handleSubmit(onSubmitBackup)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={backupForm.control}
                    name="enableAutomaticBackups"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Habilitar Backups Automáticos</FormLabel>
                          <FormDescription>
                            Realizar copias de seguridad automáticas según la frecuencia configurada
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={backupForm.control}
                    name="backupFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frecuencia de Backup</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una frecuencia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hourly">Cada hora</SelectItem>
                            <SelectItem value="daily">Diario</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Con qué frecuencia se realizarán los backups automáticos</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={backupForm.control}
                    name="backupRetentionDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Días de Retención</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Cuántos días se conservarán los backups antes de eliminarlos</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={backupForm.control}
                    name="backupLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación de Backup</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Ruta donde se guardarán los archivos de backup</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={backupForm.control}
                    name="enableExternalStorage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Habilitar Almacenamiento Externo</FormLabel>
                          <FormDescription>
                            Guardar backups en dispositivos USB externos cuando estén conectados
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={backupForm.control}
                    name="externalStoragePath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ruta de Almacenamiento Externo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Ruta del dispositivo USB o almacenamiento externo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Guardar Configuración</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

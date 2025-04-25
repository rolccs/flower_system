import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardHeader() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Leche y Miel" width={80} height={80} className="hidden md:block h-16 w-auto" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Bienvenido a Leche y Miel</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Sistema integral de gestión para tu negocio de flores mayorista.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button>Nuevo Pedido</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* El contenido se muestra en los componentes de abajo */}
        </TabsContent>
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suscripciones Activas</CardTitle>
              <CardDescription>Gestiona todas las suscripciones recurrentes de tus clientes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>El contenido de suscripciones se cargará aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventario Actual</CardTitle>
              <CardDescription>Visualiza y gestiona tu inventario de flores y productos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>El contenido de inventario se cargará aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entregas Programadas</CardTitle>
              <CardDescription>Visualiza y gestiona las entregas programadas para hoy.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>El contenido de delivery se cargará aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

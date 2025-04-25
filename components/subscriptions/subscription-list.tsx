"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Trash2, Search, Plus, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Subscription {
  id: string
  customer: {
    id: string
    name: string
  }
  plan: string
  frequency: string
  price: number
  nextDelivery: string
  status: string
}

export function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Datos de ejemplo para la demostración
  useEffect(() => {
    // En un sistema real, esto sería una llamada a la API
    const mockSubscriptions = [
      {
        id: "1",
        customer: {
          id: "1",
          name: "Florería Bella Rosa",
        },
        plan: "Premium Semanal",
        frequency: "Semanal",
        price: 450.0,
        nextDelivery: "2023-04-24",
        status: "Activa",
      },
      {
        id: "2",
        customer: {
          id: "2",
          name: "Eventos Elegantes",
        },
        plan: "Estándar Quincenal",
        frequency: "Quincenal",
        price: 850.0,
        nextDelivery: "2023-04-30",
        status: "Activa",
      },
      {
        id: "3",
        customer: {
          id: "3",
          name: "Jardines Modernos",
        },
        plan: "Básico Mensual",
        frequency: "Mensual",
        price: 1200.0,
        nextDelivery: "2023-05-15",
        status: "Activa",
      },
      {
        id: "4",
        customer: {
          id: "4",
          name: "Hotel Magnolia",
        },
        plan: "Premium Semanal",
        frequency: "Semanal",
        price: 750.0,
        nextDelivery: "2023-04-25",
        status: "Pendiente",
      },
      {
        id: "5",
        customer: {
          id: "5",
          name: "Decoraciones Primavera",
        },
        plan: "Estándar Quincenal",
        frequency: "Quincenal",
        price: 550.0,
        nextDelivery: "2023-05-02",
        status: "Cancelada",
      },
    ]

    setSubscriptions(mockSubscriptions)
    setLoading(false)
  }, [])

  // Filtrar suscripciones
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // Manejar eliminación de suscripción
  const handleDeleteSubscription = async (id: string) => {
    try {
      // En un sistema real, esto sería una llamada a la API
      // await fetch(`/api/subscriptions/${id}`, { method: "DELETE" })

      // Actualizar la lista de suscripciones
      setSubscriptions(subscriptions.filter((subscription) => subscription.id !== id))

      toast({
        title: "Suscripción eliminada",
        description: "La suscripción ha sido eliminada correctamente",
      })
    } catch (error) {
      console.error("Error al eliminar suscripción:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la suscripción",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center">
        <div className="grid gap-2">
          <CardTitle>Suscripciones</CardTitle>
          <CardDescription>Gestiona todas las suscripciones recurrentes</CardDescription>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar suscripciones..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Activa">Activas</SelectItem>
              <SelectItem value="Pendiente">Pendientes</SelectItem>
              <SelectItem value="Cancelada">Canceladas</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/subscriptions/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Suscripción
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full overflow-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Frecuencia</TableHead>
                  <TableHead>Próxima Entrega</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Cargando suscripciones...
                    </TableCell>
                  </TableRow>
                ) : filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No se encontraron suscripciones
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.customer.name}</TableCell>
                      <TableCell>{subscription.plan}</TableCell>
                      <TableCell>{subscription.frequency}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {new Date(subscription.nextDelivery).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>${subscription.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getSubscriptionStatusVariant(subscription.status)}>{subscription.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/subscriptions/${subscription.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/subscriptions/${subscription.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente la suscripción de{" "}
                                  {subscription.customer.name}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSubscription(subscription.id)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function getSubscriptionStatusVariant(status: string) {
  switch (status) {
    case "Activa":
      return "success"
    case "Pendiente":
      return "warning"
    case "Cancelada":
      return "destructive"
    default:
      return "default"
  }
}

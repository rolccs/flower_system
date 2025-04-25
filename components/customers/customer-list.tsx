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
import { Eye, Pencil, Trash2, Search, Plus } from "lucide-react"
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

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  type: string
  status: string
  totalSpent: number
}

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // Datos de ejemplo para la demostración
  useEffect(() => {
    // En un sistema real, esto sería una llamada a la API
    const mockCustomers = [
      {
        id: "1",
        name: "Florería Bella Rosa",
        email: "info@bellarosa.com",
        phone: "555-1234",
        type: "Empresa",
        status: "Activo",
        totalSpent: 12500.0,
      },
      {
        id: "2",
        name: "Eventos Elegantes",
        email: "contacto@eventoselegantes.com",
        phone: "555-5678",
        type: "Empresa",
        status: "Activo",
        totalSpent: 32000.0,
      },
      {
        id: "3",
        name: "María González",
        email: "maria@example.com",
        phone: "555-9012",
        type: "Individual",
        status: "Activo",
        totalSpent: 1850.0,
      },
      {
        id: "4",
        name: "Hotel Magnolia",
        email: "reservas@hotelmagnolia.com",
        phone: "555-3456",
        type: "Empresa",
        status: "Inactivo",
        totalSpent: 17500.0,
      },
      {
        id: "5",
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "555-7890",
        type: "Individual",
        status: "Activo",
        totalSpent: 950.0,
      },
    ]

    setCustomers(mockCustomers)
    setLoading(false)
  }, [])

  // Filtrar clientes
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchTerm))

    const matchesType = typeFilter === "all" || customer.type === typeFilter

    return matchesSearch && matchesType
  })

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // Manejar eliminación de cliente
  const handleDeleteCustomer = async (id: string) => {
    try {
      // En un sistema real, esto sería una llamada a la API
      // await fetch(`/api/customers/${id}`, { method: "DELETE" })

      // Actualizar la lista de clientes
      setCustomers(customers.filter((customer) => customer.id !== id))

      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado correctamente",
      })
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center">
        <div className="grid gap-2">
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Gestiona todos los clientes del sistema</CardDescription>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="Empresa">Empresas</SelectItem>
              <SelectItem value="Individual">Individuales</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total Gastado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Cargando clientes...
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email || "-"}</TableCell>
                      <TableCell>{customer.phone || "-"}</TableCell>
                      <TableCell>{customer.type}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "Activo" ? "success" : "secondary"}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/customers/${customer.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/customers/${customer.id}/edit`}>
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
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el cliente{" "}
                                  {customer.name}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
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

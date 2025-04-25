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
import { Eye, MapPin, Truck, Search, Plus, Calendar } from "lucide-react"

interface DeliveryRoute {
  id: string
  driverName: string
  createdAt: string
  orderCount: number
  status: string
}

export function DeliveryRoutes() {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Datos de ejemplo para la demostración
  useEffect(() => {
    // En un sistema real, esto sería una llamada a la API
    const mockRoutes = [
      {
        id: "1",
        driverName: "Juan Pérez",
        createdAt: "2023-04-15",
        orderCount: 8,
        status: "En Ruta",
      },
      {
        id: "2",
        driverName: "María González",
        createdAt: "2023-04-15",
        orderCount: 5,
        status: "Pendiente",
      },
      {
        id: "3",
        driverName: "Carlos Rodríguez",
        createdAt: "2023-04-14",
        orderCount: 10,
        status: "Completada",
      },
      {
        id: "4",
        driverName: "Ana Martínez",
        createdAt: "2023-04-14",
        orderCount: 6,
        status: "Completada",
      },
      {
        id: "5",
        driverName: "Roberto Sánchez",
        createdAt: "2023-04-13",
        orderCount: 7,
        status: "Cancelada",
      },
    ]

    setRoutes(mockRoutes)
    setLoading(false)
  }, [])

  // Filtrar rutas
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = route.driverName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || route.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center">
        <div className="grid gap-2">
          <CardTitle>Rutas de Entrega</CardTitle>
          <CardDescription>Gestiona todas las rutas de entrega</CardDescription>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar rutas..."
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
              <SelectItem value="Pendiente">Pendientes</SelectItem>
              <SelectItem value="En Ruta">En Ruta</SelectItem>
              <SelectItem value="Completada">Completadas</SelectItem>
              <SelectItem value="Cancelada">Canceladas</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/delivery/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Ruta
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
                  <TableHead>Conductor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Órdenes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Cargando rutas...
                    </TableCell>
                  </TableRow>
                ) : filteredRoutes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No se encontraron rutas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                          {route.driverName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {new Date(route.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{route.orderCount} órdenes</TableCell>
                      <TableCell>
                        <Badge variant={getRouteStatusVariant(route.status)}>{route.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/delivery/${route.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/delivery/${route.id}/map`}>
                              <MapPin className="h-4 w-4" />
                              <span className="sr-only">Mapa</span>
                            </Link>
                          </Button>
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

function getRouteStatusVariant(status: string) {
  switch (status) {
    case "Pendiente":
      return "warning"
    case "En Ruta":
      return "info"
    case "Completada":
      return "success"
    case "Cancelada":
      return "destructive"
    default:
      return "default"
  }
}

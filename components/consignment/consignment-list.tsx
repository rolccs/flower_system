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
import { Eye, Pencil, FileText, Search, Plus, Store } from "lucide-react"

interface Consignment {
  id: string
  store: string
  date: string
  status: string
  itemCount: number
  totalDelivered: number
  totalSold: number
  totalReturned: number
}

export function ConsignmentList() {
  const [consignments, setConsignments] = useState<Consignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Datos de ejemplo para la demostración
  useEffect(() => {
    // En un sistema real, esto sería una llamada a la API
    const mockConsignments = [
      {
        id: "1",
        store: "Florería Bella Rosa",
        date: "2023-04-15",
        status: "En Proceso",
        itemCount: 5,
        totalDelivered: 100,
        totalSold: 75,
        totalReturned: 25,
      },
      {
        id: "2",
        store: "Eventos Elegantes",
        date: "2023-04-10",
        status: "Completada",
        itemCount: 3,
        totalDelivered: 50,
        totalSold: 50,
        totalReturned: 0,
      },
      {
        id: "3",
        store: "Jardines Modernos",
        date: "2023-04-05",
        status: "Facturada",
        itemCount: 4,
        totalDelivered: 80,
        totalSold: 65,
        totalReturned: 15,
      },
      {
        id: "4",
        store: "Hotel Magnolia",
        date: "2023-04-01",
        status: "Facturada",
        itemCount: 6,
        totalDelivered: 120,
        totalSold: 110,
        totalReturned: 10,
      },
      {
        id: "5",
        store: "Decoraciones Primavera",
        date: "2023-03-25",
        status: "Completada",
        itemCount: 2,
        totalDelivered: 40,
        totalSold: 38,
        totalReturned: 2,
      },
    ]

    setConsignments(mockConsignments)
    setLoading(false)
  }, [])

  // Filtrar consignaciones
  const filteredConsignments = consignments.filter((consignment) => {
    const matchesSearch = consignment.store.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || consignment.status === statusFilter

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
          <CardTitle>Consignaciones</CardTitle>
          <CardDescription>Gestiona todas las consignaciones de productos</CardDescription>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar consignaciones..."
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
              <SelectItem value="En Proceso">En Proceso</SelectItem>
              <SelectItem value="Completada">Completadas</SelectItem>
              <SelectItem value="Facturada">Facturadas</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/consignment/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Consignación
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
                  <TableHead>Tienda</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Entregados</TableHead>
                  <TableHead>Vendidos</TableHead>
                  <TableHead>Devueltos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Cargando consignaciones...
                    </TableCell>
                  </TableRow>
                ) : filteredConsignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No se encontraron consignaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConsignments.map((consignment) => (
                    <TableRow key={consignment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                          {consignment.store}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(consignment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{consignment.itemCount}</TableCell>
                      <TableCell>{consignment.totalDelivered}</TableCell>
                      <TableCell>{consignment.totalSold}</TableCell>
                      <TableCell>{consignment.totalReturned}</TableCell>
                      <TableCell>
                        <Badge variant={getConsignmentStatusVariant(consignment.status)}>{consignment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/consignment/${consignment.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/consignment/${consignment.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/consignment/${consignment.id}/report`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Reporte</span>
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

function getConsignmentStatusVariant(status: string) {
  switch (status) {
    case "En Proceso":
      return "warning"
    case "Completada":
      return "success"
    case "Facturada":
      return "default"
    default:
      return "default"
  }
}

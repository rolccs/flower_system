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
import { Eye, FileDown, Printer, Search, Plus } from "lucide-react"

interface Invoice {
  id: string
  invoiceNumber: string
  customer: {
    id: string
    name: string
  }
  type: string
  total: number
  status: string
  createdAt: string
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Datos de ejemplo para la demostración
  useEffect(() => {
    // En un sistema real, esto sería una llamada a la API
    const mockInvoices = [
      {
        id: "1",
        invoiceNumber: "INV-001",
        customer: {
          id: "1",
          name: "Florería Bella Rosa",
        },
        type: "Venta Directa",
        total: 1250.0,
        status: "Pagada",
        createdAt: "2023-04-15T10:30:00Z",
      },
      {
        id: "2",
        invoiceNumber: "INV-002",
        customer: {
          id: "2",
          name: "Eventos Elegantes",
        },
        type: "Suscripción",
        total: 3200.0,
        status: "Pendiente",
        createdAt: "2023-04-14T09:15:00Z",
      },
      {
        id: "3",
        invoiceNumber: "INV-003",
        customer: {
          id: "3",
          name: "Jardines Modernos",
        },
        type: "Consignación",
        total: 845.0,
        status: "Pagada",
        createdAt: "2023-04-13T14:45:00Z",
      },
      {
        id: "4",
        invoiceNumber: "INV-004",
        customer: {
          id: "4",
          name: "Hotel Magnolia",
        },
        type: "Venta Directa",
        total: 1750.0,
        status: "Cancelada",
        createdAt: "2023-04-12T11:20:00Z",
      },
      {
        id: "5",
        invoiceNumber: "INV-005",
        customer: {
          id: "5",
          name: "Decoraciones Primavera",
        },
        type: "Suscripción",
        total: 920.0,
        status: "Pendiente",
        createdAt: "2023-04-11T16:10:00Z",
      },
    ]

    setInvoices(mockInvoices)
    setLoading(false)
  }, [])

  // Filtrar facturas
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

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
          <CardTitle>Facturas</CardTitle>
          <CardDescription>Gestiona todas las facturas del sistema</CardDescription>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar facturas..."
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
              <SelectItem value="Pagada">Pagadas</SelectItem>
              <SelectItem value="Pendiente">Pendientes</SelectItem>
              <SelectItem value="Cancelada">Canceladas</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/billing/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Factura
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
                  <TableHead>Nº Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Cargando facturas...
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No se encontraron facturas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.customer.name}</TableCell>
                      <TableCell>{invoice.type}</TableCell>
                      <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>${invoice.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getInvoiceStatusVariant(invoice.status)}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/billing/${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Printer className="h-4 w-4" />
                            <span className="sr-only">Imprimir</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <FileDown className="h-4 w-4" />
                            <span className="sr-only">Descargar</span>
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

function getInvoiceStatusVariant(status: string) {
  switch (status) {
    case "Pagada":
      return "success"
    case "Pendiente":
      return "warning"
    case "Cancelada":
      return "destructive"
    default:
      return "default"
  }
}

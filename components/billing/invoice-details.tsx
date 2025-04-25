"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Printer, FileDown, ArrowLeft, CreditCard } from "lucide-react"

interface InvoiceDetailsProps {
  invoice: any // Usar el tipo correcto de Invoice
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Obtener variante de estado
  const getStatusVariant = (status: string) => {
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

  // Manejar cambio de estado
  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/billing/${invoice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la factura")
      }

      toast({
        title: "Estado actualizado",
        description: `La factura ha sido marcada como ${newStatus}`,
      })

      // Actualizar la UI
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la factura",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Manejar impresión
  const handlePrint = () => {
    window.print()
  }

  // Manejar descarga
  const handleDownload = () => {
    // En un sistema real, aquí se generaría un PDF y se descargaría
    toast({
      title: "Descarga iniciada",
      description: "La factura se está descargando como PDF",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <FileDown className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Factura #{invoice.invoiceNumber}</CardTitle>
            <CardDescription>Emitida el {formatDate(invoice.createdAt)}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Datos del Cliente</h3>
              <div className="text-lg font-medium">{invoice.customer.name}</div>
              <div className="text-sm text-muted-foreground">
                {invoice.customer.email && <div>{invoice.customer.email}</div>}
                {invoice.customer.phone && <div>{invoice.customer.phone}</div>}
                {invoice.customer.address && (
                  <div>
                    {invoice.customer.address}
                    {invoice.customer.city && `, ${invoice.customer.city}`}
                    {invoice.customer.state && `, ${invoice.customer.state}`}
                    {invoice.customer.zipCode && ` ${invoice.customer.zipCode}`}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Detalles de Facturación</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span>{invoice.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de pago:</span>
                  <span>{invoice.paymentMethod || "No especificado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de emisión:</span>
                  <span>{formatDate(invoice.createdAt)}</span>
                </div>
                {invoice.status === "Pagada" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de pago:</span>
                    <span>{formatDate(invoice.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Órdenes Asociadas</h3>
            {invoice.orders && invoice.orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Orden</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No hay órdenes asociadas a esta factura</div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {invoice.paymentDetails && (
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Detalles de Pago</h3>
              <p className="text-sm">{invoice.paymentDetails}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {invoice.status === "Pendiente" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" disabled={isUpdating}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Marcar como Pagada
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Confirmar pago?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción marcará la factura como pagada. ¿Estás seguro de que deseas continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleStatusChange("Pagada")}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {invoice.status !== "Cancelada" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isUpdating}>
                  Cancelar Factura
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Cancelar factura?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción marcará la factura como cancelada. Esta operación no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, mantener factura</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleStatusChange("Cancelada")}>
                    Sí, cancelar factura
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

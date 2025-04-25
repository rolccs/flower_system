"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StoreHeader } from "@/components/store/store-header"
import { CheckCircle, ShoppingBag, Calendar, ArrowRight } from "lucide-react"

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos del pedido
    const timer = setTimeout(() => {
      // Datos de ejemplo
      const mockOrderDetails = {
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        total: 125.45,
        items: [
          {
            name: "Rosa Roja Premium (60cm)",
            quantity: 2,
            price: 18,
          },
          {
            name: "Lirio Blanco (60cm)",
            quantity: 1,
            price: 20,
          },
        ],
        shipping: {
          address: "123 Ocean Drive, Miami Beach, FL 33139",
          method: "Entrega el mismo día",
          estimatedDelivery: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 horas después
        },
        payment: {
          method: "Tarjeta de crédito",
          last4: "4242",
        },
      }

      setOrderDetails(mockOrderDetails)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg font-medium">Cargando detalles del pedido...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-center">¡Gracias por tu compra!</h1>
                <p className="text-muted-foreground text-center mt-2">Tu pedido ha sido procesado correctamente.</p>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                    Detalles del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Número de Pedido</p>
                      <p className="text-lg">{orderDetails.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fecha</p>
                      <p className="text-lg">{new Date(orderDetails.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Productos</p>
                    <div className="space-y-2">
                      {orderDetails.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Información de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Dirección de Entrega</p>
                    <p className="text-lg">{orderDetails.shipping.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Método de Entrega</p>
                      <p className="text-lg">{orderDetails.shipping.method}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Entrega Estimada</p>
                      <p className="text-lg">
                        {new Date(orderDetails.shipping.estimatedDelivery).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link href="/store">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Volver a la Tienda
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/account/orders">Ver Mis Pedidos</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, CreditCard, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { createCheckoutSession } from "@/lib/services/stripe-service"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}

export function ShoppingCartComponent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    // Simular carga de datos del carrito
    const timer = setTimeout(() => {
      // Datos de ejemplo
      const mockCartItems: CartItem[] = [
        {
          id: "R001",
          name: "Rosa Roja Premium",
          price: 18,
          image: "/single-red-rose.png",
          quantity: 2,
          size: "60cm",
        },
        {
          id: "L001",
          name: "Lirio Blanco",
          price: 20,
          image: "/placeholder.svg?height=80&width=80&query=Lirio%20Blanco",
          quantity: 1,
          size: "60cm",
        },
      ]

      setCartItems(mockCartItems)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))

    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del carrito",
    })
  }

  const clearCart = () => {
    setCartItems([])

    toast({
      title: "Carrito vacío",
      description: "Todos los productos han sido eliminados del carrito",
    })
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 200 ? 0 : 15
  const tax = subtotal * 0.07 // 7% de impuesto
  const total = subtotal + shipping + tax

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Añade productos al carrito antes de proceder al pago",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      const session = await createCheckoutSession({
        items: cartItems.map((item) => ({
          id: item.id,
          name: `${item.name}${item.size ? ` (${item.size})` : ""}`,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        successUrl: `${window.location.origin}/store/checkout/success`,
        cancelUrl: `${window.location.origin}/store/cart`,
      })

      // En un entorno real, redirigimos al usuario a la página de checkout de Stripe
      // window.location.href = session.url

      // Para la demostración, simulamos una redirección
      toast({
        title: "Redirigiendo al checkout",
        description: "Serás redirigido a la página de pago",
      })

      // Simular redirección después de 1.5 segundos
      setTimeout(() => {
        window.location.href = "/store/checkout/success"
      }, 1500)
    } catch (error) {
      console.error("Error al procesar el checkout:", error)

      toast({
        title: "Error al procesar el pago",
        description: "Ha ocurrido un error al procesar el pago. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
        <div className="h-[200px] bg-gray-200 rounded animate-pulse"></div>
        <div className="h-[100px] bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tu Carrito</h2>
        {cartItems.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <Trash2 className="mr-2 h-4 w-4" />
            Vaciar Carrito
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Parece que aún no has añadido ningún producto a tu carrito. Explora nuestro catálogo para encontrar las
              mejores flores.
            </p>
            <Button asChild>
              <Link href="/store/products">Ver Productos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.size && <p className="text-sm text-muted-foreground">Tamaño: {item.size}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-14 h-8 mx-2 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Políticas de Envío y Devoluciones</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <span className="font-medium">Envío gratuito:</span> En pedidos mayores a $200 en Miami y área
                  metropolitana.
                </p>
                <p>
                  <span className="font-medium">Entrega el mismo día:</span> Para pedidos realizados antes de las 2:00
                  PM.
                </p>
                <p>
                  <span className="font-medium">Devoluciones:</span> Si no estás satisfecho con la calidad de nuestras
                  flores, ofrecemos reemplazo o reembolso dentro de las 24 horas posteriores a la entrega.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Impuestos (7%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut || cartItems.length === 0}>
                  {isCheckingOut ? (
                    "Procesando..."
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceder al Pago
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/store/products">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Continuar Comprando
                  </Link>
                </Button>
                <div className="text-xs text-muted-foreground text-center">
                  Procesamos pagos de forma segura a través de Stripe
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StoreHeader } from "@/components/store/store-header"
import { ShoppingCart, Heart, Share2, Truck, ArrowLeft, Check, Info } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("60cm")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // En un sistema real, estos datos vendrían de una API
  const product = {
    id: params.id,
    name: "Rosa Roja Premium",
    category: "Rosas",
    description:
      "Rosa de tallo largo con botón grande y color intenso. Ideal para arreglos florales y ramos de regalo. Cultivada en las mejores condiciones para garantizar su frescura y duración.",
    color: "Rojo",
    price: {
      "50cm": 15,
      "60cm": 18,
      "70cm": 22,
    },
    images: [
      "/single-red-rose.png",
      "/crimson-bloom.png",
      "/placeholder.svg?height=600&width=600&query=Rosa%20Roja%203",
      "/placeholder.svg?height=600&width=600&query=Rosa%20Roja%204",
    ],
    stock: 120,
    origin: "Ecuador",
    lifespan: "7-14 días",
    care: "Cortar tallos en diagonal, cambiar agua cada 2 días, mantener alejado de frutas",
    bonche: "25 tallos",
    isNew: false,
    isFeatured: true,
    isAvailableForSubscription: true,
    isAvailableForConsignment: true,
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const addToCart = async () => {
    setIsAddingToCart(true)

    try {
      // En un sistema real, esto enviaría el producto al carrito
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Producto añadido",
        description: `${quantity} x ${product.name} (${selectedSize}) ha sido añadido al carrito`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir el producto al carrito",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const checkout = async () => {
    setIsCheckingOut(true)

    try {
      // En un sistema real, esto crearía una sesión de checkout con Stripe
      // const response = await fetch('/api/checkout', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     items: [
      //       {
      //         id: product.id,
      //         name: `${product.name} (${selectedSize})`,
      //         description: product.description,
      //         price: product.price[selectedSize as keyof typeof product.price],
      //         quantity,
      //         image: product.images[0],
      //       },
      //     ],
      //     successUrl: `${window.location.origin}/store/checkout/success`,
      //     cancelUrl: `${window.location.origin}${window.location.pathname}`,
      //   }),
      // })

      // const session = await response.json()
      // window.location.href = session.url

      // Simulamos una redirección para la demostración
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Redirigiendo al checkout",
        description: "Serás redirigido a la página de pago",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el checkout",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const [mainImage, setMainImage] = useState(product.images[0])

  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/store/products" className="flex items-center text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Productos
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
                <Image src={mainImage || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square overflow-hidden rounded-md border cursor-pointer ${
                      mainImage === image ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setMainImage(image)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/store/categories/${product.category.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {product.category}
                  </Link>
                  {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">Nuevo</Badge>}
                  {product.isFeatured && <Badge variant="secondary">Destacado</Badge>}
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-2xl font-bold">
                    ${product.price[selectedSize as keyof typeof product.price].toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">por bonche de {product.bonche}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tamaño</h3>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50cm" id="50cm" />
                    <Label htmlFor="50cm" className="cursor-pointer">
                      50 cm (${product.price["50cm"].toFixed(2)})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="60cm" id="60cm" />
                    <Label htmlFor="60cm" className="cursor-pointer">
                      60 cm (${product.price["60cm"].toFixed(2)})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="70cm" id="70cm" />
                    <Label htmlFor="70cm" className="cursor-pointer">
                      70 cm (${product.price["70cm"].toFixed(2)})
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-medium mb-2">Cantidad</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 text-center"
                  />
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={addToCart} disabled={isAddingToCart}>
                  {isAddingToCart ? (
                    "Añadiendo..."
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Añadir al Carrito
                    </>
                  )}
                </Button>
                <Button variant="secondary" className="flex-1" onClick={checkout} disabled={isCheckingOut}>
                  {isCheckingOut ? "Procesando..." : "Comprar Ahora"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>En stock: {product.stock} disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Entrega en el mismo día para pedidos antes de las 2 PM</span>
                </div>
                {product.isAvailableForSubscription && (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Disponible para suscripción</span>
                  </div>
                )}
                {product.isAvailableForConsignment && (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Disponible para consignación</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-10" />

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="care">Cuidados</TabsTrigger>
              <TabsTrigger value="shipping">Envío</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-4">
              <div className="prose max-w-none">
                <p>{product.description}</p>
                <p>
                  Nuestras rosas son cultivadas en las mejores condiciones climáticas de Ecuador, lo que garantiza
                  flores de gran tamaño, colores intensos y una vida útil prolongada.
                </p>
                <p>
                  Cada bonche contiene {product.bonche} cuidadosamente seleccionados y empacados para mantener su
                  frescura durante el transporte.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                    Especificaciones
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Color:</span>
                      <span>{product.color}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Tamaño:</span>
                      <span>50cm / 60cm / 70cm</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Bonche:</span>
                      <span>{product.bonche}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Origen:</span>
                      <span>{product.origin}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Vida útil aproximada:</span>
                      <span>{product.lifespan}</span>
                    </li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                    Disponibilidad
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Stock actual:</span>
                      <span>{product.stock} bonches</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Disponible para suscripción:</span>
                      <span>{product.isAvailableForSubscription ? "Sí" : "No"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Disponible para consignación:</span>
                      <span>{product.isAvailableForConsignment ? "Sí" : "No"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Temporada:</span>
                      <span>Todo el año</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="care" className="py-4">
              <div className="prose max-w-none">
                <h3>Cuidados para mantener sus flores frescas por más tiempo</h3>
                <ul>
                  <li>Cortar los tallos en diagonal aproximadamente 1 cm antes de colocarlos en agua.</li>
                  <li>Utilizar agua limpia y fresca, cambiándola cada 2-3 días.</li>
                  <li>
                    Mantener las flores alejadas de la luz solar directa, fuentes de calor y frutas (producen etileno
                    que acelera la maduración).
                  </li>
                  <li>Retirar hojas que queden sumergidas en el agua para evitar la proliferación de bacterias.</li>
                  <li>Utilizar el conservante floral que viene con su pedido para prolongar la vida de sus flores.</li>
                  <li>Mantener en un lugar fresco, preferiblemente entre 18-22°C.</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="py-4">
              <div className="prose max-w-none">
                <h3>Información de Envío</h3>
                <p>
                  Ofrecemos entrega en el mismo día para pedidos realizados antes de las 2:00 PM en Miami y área
                  metropolitana. Para otras zonas, el tiempo de entrega puede variar entre 1-2 días hábiles.
                </p>
                <p>
                  Nuestras flores son cuidadosamente empacadas en cajas especiales que mantienen la temperatura adecuada
                  y protegen los tallos durante el transporte.
                </p>
                <h4>Costos de envío:</h4>
                <ul>
                  <li>Envío gratuito en pedidos mayores a $200</li>
                  <li>Miami y área metropolitana: $15</li>
                  <li>Resto de Florida: $25</li>
                  <li>Otros estados: Consultar tarifas</li>
                </ul>
                <p>
                  Para pedidos mayoristas o de gran volumen, contáctenos directamente para coordinar la logística de
                  entrega y obtener tarifas especiales.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

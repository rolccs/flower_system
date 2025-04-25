"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  category: string
  description: string
  color: string
  price: number
  price50cm?: number
  price60cm?: number
  price70cm?: number
  image: string
  stock: number
  origin: string
  isNew?: boolean
  isFeatured?: boolean
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        // En un sistema real, esto sería una llamada a la API
        // const response = await fetch('/api/store/products')
        // const data = await response.json()

        // Simulamos datos para la demostración
        const mockProducts: Product[] = [
          {
            id: "R001",
            name: "Rosa Roja Premium",
            category: "Rosas",
            description: "Rosa de tallo largo con botón grande y color intenso",
            color: "Rojo",
            price: 15,
            price50cm: 15,
            price60cm: 18,
            price70cm: 22,
            image: "/placeholder.svg?key=k01wm",
            stock: 120,
            origin: "Ecuador",
            isFeatured: true,
          },
          {
            id: "T001",
            name: "Tulipán Amarillo",
            category: "Tulipanes",
            description: "Tulipán de color amarillo brillante con tallo firme",
            color: "Amarillo",
            price: 14,
            price50cm: 14,
            price60cm: 16,
            price70cm: 18,
            image: "/placeholder.svg?key=bohmd",
            stock: 45,
            origin: "Holanda",
            isNew: true,
          },
          {
            id: "C001",
            name: "Clavel Blanco",
            category: "Claveles",
            description: "Clavel estándar de gran tamaño y pétalos firmes",
            color: "Blanco",
            price: 12,
            price50cm: 12,
            price60cm: 14,
            price70cm: 7,
            image: "/placeholder.svg?key=k4xf1",
            stock: 65,
            origin: "Colombia",
          },
          {
            id: "L001",
            name: "Lirio Blanco",
            category: "Lirios",
            description: "Lirio oriental de gran tamaño y aroma intenso",
            color: "Blanco",
            price: 18,
            price50cm: 18,
            price60cm: 20,
            price70cm: 24,
            image: "/placeholder.svg?key=p1q3w",
            stock: 30,
            origin: "Perú",
            isFeatured: true,
          },
          {
            id: "G001",
            name: "Girasol Grande",
            category: "Girasoles",
            description: "Girasol de gran tamaño con centro oscuro y pétalos brillantes",
            color: "Amarillo",
            price: 16,
            image: "/placeholder.svg?key=gw5dt",
            stock: 40,
            origin: "México",
            isNew: true,
          },
          {
            id: "O001",
            name: "Orquídea Phalaenopsis",
            category: "Orquídeas",
            description: "Orquídea elegante de larga duración",
            color: "Blanco/Rosa",
            price: 35,
            image: "/elegant-phalaenopsis.png",
            stock: 15,
            origin: "Tailandia",
            isFeatured: true,
          },
          {
            id: "M003",
            name: "Margaritas Amarillas",
            category: "Flores de Temporada",
            description: "Margaritas completamente amarillas, alegres y luminosas",
            color: "Amarillo",
            price: 12,
            price50cm: 12,
            price60cm: 14,
            price70cm: 3.8,
            image: "/golden-margaritas.png",
            stock: 55,
            origin: "Colombia",
          },
          {
            id: "H001",
            name: "Hortensias Azules",
            category: "Hortensias",
            description: "Hortensias de intenso color azul y gran tamaño",
            color: "Azul",
            price: 22,
            image: "/blue-hydrangea-garden.png",
            stock: 25,
            origin: "Colombia",
            isNew: true,
          },
        ]

        setProducts(mockProducts)
      } catch (error) {
        console.error("Error al cargar productos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addToCart = (product: Product) => {
    // En un sistema real, esto enviaría el producto al carrito
    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al carrito`,
    })
  }

  const addToWishlist = (product: Product) => {
    // En un sistema real, esto añadiría el producto a la lista de deseos
    toast({
      title: "Añadido a favoritos",
      description: `${product.name} ha sido añadido a tu lista de deseos`,
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden group">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-2">
                <Button size="icon" variant="secondary" onClick={() => addToCart(product)}>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={() => addToWishlist(product)}>
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" asChild>
                  <Link href={`/store/products/${product.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">Nuevo</Badge>}
              {product.isFeatured && <Badge variant="secondary">Destacado</Badge>}
              {product.stock < 20 && <Badge variant="destructive">Pocas unidades</Badge>}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
            <Link href={`/store/products/${product.id}`} className="hover:underline">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
            </Link>
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Origen: {product.origin}</div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={() => addToCart(product)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Añadir al Carrito
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

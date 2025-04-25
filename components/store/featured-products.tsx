"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  category: string
  description: string
  color: string
  price: number
  image: string
  stock: number
  origin: string
  isNew?: boolean
  isFeatured?: boolean
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        // En un sistema real, esto sería una llamada a la API
        // const response = await fetch('/api/store/products/featured')
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
            image: "/placeholder.svg?key=p3fzv",
            stock: 120,
            origin: "Ecuador",
            isFeatured: true,
          },
          {
            id: "L001",
            name: "Lirio Blanco",
            category: "Lirios",
            description: "Lirio oriental de gran tamaño y aroma intenso",
            color: "Blanco",
            price: 18,
            image: "/placeholder.svg?key=92bv4",
            stock: 30,
            origin: "Perú",
            isFeatured: true,
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
            id: "G001",
            name: "Girasol Grande",
            category: "Girasoles",
            description: "Girasol de gran tamaño con centro oscuro y pétalos brillantes",
            color: "Amarillo",
            price: 16,
            image: "/placeholder.svg?key=93f55",
            stock: 40,
            origin: "México",
            isNew: true,
          },
        ]

        setProducts(mockProducts)
      } catch (error) {
        console.error("Error al cargar productos destacados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const addToCart = (product: Product) => {
    // En un sistema real, esto enviaría el producto al carrito
    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al carrito`,
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden group">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">Nuevo</Badge>}
              {product.isFeatured && <Badge variant="secondary">Destacado</Badge>}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
            <Link href={`/store/products/${product.id}`} className="hover:underline">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            </Link>
            <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
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

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Esquema de validación para el formulario
const productSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().optional(),
  sku: z.string().min(3, { message: "El SKU debe tener al menos 3 caracteres" }),
  barcode: z.string().optional(),
  price: z.coerce.number().min(0, { message: "El precio no puede ser negativo" }),
  price50cm: z.coerce.number().min(0, { message: "El precio no puede ser negativo" }).optional(),
  price60cm: z.coerce.number().min(0, { message: "El precio no puede ser negativo" }).optional(),
  price70cm: z.coerce.number().min(0, { message: "El precio no puede ser negativo" }).optional(),
  stock: z.coerce.number().int().min(0, { message: "El stock no puede ser negativo" }),
  minStock: z.coerce.number().int().min(0, { message: "El stock mínimo no puede ser negativo" }).optional(),
  color: z.string().optional(),
  categoryId: z.string().min(1, { message: "La categoría es obligatoria" }),
})

type ProductFormValues = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  productId?: string
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const isEditing = !!productId

  // Formulario con valores por defecto
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      barcode: "",
      price: 0,
      price50cm: undefined,
      price60cm: undefined,
      price70cm: undefined,
      stock: 0,
      minStock: 5,
      color: "",
      categoryId: "",
    },
  })

  // Cargar categorías
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Error al cargar categorías")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error al cargar categorías:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías",
          variant: "destructive",
        })
      }
    }

    loadCategories()
  }, [])

  // Cargar datos del producto si estamos editando
  useEffect(() => {
    if (productId) {
      setLoading(true)
      async function loadProduct() {
        try {
          const response = await fetch(`/api/inventory/${productId}`)
          if (!response.ok) throw new Error("Error al cargar producto")
          const product = await response.json()

          // Establecer valores en el formulario
          form.reset({
            name: product.name,
            description: product.description || "",
            sku: product.sku,
            barcode: product.barcode || "",
            price: product.price,
            price50cm: product.price50cm,
            price60cm: product.price60cm,
            price70cm: product.price70cm,
            stock: product.stock,
            minStock: product.minStock,
            color: product.color || "",
            categoryId: product.categoryId,
          })
        } catch (error) {
          console.error("Error al cargar producto:", error)
          toast({
            title: "Error",
            description: "No se pudo cargar el producto",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      loadProduct()
    }
  }, [productId, form])

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true)
    try {
      const url = isEditing ? `/api/inventory/${productId}` : "/api/inventory"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el producto")
      }

      toast({
        title: isEditing ? "Producto actualizado" : "Producto creado",
        description: isEditing
          ? "El producto ha sido actualizado correctamente"
          : "El producto ha sido creado correctamente",
      })

      router.push("/dashboard/inventory")
      router.refresh()
    } catch (error) {
      console.error("Error al guardar producto:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar el producto",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div>Cargando producto...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto*</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Rosa Roja Premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descripción detallada del producto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU*</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: ROSA-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Barras</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 1234567890123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Rojo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock*</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Mínimo</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Base ($)*</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price50cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio 50 cm ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price60cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio 60 cm ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price70cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio 70 cm ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

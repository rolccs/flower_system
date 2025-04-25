import { prisma } from "@/lib/prisma"
import type { Product } from "@prisma/client"

export async function getProducts(options?: {
  categoryId?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const { categoryId, search, limit = 50, offset = 0 } = options || {}

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        name: "asc",
      },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    limit,
    offset,
  }
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })
}

export async function getProductBySku(sku: string) {
  return prisma.product.findUnique({
    where: { sku },
    include: {
      category: true,
    },
  })
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return prisma.product.create({
    data,
    include: {
      category: true,
    },
  })
}

export async function updateProduct(id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  })
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  })
}

export async function createCategory(data: { name: string; description?: string }) {
  return prisma.category.create({
    data,
  })
}

export async function updateCategory(id: string, data: { name?: string; description?: string }) {
  return prisma.category.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  })
}

export async function getProductStats() {
  const totalProducts = await prisma.product.count()
  const lowStockProducts = await prisma.product.count({
    where: {
      stock: {
        lte: prisma.product.fields.minStock,
      },
    },
  })

  const productsByCategory = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  })

  return {
    totalProducts,
    lowStockProducts,
    productsByCategory: productsByCategory.map((category) => ({
      id: category.id,
      name: category.name,
      count: category._count.products,
    })),
  }
}

export async function recordInventoryMovement(data: {
  productId: string
  userId: string
  amount: number
  reason: string
}) {
  const { productId, userId, amount, reason } = data

  // Obtener el producto actual
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error("Producto no encontrado")
  }

  const previousStock = product.stock
  const newStock = previousStock + amount

  // Actualizar el stock del producto
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      stock: newStock,
    },
  })

  // Registrar el movimiento
  const movement = await prisma.inventoryMovement.create({
    data: {
      productId,
      userId,
      previousStock,
      newStock,
      amount,
      reason,
    },
  })

  return {
    movement,
    product: updatedProduct,
  }
}

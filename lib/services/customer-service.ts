import { prisma } from "@/lib/prisma"
import type { Customer } from "@prisma/client"

export async function getCustomers(options?: {
  search?: string
  type?: string
  limit?: number
  offset?: number
}) {
  const { search, type, limit = 50, offset = 0 } = options || {}

  const where = {
    ...(type ? { type } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        name: "asc",
      },
    }),
    prisma.customer.count({ where }),
  ])

  return {
    customers,
    total,
    limit,
    offset,
  }
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      subscriptions: {
        where: {
          status: "Activa",
        },
      },
    },
  })
}

export async function createCustomer(
  data: Omit<Customer, "id" | "createdAt" | "updatedAt" | "totalSpent" | "purchaseCount">,
) {
  return prisma.customer.create({
    data,
  })
}

export async function updateCustomer(
  id: string,
  data: Partial<Omit<Customer, "id" | "createdAt" | "updatedAt" | "totalSpent" | "purchaseCount">>,
) {
  return prisma.customer.update({
    where: { id },
    data,
  })
}

export async function deleteCustomer(id: string) {
  return prisma.customer.delete({
    where: { id },
  })
}

export async function getCustomerStats() {
  const totalCustomers = await prisma.customer.count()
  const individualCustomers = await prisma.customer.count({
    where: {
      type: "Individual",
    },
  })
  const businessCustomers = await prisma.customer.count({
    where: {
      type: "Empresa",
    },
  })

  const topCustomers = await prisma.customer.findMany({
    orderBy: {
      totalSpent: "desc",
    },
    take: 5,
  })

  return {
    totalCustomers,
    individualCustomers,
    businessCustomers,
    topCustomers,
  }
}

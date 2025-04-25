import { prisma } from "@/lib/prisma"

// Obtener todas las facturas con filtros
export async function getInvoices(options?: {
  status?: string
  customerId?: string
  type?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const { status, customerId, type, startDate, endDate, limit = 50, offset = 0 } = options || {}

  const where = {
    ...(status ? { status } : {}),
    ...(customerId ? { customerId } : {}),
    ...(type ? { type } : {}),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          },
        }
      : {}),
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.invoice.count({ where }),
  ])

  return {
    invoices,
    total,
    limit,
    offset,
  }
}

// Obtener una factura por ID
export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  })
}

// Crear una nueva factura
export async function createInvoice(data: {
  invoiceNumber: string
  customerId: string
  userId: string
  type: string
  total: number
  status?: string
  paymentMethod?: string
  paymentDetails?: string
  orderIds?: string[]
}) {
  const { orderIds, ...invoiceData } = data

  return prisma.invoice.create({
    data: {
      ...invoiceData,
      ...(orderIds
        ? {
            orders: {
              connect: orderIds.map((id) => ({ id })),
            },
          }
        : {}),
    },
    include: {
      customer: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orders: true,
    },
  })
}

// Actualizar una factura existente
export async function updateInvoice(
  id: string,
  data: Partial<{
    status: string
    paymentMethod: string
    paymentDetails: string
    total: number
  }>,
) {
  return prisma.invoice.update({
    where: { id },
    data,
    include: {
      customer: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orders: true,
    },
  })
}

// Generar número de factura
export async function generateInvoiceNumber() {
  // Obtener el año y mes actual
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, "0")

  // Contar facturas de este mes
  const count = await prisma.invoice.count({
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
    },
  })

  // Generar número secuencial
  const sequence = (count + 1).toString().padStart(4, "0")

  return `INV-${year}${month}-${sequence}`
}

// Generar reporte de ventas
export async function generateSalesReport(options: {
  startDate: Date
  endDate: Date
  groupBy?: "day" | "week" | "month"
  customerId?: string
}) {
  const { startDate, endDate, groupBy = "day", customerId } = options

  const where = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
    status: "Pagada",
    ...(customerId ? { customerId } : {}),
  }

  // Obtener todas las facturas en el rango
  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      customer: true,
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // Agrupar por período
  const groupedData: Record<
    string,
    {
      period: string
      count: number
      total: number
      invoices: typeof invoices
    }
  > = {}

  invoices.forEach((invoice) => {
    let periodKey: string

    switch (groupBy) {
      case "day":
        periodKey = invoice.createdAt.toISOString().split("T")[0]
        break
      case "week":
        const date = new Date(invoice.createdAt)
        const dayOfWeek = date.getDay()
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        const weekStart = new Date(date.setDate(diff))
        periodKey = weekStart.toISOString().split("T")[0]
        break
      case "month":
        periodKey = `${invoice.createdAt.getFullYear()}-${(invoice.createdAt.getMonth() + 1).toString().padStart(2, "0")}`
        break
    }

    if (!groupedData[periodKey]) {
      groupedData[periodKey] = {
        period: periodKey,
        count: 0,
        total: 0,
        invoices: [],
      }
    }

    groupedData[periodKey].count += 1
    groupedData[periodKey].total += invoice.total
    groupedData[periodKey].invoices.push(invoice)
  })

  // Calcular totales
  const totalSales = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const totalInvoices = invoices.length

  // Calcular ventas por tipo
  const salesByType: Record<
    string,
    {
      type: string
      count: number
      total: number
    }
  > = {}

  invoices.forEach((invoice) => {
    if (!salesByType[invoice.type]) {
      salesByType[invoice.type] = {
        type: invoice.type,
        count: 0,
        total: 0,
      }
    }

    salesByType[invoice.type].count += 1
    salesByType[invoice.type].total += invoice.total
  })

  // Calcular ventas por cliente (top 5)
  const salesByCustomer: Record<
    string,
    {
      customerId: string
      customerName: string
      count: number
      total: number
    }
  > = {}

  invoices.forEach((invoice) => {
    if (!salesByCustomer[invoice.customerId]) {
      salesByCustomer[invoice.customerId] = {
        customerId: invoice.customerId,
        customerName: invoice.customer.name,
        count: 0,
        total: 0,
      }
    }

    salesByCustomer[invoice.customerId].count += 1
    salesByCustomer[invoice.customerId].total += invoice.total
  })

  const topCustomers = Object.values(salesByCustomer)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return {
    periods: Object.values(groupedData),
    summary: {
      totalSales,
      totalInvoices,
      averageInvoiceValue: totalInvoices > 0 ? totalSales / totalInvoices : 0,
      startDate,
      endDate,
    },
    salesByType: Object.values(salesByType),
    topCustomers,
  }
}

// Generar reporte de impuestos
export async function generateTaxReport(options: {
  startDate: Date
  endDate: Date
  state?: string
}) {
  const { startDate, endDate, state } = options

  // En un sistema real, aquí se implementaría la lógica para calcular impuestos
  // por estado según las regulaciones de EE. UU.

  // Por ahora, devolvemos un reporte simulado
  return {
    period: {
      startDate,
      endDate,
    },
    summary: {
      totalSales: 45000,
      totalTaxableAmount: 42000,
      totalTaxCollected: 3360,
      effectiveTaxRate: 8,
    },
    taxesByState: [
      {
        state: "Florida",
        taxableAmount: 25000,
        taxRate: 6,
        taxCollected: 1500,
      },
      {
        state: "New York",
        taxableAmount: 17000,
        taxRate: 8.875,
        taxCollected: 1508.75,
      },
      // Más estados...
    ],
    taxesByCategory: [
      {
        category: "Ventas de productos",
        taxableAmount: 38000,
        taxCollected: 3040,
      },
      {
        category: "Servicios",
        taxableAmount: 4000,
        taxCollected: 320,
      },
    ],
  }
}

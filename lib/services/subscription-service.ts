import { prisma } from "@/lib/prisma"

// Obtener todas las suscripciones con filtros
export async function getSubscriptions(options?: {
  status?: string
  customerId?: string
  nextDeliveryBefore?: Date
  nextDeliveryAfter?: Date
  limit?: number
  offset?: number
}) {
  const { status, customerId, nextDeliveryBefore, nextDeliveryAfter, limit = 50, offset = 0 } = options || {}

  const where = {
    ...(status ? { status } : {}),
    ...(customerId ? { customerId } : {}),
    ...(nextDeliveryBefore || nextDeliveryAfter
      ? {
          nextDelivery: {
            ...(nextDeliveryBefore ? { lte: nextDeliveryBefore } : {}),
            ...(nextDeliveryAfter ? { gte: nextDeliveryAfter } : {}),
          },
        }
      : {}),
  }

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      include: {
        customer: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        nextDelivery: "asc",
      },
    }),
    prisma.subscription.count({ where }),
  ])

  return {
    subscriptions,
    total,
    limit,
    offset,
  }
}

// Obtener suscripciones próximas a entrega
export async function getUpcomingDeliveries(daysAhead = 7) {
  const today = new Date()
  const endDate = new Date()
  endDate.setDate(today.getDate() + daysAhead)

  return prisma.subscription.findMany({
    where: {
      status: "Activa",
      nextDelivery: {
        gte: today,
        lte: endDate,
      },
    },
    include: {
      customer: true,
    },
    orderBy: {
      nextDelivery: "asc",
    },
  })
}

// Crear una nueva suscripción
export async function createSubscription(data: {
  customerId: string
  plan: string
  frequency: string
  price: number
  startDate: Date
  nextDelivery: Date
  deliveryInstructions?: string
  paymentDetails?: string
  status?: string
}) {
  return prisma.subscription.create({
    data,
    include: {
      customer: true,
    },
  })
}

// Actualizar una suscripción existente
export async function updateSubscription(
  id: string,
  data: Partial<{
    plan: string
    frequency: string
    price: number
    nextDelivery: Date
    deliveryInstructions: string
    paymentDetails: string
    status: string
  }>,
) {
  return prisma.subscription.update({
    where: { id },
    data,
    include: {
      customer: true,
    },
  })
}

// Procesar entrega de suscripción
export async function processSubscriptionDelivery(id: string) {
  // Obtener la suscripción
  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      customer: true,
    },
  })

  if (!subscription) {
    throw new Error("Suscripción no encontrada")
  }

  // Calcular la próxima fecha de entrega según la frecuencia
  const nextDelivery = new Date(subscription.nextDelivery)

  switch (subscription.frequency) {
    case "Semanal":
      nextDelivery.setDate(nextDelivery.getDate() + 7)
      break
    case "Quincenal":
      nextDelivery.setDate(nextDelivery.getDate() + 14)
      break
    case "Mensual":
      nextDelivery.setMonth(nextDelivery.getMonth() + 1)
      break
    default:
      throw new Error("Frecuencia de suscripción no válida")
  }

  // Actualizar la suscripción con la próxima fecha de entrega
  const updatedSubscription = await prisma.subscription.update({
    where: { id },
    data: {
      nextDelivery,
    },
    include: {
      customer: true,
    },
  })

  // Aquí se podría crear una factura, orden de entrega, etc.
  // Por ahora, solo devolvemos la suscripción actualizada
  return updatedSubscription
}

// Servicios para consignación
export async function getConsignments(options?: {
  status?: string
  storeId?: string
  limit?: number
  offset?: number
}) {
  const { status, storeId, limit = 50, offset = 0 } = options || {}

  const where = {
    ...(status ? { status } : {}),
    ...(storeId ? { store: storeId } : {}),
  }

  const [consignments, total] = await Promise.all([
    prisma.consignment.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        date: "desc",
      },
    }),
    prisma.consignment.count({ where }),
  ])

  return {
    consignments,
    total,
    limit,
    offset,
  }
}

// Crear una nueva consignación
export async function createConsignment(data: {
  store: string
  date: Date
  status?: string
  items: Array<{
    productId: string
    delivered: number
  }>
}) {
  const { items, ...consignmentData } = data

  return prisma.consignment.create({
    data: {
      ...consignmentData,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          delivered: item.delivered,
          sold: 0,
          returned: 0,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })
}

// Actualizar ventas de consignación
export async function updateConsignmentSales(
  id: string,
  itemUpdates: Array<{
    id: string
    sold: number
    returned: number
  }>,
) {
  // Obtener la consignación
  const consignment = await prisma.consignment.findUnique({
    where: { id },
    include: {
      items: true,
    },
  })

  if (!consignment) {
    throw new Error("Consignación no encontrada")
  }

  // Actualizar cada ítem
  const updatePromises = itemUpdates.map((update) => {
    const item = consignment.items.find((i) => i.id === update.id)
    if (!item) {
      throw new Error(`Ítem de consignación ${update.id} no encontrado`)
    }

    // Validar que sold + returned <= delivered
    if (update.sold + update.returned > item.delivered) {
      throw new Error(
        `La suma de vendidos y devueltos no puede superar la cantidad entregada para el ítem ${update.id}`,
      )
    }

    return prisma.consignmentItem.update({
      where: { id: update.id },
      data: {
        sold: update.sold,
        returned: update.returned,
      },
    })
  })

  await Promise.all(updatePromises)

  // Devolver la consignación actualizada
  return prisma.consignment.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })
}

// Generar reporte de consignación
export async function generateConsignmentReport(options?: {
  storeId?: string
  startDate?: Date
  endDate?: Date
}) {
  const { storeId, startDate, endDate } = options || {}

  const where = {
    ...(storeId ? { store: storeId } : {}),
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          },
        }
      : {}),
  }

  const consignments = await prisma.consignment.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })

  // Calcular estadísticas
  let totalDelivered = 0
  let totalSold = 0
  let totalReturned = 0
  let totalRevenue = 0

  const productStats: Record<
    string,
    {
      productId: string
      productName: string
      delivered: number
      sold: number
      returned: number
      revenue: number
    }
  > = {}

  consignments.forEach((consignment) => {
    consignment.items.forEach((item) => {
      totalDelivered += item.delivered
      totalSold += item.sold
      totalReturned += item.returned

      const revenue = item.sold * item.product.price
      totalRevenue += revenue

      if (!productStats[item.productId]) {
        productStats[item.productId] = {
          productId: item.productId,
          productName: item.product.name,
          delivered: 0,
          sold: 0,
          returned: 0,
          revenue: 0,
        }
      }

      productStats[item.productId].delivered += item.delivered
      productStats[item.productId].sold += item.sold
      productStats[item.productId].returned += item.returned
      productStats[item.productId].revenue += revenue
    })
  })

  return {
    consignments,
    summary: {
      totalDelivered,
      totalSold,
      totalReturned,
      totalRevenue,
      sellThroughRate: totalDelivered > 0 ? (totalSold / totalDelivered) * 100 : 0,
    },
    productStats: Object.values(productStats),
  }
}

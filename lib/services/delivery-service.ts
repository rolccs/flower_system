import { prisma } from "@/lib/prisma"

// Obtener todas las rutas de entrega
export async function getDeliveryRoutes(options?: {
  date?: Date
  driverName?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const { date, driverName, status, limit = 50, offset = 0 } = options || {}

  // Construir la consulta
  const where = {
    ...(driverName ? { driverName } : {}),
    ...(date
      ? {
          createdAt: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999)),
          },
        }
      : {}),
    ...(status
      ? {
          orders: {
            some: {
              status,
            },
          },
        }
      : {}),
  }

  const [routes, total] = await Promise.all([
    prisma.deliveryRoute.findMany({
      where,
      include: {
        orders: {
          include: {
            customer: true,
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
    prisma.deliveryRoute.count({ where }),
  ])

  return {
    routes,
    total,
    limit,
    offset,
  }
}

// Obtener una ruta de entrega por ID
export async function getDeliveryRouteById(id: string) {
  return prisma.deliveryRoute.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          customer: true,
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

// Crear una nueva ruta de entrega
export async function createDeliveryRoute(data: {
  driverName: string
  orderIds?: string[]
}) {
  const { orderIds, ...routeData } = data

  return prisma.deliveryRoute.create({
    data: {
      ...routeData,
      ...(orderIds
        ? {
            orders: {
              connect: orderIds.map((id) => ({ id })),
            },
          }
        : {}),
    },
    include: {
      orders: {
        include: {
          customer: true,
        },
      },
    },
  })
}

// Añadir órdenes a una ruta de entrega
export async function addOrdersToRoute(routeId: string, orderIds: string[]) {
  return prisma.deliveryRoute.update({
    where: { id: routeId },
    data: {
      orders: {
        connect: orderIds.map((id) => ({ id })),
      },
    },
    include: {
      orders: {
        include: {
          customer: true,
        },
      },
    },
  })
}

// Eliminar órdenes de una ruta de entrega
export async function removeOrdersFromRoute(routeId: string, orderIds: string[]) {
  return prisma.deliveryRoute.update({
    where: { id: routeId },
    data: {
      orders: {
        disconnect: orderIds.map((id) => ({ id })),
      },
    },
    include: {
      orders: {
        include: {
          customer: true,
        },
      },
    },
  })
}

// Optimizar ruta de entrega
export async function optimizeDeliveryRoute(routeId: string) {
  // Obtener la ruta con sus órdenes
  const route = await prisma.deliveryRoute.findUnique({
    where: { id: routeId },
    include: {
      orders: {
        include: {
          customer: true,
        },
      },
    },
  })

  if (!route) {
    throw new Error("Ruta no encontrada")
  }

  // En un sistema real, aquí se implementaría un algoritmo de optimización de rutas
  // utilizando las direcciones de los clientes y posiblemente una API de mapas

  // Por ahora, simplemente devolvemos la ruta sin cambios
  return route
}

// Actualizar estado de una orden en la ruta
export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingInfo?: {
    latitude?: number
    longitude?: number
    notes?: string
    signature?: string
  },
) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      trackingCode: trackingInfo ? JSON.stringify(trackingInfo) : undefined,
    },
    include: {
      customer: true,
      deliveryRoute: true,
    },
  })
}

// Obtener conductores disponibles
export async function getAvailableDrivers() {
  return prisma.driver.findMany({
    where: {
      status: "Disponible",
    },
    orderBy: {
      name: "asc",
    },
  })
}

// Generar código QR para una orden
export async function generateOrderQRCode(orderId: string) {
  // En un sistema real, aquí se generaría un código QR único para la orden
  // y se almacenaría en la base de datos

  // Por ahora, simplemente devolvemos un valor simulado
  const qrCode = `ORD-QR-${orderId}`

  await prisma.order.update({
    where: { id: orderId },
    data: {
      trackingCode: qrCode,
    },
  })

  return qrCode
}

// Obtener estadísticas de entregas
export async function getDeliveryStats(options?: {
  startDate?: Date
  endDate?: Date
  driverName?: string
}) {
  const { startDate, endDate, driverName } = options || {}

  const where = {
    ...(driverName ? { driverName } : {}),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          },
        }
      : {}),
  }

  const routes = await prisma.deliveryRoute.findMany({
    where,
    include: {
      orders: true,
    },
  })

  // Calcular estadísticas
  const totalRoutes = routes.length
  let totalOrders = 0
  let completedOrders = 0
  let pendingOrders = 0
  let inTransitOrders = 0

  routes.forEach((route) => {
    totalOrders += route.orders.length
    route.orders.forEach((order) => {
      if (order.status === "Entregado") {
        completedOrders += 1
      } else if (order.status === "En Ruta") {
        inTransitOrders += 1
      } else {
        pendingOrders += 1
      }
    })
  })

  return {
    totalRoutes,
    totalOrders,
    completedOrders,
    pendingOrders,
    inTransitOrders,
    completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
  }
}

import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"
import { prisma } from "@/lib/prisma"
import { parse } from "csv-parse/sync"

const execAsync = promisify(exec)

// Interfaz para la configuración de backup
interface BackupConfig {
  enabled: boolean
  frequency: "hourly" | "daily" | "weekly" | "monthly"
  retentionDays: number
  location: string
  useExternalStorage: boolean
  externalStoragePath?: string
}

// Interfaz para el resultado del backup
interface BackupResult {
  success: boolean
  message: string
  filename?: string
  timestamp?: Date
  size?: number
}

// Entidades que se pueden exportar/importar
export type BackupEntity =
  | "products"
  | "categories"
  | "customers"
  | "orders"
  | "invoices"
  | "subscriptions"
  | "consignments"
  | "deliveries"
  | "users"
  | "config"
  | "all"

// Función para obtener la configuración de backup
export async function getBackupConfig(): Promise<BackupConfig> {
  try {
    // En un sistema real, esto se obtendría de la base de datos
    const configEntries = await prisma.config.findMany({
      where: {
        key: {
          startsWith: "backup_",
        },
      },
    })

    // Convertir las entradas a un objeto de configuración
    const config: BackupConfig = {
      enabled: configEntries.find((entry) => entry.key === "backup_enabled")?.value === "true",
      frequency: (configEntries.find((entry) => entry.key === "backup_frequency")?.value || "daily") as
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly",
      retentionDays: Number.parseInt(
        configEntries.find((entry) => entry.key === "backup_retention_days")?.value || "30",
      ),
      location: configEntries.find((entry) => entry.key === "backup_location")?.value || "/backups",
      useExternalStorage: configEntries.find((entry) => entry.key === "backup_use_external_storage")?.value === "true",
      externalStoragePath: configEntries.find((entry) => entry.key === "backup_external_storage_path")?.value,
    }

    return config
  } catch (error) {
    console.error("Error al obtener configuración de backup:", error)
    // Configuración por defecto
    return {
      enabled: true,
      frequency: "daily",
      retentionDays: 30,
      location: "/backups",
      useExternalStorage: false,
    }
  }
}

// Función para realizar un backup de la base de datos
export async function backupDatabase(): Promise<BackupResult> {
  try {
    const config = await getBackupConfig()

    if (!config.enabled) {
      return {
        success: false,
        message: "Los backups automáticos están desactivados",
      }
    }

    // Crear directorio de backup si no existe
    const backupDir = config.location
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Generar nombre de archivo con timestamp
    const timestamp = new Date()
    const formattedDate = timestamp.toISOString().replace(/:/g, "-").replace(/\..+/, "")
    const filename = `backup_${formattedDate}.sql`
    const filePath = path.join(backupDir, filename)

    // Ejecutar comando de backup de PostgreSQL
    const dbUrl = process.env.DATABASE_URL || ""
    const command = `pg_dump "${dbUrl}" > "${filePath}"`

    await execAsync(command)

    // Verificar si el archivo se creó correctamente
    const stats = fs.statSync(filePath)

    // Si está habilitado el almacenamiento externo, copiar el archivo
    if (config.useExternalStorage && config.externalStoragePath) {
      const externalDir = config.externalStoragePath

      // Verificar si el dispositivo externo está conectado
      if (fs.existsSync(externalDir)) {
        const externalFilePath = path.join(externalDir, filename)
        fs.copyFileSync(filePath, externalFilePath)
      } else {
        console.warn("Dispositivo de almacenamiento externo no encontrado")
      }
    }

    // Eliminar backups antiguos
    await cleanupOldBackups(config)

    // Registrar el backup en la base de datos
    await prisma.config.create({
      data: {
        key: `backup_history_${formattedDate}`,
        value: JSON.stringify({
          filename,
          timestamp: timestamp.toISOString(),
          size: stats.size,
        }),
        description: "Registro de backup automático",
      },
    })

    return {
      success: true,
      message: "Backup realizado correctamente",
      filename,
      timestamp,
      size: stats.size,
    }
  } catch (error) {
    console.error("Error al realizar backup:", error)
    return {
      success: false,
      message: `Error al realizar backup: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Función para limpiar backups antiguos
async function cleanupOldBackups(config: BackupConfig): Promise<void> {
  try {
    const backupDir = config.location
    const files = fs.readdirSync(backupDir)

    // Filtrar solo archivos de backup
    const backupFiles = files.filter((file) => file.startsWith("backup_") && file.endsWith(".sql"))

    // Ordenar por fecha (más reciente primero)
    backupFiles.sort().reverse()

    // Calcular la fecha límite para retención
    const retentionLimit = new Date()
    retentionLimit.setDate(retentionLimit.getDate() - config.retentionDays)

    // Eliminar archivos antiguos
    for (const file of backupFiles) {
      try {
        // Extraer fecha del nombre del archivo
        const dateMatch = file.match(/backup_(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/)
        if (dateMatch) {
          const fileDate = new Date(dateMatch[1].replace(/-/g, ":"))

          // Si el archivo es más antiguo que el límite de retención, eliminarlo
          if (fileDate < retentionLimit) {
            fs.unlinkSync(path.join(backupDir, file))
            console.log(`Backup antiguo eliminado: ${file}`)
          }
        }
      } catch (err) {
        console.error(`Error al procesar archivo de backup ${file}:`, err)
      }
    }
  } catch (error) {
    console.error("Error al limpiar backups antiguos:", error)
  }
}

// Función para restaurar un backup
export async function restoreDatabase(filename: string): Promise<BackupResult> {
  try {
    const config = await getBackupConfig()
    const filePath = path.join(config.location, filename)

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: `El archivo de backup ${filename} no existe`,
      }
    }

    // Ejecutar comando de restauración
    const dbUrl = process.env.DATABASE_URL || ""
    const command = `psql "${dbUrl}" < "${filePath}"`

    await execAsync(command)

    return {
      success: true,
      message: "Restauración completada correctamente",
      filename,
    }
  } catch (error) {
    console.error("Error al restaurar backup:", error)
    return {
      success: false,
      message: `Error al restaurar backup: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Función para obtener la lista de backups disponibles
export async function getBackupHistory(): Promise<
  Array<{
    filename: string
    timestamp: Date
    size: number
  }>
> {
  try {
    // Obtener registros de backup de la base de datos
    const backupEntries = await prisma.config.findMany({
      where: {
        key: {
          startsWith: "backup_history_",
        },
      },
    })

    // Convertir las entradas a objetos de backup
    const backups = backupEntries.map((entry) => {
      const data = JSON.parse(entry.value)
      return {
        filename: data.filename,
        timestamp: new Date(data.timestamp),
        size: data.size,
      }
    })

    // Ordenar por fecha (más reciente primero)
    backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return backups
  } catch (error) {
    console.error("Error al obtener historial de backups:", error)
    return []
  }
}

// Función para exportar datos en CSV
export async function exportDataToCSV(entity: BackupEntity): Promise<BackupResult> {
  try {
    const config = await getBackupConfig()

    // Crear directorio de exportación si no existe
    const exportDir = path.join(config.location, "exports")
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true })
    }

    // Generar nombre de archivo con timestamp
    const timestamp = new Date()
    const formattedDate = timestamp.toISOString().replace(/:/g, "-").replace(/\..+/, "")

    // Si es "all", exportar todas las entidades
    if (entity === "all") {
      const entities: BackupEntity[] = [
        "products",
        "categories",
        "customers",
        "orders",
        "invoices",
        "subscriptions",
        "consignments",
        "deliveries",
        "users",
        "config",
      ]

      // Crear un directorio para el backup completo
      const fullBackupDir = path.join(exportDir, `full_backup_${formattedDate}`)
      fs.mkdirSync(fullBackupDir, { recursive: true })

      // Exportar cada entidad
      const results = await Promise.all(
        entities.map(async (ent) => {
          const result = await exportSingleEntityToCSV(ent, fullBackupDir, formattedDate)
          return { entity: ent, ...result }
        }),
      )

      // Crear un archivo README con instrucciones
      const readmePath = path.join(fullBackupDir, "README.txt")
      const readmeContent = `
BACKUP COMPLETO DEL SISTEMA - ${new Date().toLocaleString()}

Este directorio contiene archivos CSV con todos los datos del sistema.
Para restaurar el sistema, siga estos pasos:

1. Instale una nueva instancia del sistema
2. Vaya a la sección de Configuración > Respaldos
3. Seleccione "Importar desde CSV"
4. Seleccione este directorio completo
5. Haga clic en "Restaurar Sistema"

Los archivos incluidos son:
${entities.map((e) => `- ${e}.csv`).join("\n")}

IMPORTANTE: La restauración sobrescribirá todos los datos existentes.
      `.trim()

      fs.writeFileSync(readmePath, readmeContent)

      // Crear un archivo ZIP con todo el contenido
      const zipFilename = `full_backup_${formattedDate}.zip`
      const zipFilePath = path.join(exportDir, zipFilename)

      // Comando para crear ZIP
      const zipCommand = `cd "${exportDir}" && zip -r "${zipFilename}" "full_backup_${formattedDate}"`
      await execAsync(zipCommand)

      return {
        success: true,
        message: `Backup completo exportado correctamente a ${zipFilePath}`,
        filename: zipFilename,
        timestamp,
        size: fs.statSync(zipFilePath).size,
      }
    }

    // Si es una entidad específica
    return await exportSingleEntityToCSV(entity, exportDir, formattedDate)
  } catch (error) {
    console.error(`Error al exportar a CSV:`, error)
    return {
      success: false,
      message: `Error al exportar a CSV: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Función auxiliar para exportar una sola entidad a CSV
async function exportSingleEntityToCSV(
  entity: BackupEntity,
  exportDir: string,
  formattedDate: string,
): Promise<BackupResult> {
  try {
    const filename = `${entity}_${formattedDate}.csv`
    const filePath = path.join(exportDir, filename)

    // Obtener datos según la entidad
    let data: any[] = []
    let headers: string[] = []

    switch (entity) {
      case "products":
        data = await prisma.product.findMany({
          include: {
            category: true,
          },
        })
        headers = [
          "id",
          "name",
          "description",
          "sku",
          "barcode",
          "gtin",
          "qrCode",
          "price",
          "price50cm",
          "price60cm",
          "price70cm",
          "stock",
          "minStock",
          "color",
          "image",
          "metadata",
          "categoryId",
          "createdAt",
          "updatedAt",
        ]
        break

      case "categories":
        data = await prisma.category.findMany()
        headers = ["id", "name", "description", "createdAt", "updatedAt"]
        break

      case "customers":
        data = await prisma.customer.findMany()
        headers = [
          "id",
          "name",
          "email",
          "phone",
          "address",
          "city",
          "state",
          "zipCode",
          "country",
          "type",
          "taxId",
          "notes",
          "status",
          "createdAt",
          "updatedAt",
        ]
        break

      case "orders":
        data = await prisma.order.findMany({
          include: {
            customer: {
              select: { id: true, name: true },
            },
            items: {
              include: {
                product: {
                  select: { id: true, name: true, sku: true },
                },
              },
            },
          },
        })

        // Aplanar los datos de pedidos para CSV
        data = data.map((order) => {
          const flatOrder = {
            id: order.id,
            customerId: order.customerId,
            customerName: order.customer.name,
            orderNumber: order.orderNumber,
            status: order.status,
            total: order.total,
            tax: order.tax,
            shippingCost: order.shippingCost,
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: JSON.stringify(
              order.items.map((item) => ({
                productId: item.productId,
                productName: item.product.name,
                sku: item.product.sku,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
              })),
            ),
          }
          return flatOrder
        })

        headers = [
          "id",
          "customerId",
          "customerName",
          "orderNumber",
          "status",
          "total",
          "tax",
          "shippingCost",
          "notes",
          "createdAt",
          "updatedAt",
          "items",
        ]
        break

      case "invoices":
        data = await prisma.invoice.findMany({
          include: {
            order: {
              select: { id: true, orderNumber: true },
            },
            customer: {
              select: { id: true, name: true },
            },
          },
        })

        // Aplanar los datos de facturas
        data = data.map((invoice) => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          orderId: invoice.orderId,
          orderNumber: invoice.order?.orderNumber,
          customerId: invoice.customerId,
          customerName: invoice.customer?.name,
          status: invoice.status,
          amount: invoice.amount,
          tax: invoice.tax,
          dueDate: invoice.dueDate,
          paidDate: invoice.paidDate,
          notes: invoice.notes,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
        }))

        headers = [
          "id",
          "invoiceNumber",
          "orderId",
          "orderNumber",
          "customerId",
          "customerName",
          "status",
          "amount",
          "tax",
          "dueDate",
          "paidDate",
          "notes",
          "createdAt",
          "updatedAt",
        ]
        break

      case "subscriptions":
        data = await prisma.subscription.findMany({
          include: {
            customer: {
              select: { id: true, name: true },
            },
            items: {
              include: {
                product: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        })

        // Aplanar los datos de suscripciones
        data = data.map((sub) => ({
          id: sub.id,
          customerId: sub.customerId,
          customerName: sub.customer?.name,
          status: sub.status,
          frequency: sub.frequency,
          nextDeliveryDate: sub.nextDeliveryDate,
          amount: sub.amount,
          startDate: sub.startDate,
          endDate: sub.endDate,
          notes: sub.notes,
          items: JSON.stringify(
            sub.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              price: item.price,
            })),
          ),
          createdAt: sub.createdAt,
          updatedAt: sub.updatedAt,
        }))

        headers = [
          "id",
          "customerId",
          "customerName",
          "status",
          "frequency",
          "nextDeliveryDate",
          "amount",
          "startDate",
          "endDate",
          "notes",
          "items",
          "createdAt",
          "updatedAt",
        ]
        break

      case "consignments":
        data = await prisma.consignment.findMany({
          include: {
            customer: {
              select: { id: true, name: true },
            },
            items: {
              include: {
                product: {
                  select: { id: true, name: true, sku: true },
                },
              },
            },
          },
        })

        // Aplanar los datos de consignaciones
        data = data.map((con) => ({
          id: con.id,
          customerId: con.customerId,
          customerName: con.customer?.name,
          status: con.status,
          deliveryDate: con.deliveryDate,
          returnDate: con.returnDate,
          settlementDate: con.settlementDate,
          totalItems: con.totalItems,
          soldItems: con.soldItems,
          returnedItems: con.returnedItems,
          amount: con.amount,
          notes: con.notes,
          items: JSON.stringify(
            con.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              sku: item.product.sku,
              quantity: item.quantity,
              price: item.price,
              sold: item.sold,
              returned: item.returned,
            })),
          ),
          createdAt: con.createdAt,
          updatedAt: con.updatedAt,
        }))

        headers = [
          "id",
          "customerId",
          "customerName",
          "status",
          "deliveryDate",
          "returnDate",
          "settlementDate",
          "totalItems",
          "soldItems",
          "returnedItems",
          "amount",
          "notes",
          "items",
          "createdAt",
          "updatedAt",
        ]
        break

      case "deliveries":
        data = await prisma.delivery.findMany({
          include: {
            order: {
              select: { id: true, orderNumber: true },
            },
            driver: {
              select: { id: true, name: true },
            },
          },
        })

        // Aplanar los datos de entregas
        data = data.map((del) => ({
          id: del.id,
          orderId: del.orderId,
          orderNumber: del.order?.orderNumber,
          driverId: del.driverId,
          driverName: del.driver?.name,
          status: del.status,
          scheduledDate: del.scheduledDate,
          deliveredDate: del.deliveredDate,
          address: del.address,
          city: del.city,
          state: del.state,
          zipCode: del.zipCode,
          country: del.country,
          trackingCode: del.trackingCode,
          qrCode: del.qrCode,
          notes: del.notes,
          latitude: del.latitude,
          longitude: del.longitude,
          createdAt: del.createdAt,
          updatedAt: del.updatedAt,
        }))

        headers = [
          "id",
          "orderId",
          "orderNumber",
          "driverId",
          "driverName",
          "status",
          "scheduledDate",
          "deliveredDate",
          "address",
          "city",
          "state",
          "zipCode",
          "country",
          "trackingCode",
          "qrCode",
          "notes",
          "latitude",
          "longitude",
          "createdAt",
          "updatedAt",
        ]
        break

      case "users":
        data = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
            // No incluir contraseñas por seguridad
          },
        })

        headers = ["id", "name", "email", "role", "active", "lastLogin", "createdAt", "updatedAt"]
        break

      case "config":
        data = await prisma.config.findMany()
        headers = ["id", "key", "value", "description", "createdAt", "updatedAt"]
        break

      default:
        throw new Error(`Entidad no soportada: ${entity}`)
    }

    // Generar contenido CSV
    let csvContent = headers.join(",") + "\n"

    for (const item of data) {
      const row = headers.map((header) => {
        let value = item[header]

        // Formatear fechas
        if (value instanceof Date) {
          value = value.toISOString()
        }

        // Convertir objetos a JSON
        if (typeof value === "object" && value !== null) {
          value = JSON.stringify(value)
        }

        // Escapar comas y comillas
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }

        // Manejar valores nulos
        if (value === null || value === undefined) {
          return ""
        }

        return value
      })
      csvContent += row.join(",") + "\n"
    }

    // Escribir archivo CSV
    fs.writeFileSync(filePath, csvContent)

    // Verificar si el archivo se creó correctamente
    const stats = fs.statSync(filePath)

    return {
      success: true,
      message: `Exportación de ${entity} completada correctamente`,
      filename,
      timestamp: new Date(),
      size: stats.size,
    }
  } catch (error) {
    console.error(`Error al exportar ${entity} a CSV:`, error)
    return {
      success: false,
      message: `Error al exportar ${entity} a CSV: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Función para importar datos desde CSV
export async function importDataFromCSV(
  entity: BackupEntity,
  filePath: string,
  options: {
    overwrite?: boolean
    dryRun?: boolean
  } = {},
): Promise<BackupResult> {
  const { overwrite = false, dryRun = false } = options

  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: `El archivo ${filePath} no existe`,
      }
    }
    
    // Leer el archivo CSV
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // Parsear el CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })
    
    if (records.length === 0) {
      return {
        success: false,
        message: `El archivo CSV está vacío o no tiene un formato válido`,
      }
    }
    
    // Si es modo de prueba, solo devolver información
    if (dryRun) {
      return {
        success: true,
        message: `Simulación de importación: ${records.length} registros de ${entity} serían importados`,
      }
    }
    
    // Procesar según la entidad
    let importedCount = 0
    let updatedCount = 0
    let errorCount = 0
    
    switch (entity) {
      case "products":
        for (const record of records) {
          try {
            // Convertir campos de fecha
            const createdAt = record.createdAt ? new Date(record.createdAt) : new Date()
            const updatedAt = record.updatedAt ? new Date(record.updatedAt) : new Date()
            
            // Convertir campos numéricos
            const price = Number.parseFloat(record.price) || 0
            const price50cm = record.price50cm ? Number.parseFloat(record.price50cm) : null
            const price60cm = record.price60cm ? Number.parseFloat(record.price60cm) : null
            const price70cm = record.price70cm ? Number.parseFloat(record.price70cm) : null
            const stock = Number.parseInt(record.stock) || 0
            const minStock = Number.parseInt(record.minStock) || 0
            
            // Verificar si el producto ya existe
            const existingProduct = await prisma.product.findUnique({
              where: { id: record.id },
            })
            
            if (existingProduct) {
              if (overwrite) {
                // Actualizar producto existente
                await prisma.product.update({
                  where: { id: record.id },
                  data: {
                    name: record.name,
                    description: record.description || null,
                    sku: record.sku,
                    barcode: record.barcode || null,
                    gtin: record.gtin || null,
                    qrCode: record.qrCode || null,
                    price,
                    price50cm,
                    price60cm,
                    price70cm,
                    stock,
                    minStock,
                    color: record.color || null,
                    image: record.image || null,
                    metadata: record.metadata || null,
                    categoryId: record.categoryId,
                    updatedAt
                  },
                })
                updatedCount++
              }
            } else {
              // Crear nuevo producto
              await prisma.product.create({
                data: {
                  id: record.id,
                  name: record.name,
                  description: record.description || null,
                  sku: record.sku,
                  barcode: record.barcode || null,
                  gtin: record.gtin || null,
                  qrCode: record.qrCode || null,
                  price,
                  price50cm,
                  price60cm,
                  price70cm,
                  stock,
                  minStock,
                  color: record.color || null,
                  image: record.image || null,
                  metadata: record.metadata || null,
                  categoryId: record.categoryId,
                  createdAt,
                  updatedAt
                },
              })
              importedCount++
            }
          } catch (err) {
            console.error(`Error al importar producto:`, err, record)
            errorCount++
          }
        }
        break
        
      case "categories":
        for (const record of records) {
          try {
            // Convertir campos de fecha
            const createdAt = record.createdAt ? new Date(record.createdAt) : new Date()
            const updatedAt = record.updatedAt ? new Date(record.updatedAt) : new Date()
            
            // Verificar si la categoría ya existe
            const existingCategory = await prisma.category.findUnique({
              where: { id: record.id },
            })
            
            if (existingCategory) {
              if (overwrite) {
                // Actualizar categoría existente
                await prisma.category.update({
                  where: { id: record.id },
                  data: {
                    name: record.name,
                    description: record.description || null,
                    updatedAt
                  },
                })
                updatedCount++
              }
            } else {
              // Crear nueva categoría
              await prisma.category.create({
                data: {
                  id: record.id,
                  name: record.name,
                  description: record.description || null,
                  createdAt,
                  updatedAt
                },
              })
              importedCount++
            }
          } catch (err) {
            console.error(`Error al importar categoría:`, err, record)
            errorCount++
          }
        }
        break
        
      // Implementar casos para otras entidades siguiendo el mismo patrón
      
      case "all":
        // La importación completa se maneja de forma especial
        return {
          success: false,
          message: "Para importar todos los datos, use la función importFullBackup",
        }
        
      default:
        return {
          success: false,
          message: `Entidad no soportada para importación: ${entity}`,
        }
    }
    
    return {
      success: true,
      message: `Importación completada: ${importedCount} registros importados, ${updatedCount} actualizados, ${errorCount} errores`,
    }
  }
}

// Función para importar un backup completo\
export async function importFullBackup(
  backupDir: string,
  options: {
    overwrite?: boolean
    dryRun?: boolean
  } = {},
): Promise<BackupResult> {
  try {
    // Verificar si el directorio existe
    if (!fs.existsSync(backupDir)) {
      return {
        success: false,
        message: `El directorio ${backupDir} no existe`,
      }
    }

    // Orden de importación para respetar dependencias
    const importOrder: BackupEntity[] = [
      "config",
      "categories",
      "products",
      "customers",
      "users",
      "orders",
      "invoices",
      "subscriptions",
      "consignments",
      "deliveries",
    ]

    const results = []

    // Importar en el orden correcto
    for (const entity of importOrder) {
      const filePath = findEntityFile(backupDir, entity)

      if (filePath) {
        const result = await importDataFromCSV(entity, filePath, options)
        results.push({ entity, ...result })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const errorCount = results.length - successCount

    return {
      success: successCount > 0,
      message: `Importación completa finalizada: ${successCount} entidades importadas correctamente, ${errorCount} con errores`,
    }
  } catch (error) {
    console.error("Error al importar backup completo:", error)
    return {
      success: false,
      message: `Error al importar backup completo: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Función auxiliar para encontrar archivos de entidades en un directorio
function findEntityFile(directory: string, entity: BackupEntity): string | null {
  try {
    const files = fs.readdirSync(directory)

    // Buscar archivos que coincidan con el patrón de la entidad
    const entityFile = files.find((file) => file.startsWith(`${entity}_`) && file.endsWith(".csv"))

    return entityFile ? path.join(directory, entityFile) : null
  } catch (error) {
    console.error(`Error al buscar archivo para ${entity}:`, error)
    return null
  }
}

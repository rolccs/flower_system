"use client"

import { FormDescription } from "@/components/ui/form"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Download, Upload, Database, FileText, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { BackupEntity } from "@/lib/services/backup-service"

// Esquema de validación para exportación de datos
const exportSchema = z.object({
  entity: z.string().min(1, { message: "La entidad es obligatoria" }),
  format: z.string().min(1, { message: "El formato es obligatorio" }),
})

// Esquema de validación para importación de datos
const importSchema = z.object({
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "El archivo es obligatorio",
  }),
  entity: z.string().min(1, { message: "La entidad es obligatoria" }),
  overwrite: z.boolean().default(false),
})

// Esquema de validación para configuración de respaldos
const backupConfigSchema = z.object({
  enabled: z.boolean().default(true),
  frequency: z.string().min(1, { message: "La frecuencia es obligatoria" }),
  retentionDays: z.number().min(1, { message: "Los días de retención deben ser al menos 1" }),
  useExternalStorage: z.boolean().default(false),
  externalStoragePath: z.string().optional(),
})

// Tipo para el historial de respaldos
type BackupHistoryItem = {
  filename: string
  timestamp: Date
  size: number
  type: "database" | "csv"
}

// Tipo para la configuración de respaldos
type BackupConfig = {
  enabled: boolean
  frequency: string
  retentionDays: number
  useExternalStorage: boolean
  externalStoragePath?: string
}

export function BackupManager() {
  const [activeTab, setActiveTab] = useState("export")
  const [isLoading, setIsLoading] = useState(false)
  const [backupHistory, setBackupHistory] = useState<BackupHistoryItem[]>([])
  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    enabled: true,
    frequency: "daily",
    retentionDays: 30,
    useExternalStorage: false,
  })
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<BackupEntity | null>(null)

  // Formulario para exportación de datos
  const exportForm = useForm<z.infer<typeof exportSchema>>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      entity: "all",
      format: "csv",
    },
  })

  // Formulario para importación de datos
  const importForm = useForm<z.infer<typeof importSchema>>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      entity: "all",
      overwrite: false,
    },
  })

  // Formulario para configuración de respaldos
  const configForm = useForm<z.infer<typeof backupConfigSchema>>({
    resolver: zodResolver(backupConfigSchema),
    defaultValues: {
      enabled: true,
      frequency: "daily",
      retentionDays: 30,
      useExternalStorage: false,
    },
  })

  // Cargar historial de respaldos al montar el componente
  useEffect(() => {
    loadBackupHistory()
    loadBackupConfig()
  }, [])

  // Función para cargar el historial de respaldos
  const loadBackupHistory = async () => {
    try {
      // En un sistema real, esto se obtendría de una API
      // Simulamos datos para la demostración
      const mockHistory: BackupHistoryItem[] = [
        {
          filename: "backup_2023-05-15T08-30-00.sql",
          timestamp: new Date("2023-05-15T08:30:00"),
          size: 1024 * 1024 * 5.2, // 5.2 MB
          type: "database",
        },
        {
          filename: "backup_2023-05-14T08-30-00.sql",
          timestamp: new Date("2023-05-14T08:30:00"),
          size: 1024 * 1024 * 5.1, // 5.1 MB
          type: "database",
        },
        {
          filename: "export_all_2023-05-13T14-45-00.zip",
          timestamp: new Date("2023-05-13T14:45:00"),
          size: 1024 * 1024 * 3.7, // 3.7 MB
          type: "csv",
        },
        {
          filename: "export_products_2023-05-12T10-15-00.csv",
          timestamp: new Date("2023-05-12T10:15:00"),
          size: 1024 * 512, // 512 KB
          type: "csv",
        },
      ]

      setBackupHistory(mockHistory)
    } catch (error) {
      console.error("Error al cargar historial de respaldos:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el historial de respaldos",
        variant: "destructive",
      })
    }
  }

  // Función para cargar la configuración de respaldos
  const loadBackupConfig = async () => {
    try {
      // En un sistema real, esto se obtendría de una API
      // Simulamos datos para la demostración
      const mockConfig: BackupConfig = {
        enabled: true,
        frequency: "daily",
        retentionDays: 30,
        useExternalStorage: false,
      }

      setBackupConfig(mockConfig)
      configForm.reset(mockConfig)
    } catch (error) {
      console.error("Error al cargar configuración de respaldos:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración de respaldos",
        variant: "destructive",
      })
    }
  }

  // Función para exportar datos
  const onSubmitExport = async (data: z.infer<typeof exportSchema>) => {
    setIsLoading(true)

    try {
      // En un sistema real, esto llamaría a una API
      console.log("Exportando datos:", data)

      // Simulamos una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Exportación completada",
        description: `Los datos de ${data.entity} han sido exportados correctamente en formato ${data.format.toUpperCase()}.`,
      })

      // Recargar historial de respaldos
      loadBackupHistory()
    } catch (error) {
      console.error("Error al exportar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para importar datos
  const onSubmitImport = async (data: z.infer<typeof importSchema>) => {
    setIsLoading(true)

    try {
      // En un sistema real, esto subiría el archivo a una API
      console.log("Importando datos:", data)

      // Simulamos una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Importación completada",
        description: `Los datos de ${data.entity} han sido importados correctamente.`,
      })

      // Limpiar formulario
      importForm.reset()
    } catch (error) {
      console.error("Error al importar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron importar los datos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para guardar configuración de respaldos
  const onSubmitConfig = async (data: z.infer<typeof backupConfigSchema>) => {
    setIsLoading(true)

    try {
      // En un sistema real, esto llamaría a una API
      console.log("Guardando configuración:", data)

      // Simulamos una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setBackupConfig(data)

      toast({
        title: "Configuración guardada",
        description: "La configuración de respaldos ha sido guardada correctamente.",
      })
    } catch (error) {
      console.error("Error al guardar configuración:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para crear un respaldo manual
  const createManualBackup = async () => {
    setIsLoading(true)

    try {
      // En un sistema real, esto llamaría a una API
      console.log("Creando respaldo manual")

      // Simulamos una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Respaldo creado",
        description: "El respaldo manual ha sido creado correctamente.",
      })

      // Recargar historial de respaldos
      loadBackupHistory()
    } catch (error) {
      console.error("Error al crear respaldo manual:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el respaldo manual",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para restaurar un respaldo
  const restoreBackup = async () => {
    if (!selectedBackup) return

    setIsLoading(true)
    setShowRestoreConfirm(false)

    try {
      // En un sistema real, esto llamaría a una API
      console.log("Restaurando respaldo:", selectedBackup)

      // Simulamos una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 5000))

      toast({
        title: "Restauración completada",
        description: "El sistema ha sido restaurado correctamente.",
      })
    } catch (error) {
      console.error("Error al restaurar respaldo:", error)
      toast({
        title: "Error",
        description: "No se pudo restaurar el respaldo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSelectedBackup(null)
    }
  }

  // Función para formatear el tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  return (
    <Tabs defaultValue="export" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="export">Exportar Datos</TabsTrigger>
        <TabsTrigger value="import">Importar Datos</TabsTrigger>
        <TabsTrigger value="history">Historial</TabsTrigger>
        <TabsTrigger value="config">Configuración</TabsTrigger>
      </TabsList>

      {/* Exportar Datos */}
      <TabsContent value="export">
        <Card>
          <CardHeader>
            <CardTitle>Exportar Datos</CardTitle>
            <CardDescription>Exporta los datos del sistema a archivos CSV para respaldo o migración.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...exportForm}>
              <form onSubmit={exportForm.handleSubmit(onSubmitExport)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={exportForm.control}
                    name="entity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entidad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una entidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Todo el sistema</SelectItem>
                            <SelectItem value="products">Productos</SelectItem>
                            <SelectItem value="categories">Categorías</SelectItem>
                            <SelectItem value="customers">Clientes</SelectItem>
                            <SelectItem value="orders">Pedidos</SelectItem>
                            <SelectItem value="invoices">Facturas</SelectItem>
                            <SelectItem value="subscriptions">Suscripciones</SelectItem>
                            <SelectItem value="consignments">Consignaciones</SelectItem>
                            <SelectItem value="deliveries">Entregas</SelectItem>
                            <SelectItem value="users">Usuarios</SelectItem>
                            <SelectItem value="config">Configuración</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exportForm.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un formato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Exportando..." : "Exportar Datos"}
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" onClick={createManualBackup} disabled={isLoading}>
                    {isLoading ? "Creando..." : "Crear Respaldo Completo"}
                    <Database className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Importar Datos */}
      <TabsContent value="import">
        <Card>
          <CardHeader>
            <CardTitle>Importar Datos</CardTitle>
            <CardDescription>
              Importa datos desde archivos CSV para restaurar el sistema o migrar datos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...importForm}>
              <form onSubmit={importForm.handleSubmit(onSubmitImport)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={importForm.control}
                    name="file"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Archivo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".csv,.json,.zip"
                            onChange={(e) => onChange(e.target.files)}
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={importForm.control}
                    name="entity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entidad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una entidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Todo el sistema</SelectItem>
                            <SelectItem value="products">Productos</SelectItem>
                            <SelectItem value="categories">Categorías</SelectItem>
                            <SelectItem value="customers">Clientes</SelectItem>
                            <SelectItem value="orders">Pedidos</SelectItem>
                            <SelectItem value="invoices">Facturas</SelectItem>
                            <SelectItem value="subscriptions">Suscripciones</SelectItem>
                            <SelectItem value="consignments">Consignaciones</SelectItem>
                            <SelectItem value="deliveries">Entregas</SelectItem>
                            <SelectItem value="users">Usuarios</SelectItem>
                            <SelectItem value="config">Configuración</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={importForm.control}
                    name="overwrite"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Sobrescribir datos existentes</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Si está marcado, los datos existentes serán reemplazados por los importados.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" disabled={isLoading}>
                      {isLoading ? "Importando..." : "Importar Datos"}
                      <Upload className="ml-2 h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción importará datos al sistema. Dependiendo de la configuración, podría sobrescribir
                        datos existentes.
                        <br />
                        <br />
                        <span className="font-semibold">Recomendación:</span> Realiza un respaldo completo antes de
                        importar datos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={importForm.handleSubmit(onSubmitImport)}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Historial de Respaldos */}
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Respaldos</CardTitle>
            <CardDescription>Visualiza y gestiona los respaldos y exportaciones realizados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Archivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No hay respaldos disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    backupHistory.map((backup) => (
                      <TableRow key={backup.filename}>
                        <TableCell className="font-medium">{backup.filename}</TableCell>
                        <TableCell>
                          {backup.type === "database" ? (
                            <span className="flex items-center">
                              <Database className="mr-2 h-4 w-4" />
                              Base de datos
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              CSV
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{backup.timestamp.toLocaleString()}</TableCell>
                        <TableCell>{formatFileSize(backup.size)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedBackup(backup.filename)}>
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Restaurar este respaldo?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción restaurará el sistema al estado guardado en este respaldo. Todos los
                                    datos actuales serán reemplazados.
                                    <br />
                                    <br />
                                    <span className="font-semibold text-destructive">Advertencia:</span> Esta acción no
                                    se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={restoreBackup}>Restaurar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Configuración de Respaldos */}
      <TabsContent value="config">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Respaldos</CardTitle>
            <CardDescription>Configura los respaldos automáticos y las políticas de retención.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...configForm}>
              <form onSubmit={configForm.handleSubmit(onSubmitConfig)} className="space-y-6">
                <FormField
                  control={configForm.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Respaldos Automáticos</FormLabel>
                        <FormDescription>Habilitar respaldos automáticos programados</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={configForm.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frecuencia</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una frecuencia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hourly">Cada hora</SelectItem>
                            <SelectItem value="daily">Diario</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={configForm.control}
                    name="retentionDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Días de Retención</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={configForm.control}
                  name="useExternalStorage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Almacenamiento Externo</FormLabel>
                        <FormDescription>Guardar copias de respaldo en almacenamiento externo</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {configForm.watch("useExternalStorage") && (
                  <FormField
                    control={configForm.control}
                    name="externalStoragePath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ruta de Almacenamiento Externo</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/mnt/backup" />
                        </FormControl>
                        <FormDescription>Ruta donde se guardarán las copias de respaldo externas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Configuración"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Diálogo de confirmación de restauración */}
      <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Restauración</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas restaurar el sistema con este respaldo?
              <br />
              <br />
              <span className="font-semibold text-destructive">Advertencia:</span> Esta acción reemplazará todos los
              datos actuales y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={restoreBackup}>Confirmar Restauración</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}

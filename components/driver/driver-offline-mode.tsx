"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { WifiOff, RefreshCw, Database, Trash2, Clock, CheckCircle, AlertTriangle, HardDrive } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function DriverOfflineMode() {
  const [isOfflineEnabled, setIsOfflineEnabled] = useState(true)
  const [storageUsage, setStorageUsage] = useState(32) // porcentaje
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date())
  const [pendingSyncs, setPendingSyncs] = useState(3)
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState("status")

  const toggleOfflineMode = () => {
    setIsOfflineEnabled(!isOfflineEnabled)

    toast({
      title: isOfflineEnabled ? "Modo offline desactivado" : "Modo offline activado",
      description: isOfflineEnabled
        ? "Los datos ya no se almacenarán localmente cuando no haya conexión"
        : "Los datos se almacenarán localmente cuando no haya conexión",
    })
  }

  const syncData = () => {
    if (pendingSyncs === 0) {
      toast({
        title: "No hay datos pendientes",
        description: "Todos los datos están sincronizados",
      })
      return
    }

    setIsSyncing(true)

    // Simular sincronización
    toast({
      title: "Sincronizando datos",
      description: `Sincronizando ${pendingSyncs} elementos pendientes...`,
    })

    setTimeout(() => {
      setPendingSyncs(0)
      setLastSyncTime(new Date())
      setIsSyncing(false)

      toast({
        title: "Sincronización completada",
        description: "Todos los datos han sido sincronizados correctamente",
      })
    }, 2000)
  }

  const clearOfflineData = () => {
    toast({
      title: "Datos offline eliminados",
      description: "Se han eliminado todos los datos almacenados localmente",
    })

    setStorageUsage(0)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <WifiOff className="mr-2 h-5 w-5 text-primary" />
            Modo Offline
          </CardTitle>
          <CardDescription>Gestiona cómo la aplicación funciona cuando no hay conexión a internet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="offline-mode">Activar modo offline</Label>
                <p className="text-sm text-muted-foreground">Permite seguir trabajando sin conexión a internet</p>
              </div>
              <Switch id="offline-mode" checked={isOfflineEnabled} onCheckedChange={toggleOfflineMode} />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="status">Estado</TabsTrigger>
                <TabsTrigger value="data">Datos</TabsTrigger>
                <TabsTrigger value="settings">Configuración</TabsTrigger>
              </TabsList>

              <TabsContent value="status" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <span className="flex items-center text-sm">
                      {isOfflineEnabled ? (
                        <>
                          <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                          Activado
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
                          Desactivado
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Última sincronización:</span>
                    <span className="text-sm">{lastSyncTime ? lastSyncTime.toLocaleTimeString() : "Nunca"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Elementos pendientes:</span>
                    <span className="text-sm">{pendingSyncs}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Almacenamiento utilizado:</span>
                    <span className="text-sm">{storageUsage}%</span>
                  </div>
                  <Progress value={storageUsage} className="h-2" />
                </div>

                <Button onClick={syncData} disabled={pendingSyncs === 0 || isSyncing} className="w-full">
                  {isSyncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sincronizar Ahora
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="data" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Entregas pendientes</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          Actualizado hace 5 minutos
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{pendingSyncs}</div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <HardDrive className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Almacenamiento</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          5.2 MB utilizados
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{storageUsage}%</div>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Limpiar Datos Offline
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará todos los datos almacenados localmente. Los datos que no se hayan
                          sincronizado se perderán permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={clearOfflineData}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sincronización automática</Label>
                      <p className="text-sm text-muted-foreground">Sincronizar automáticamente cuando hay conexión</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaciones offline</Label>
                      <p className="text-sm text-muted-foreground">Recibir notificaciones cuando estás offline</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Límite de almacenamiento</Label>
                      <p className="text-sm text-muted-foreground">Limitar el espacio utilizado para datos offline</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="rounded-md border p-4">
                    <h4 className="text-sm font-medium mb-2">Frecuencia de sincronización</h4>
                    <select className="w-full p-2 rounded-md border">
                      <option value="5">Cada 5 minutos</option>
                      <option value="15">Cada 15 minutos</option>
                      <option value="30">Cada 30 minutos</option>
                      <option value="60">Cada hora</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            El modo offline permite seguir trabajando cuando no hay conexión a internet. Los datos se almacenan
            localmente y se sincronizan cuando vuelve la conexión.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

import { BackupManager } from "@/components/backups/backup-manager"

export default function BackupsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Respaldos y Restauración</h1>
        <p className="text-muted-foreground">
          Gestiona los respaldos del sistema, exporta datos a CSV y restaura el sistema en caso de fallo.
        </p>
      </div>

      <BackupManager />
    </div>
  )
}

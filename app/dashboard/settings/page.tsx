import { SystemSettings } from "@/components/settings/system-settings"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración del Sistema</h1>
        <p className="text-muted-foreground">Administra todas las configuraciones y preferencias del sistema.</p>
      </div>

      <SystemSettings />
    </div>
  )
}

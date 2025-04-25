import { ReportGenerator } from "@/components/reports/report-generator"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reportes e Informes</h1>
        <p className="text-muted-foreground">
          Genera reportes personalizados sobre ventas, inventario, clientes y más.
        </p>
      </div>

      <ReportGenerator />
    </div>
  )
}

import { SubscriptionList } from "@/components/subscriptions/subscription-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileDown, Plus, Calendar } from "lucide-react"

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suscripciones</h1>
          <p className="text-muted-foreground">Gestiona todas las suscripciones recurrentes del sistema.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/subscriptions/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Suscripción
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Ver Calendario
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <SubscriptionList />
    </div>
  )
}

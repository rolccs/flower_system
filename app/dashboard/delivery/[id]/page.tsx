import { RoutePlanner } from "@/components/delivery/route-planner"

interface DeliveryRoutePageProps {
  params: {
    id: string
  }
}

export default function DeliveryRoutePage({ params }: DeliveryRoutePageProps) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Ruta de Entrega</h1>
      <RoutePlanner routeId={params.id} />
    </div>
  )
}

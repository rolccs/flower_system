import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Pedidos Recientes</CardTitle>
          <CardDescription>Últimos 5 pedidos recibidos en el sistema</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          Ver todos
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={order.avatar || "/placeholder.svg"} alt={order.customer} />
                <AvatarFallback>{order.customer.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 gap-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{order.customer}</div>
                  <Badge variant={getStatusVariant(order.status)} className="ml-auto">
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Pedido #{order.id} • {order.date} • ${order.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Completado":
      return "success"
    case "Procesando":
      return "default"
    case "Pendiente":
      return "secondary"
    case "En Delivery":
      return "warning"
    default:
      return "outline"
  }
}

const recentOrders = [
  {
    id: "ORD-7352",
    customer: "Florería Bella Rosa",
    avatar: "/avatar-1.png",
    date: "Hoy, 10:45 AM",
    amount: "1,250.00",
    status: "Procesando",
  },
  {
    id: "ORD-7351",
    customer: "Eventos Elegantes",
    avatar: "/avatar-2.png",
    date: "Hoy, 9:30 AM",
    amount: "3,200.00",
    status: "Pendiente",
  },
  {
    id: "ORD-7350",
    customer: "Jardines Modernos",
    avatar: "/avatar-3.png",
    date: "Ayer, 4:25 PM",
    amount: "845.00",
    status: "En Delivery",
  },
  {
    id: "ORD-7349",
    customer: "Hotel Magnolia",
    avatar: "/avatar-4.png",
    date: "Ayer, 2:10 PM",
    amount: "1,750.00",
    status: "Completado",
  },
  {
    id: "ORD-7348",
    customer: "Decoraciones Primavera",
    avatar: "/avatar-5.png",
    date: "Ayer, 11:45 AM",
    amount: "920.00",
    status: "Completado",
  },
]

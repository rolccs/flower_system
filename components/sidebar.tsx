"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Truck,
  CalendarClock,
  ShoppingCart,
  Wrench,
  LogOut,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    inventory: true,
    customers: true,
    billing: true,
    delivery: true,
    tools: true,
    store: true,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className={cn("pb-12 w-64 border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Leche y Miel" width={32} height={32} />
            <h2 className="text-lg font-semibold tracking-tight">Leche y Miel</h2>
          </Link>
        </div>
        <div className="px-4">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">GESTIÓN</h2>
          <ScrollArea className="h-[calc(100vh-14rem)]">
            <div className="space-y-1">
              {/* Inventario */}
              <div>
                <button
                  onClick={() => toggleMenu("inventory")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    pathname.includes("/dashboard/inventory") && "bg-accent text-accent-foreground",
                  )}
                >
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Inventario</span>
                  </div>
                  {openMenus.inventory ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openMenus.inventory && (
                  <div className="pl-8 space-y-1 mt-1">
                    <Link
                      href="/dashboard/inventory"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/inventory") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Productos
                    </Link>
                    <Link
                      href="/dashboard/inventory/categories"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/inventory/categories") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Categorías
                    </Link>
                    <Link
                      href="/dashboard/inventory/new"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/inventory/new") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Nuevo Producto
                    </Link>
                  </div>
                )}
              </div>

              {/* Clientes */}
              <div>
                <button
                  onClick={() => toggleMenu("customers")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    pathname.includes("/dashboard/customers") && "bg-accent text-accent-foreground",
                  )}
                >
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Clientes</span>
                  </div>
                  {openMenus.customers ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openMenus.customers && (
                  <div className="pl-8 space-y-1 mt-1">
                    <Link
                      href="/dashboard/customers"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/customers") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Directorio
                    </Link>
                    <Link
                      href="/dashboard/subscriptions"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/subscriptions") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Suscripciones
                    </Link>
                    <Link
                      href="/dashboard/consignment"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/consignment") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Consignación
                    </Link>
                  </div>
                )}
              </div>

              {/* Facturación */}
              <div>
                <button
                  onClick={() => toggleMenu("billing")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    pathname.includes("/dashboard/billing") && "bg-accent text-accent-foreground",
                  )}
                >
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Facturación</span>
                  </div>
                  {openMenus.billing ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openMenus.billing && (
                  <div className="pl-8 space-y-1 mt-1">
                    <Link
                      href="/dashboard/billing"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/billing") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Facturas
                    </Link>
                    <Link
                      href="/dashboard/billing/new"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/billing/new") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Nueva Factura
                    </Link>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div>
                <button
                  onClick={() => toggleMenu("delivery")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    pathname.includes("/dashboard/delivery") && "bg-accent text-accent-foreground",
                  )}
                >
                  <div className="flex items-center">
                    <Truck className="mr-2 h-4 w-4" />
                    <span>Delivery</span>
                  </div>
                  {openMenus.delivery ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openMenus.delivery && (
                  <div className="pl-8 space-y-1 mt-1">
                    <Link
                      href="/dashboard/delivery"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/delivery") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Rutas
                    </Link>
                    <Link
                      href="/dashboard/delivery/drivers"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/delivery/drivers") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Conductores
                    </Link>
                    <Link
                      href="/driver"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/driver") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      App de Conductores
                    </Link>
                  </div>
                )}
              </div>

              {/* Herramientas */}
              <div>
                <button
                  onClick={() => toggleMenu("tools")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    pathname.includes("/dashboard/tools") && "bg-accent text-accent-foreground",
                  )}
                >
                  <div className="flex items-center">
                    <Wrench className="mr-2 h-4 w-4" />
                    <span>Herramientas</span>
                  </div>
                  {openMenus.tools ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openMenus.tools && (
                  <div className="pl-8 space-y-1 mt-1">
                    <Link
                      href="/dashboard/tools"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/tools") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      General
                    </Link>
                    <Link
                      href="/dashboard/reports"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/dashboard/reports") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Reportes
                    </Link>
                  </div>
                )}
              </div>

              {/* Tienda */}
              <div>
                <button
                  onClick={() => toggleMenu("store")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    pathname.includes("/store") && "bg-accent text-accent-foreground",
                  )}
                >
                  <div className="flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>E-Commerce</span>
                  </div>
                  {openMenus.store ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openMenus.store && (
                  <div className="pl-8 space-y-1 mt-1">
                    <Link
                      href="/store"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/store") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Tienda
                    </Link>
                    <Link
                      href="/store/products"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/store/products") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Productos
                    </Link>
                    <Link
                      href="/store/cart"
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        isActive("/store/cart") && "bg-accent/50 text-accent-foreground",
                      )}
                    >
                      Carrito
                    </Link>
                  </div>
                )}
              </div>

              {/* Otros enlaces */}
              <Link
                href="/dashboard/settings"
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/dashboard/settings") && "bg-accent text-accent-foreground",
                )}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Link>
              <Link
                href="/dashboard/calendar"
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/dashboard/calendar") && "bg-accent text-accent-foreground",
                )}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Calendario
              </Link>
              <Link
                href="/dashboard/analytics"
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                  isActive("/dashboard/analytics") && "bg-accent text-accent-foreground",
                )}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analíticas
              </Link>
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="px-4 py-2 border-t">
        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}

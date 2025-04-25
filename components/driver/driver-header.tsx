"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell, Menu, LogOut, Settings, User, HelpCircle, Wifi, WifiOff } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface DriverHeaderProps {
  isOnline: boolean
  toggleOnlineStatus: () => void
}

export function DriverHeader({ isOnline, toggleOnlineStatus }: DriverHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <div className="flex flex-col h-full">
              <div className="py-4 border-b">
                <Link href="/driver" className="flex items-center gap-2 font-semibold">
                  <Image src="/logo.png" alt="Leche y Miel" width={40} height={40} className="h-8 w-auto" />
                  <span className="text-lg">Leche y Miel Delivery</span>
                </Link>
              </div>
              <nav className="flex-1 py-4">
                <ul className="space-y-2">
                  <li>
                    <SheetClose asChild>
                      <Link href="/driver" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/driver/scan"
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                      >
                        <User className="h-4 w-4" />
                        Escanear QR
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/driver/history"
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                      >
                        <User className="h-4 w-4" />
                        Historial
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/driver/settings"
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                      >
                        <Settings className="h-4 w-4" />
                        Configuración
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/driver/help"
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Ayuda
                      </Link>
                    </SheetClose>
                  </li>
                </ul>
              </nav>
              <div className="py-4 border-t">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge variant={isOnline ? "default" : "outline"} className="flex items-center gap-1">
                      {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                      {isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full" onClick={toggleOnlineStatus}>
                      {isOnline ? "Cambiar a Offline" : "Cambiar a Online"}
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="destructive" className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/driver" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="Leche y Miel" width={40} height={40} className="h-8 w-auto" />
          <span className="text-lg hidden md:inline-block">Leche y Miel Delivery</span>
        </Link>

        {/* Status Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Badge variant={isOnline ? "default" : "outline"} className="flex items-center gap-1">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Mi Cuenta</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/driver/profile">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/driver/settings">Configuración</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/driver/help">Ayuda</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

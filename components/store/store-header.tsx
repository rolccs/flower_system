"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, User, Search, Menu, X, Heart, Phone } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function StoreHeader() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Simular carrito con algunos productos
  useState(() => {
    setCartCount(3)
  })

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-sm hidden md:block">Envío gratis en pedidos mayores a $200</div>
          <div className="flex items-center gap-4">
            <a href="tel:+13055551234" className="text-sm flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              (305) 555-1234
            </a>
            <div className="h-4 w-px bg-primary-foreground/30" />
            <Link href="/store/track-order" className="text-sm">
              Rastrear Pedido
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
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
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <Image src="/logo.png" alt="Leche y Miel" width={40} height={40} className="h-8 w-auto" />
                  <span className="text-lg">Leche y Miel</span>
                </Link>
              </div>
              <nav className="flex-1 py-4">
                <ul className="space-y-2">
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/store"
                        className={`block px-2 py-2 rounded-md ${
                          pathname === "/store" ? "bg-primary/10 text-primary font-medium" : ""
                        }`}
                      >
                        Inicio
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/store/products"
                        className={`block px-2 py-2 rounded-md ${
                          pathname === "/store/products" ? "bg-primary/10 text-primary font-medium" : ""
                        }`}
                      >
                        Productos
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/store/categories"
                        className={`block px-2 py-2 rounded-md ${
                          pathname === "/store/categories" ? "bg-primary/10 text-primary font-medium" : ""
                        }`}
                      >
                        Categorías
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/store/subscriptions"
                        className={`block px-2 py-2 rounded-md ${
                          pathname === "/store/subscriptions" ? "bg-primary/10 text-primary font-medium" : ""
                        }`}
                      >
                        Suscripciones
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/store/wholesale"
                        className={`block px-2 py-2 rounded-md ${
                          pathname === "/store/wholesale" ? "bg-primary/10 text-primary font-medium" : ""
                        }`}
                      >
                        Mayoreo
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/contact"
                        className={`block px-2 py-2 rounded-md ${
                          pathname === "/contact" ? "bg-primary/10 text-primary font-medium" : ""
                        }`}
                      >
                        Contacto
                      </Link>
                    </SheetClose>
                  </li>
                </ul>
              </nav>
              <div className="py-4 border-t">
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button asChild>
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" asChild>
                      <Link href="/register">Crear Cuenta</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="Leche y Miel" width={40} height={40} className="h-8 w-auto" />
          <span className="text-lg hidden md:inline-block">Leche y Miel</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/store"
            className={`text-sm font-medium ${pathname === "/store" ? "text-primary" : "text-foreground"}`}
          >
            Inicio
          </Link>
          <Link
            href="/store/products"
            className={`text-sm font-medium ${pathname === "/store/products" ? "text-primary" : "text-foreground"}`}
          >
            Productos
          </Link>
          <Link
            href="/store/categories"
            className={`text-sm font-medium ${pathname === "/store/categories" ? "text-primary" : "text-foreground"}`}
          >
            Categorías
          </Link>
          <Link
            href="/store/subscriptions"
            className={`text-sm font-medium ${
              pathname === "/store/subscriptions" ? "text-primary" : "text-foreground"
            }`}
          >
            Suscripciones
          </Link>
          <Link
            href="/store/wholesale"
            className={`text-sm font-medium ${pathname === "/store/wholesale" ? "text-primary" : "text-foreground"}`}
          >
            Mayoreo
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium ${pathname === "/contact" ? "text-primary" : "text-foreground"}`}
          >
            Contacto
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input type="search" placeholder="Buscar productos..." className="w-full md:w-[200px] h-9" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild>
            <Link href="/store/wishlist">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Lista de Deseos</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/store/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          <div className="hidden md:block">
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
                  <Link href="/login">Iniciar Sesión</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Crear Cuenta</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/store/orders">Mis Pedidos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/store/wishlist">Lista de Deseos</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

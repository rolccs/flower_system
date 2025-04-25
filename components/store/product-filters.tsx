"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 50])

  const categories = [
    { id: "roses", label: "Rosas" },
    { id: "tulips", label: "Tulipanes" },
    { id: "carnations", label: "Claveles" },
    { id: "lilies", label: "Lirios" },
    { id: "sunflowers", label: "Girasoles" },
    { id: "orchids", label: "Orquídeas" },
    { id: "seasonal", label: "Flores de Temporada" },
    { id: "hydrangeas", label: "Hortensias" },
  ]

  const colors = [
    { id: "red", label: "Rojo" },
    { id: "white", label: "Blanco" },
    { id: "yellow", label: "Amarillo" },
    { id: "pink", label: "Rosa" },
    { id: "purple", label: "Púrpura" },
    { id: "orange", label: "Naranja" },
    { id: "blue", label: "Azul" },
    { id: "multicolor", label: "Multicolor" },
  ]

  const origins = [
    { id: "colombia", label: "Colombia" },
    { id: "ecuador", label: "Ecuador" },
    { id: "holland", label: "Holanda" },
    { id: "peru", label: "Perú" },
    { id: "mexico", label: "México" },
    { id: "thailand", label: "Tailandia" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <Button variant="outline" size="sm" className="w-full">
          Limpiar Filtros
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "colors"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categorías</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={`category-${category.id}`} />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 50]} max={50} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center space-x-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="from">Desde</Label>
                  <div className="flex items-center">
                    <span className="mr-1">$</span>
                    <Input
                      type="number"
                      id="from"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="to">Hasta</Label>
                  <div className="flex items-center">
                    <span className="mr-1">$</span>
                    <Input
                      type="number"
                      id="to"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger>Colores</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox id={`color-${color.id}`} />
                  <Label htmlFor={`color-${color.id}`} className="text-sm font-normal cursor-pointer">
                    {color.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="origins">
          <AccordionTrigger>Origen</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {origins.map((origin) => (
                <div key={origin.id} className="flex items-center space-x-2">
                  <Checkbox id={`origin-${origin.id}`} />
                  <Label htmlFor={`origin-${origin.id}`} className="text-sm font-normal cursor-pointer">
                    {origin.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Disponibilidad</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" />
                <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                  En Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="subscription" />
                <Label htmlFor="subscription" className="text-sm font-normal cursor-pointer">
                  Disponible para Suscripción
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="consignment" />
                <Label htmlFor="consignment" className="text-sm font-normal cursor-pointer">
                  Disponible para Consignación
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4">
        <Button className="w-full">Aplicar Filtros</Button>
      </div>
    </div>
  )
}

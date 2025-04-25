"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InventoryData } from "@/lib/types"

export function InventoryOverview({ inventoryData }: { inventoryData: InventoryData[] }) {
  const [period, setPeriod] = useState("all")

  // Verificar si inventoryData es un arreglo válido y no está vacío
  if (!Array.isArray(inventoryData) || inventoryData.length === 0) {
    return <div>No hay datos de inventario disponibles</div>
  }

  // Procesar datos para el gráfico
  const categoryData = inventoryData.reduce(
    (acc, item) => {
      const category = item.Categoría
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += Number.parseInt(item.Stock)
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6) // Mostrar solo las 6 categorías principales

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center">
        <div className="grid gap-2">
          <CardTitle>Inventario por Categoría</CardTitle>
          <CardDescription>Distribución del stock actual por categoría de producto</CardDescription>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo</SelectItem>
              <SelectItem value="roses">Rosas</SelectItem>
              <SelectItem value="seasonal">Temporada</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Stock" fill="#e11d48" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

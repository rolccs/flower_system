"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const data = [
  {
    name: "Ene",
    Suscripciones: 45,
    Consignación: 28,
  },
  {
    name: "Feb",
    Suscripciones: 52,
    Consignación: 32,
  },
  {
    name: "Mar",
    Suscripciones: 49,
    Consignación: 35,
  },
  {
    name: "Abr",
    Suscripciones: 63,
    Consignación: 42,
  },
  {
    name: "May",
    Suscripciones: 58,
    Consignación: 45,
  },
  {
    name: "Jun",
    Suscripciones: 64,
    Consignación: 48,
  },
]

export function SubscriptionStats() {
  const [period, setPeriod] = useState("6m")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Estadísticas de Suscripciones</CardTitle>
          <CardDescription>Comparativa entre suscripciones y consignación</CardDescription>
        </div>
        <div className="ml-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mes</SelectItem>
              <SelectItem value="3m">3 meses</SelectItem>
              <SelectItem value="6m">6 meses</SelectItem>
              <SelectItem value="1y">1 año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Suscripciones" fill="#8884d8" />
            <Bar dataKey="Consignación" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

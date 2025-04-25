"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface MapPlaceholderProps {
  locations?: Array<{
    id: string
    name: string
    address: string
    status: string
  }>
  height?: string
  showControls?: boolean
}

export function MapPlaceholder({ locations = [], height = "400px", showControls = true }: MapPlaceholderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center bg-muted/30 rounded-md border" style={{ height }}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-md border overflow-hidden" style={{ height }}>
      {/* Imagen de mapa estática */}
      <div className="absolute inset-0 bg-muted/10">
        <Image
          src="/map-background.png"
          alt="Mapa de entregas"
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
      </div>

      {/* Marcadores de ubicación */}
      {locations.map((location, index) => {
        // Posicionar marcadores en diferentes lugares del mapa
        const top = 20 + ((index * 15) % 60)
        const left = 20 + ((index * 18) % 80)

        return (
          <div
            key={location.id}
            className="absolute z-10 w-6 h-6 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:bg-rose-600 transition-colors"
            style={{ top: `${top}%`, left: `${left}%` }}
            title={`${location.name}: ${location.address}`}
          >
            {index + 1}
          </div>
        )
      })}

      {/* Controles del mapa */}
      {showControls && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-100">
            <span className="text-xl">+</span>
          </button>
          <button className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-100">
            <span className="text-xl">−</span>
          </button>
        </div>
      )}

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md text-xs">
        <div className="flex items-center gap-2">
          <span className="block w-3 h-3 rounded-full bg-rose-500"></span>
          <span>Ubicaciones de entrega ({locations.length})</span>
        </div>
      </div>
    </div>
  )
}

import type { InventoryData, ServiceData } from "./types"

// Función para obtener datos del inventario
export async function getInventoryData(): Promise<InventoryData[]> {
  try {
    // En un entorno real, esto podría ser una llamada a una API o base de datos
    // Para este ejemplo, usamos los datos del CSV proporcionado
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inventario_leche_y_miel_2025-04-24%20%282%29-MauXBJ1Hnqv2koNsviaIv5npYufCrU.csv",
    )
    const csvText = await response.text()

    // Parsear CSV manualmente (en un entorno real usaríamos una biblioteca)
    const rows = csvText.split("\n")
    const headers = rows[0].split(",")

    const data: InventoryData[] = []

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue // Saltar filas vacías

      const values = rows[i].split(",")
      const item: any = {}

      headers.forEach((header, index) => {
        item[header.trim()] = values[index]?.trim() || ""
      })

      data.push(item as InventoryData)
    }

    return data
  } catch (error) {
    console.error("Error al cargar datos de inventario:", error)

    // Datos de respaldo en caso de error
    return [
      {
        ID: "C001",
        Producto: "Clavel Blanco",
        Categoría: "Claveles",
        Descripción: "Clavel estándar de gran tamaño y pétalos firmes",
        Color: "Blanco",
        "50 cm ($)": "12",
        "60 cm ($)": "14",
        "70 cm ($)": "7",
        "Precio Fijo": "7",
        Bonche: "25 tallos",
        Stock: "65",
        "Stock Mínimo": "10",
        Temporada: "Todo el año",
        "Vida Útil Aprox": "14-21 días",
        "País de Origen": "Colombia",
        "Cuidados Especiales": "Cortar tallos en diagonal, agua limpia",
        "Disponible Suscripción": "Sí",
        "Disponible Consignación": "Sí",
      },
      {
        ID: "R001",
        Producto: "Rosa Roja Premium",
        Categoría: "Rosas",
        Descripción: "Rosa de tallo largo con botón grande y color intenso",
        Color: "Rojo",
        "50 cm ($)": "15",
        "60 cm ($)": "18",
        "70 cm ($)": "22",
        "Precio Fijo": null,
        Bonche: "25 tallos",
        Stock: "120",
        "Stock Mínimo": "30",
        Temporada: "Todo el año",
        "Vida Útil Aprox": "7-14 días",
        "País de Origen": "Ecuador",
        "Cuidados Especiales": "Cambiar agua cada 2 días, mantener alejado de frutas",
        "Disponible Suscripción": "Sí",
        "Disponible Consignación": "Sí",
      },
      {
        ID: "T001",
        Producto: "Tulipán Amarillo",
        Categoría: "Tulipanes",
        Descripción: "Tulipán de color amarillo brillante con tallo firme",
        Color: "Amarillo",
        "50 cm ($)": "14",
        "60 cm ($)": "16",
        "70 cm ($)": "18",
        "Precio Fijo": null,
        Bonche: "10 tallos",
        Stock: "45",
        "Stock Mínimo": "15",
        Temporada: "Primavera",
        "Vida Útil Aprox": "5-7 días",
        "País de Origen": "Holanda",
        "Cuidados Especiales": "Agua fría, cortar 1cm del tallo cada 2 días",
        "Disponible Suscripción": "Sí",
        "Disponible Consignación": "No",
      },
    ]
  }
}

// Función para obtener datos de servicios
export async function getServicesData(): Promise<ServiceData[]> {
  try {
    // En un entorno real, esto podría ser una llamada a una API o base de datos
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Catalogo_Servicios_Unificado-A6hHaIQDPqy9aq58jSsylCx3gOuj7c.csv",
    )
    const csvText = await response.text()

    // Parsear CSV manualmente
    const rows = csvText.split("\n")
    const headers = rows[0].split(",")

    const data: ServiceData[] = []

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue // Saltar filas vacías

      const values = rows[i].split(",")
      const item: any = {}

      headers.forEach((header, index) => {
        item[header.trim()] = values[index]?.trim() || ""
      })

      data.push(item as ServiceData)
    }

    return data
  } catch (error) {
    console.error("Error al cargar datos de servicios:", error)

    // Datos de respaldo en caso de error
    return [
      {
        ID: "6c9eacbb-8f1b-4e27-80fc-9f7cbd57b4a6",
        "Código de Servicio": "6c9eacbb-8f1b-4e27-80fc-9f7cbd57b4a6",
        Producto: "Spider",
        Categoría: "Producto para Suscripción",
        Descripción: "Margaritas completamente amarillas, alegres y luminosas",
        Color: "-",
        "Tipo de Servicio": "Suscripción",
        "50 cm ($)": "12",
        "60 cm ($)": "14",
        "70 cm ($)": "3.8",
        Precio: null,
        "Precio Fijo": "8.99",
        Bonche: "20 tallos",
        Stock: "55",
        Temporada: "Primavera-Verano",
        "Vida Útil Aprox": "5-8 días",
        "País de Origen": "Colombia",
        "Cuidados Especiales": "Mantener en lugar fresco y ventilado",
        "Código GS1": "7503344218849",
      },
    ]
  }
}

// Función para obtener datos del catálogo completo
export async function getCatalogData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Catalogo_Flores_Completo-ppyFLNbDaHUnIyW9uLON5vqMGqGyzQ.csv",
    )
    const csvText = await response.text()

    // Parsear CSV manualmente
    const rows = csvText.split("\n")
    const headers = rows[0].split(",")

    const data = []

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue // Saltar filas vacías

      const values = rows[i].split(",")
      const item = {}

      headers.forEach((header, index) => {
        item[header.trim()] = values[index]?.trim() || ""
      })

      data.push(item)
    }

    return data
  } catch (error) {
    console.error("Error al cargar datos del catálogo:", error)
    return []
  }
}

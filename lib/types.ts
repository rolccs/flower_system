export interface InventoryData {
  ID: string
  Producto: string
  Categoría: string
  Descripción: string
  Color: string
  "50 cm ($)": string
  "60 cm ($)": string
  "70 cm ($)": string
  "Precio Fijo": string | null
  Bonche: string
  Stock: string
  "Stock Mínimo": string
  Temporada: string
  "Vida Útil Aprox": string
  "País de Origen": string
  "Cuidados Especiales": string
  "Disponible Suscripción"?: string
  "Disponible Consignación"?: string
}

export interface ServiceData {
  ID: string
  "Código de Servicio": string
  Producto: string
  Categoría: string
  Descripción: string
  Color: string
  "Tipo de Servicio": string
  "50 cm ($)"?: string
  "60 cm ($)"?: string
  "70 cm ($)"?: string
  Precio?: string | null
  "Precio Fijo"?: string
  Bonche?: string
  Stock?: string
  Temporada?: string
  "Vida Útil Aprox"?: string
  "País de Origen"?: string
  "Cuidados Especiales"?: string
  "Código GS1"?: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  sku: string
  barcode: string | null
  gtin: string | null
  qrCode: string | null
  price: number
  price50cm: number | null
  price60cm: number | null
  price70cm: number | null
  stock: number
  minStock: number
  color: string | null
  image: string | null
  metadata: string | null
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

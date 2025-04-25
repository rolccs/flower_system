import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Configuración de la conexión a Neon Database
const sql = neon(process.env.DATABASE_URL!)

// Crear una instancia de Drizzle con la conexión a Neon
export const db = drizzle(sql)

// Función para ejecutar consultas SQL directamente
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params)
  } catch (error) {
    console.error("Error ejecutando consulta SQL:", error)
    throw error
  }
}

// Función para verificar la conexión con la base de datos
export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT NOW()`
    console.log("Conexión a la base de datos establecida:", result)
    return true
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error)
    return false
  }
}

// Exportamos la instancia de SQL para uso directo
export { sql }

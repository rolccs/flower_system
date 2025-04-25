import { Pool } from "pg"

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/lecheymielfloreria",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Función para ejecutar consultas SQL
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Función para obtener una conexión del pool
export async function getClient() {
  const client = await pool.connect()
  const query = client.query.bind(client)
  const release = client.release.bind(client)

  // Sobrescribir la función de liberación para registrar cuando se libera una conexión
  client.release = () => {
    client.query = () => {
      throw new Error("Error: Llamada a query después de liberar la conexión")
    }
    return release()
  }

  return {
    query,
    release: client.release,
  }
}

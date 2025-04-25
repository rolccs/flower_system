import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function setupDatabase() {
  try {
    console.log("🔄 Iniciando configuración de la base de datos...")

    // Generar cliente Prisma
    console.log("🔄 Generando cliente Prisma...")
    await execAsync("npx prisma generate")
    console.log("✅ Cliente Prisma generado correctamente")

    // Ejecutar migraciones
    console.log("🔄 Ejecutando migraciones...")
    await execAsync("npx prisma migrate dev --name init")
    console.log("✅ Migraciones ejecutadas correctamente")

    // Ejecutar seed
    console.log("🔄 Sembrando datos iniciales...")
    await execAsync("npx prisma db seed")
    console.log("✅ Datos iniciales sembrados correctamente")

    console.log("✅ Base de datos configurada correctamente")
  } catch (error) {
    console.error("❌ Error al configurar la base de datos:", error)
    process.exit(1)
  }
}

setupDatabase()

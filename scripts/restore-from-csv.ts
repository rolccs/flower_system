#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { program } from "commander"
import { importFullBackup, importDataFromCSV } from "../lib/services/backup-service"
import type { BackupEntity } from "../lib/services/backup-service"

// Configurar el CLI
program
  .name("restore-from-csv")
  .description("Herramienta para restaurar el sistema desde archivos CSV")
  .version("1.0.0")

// Comando para restaurar todo el sistema
program
  .command("full")
  .description("Restaurar todo el sistema desde un directorio de backup")
  .argument("<directory>", "Directorio que contiene los archivos CSV de backup")
  .option("-d, --dry-run", "Simular la restauración sin realizar cambios", false)
  .option("-o, --overwrite", "Sobrescribir datos existentes", false)
  .action(async (directory, options) => {
    try {
      console.log("Iniciando restauración completa del sistema...")
      console.log(`Directorio: ${directory}`)
      console.log(`Modo simulación: ${options.dryRun ? "Sí" : "No"}`)
      console.log(`Sobrescribir datos: ${options.overwrite ? "Sí" : "No"}`)

      // Verificar que el directorio existe
      if (!fs.existsSync(directory)) {
        console.error(`Error: El directorio ${directory} no existe`)
        process.exit(1)
      }

      // Realizar la restauración
      const result = await importFullBackup(directory, {
        dryRun: options.dryRun,
        overwrite: options.overwrite,
      })

      if (result.success) {
        console.log("\n✅ Restauración completada con éxito")
        console.log(result.message)
      } else {
        console.error("\n❌ Error en la restauración")
        console.error(result.message)
        process.exit(1)
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      process.exit(1)
    }
  })

// Comando para restaurar una entidad específica
program
  .command("entity")
  .description("Restaurar una entidad específica desde un archivo CSV")
  .argument("<entity>", "Entidad a restaurar (products, categories, customers, etc.)")
  .argument("<file>", "Archivo CSV con los datos")
  .option("-d, --dry-run", "Simular la restauración sin realizar cambios", false)
  .option("-o, --overwrite", "Sobrescribir datos existentes", false)
  .action(async (entity, file, options) => {
    try {
      // Validar la entidad
      const validEntities: BackupEntity[] = [
        "products",
        "categories",
        "customers",
        "orders",
        "invoices",
        "subscriptions",
        "consignments",
        "deliveries",
        "users",
        "config",
      ]

      if (!validEntities.includes(entity as BackupEntity)) {
        console.error(`Error: Entidad inválida. Las entidades válidas son: ${validEntities.join(", ")}`)
        process.exit(1)
      }

      // Verificar que el archivo existe
      if (!fs.existsSync(file)) {
        console.error(`Error: El archivo ${file} no existe`)
        process.exit(1)
      }

      console.log(`Iniciando restauración de ${entity}...`)
      console.log(`Archivo: ${file}`)
      console.log(`Modo simulación: ${options.dryRun ? "Sí" : "No"}`)
      console.log(`Sobrescribir datos: ${options.overwrite ? "Sí" : "No"}`)

      // Realizar la restauración
      const result = await importDataFromCSV(entity as BackupEntity, file, {
        dryRun: options.dryRun,
        overwrite: options.overwrite,
      })

      if (result.success) {
        console.log("\n✅ Restauración completada con éxito")
        console.log(result.message)
      } else {
        console.error("\n❌ Error en la restauración")
        console.error(result.message)
        process.exit(1)
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      process.exit(1)
    }
  })

// Comando para verificar la integridad de los archivos CSV
program
  .command("verify")
  .description("Verificar la integridad de los archivos CSV de backup")
  .argument("<directory>", "Directorio que contiene los archivos CSV de backup")
  .action(async (directory) => {
    try {
      console.log("Verificando integridad de los archivos CSV...")

      // Verificar que el directorio existe
      if (!fs.existsSync(directory)) {
        console.error(`Error: El directorio ${directory} no existe`)
        process.exit(1)
      }

      // Listar archivos CSV en el directorio
      const files = fs.readdirSync(directory).filter((file) => file.endsWith(".csv"))

      if (files.length === 0) {
        console.log("No se encontraron archivos CSV en el directorio")
        process.exit(0)
      }

      console.log(`Se encontraron ${files.length} archivos CSV:`)

      // Verificar cada archivo
      let allValid = true

      for (const file of files) {
        const filePath = path.join(directory, file)

        try {
          // Leer las primeras líneas para verificar la estructura
          const content = fs.readFileSync(filePath, "utf8")
          const lines = content.split("\n")

          if (lines.length < 2) {
            console.log(`❌ ${file}: Archivo vacío o sin datos`)
            allValid = false
            continue
          }

          // Verificar que la primera línea tenga encabezados
          const headers = lines[0].split(",")
          if (headers.length < 2) {
            console.log(`❌ ${file}: Formato de encabezado inválido`)
            allValid = false
            continue
          }

          // Verificar que al menos una línea de datos tenga el mismo número de columnas
          const firstDataLine = lines[1].split(",")
          if (firstDataLine.length !== headers.length) {
            console.log(`❌ ${file}: Inconsistencia en el número de columnas`)
            allValid = false
            continue
          }

          console.log(`✅ ${file}: Válido (${lines.length - 1} registros)`)
        } catch (error) {
          console.log(
            `❌ ${file}: Error al leer el archivo - ${error instanceof Error ? error.message : String(error)}`,
          )
          allValid = false
        }
      }

      if (allValid) {
        console.log("\n✅ Todos los archivos CSV son válidos")
      } else {
        console.log("\n❌ Se encontraron problemas en algunos archivos CSV")
        process.exit(1)
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      process.exit(1)
    }
  })

// Ejecutar el programa
program.parse()

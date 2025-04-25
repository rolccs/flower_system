# Guía de Recuperación del Sistema

Este documento proporciona instrucciones detalladas sobre cómo recuperar el sistema en caso de fallo o cuando se necesita migrar a un nuevo servidor.

## Requisitos Previos

- Acceso a los archivos de respaldo (CSV o SQL)
- Node.js v16 o superior
- PostgreSQL 13 o superior
- Permisos de administrador en el servidor

## Métodos de Recuperación

Existen dos métodos principales para recuperar el sistema:

1. **Restauración desde respaldo SQL** - Más rápido, restaura el estado exacto de la base de datos
2. **Restauración desde archivos CSV** - Más flexible, permite restaurar entidades específicas o migrar entre diferentes versiones del sistema

## Método 1: Restauración desde Respaldo SQL

### Paso 1: Preparar el Entorno

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/tu-empresa/flower-wholesale-system.git
cd flower-wholesale-system

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con los datos de conexión a la base de datos
\`\`\`

### Paso 2: Restaurar la Base de Datos

\`\`\`bash
# Restaurar desde el archivo SQL
psql -U usuario -d nombre_base_datos < ruta/al/archivo/backup_fecha.sql
\`\`\`

### Paso 3: Verificar la Restauración

\`\`\`bash
# Iniciar el sistema
npm run dev

# Verificar que todo funciona correctamente
# Acceder a http://localhost:3000
\`\`\`

## Método 2: Restauración desde Archivos CSV

Este método es útil cuando:
- No se dispone de un respaldo SQL completo
- Se necesita migrar datos entre diferentes versiones del sistema
- Se quieren restaurar solo ciertas entidades

### Paso 1: Preparar el Entorno

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/tu-empresa/flower-wholesale-system.git
cd flower-wholesale-system

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con los datos de conexión a la base de datos

# Crear la estructura de la base de datos
npx prisma migrate deploy
\`\`\`

### Paso 2: Utilizar el Script de Restauración

El sistema incluye un script especializado para restaurar datos desde archivos CSV.

#### Restauración Completa

\`\`\`bash
# Restaurar todo el sistema desde un directorio de backup
npm run restore-from-csv full ruta/al/directorio/backup

# Opciones adicionales:
# --dry-run: Simular la restauración sin realizar cambios
# --overwrite: Sobrescribir datos existentes
\`\`\`

#### Restauración de Entidades Específicas

\`\`\`bash
# Restaurar solo los productos
npm run restore-from-csv entity products ruta/al/archivo/products.csv

# Restaurar solo los clientes
npm run restore-from-csv entity customers ruta/al/archivo/customers.csv
\`\`\`

#### Verificar la Integridad de los Archivos CSV

\`\`\`bash
# Verificar que los archivos CSV son válidos antes de restaurar
npm run restore-from-csv verify ruta/al/directorio/backup
\`\`\`

### Paso 3: Verificar la Restauración

\`\`\`bash
# Iniciar el sistema
npm run dev

# Verificar que todo funciona correctamente
# Acceder a http://localhost:3000
\`\`\`

## Orden de Restauración Recomendado

Si restauras entidades individualmente, sigue este orden para respetar las dependencias:

1. Configuración (`config`)
2. Categorías (`categories`)
3. Productos (`products`)
4. Clientes (`customers`)
5. Usuarios (`users`)
6. Pedidos (`orders`)
7. Facturas (`invoices`)
8. Suscripciones (`subscriptions`)
9. Consignaciones (`consignments`)
10. Entregas (`deliveries`)

## Solución de Problemas

### Error: Violación de Restricción de Clave Foránea

Este error ocurre cuando se intenta restaurar una entidad que depende de otra que aún no ha sido restaurada.

**Solución**: Sigue el orden de restauración recomendado.

### Error: Duplicación de Clave Primaria

Este error ocurre cuando se intenta insertar un registro con un ID que ya existe en la base de datos.

**Solución**: Usa la opción `--overwrite` para sobrescribir los datos existentes.

### Error: Formato de CSV Inválido

**Solución**: Verifica la integridad de los archivos CSV con el comando `verify`.

## Contacto de Soporte

Si encuentras problemas durante la recuperación, contacta al equipo de soporte:

- Email: soporte@tu-empresa.com
- Teléfono: +1 (555) 123-4567

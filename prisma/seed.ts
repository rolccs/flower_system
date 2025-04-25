import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@lecheymiel.com" },
    update: {},
    create: {
      email: "admin@lecheymiel.com",
      name: "Administrador",
      password: adminPassword,
      role: "admin",
      permissions: "all,users,inventory,orders,invoices",
    },
  })

  console.log({ admin })

  // Create categories
  const categories = [
    { name: "Rosas", description: "Diferentes variedades de rosas" },
    { name: "Tulipanes", description: "Tulipanes importados" },
    { name: "Girasoles", description: "Girasoles de diferentes tamaños" },
    { name: "Lirios", description: "Lirios de diferentes colores" },
    { name: "Orquídeas", description: "Orquídeas exóticas" },
    { name: "Claveles", description: "Claveles de diferentes colores" },
    { name: "Margaritas", description: "Margaritas frescas" },
    { name: "Gerberas", description: "Gerberas coloridas" },
    { name: "Crisantemos", description: "Crisantemos de temporada" },
    { name: "Follaje", description: "Follaje decorativo" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  console.log("Categories created")

  // Create customers
  const customers = [
    {
      name: "María González",
      firstName: "María",
      lastName: "González",
      email: "maria@example.com",
      phone: "555-1234",
      address: "Calle Principal 123",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      type: "Individual",
      purchaseHistory: JSON.stringify([]),
      subscriptionDetails: JSON.stringify({}),
    },
    {
      name: "Empresas Flores S.A.",
      email: "info@empresasflores.com",
      phone: "555-5678",
      address: "Av. Comercial 456",
      city: "Miami Beach",
      state: "FL",
      zipCode: "33139",
      type: "Empresa",
      purchaseHistory: JSON.stringify([]),
      subscriptionDetails: JSON.stringify({}),
    },
    {
      name: "Juan Pérez",
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan@example.com",
      phone: "555-9876",
      address: "Calle Secundaria 789",
      city: "Coral Gables",
      state: "FL",
      zipCode: "33134",
      type: "Individual",
      purchaseHistory: JSON.stringify([]),
      subscriptionDetails: JSON.stringify({}),
    },
    {
      name: "Hotel Magnolia",
      email: "reservas@hotelmagnolia.com",
      phone: "555-4321",
      address: "101 Cedar Blvd",
      city: "Brickell",
      state: "FL",
      zipCode: "33131",
      type: "Empresa",
      purchaseHistory: JSON.stringify([]),
      subscriptionDetails: JSON.stringify({}),
    },
    {
      name: "Decoraciones Primavera",
      email: "info@decoracionesprimavera.com",
      phone: "555-8765",
      address: "202 Elm St",
      city: "Doral",
      state: "FL",
      zipCode: "33122",
      type: "Empresa",
      purchaseHistory: JSON.stringify([]),
      subscriptionDetails: JSON.stringify({}),
    },
  ]

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { email: customer.email! },
      update: {},
      create: customer,
    })
  }

  console.log("Customers created")

  // Get categories to create products
  const rosasCategory = await prisma.category.findFirst({ where: { name: "Rosas" } })
  const tulipanesCategory = await prisma.category.findFirst({ where: { name: "Tulipanes" } })
  const girasolesCategory = await prisma.category.findFirst({ where: { name: "Girasoles" } })
  const liriosCategory = await prisma.category.findFirst({ where: { name: "Lirios" } })
  const orquideasCategory = await prisma.category.findFirst({ where: { name: "Orquídeas" } })
  const clavelesCategory = await prisma.category.findFirst({ where: { name: "Claveles" } })

  // Create products
  if (
    rosasCategory &&
    tulipanesCategory &&
    girasolesCategory &&
    liriosCategory &&
    orquideasCategory &&
    clavelesCategory
  ) {
    const products = [
      {
        name: "Rosas Rojas",
        description: "Rosas rojas de alta calidad, perfectas para ocasiones románticas.",
        sku: "ROSA-001",
        barcode: "1234567890123",
        price: 12.0,
        price50cm: 12.0,
        price60cm: 14.0,
        price70cm: 16.0,
        stock: 150,
        minStock: 20,
        color: "Rojo",
        categoryId: rosasCategory.id,
      },
      {
        name: "Rosas Blancas",
        description: "Rosas blancas elegantes para bodas y eventos especiales.",
        sku: "ROSA-002",
        barcode: "1234567890124",
        price: 12.0,
        price50cm: 12.0,
        price60cm: 14.0,
        price70cm: 16.0,
        stock: 120,
        minStock: 20,
        color: "Blanco",
        categoryId: rosasCategory.id,
      },
      {
        name: "Rosas Rosadas",
        description: "Rosas rosadas para expresar gratitud y aprecio.",
        sku: "ROSA-003",
        barcode: "1234567890125",
        price: 12.0,
        price50cm: 12.0,
        price60cm: 14.0,
        price70cm: 16.0,
        stock: 100,
        minStock: 20,
        color: "Rosa",
        categoryId: rosasCategory.id,
      },
      {
        name: "Tulipanes Amarillos",
        description: "Tulipanes amarillos importados, ideales para regalar.",
        sku: "TUL-001",
        barcode: "2234567890123",
        price: 15.0,
        price50cm: 15.0,
        price60cm: 18.0,
        price70cm: 20.0,
        stock: 80,
        minStock: 10,
        color: "Amarillo",
        categoryId: tulipanesCategory.id,
      },
      {
        name: "Tulipanes Rojos",
        description: "Tulipanes rojos importados, símbolo de amor perfecto.",
        sku: "TUL-002",
        barcode: "2234567890124",
        price: 15.0,
        price50cm: 15.0,
        price60cm: 18.0,
        price70cm: 20.0,
        stock: 65,
        minStock: 10,
        color: "Rojo",
        categoryId: tulipanesCategory.id,
      },
      {
        name: "Girasoles",
        description: "Girasoles de gran tamaño, ideales para decoración.",
        sku: "GIR-001",
        barcode: "3234567890123",
        price: 10.0,
        price50cm: 10.0,
        price60cm: 12.0,
        price70cm: 14.0,
        stock: 50,
        minStock: 10,
        color: "Amarillo",
        categoryId: girasolesCategory.id,
      },
      {
        name: "Lirios Blancos",
        description: "Lirios blancos elegantes para eventos especiales.",
        sku: "LIR-001",
        barcode: "4234567890123",
        price: 14.0,
        price50cm: 14.0,
        price60cm: 16.0,
        price70cm: 18.0,
        stock: 120,
        minStock: 15,
        color: "Blanco",
        categoryId: liriosCategory.id,
      },
      {
        name: "Lirios Rosados",
        description: "Lirios rosados para ocasiones especiales.",
        sku: "LIR-002",
        barcode: "4234567890124",
        price: 14.0,
        price50cm: 14.0,
        price60cm: 16.0,
        price70cm: 18.0,
        stock: 90,
        minStock: 15,
        color: "Rosa",
        categoryId: liriosCategory.id,
      },
      {
        name: "Orquídeas Púrpura",
        description: "Orquídeas exóticas de larga duración.",
        sku: "ORQ-001",
        barcode: "5234567890123",
        price: 25.0,
        price50cm: 25.0,
        price60cm: 30.0,
        price70cm: 35.0,
        stock: 40,
        minStock: 15,
        color: "Púrpura",
        categoryId: orquideasCategory.id,
      },
      {
        name: "Orquídeas Blancas",
        description: "Orquídeas blancas elegantes para bodas.",
        sku: "ORQ-002",
        barcode: "5234567890124",
        price: 25.0,
        price50cm: 25.0,
        price60cm: 30.0,
        price70cm: 35.0,
        stock: 35,
        minStock: 15,
        color: "Blanco",
        categoryId: orquideasCategory.id,
      },
      {
        name: "Clavel Blanco",
        description: "Clavel estándar de gran tamaño y pétalos firmes",
        sku: "CLAV-001",
        barcode: "6234567890123",
        price: 7.0,
        price50cm: 7.0,
        price60cm: 9.0,
        price70cm: 11.0,
        stock: 65,
        minStock: 10,
        color: "Blanco",
        categoryId: clavelesCategory.id,
      },
      {
        name: "Clavel Rojo",
        description: "Clavel rojo intenso, ideal para arreglos florales",
        sku: "CLAV-002",
        barcode: "6234567890124",
        price: 7.0,
        price50cm: 7.0,
        price60cm: 9.0,
        price70cm: 11.0,
        stock: 70,
        minStock: 10,
        color: "Rojo",
        categoryId: clavelesCategory.id,
      },
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      })
    }

    console.log("Products created")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

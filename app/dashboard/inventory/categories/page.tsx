import { CategoryManagement } from "@/components/inventory/category-management"

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Categorías</h1>
        <p className="text-muted-foreground">Administra las categorías de productos del sistema.</p>
      </div>

      <CategoryManagement />
    </div>
  )
}

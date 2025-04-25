import { StoreHeader } from "@/components/store/store-header"
import { ShoppingCartComponent } from "@/components/store/shopping-cart"

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <ShoppingCartComponent />
        </div>
      </main>
    </div>
  )
}

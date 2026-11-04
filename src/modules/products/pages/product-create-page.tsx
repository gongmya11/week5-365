import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, PlusCircle } from "lucide-react"
import { Card } from "@/core/components/ui/card"
import { useCreateProductMutation } from "../hooks/use-products-query"
import type { ProductInput } from "../types/product"
import { ProductForm } from "../components/product-form"

export default function ProductCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateProductMutation()

  const handleCreate = async (input: ProductInput) => {
    try {
      const created = await createMutation.mutateAsync(input)
      navigate(`/products/${created.id}`)
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách sản phẩm
        </Link>
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <PlusCircle className="size-5" />
            </div>
            <div>
              <Card.Title>Tạo sản phẩm mới</Card.Title>
              <Card.Description>
                Điền các thông tin chi tiết để thêm sản phẩm vào kho (TanStack
                Mutation)
              </Card.Description>
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          <ProductForm
            isSubmitting={createMutation.isPending}
            onSubmit={handleCreate}
            onReset={() => navigate("/products")}
          />
        </Card.Content>
      </Card>
    </div>
  )
}

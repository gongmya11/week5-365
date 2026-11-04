import { useEffect, useState } from "react"
import { LoaderCircle, Plus, RefreshCw, Upload, Save } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Textarea } from "@/core/components/ui/textarea"
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  type Product,
  type ProductInput,
  type ProductStatus,
} from "../types/product"
import { deriveStatusFromQuantity } from "../utils/product-format"

interface ProductFormProps {
  initialData?: Product | null
  isSubmitting?: boolean
  isEditMode?: boolean
  onSubmit: (input: ProductInput) => Promise<void | boolean>
  onReset?: () => void
}

export function ProductForm({
  initialData,
  isSubmitting = false,
  isEditMode = false,
  onSubmit,
  onReset,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [category, setCategory] = useState(initialData?.category ?? "")
  const [price, setPrice] = useState(
    initialData ? String(initialData.price) : ""
  )
  const [quantity, setQuantity] = useState(
    initialData ? String(initialData.quantity) : ""
  )
  const [status, setStatus] = useState<ProductStatus>(
    initialData?.status ?? "Còn hàng"
  )
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "")
  const [fileName, setFileName] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cập nhật giá trị khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setCategory(initialData.category)
      setPrice(String(initialData.price))
      setQuantity(String(initialData.quantity))
      setStatus(initialData.status)
      setDescription(initialData.description || "")
      setImageUrl(initialData.imageUrl || "")
    }
  }, [initialData])

  // Tự động tính trạng thái khi số lượng thay đổi nếu không phải edit thủ công
  const handleQuantityChange = (val: string) => {
    setQuantity(val)
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      setStatus(deriveStatusFromQuantity(num))
    }
  }

  // Xử lý chọn ảnh từ máy tính (convert data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setImageUrl(event.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReset = () => {
    if (initialData) {
      setName(initialData.name)
      setCategory(initialData.category)
      setPrice(String(initialData.price))
      setQuantity(String(initialData.quantity))
      setStatus(initialData.status)
      setDescription(initialData.description || "")
      setImageUrl(initialData.imageUrl || "")
    } else {
      setName("")
      setCategory("")
      setPrice("")
      setQuantity("")
      setStatus("Còn hàng")
      setDescription("")
      setImageUrl("")
      setFileName("")
    }
    setErrors({})
    onReset?.()
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = "Vui lòng nhập tên sản phẩm"
    if (!category) errs.category = "Vui lòng chọn danh mục"
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      errs.price = "Giá phải là số hợp lệ và lớn hơn hoặc bằng 0"
    }
    if (quantity === "" || isNaN(Number(quantity)) || Number(quantity) < 0) {
      errs.quantity = "Số lượng phải là số nguyên không âm"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const parsedPrice = Number(price)
    const parsedQuantity = parseInt(quantity, 10)
    const finalStatus = status || deriveStatusFromQuantity(parsedQuantity)

    const payload: ProductInput = {
      name: name.trim(),
      category,
      price: parsedPrice,
      quantity: parsedQuantity,
      status: finalStatus,
      description: description.trim(),
      imageUrl:
        imageUrl.trim() ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    }

    const res = await onSubmit(payload)
    if (res !== false && !isEditMode) {
      handleReset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Tên sản phẩm, Danh mục, Giá */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Tên sản phẩm <span className="text-rose-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm"
            disabled={isSubmitting}
            className={`mt-1.5 h-10 ${errors.name ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Danh mục <span className="text-rose-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            className={`mt-1.5 h-10 w-full rounded-lg border bg-background px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              errors.category ? "border-rose-500" : "border-input"
            }`}
          >
            <option value="">Chọn danh mục</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Giá (VNĐ) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Nhập giá sản phẩm"
            disabled={isSubmitting}
            min={0}
            className={`mt-1.5 h-10 ${errors.price ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
          )}
        </div>
      </div>

      {/* Row 2: Số lượng, Mô tả, Hình ảnh */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Số lượng <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            placeholder="Nhập số lượng"
            disabled={isSubmitting}
            min={0}
            className={`mt-1.5 h-10 ${errors.quantity ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.quantity && (
            <p className="mt-1 text-xs text-rose-500">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Mô tả
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả sản phẩm (tùy chọn)"
            disabled={isSubmitting}
            rows={2}
            className="mt-1.5 min-h-[40px] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Hình ảnh
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <label className="flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-input bg-muted/60 px-3 text-sm font-medium text-foreground hover:bg-muted">
              <Upload className="mr-1.5 size-4 text-muted-foreground" />
              Chọn file
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>
            <span className="truncate text-xs text-muted-foreground">
              {fileName ||
                (imageUrl ? "Đã có ảnh" : "Chưa có file nào được chọn")}
            </span>
          </div>
          {imageUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img
                src={imageUrl}
                alt="Xem trước"
                className="size-10 rounded border border-border object-cover"
              />
              <span className="max-w-[180px] truncate text-xs text-muted-foreground">
                Xem trước ảnh
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Row trạng thái nếu ở chế độ sửa */}
      {isEditMode && (
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-foreground">
            Trạng thái hàng
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            disabled={isSubmitting}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {PRODUCT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 bg-blue-600 px-5 font-medium text-white hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Đang lưu...
            </>
          ) : isEditMode ? (
            <>
              <Save className="size-4" />
              Lưu thay đổi
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Thêm sản phẩm
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="size-4" />
          Làm mới
        </Button>
      </div>
    </form>
  )
}

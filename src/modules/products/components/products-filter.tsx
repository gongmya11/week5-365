import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from "../types/product"

interface ProductsFilterProps {
  initialSearch?: string
  initialCategory?: string
  initialStatus?: string
  onFilterChange: (filters: {
    search: string
    category: string
    status: string
  }) => void
}

export function ProductsFilter({
  initialSearch = "",
  initialCategory = "",
  initialStatus = "",
  onFilterChange,
}: ProductsFilterProps) {
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [status, setStatus] = useState(initialStatus)

  const handleApply = () => {
    onFilterChange({
      search: searchInput.trim(),
      category,
      status,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply()
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setCategory(val)
    onFilterChange({
      search: searchInput.trim(),
      category: val,
      status,
    })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setStatus(val)
    onFilterChange({
      search: searchInput.trim(),
      category,
      status: val,
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Tìm kiếm tên sản phẩm */}
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm theo tên sản phẩm..."
          className="h-10 rounded-lg border-input bg-background pr-3 pl-9 text-sm focus-visible:ring-primary"
        />
      </div>

      {/* Lọc danh mục */}
      <div className="w-full sm:w-48">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Tất cả danh mục</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Lọc trạng thái */}
      <div className="w-full sm:w-48">
        <select
          value={status}
          onChange={handleStatusChange}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Tất cả trạng thái</option>
          {PRODUCT_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Nút tìm kiếm */}
      <Button
        type="button"
        onClick={handleApply}
        className="h-10 gap-1.5 bg-blue-600 px-5 text-white hover:bg-blue-700"
      >
        <Search className="size-4" />
        Tìm kiếm
      </Button>
    </div>
  )
}

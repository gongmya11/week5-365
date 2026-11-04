import { PRODUCT_STATUS_CONFIG, type ProductStatus } from "../types/product"

interface ProductStatusBadgeProps {
  status: ProductStatus
  className?: string
}

export function ProductStatusBadge({
  status,
  className = "",
}: ProductStatusBadgeProps) {
  const config = PRODUCT_STATUS_CONFIG[status] || {
    label: status,
    badgeClass: "bg-muted text-muted-foreground border-border",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.badgeClass} ${className}`}
    >
      {config.label}
    </span>
  )
}

import type { Product } from "../types/product"
import { formatProductDate, formatVND } from "./product-format"

/**
 * Xuất danh sách sản phẩm ra file CSV (tương thích Excel có BOM UTF-8)
 */
export function exportProductsToExcel(
  products: Product[],
  fileName = "danh-sach-san-pham.csv"
): void {
  if (!products.length) return

  const headers = [
    "STT",
    "Mã sản phẩm",
    "Tên sản phẩm",
    "Danh mục",
    "Giá (VNĐ)",
    "Số lượng",
    "Trạng thái",
    "Ngày tạo",
    "Mô tả",
  ]

  const rows = products.map((item, index) => [
    index + 1,
    `"${item.id}"`,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.category}"`,
    `"${formatVND(item.price)}"`,
    item.quantity,
    `"${item.status}"`,
    `"${formatProductDate(item.createdAt)}"`,
    `"${(item.description || "").replace(/"/g, '""')}"`,
  ])

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

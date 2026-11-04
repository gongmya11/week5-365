/**
 * Định dạng số tiền sang định dạng tiền tệ Việt Nam (Ví dụ: 28,990,000)
 */
export function formatVND(amount: number): string {
  if (isNaN(amount)) return "0"
  return new Intl.NumberFormat("vi-VN").format(amount)
}

/**
 * Định dạng ngày tháng năm hiển thị (Ví dụ: 10/04/2024)
 */
export function formatProductDate(dateStr: string): string {
  if (!dateStr) return ""
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateStr
  }
}

/**
 * Tự động tính trạng thái từ số lượng
 */
export function deriveStatusFromQuantity(
  quantity: number
): "Còn hàng" | "Sắp hết" | "Hết hàng" {
  if (quantity <= 0) return "Hết hàng"
  if (quantity < 10) return "Sắp hết"
  return "Còn hàng"
}

import {Product} from "@/interfaces/product.ts";

export interface Quote {
  id: number
  customer_email: string
  quote_number: string
  total: number
  created_at: string
  updated_at: string
  is_active: number
  quote_items: QuoteItem[]
}

export interface QuoteItem {
  id: number
  quote_id: number
  product_id: number
  quantity: number
  created_at: string
  updated_at: string
  product: Product
}

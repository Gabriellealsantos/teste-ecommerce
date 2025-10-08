import { OrderItem } from "./OrderItem.ts";

export interface OrderDetails {
  order_id: number;
  customer_name: string;
  total_amount: number;
  items: OrderItem[];
}
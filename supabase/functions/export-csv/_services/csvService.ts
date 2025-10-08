import { OrderItem } from "../_lib/OrderItem.ts";
import { OrderDetails } from "../_lib/OrderDetails.ts";

export function generateOrderCsv(orderDetails: OrderDetails): string {
  let csv = "product_name,quantity,price\n";
  orderDetails.items.forEach((item: OrderItem) => {
    const productName = item.product_name.includes(",")
      ? `"${item.product_name}"`
      : item.product_name;
    csv += `${productName},${item.quantity},${item.price}\n`;
  });
  csv += `\nTotal,,${orderDetails.total_amount}`;
  return csv;
}

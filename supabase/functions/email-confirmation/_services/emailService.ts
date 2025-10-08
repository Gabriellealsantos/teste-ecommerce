import { OrderDetails } from "../_lib/types.ts";

// Simula o envio de um e-mail de confirmação
export function sendConfirmationEmail(orderDetails: OrderDetails): void {
  const emailHtml = `
    <h1>Olá, ${orderDetails.customer_name}!</h1>
    <p>Seu pedido #${orderDetails.order_id} foi recebido com sucesso.</p>
    <p>Total: R$ ${orderDetails.total_amount}</p>
    <p>Obrigado por comprar conosco!</p>
  `

  console.log("---- ENVIANDO E-MAIL ----");
  console.log(`Destinatário: (email do cliente aqui)`);
  console.log(`Assunto: Confirmação do Pedido #${orderDetails.order_id}`);
  console.log(`Corpo: ${emailHtml}`);
  console.log("-------------------------");
}
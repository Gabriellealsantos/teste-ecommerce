import { corsHeaders } from "../_shared/cors.ts";
import { getOrderDetails } from "./_lib/supabaseClient.ts";
import { payload } from "../_shared/payload.ts";
import { sendConfirmationEmail } from "./_services/emailService.ts";
import { getUserByAuthorization } from "../_shared/user.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getUserByAuthorization(
      req.headers.get("Authorization")!,
    );
    const { order_id }: payload = await req.json();

    const orderDetails = await getOrderDetails(order_id, user.id);

    sendConfirmationEmail(orderDetails);

    return new Response(
      JSON.stringify({
        message:
          `E-mail de confirmação para o pedido ${order_id} enviado (simulado).`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      const isAccessDenied = error.message.includes("acesso negado") ||
        error.message.includes("não encontrado");
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: isAccessDenied ? 404 : 401,
      });
    }
    return new Response(
      JSON.stringify({ error: "Ocorreu um erro inesperado." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

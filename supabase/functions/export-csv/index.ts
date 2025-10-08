import { createClient } from "supabase";
import { payload } from "../_shared/payload.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { generateOrderCsv } from "./_services/csvService.ts";
import { getUserByAuthorization } from "../_shared/user.ts";
import { OrderDetails } from "./_lib/OrderDetails.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    await getUserByAuthorization(req.headers.get("Authorization")!);
    const { order_id }: payload = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { data: orderData, error: queryError } = await supabaseClient
      .from("order_details")
      .select("*")
      .eq("order_id", order_id)
      .maybeSingle();

    if (queryError || !orderData) {
      throw new Error("Pedido não encontrado ou acesso negado.");
    }

    const csvContent = generateOrderCsv(orderData as OrderDetails);
    const headers = {
      ...corsHeaders,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedido_${order_id}.csv"`,
    };

    return new Response(csvContent, { headers, status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      const isAccessDenied = error.message.includes("acesso negado") ||
        error.message.includes("não encontrado");
      const isAuthError = error.message.includes("authorization") ||
        error.message.includes("JWT") ||
        error.message.includes("Connection refused");

      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: isAccessDenied ? 404 : (isAuthError ? 401 : 500),
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

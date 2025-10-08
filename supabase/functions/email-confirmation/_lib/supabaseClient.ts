import { createClient } from 'npm:@supabase/supabase-js@2'
import { Database } from '../../_shared/database-types.ts'
import { OrderDetails } from './types.ts'

const supabaseClient = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

export async function getOrderDetails(orderId: number, userId: string): Promise<OrderDetails> {
  const { data: orderData, error: orderError } = await supabaseClient
    .from('order_details')
    .select('*') 
    .eq('order_id', orderId)
    .eq('customer_id', userId)
    .maybeSingle()

  if (orderError || !orderData) {
    throw new Error("Pedido não encontrado ou acesso negado.");
  }

  return orderData as OrderDetails;
}
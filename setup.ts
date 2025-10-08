import { createClient } from "npm:@supabase/supabase-js@2";
import { config } from "https://deno.land/x/dotenv/mod.ts";

await config({ path: "./.env", export: true });

const SUPABASE_URL = Deno.env.get("MY_SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("MY_SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Erro: As variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não foram definidas.");
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const testUsers = [
  {
    email: "Lara@email.com",
    password: "password123",
    profile: { full_name: "Lara Silva", cpf: "11111111111", phone: "11911111111" },
    orders: [{ items: [{ product_id: 1, quantity: 1 }, { product_id: 2, quantity: 2 }] }],
  },
  {
    email: "Gabriel@email.com",
    password: "password123",
    profile: { full_name: "Gabriel Souza", cpf: "22222222222", phone: "22922222222" },
    orders: [{ items: [{ product_id: 3, quantity: 1 }] }],
  },
];

async function setup() {
  console.log("🔹 Iniciando setup dos dados de teste...");

  const products = [
    { id: 1, name: "Laptop Pro", description: "Um laptop muito potente", price: 5000 },
    { id: 2, name: "Mouse Sem Fio", description: "Mouse ergonômico", price: 150.50 },
    { id: 3, name: "Teclado Mecânico", description: "Teclado para gamers", price: 350.75 },
  ];

  await supabase.from("products").upsert(products, { onConflict: "id" });
  console.log("✅ Produtos inseridos.");

  for (const userData of testUsers) {
    let userId = '';

    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
    });

    if (createData.user) {
      userId = createData.user.id;
    } else if (createError && createError.message.includes("User already registered")) {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
        email: userData.email
      });

      if (listError) {
        console.error(`❌ Erro ao buscar usuário existente ${userData.email}:`, listError.message);
        continue;
      }
      if (users.length > 0) {
        userId = users[0].id;
      }
    } else if (createError) {
  
      console.error(`❌ Erro ao criar usuário ${userData.email}:`, createError.message);
      continue;
    }
    

    if (!userId) {
      console.error(`❌ Não foi possível obter o ID do usuário para ${userData.email}.`);
      continue;
    }
    
    console.log(`✅ Usuário processado: ${userData.email} (ID: ${userId})`);

    await supabase.from("profiles").upsert({ id: userId, ...userData.profile });
    console.log(`✅ Perfil criado/atualizado para ${userData.email}`);

    for (const order of userData.orders) {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({ customer_id: userId, status: "pending" })
        .select("id")
        .single();

      if (orderError || !orderData) {
        console.error("❌ Erro ao criar pedido:", orderError?.message);
        continue;
      }

      const orderId = orderData.id;
      const orderItems = order.items.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      
      await supabase.from("order_items").upsert(orderItems);
      console.log(`✅ Pedido #${orderId} e itens inseridos. O total será calculado pela trigger.`);
    }
  }

  console.log("\n🎉 Setup concluído! O banco de dados está populado.");
}

setup();
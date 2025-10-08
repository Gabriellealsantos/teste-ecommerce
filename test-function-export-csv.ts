import { createClient } from "npm:@supabase/supabase-js@2";
import { config } from "https://deno.land/x/dotenv/mod.ts";

await config({ path: "./.env", export: true });

const SUPABASE_URL = Deno.env.get("MY_SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("MY_SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("MY_SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Erro: Garanta que SUPABASE_URL, SUPABASE_ANON_KEY, e SUPABASE_SERVICE_ROLE_KEY estão no seu arquivo .env");
  Deno.exit(1);
}

const DEFAULT_EMAIL = 'Gabriel@email.com';
const DEFAULT_ORDER_ID = '2';

const TEST_USER_EMAIL = Deno.args[0] || DEFAULT_EMAIL;
const ORDER_ID_TO_TEST = parseInt(Deno.args[1] || DEFAULT_ORDER_ID, 10);
const TEST_USER_PASSWORD = 'password123';
const FUNCTION_TO_TEST = 'export-csv';


async function runTest() {
  console.log(`\n▶️  Iniciando teste para o usuário: ${TEST_USER_EMAIL}`);
  console.log(`▶️  Alvo: Função '${FUNCTION_TO_TEST}' para o Pedido #${ORDER_ID_TO_TEST}`);

  const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

  console.log(`[AUTH] Autenticando...`);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  if (authError || !authData.session?.access_token) {
    console.error("❌ Falha na autenticação:", authError?.message || "Token não encontrado.");
    return;
  }
  console.log("[AUTH] Autenticado com sucesso!");
  const userToken = authData.session.access_token;

  const adminSupabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
  console.log(`[DEBUG] Invocando a função...`);
  const { data, error } = await adminSupabase.functions.invoke(FUNCTION_TO_TEST, {
    body: { order_id: ORDER_ID_TO_TEST },
    headers: { 'Authorization': `Bearer ${userToken}` },
  });

  if (error) {
    console.error("\n❌ TESTE FALHOU (Como esperado para acesso negado):");
    console.error(`   - Status: ${error.context.status}`);
    console.error(`   - Mensagem:`, await error.context.json());
  } else {
    console.log("\n✅ SUCESSO! Conteúdo do CSV:");
    console.log(data);
    
    try {
      const fileName = `./pedido_${ORDER_ID_TO_TEST}_${TEST_USER_EMAIL.split('@')[0]}.csv`;
      await Deno.writeTextFile(fileName, data);
      console.log(`\n✅ Arquivo ${fileName} salvo com sucesso!`);
    } catch (e) {
      console.error("❌ Erro ao salvar o arquivo:", e);
    }
  }
}

runTest();
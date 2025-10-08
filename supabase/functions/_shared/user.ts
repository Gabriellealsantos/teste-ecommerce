import { createClient } from 'npm:@supabase/supabase-js@2'

export async function getUserByAuthorization(authorizationHeader: string) {
  if (!authorizationHeader) {
    throw new Error('Cabeçalho de autorização ausente.');
  }
  const jwt = authorizationHeader.replace('Bearer ', '');

  // Usando as variáveis que o Supabase injeta automaticamente
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
   Deno.env.get('SUPABASE_ANON_KEY')!
  );

  const { data: { user }, error } = await supabaseClient.auth.getUser(jwt);

  if (error) { throw new Error(`Autenticação falhou: ${error.message}`); }
  if (!user) { throw new Error('Usuário não encontrado.'); }
  return user;
}
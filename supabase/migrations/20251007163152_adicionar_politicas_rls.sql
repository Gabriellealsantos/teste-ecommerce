alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;


-- Tabela PROFILES: Usuários só podem ver e editar seus próprios perfis.
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Tabela PRODUCTS: Qualquer usuário autenticado pode ver os produtos.
create policy "Authenticated users can view products" on public.products
  for select to authenticated using (true);

-- Tabela ORDERS: Usuários só podem ver e criar seus próprios pedidos.
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = customer_id);

create policy "Users can create their own orders" on public.orders
  for insert with check (auth.uid() = customer_id);

-- Tabela ORDER_ITEMS: Usuários podem ver/criar itens apenas para seus próprios pedidos.
create policy "Users can view items of their own orders" on public.order_items
  for select using (
    auth.uid() = (
      select customer_id from public.orders where id = order_id
    )
);

create policy "Users can insert items to their own orders" on public.order_items
  for insert with check (
    auth.uid() = (
      select customer_id from public.orders where id = order_id
    )
);
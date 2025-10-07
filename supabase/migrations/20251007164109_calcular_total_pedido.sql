--  Função para calcular e atualizar o total de um pedido
create or replace function public.update_order_total()
returns trigger as $$
declare
  order_total numeric;
begin
  if (TG_OP = 'INSERT' or TG_OP = 'UPDATE') then
    select sum(p.price * oi.quantity) into order_total
    from public.order_items oi
    join public.products p on oi.product_id = p.id
    where oi.order_id = NEW.order_id;


    update public.orders
    set total_amount = order_total
    where id = NEW.order_id;

  elsif (TG_OP = 'DELETE') then
    select sum(p.price * oi.quantity) into order_total
    from public.order_items oi
    join public.products p on oi.product_id = p.id
    where oi.order_id = OLD.order_id;
    

    update public.orders
    set total_amount = coalesce(order_total, 0)
    where id = OLD.order_id;
  end if;

  return null; 
end;
$$ language plpgsql security definer;

create trigger on_order_items_change
  after insert or update or delete on public.order_items
  for each row execute procedure public.update_order_total();
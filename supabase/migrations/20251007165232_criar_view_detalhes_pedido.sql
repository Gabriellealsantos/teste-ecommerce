create or replace view public.order_details as
  select
    o.id as order_id,
    o.created_at as order_date,
    o.status as order_status,
    o.total_amount,
    p.full_name as customer_name,
    p.id as customer_id,
    json_agg(
      json_build_object(
        'product_id', pr.id,
        'product_name', pr.name,
        'quantity', oi.quantity,
        'price', pr.price
      )
    ) as items
  from public.orders as o
  join public.profiles as p on o.customer_id = p.id
  join public.order_items as oi on o.id = oi.order_id
  join public.products as pr on oi.product_id = pr.id
  group by
    o.id, p.full_name, p.id;
-- Inserindo dois usuários de teste para podermos testar o RLS
insert into auth.users (id, email, encrypted_password, role) values
('8a532b2e-5268-4a34-859a-3022e35275b9', 'cliente1@email.com', crypt('password123', gen_salt('bf')), 'authenticated'),
('f8d46a6d-8e6f-4f8a-9a7f-3c5e8b4d1b1c', 'cliente2@email.com', crypt('password123', gen_salt('bf')), 'authenticated');

-- Inserindo os perfis correspondentes para os usuários
insert into public.profiles (id, full_name, cpf, phone) values
('8a532b2e-5268-4a34-859a-3022e35275b9', 'Cliente Um da Silva', '11111111111', '11911111111'),
('f8d46a6d-8e6f-4f8a-9a7f-3c5e8b4d1b1c', 'Cliente Dois de Souza', '22222222222', '22922222222');

-- Inserindo alguns produtos de teste
insert into public.products (name, description, price) values
('Laptop Pro', 'Um laptop muito potente', 5000.00),
('Mouse Sem Fio', 'Mouse ergonômico', 150.50),
('Teclado Mecânico', 'Teclado para gamers', 350.75);

-- Criando um pedido para o Cliente 1
insert into public.orders (customer_id) values ('8a532b2e-5268-4a34-859a-3022e35275b9');

-- Adicionando itens ao pedido do Cliente 1
insert into public.order_items (order_id, product_id, quantity) values
(1, 1, 1), -- 1 Laptop Pro (5000.00)
(1, 2, 2); -- 2 Mouse Sem Fio (2 * 150.50 = 301.00)
-- O total deste pedido deve ser 5301.00

-- Criando um pedido para o Cliente 2
insert into public.orders (customer_id) values ('f8d46a6d-8e6f-4f8a-9a7f-3c5e8b4d1b1c');

-- Adicionando itens ao pedido do Cliente 2
insert into public.order_items (order_id, product_id, quantity) values
(2, 3, 1); -- 1 Teclado Mecânico (350.75)
-- O total deste pedido deve ser 350.75
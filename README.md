# 🛍️ Teste Técnico — Backend E-commerce com Supabase

## 📖 Visão Geral do Projeto

Este projeto implementa o **backend de um sistema de e-commerce** utilizando a plataforma **[Supabase](https://supabase.com)**, conforme os requisitos do teste técnico.  
A solução foi projetada com foco em **segurança, manutenibilidade e boas práticas**, explorando recursos nativos do Supabase como **RLS, funções SQL, triggers, views e Edge Functions**.

---

## ⚙️ Funcionalidades Implementadas

| Funcionalidade | Descrição |
|----------------|------------|
| ✅ **Criação de Tabelas** | `profiles`, `products`, `orders` e `order_items` para o gerenciamento de usuários, produtos e pedidos. |
| 🔒 **Segurança com RLS (Row-Level Security)** | Políticas configuradas em todas as tabelas para garantir que cada usuário acesse apenas seus próprios dados. |
| ⚡ **Função e Trigger Automatizados** | Função `update_order_total` e trigger associada para calcular automaticamente o valor total de cada pedido. |
| 🧾 **View para Consultas Eficientes** | View `order_details` criada para facilitar e otimizar a consulta completa de pedidos. |
| 🌐 **Edge Functions** | Implementadas duas funções serverless para automação de tarefas: |
| ├── `export-csv` | Exporta os itens de um pedido em formato CSV. |
| └── `email-confirmation` | Simula o envio de um e-mail de confirmação de pedido. |

---

## 🚀 Como Executar o Projeto Localmente

### 🧩 Pré-requisitos
Antes de iniciar, instale:
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Deno](https://deno.land)

---

### 1️⃣ Iniciar o Ambiente Supabase

Na raiz do projeto, execute:

```bash
supabase start
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie uma cópia do arquivo .env.example e renomeie para .env.
Em seguida, preencha com os valores obtidos:

```bash
MY_SUPABASE_URL=http://127.0.0.1:54321
MY_SUPABASE_SERVICE_ROLE_KEY= SUA-CHAVE-AQUI
MY_SUPABASE_ANON_KEY = 'SUA-CHAVE-AQUI' 
MY_SUPABASE_SERVICE_KEY = 'SUA-CHAVE-AQUI'
```

### 3️⃣ Popular o Banco de Dados

Execute o script de setup para criar usuários de teste, produtos e pedidos:

```bash
deno run --allow-read --allow-env --allow-net setup.ts
```

### 4️⃣ Iniciar as Edge Functions

Sirva as funções localmente:

```bash
supabase functions serve --env-file ./.env
```

### 🧪 Testes de Validação

Testes foram criados para validar o funcionamento e as regras de segurança das Edge Functions.

🔸 Exportação de CSV
### ✅ Caso de sucesso: Lara acessando seu próprio pedido (ID 1)
```bash
deno run --allow-read --allow-env --allow-net test-function.ts Lara@email.com 1
```

### ❌ Caso de falha: Gabriel tentando acessar o pedido de Lara (ID 1)
```bash
deno run --allow-read --allow-env --allow-net test-function.ts Gabriel@email.com 1
```

🔸 Envio de E-mail de Confirmação
### ✅ Caso de sucesso: Lara solicitando e-mail para seu pedido (ID 1)
```bash
deno run --allow-read --allow-env --allow-net test-email-function.ts Lara@email.com 1
```

### 🧱 Estrutura do Projeto
```bash
📦 backend-ecommerce-supabase/
│
├── supabase/
│   ├── migrations/           # Scripts SQL para criação de tabelas, views e funções
│   └── functions/
│       ├── export-csv/       # Edge Function para exportar CSV
│       └── email-confirmation/ # Edge Function para envio de e-mail simulado
│
├── _shared/                  # Utilitários e funções comuns entre Edge Functions
├── _services/                # Serviços auxiliares (ex: geração de CSV)
├── setup.ts                  # Script para popular o banco com dados de exemplo
├── test-function.ts          # Teste para exportação de CSV
├── test-email-function.ts    # Teste para envio de e-mail
└── README.md
```

## 👨‍💻 Autor

**Gabriel Leal Santos**  
📍 Sapeaçu - BA  
📧 [gabriel.lealsantos@hotmail.com](mailto:gabriel.lealsantos@hotmail.com)  
🔗 [LinkedIn](https://linkedin.com/in/Gabriel-Leal-Santos) | [GitHub](https://github.com/Gabriellealsantos)


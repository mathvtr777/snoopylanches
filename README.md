# Snoopy Lanchonete e Hamburgueria - Cardápio Digital 🍔

Cardápio digital moderno, profissional e responsivo desenvolvido sob medida para a **Snoopy Lanchonete e Hamburgueria**.

> *"Sabor que todo mundo ama!"*

---

## 🚀 Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 (Tema escuro profissional com detalhes em vermelho e amarelo)
- **Ícones:** Lucide React
- **Banco de Dados:** SQLite integrado via `better-sqlite3` (persistência local e de alta performance)
- **Integração:** WhatsApp API (Link oficial formatado para o número `(84) 99151-7640`)

---

## ✨ Funcionalidades Principais

### 1. Cardápio Público
- **Identidade Visual:** Design moderno de aplicativo de delivery, fundo predominantemente escuro, destaque para cores da marca (preto, vermelho e amarelo).
- **Categorias Dinâmicas com Scroll Suave:**
  - Hambúrgueres artesanais na brasa
  - Porções crocantes
  - Pratos Executivos (Cuscuz com carne de sol na nata, guisado, etc.)
  - Combos Especiais (Família, Duo e Individuais)
  - Bebidas e Refrigerantes
  - Sucos na Água e Sucos no Leite
  - Açaí com seletor de até 4 recheios e 1 cobertura
  - Pastéis sequinhos
  - Cachorro-Quente completo
  - Milk-Shakes cremosos de 400ml
- **Busca em Tempo Real:** Pesquisa instantânea por nome, ingredientes ou categoria.
- **Modal de Personalização:**
  - Escolha de quantidade (+ / -)
  - Escolha de recheios e coberturas para Açaí
  - Escolha de opções de hambúrgueres para combos familiares
  - Escolha de sabores para milk-shake e refrigerantes
  - Campo aberto para observações do cliente (ex: *sem cebola, maionese à parte*)

### 2. Carrinho de Compras Interativo
- Contador dinâmico de itens
- Atualização em tempo real de subtotais e valores
- Gaveta lateral (Cart Drawer) e botão flutuante mobile persistente
- Persistência no navegador (`localStorage`) para que o cliente não perca seu pedido

### 3. Checkout e Cálculo de Frete
- **Pergunta inicial:** *"Como deseja receber seu pedido?"*
  - **Entrega em domicílio:** Exige nome, telefone/WhatsApp, seleção de bairro com taxa calculada automaticamente, rua, número, complemento e ponto de referência.
  - **Retirada no estabelecimento:** Exige nome e telefone, isento de taxa de entrega.
- **Sistema de Bairros:** Bairros com taxas cadastradas pela própria lanchonete. Se o bairro não estiver cadastrado, o cliente é orientado a consultar disponibilidade via WhatsApp.
- **Formas de Pagamento:**
  - Cartão de Crédito (na maquininha)
  - Cartão de Débito (na maquininha)
  - Pix (com chave da lanchonete exibida e botão de cópia rápida)

### 4. Integração com WhatsApp
- Ao clicar em *"Enviar Pedido pelo WhatsApp"*, o sistema:
  1. Registra o pedido com código sequencial no banco de dados SQLite;
  2. Limpa o carrinho de compras;
  3. Abre o WhatsApp com a mensagem formatada conforme o modelo exigido, com todos os dados do cliente, endereço (quando entrega), itens detalhados, observações, resumo financeiro e forma de pagamento.

### 5. Painel Administrativo (`/admin`)
- **Protegido por Senha:**
  - Senha padrão de acesso: `snoopy123` (editável diretamente no painel).
- **Gestão de Produtos:**
  - Criar novos produtos
  - Editar preços, descrições, fotos e categorias
  - Marcar produtos como *Indisponíveis/Esgotados* sem excluí-los
  - Excluir produtos
- **Gestão de Bairros e Taxas:**
  - Cadastrar novos bairros e definir taxas em R$
  - Ativar ou desativar bairros
  - Editar tempo médio de entrega
- **Opções e Personalizações:**
  - Adicionar e desativar recheios e coberturas do Açaí
  - Gerenciar sabores de Milk-Shake
- **Histórico de Pedidos:**
  - Visualizar todos os pedidos enviados pelo cardápio
  - Acompanhar status (*Pendente, Em preparo, Saiu para entrega, Concluído, Cancelado*)
- **Configurações Gerais:**
  - Alterar o número do WhatsApp de recebimento (padrão: `5584991517640`)
  - Abrir ou fechar a loja (status *Aberto / Fechado* em tempo real no topo)
  - Alterar horário de funcionamento e tempo médio de entrega
  - Configurar chave Pix

---

## 🛠️ Como Executar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor em modo desenvolvimento
npm run dev

# Gerar build otimizado de produção
npm run build

# Iniciar servidor em modo produção
npm run start
```

O aplicativo estará disponível em:
- **Cardápio Público:** [http://localhost:3000](http://localhost:3000)
- **Painel Administrativo:** [http://localhost:3000/admin](http://localhost:3000/admin) (Senha: `snoopy123`)

import Database from 'better-sqlite3';

const db = new Database(':memory:');

// Inicialização de tabelas
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      image_url TEXT,
      is_active INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      options_config TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS neighborhoods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      fee REAL NOT NULL,
      is_active INTEGER DEFAULT 1,
      estimated_time TEXT DEFAULT '30-45 min'
    );

    CREATE TABLE IF NOT EXISTS customization_options (
      id TEXT PRIMARY KEY,
      group_type TEXT NOT NULL, -- 'acai_filling', 'acai_topping', 'milkshake_flavor', 'drink_flavor', 'combo_option'
      name TEXT NOT NULL,
      price REAL DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS store_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      order_type TEXT NOT NULL,
      address_json TEXT,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      delivery_fee REAL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDefaultData();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/refrigerante-1l.png'
    WHERE id = 'prod-refri-1l'
      AND image_url = 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/refrigerante-lata-350ml.png'
    WHERE id = 'prod-refri-lata'
      AND image_url = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-caju.png'
    WHERE id = 'prod-suco-agua-caju'
      AND image_url = 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-caju.png'
    WHERE id = 'prod-suco-leite-caju'
      AND image_url = 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-goiaba.png'
    WHERE id = 'prod-suco-agua-goiaba'
      AND image_url = 'https://images.unsplash.com/photo-1546883446-2433f4a080eb?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-goiaba.png'
    WHERE id = 'prod-suco-leite-goiaba'
      AND image_url = 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-graviola.png'
    WHERE id = 'prod-suco-agua-graviola'
      AND image_url = 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-graviola.png'
    WHERE id = 'prod-suco-leite-graviola'
      AND image_url = 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-uva.png'
    WHERE id = 'prod-suco-agua-uva'
      AND image_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-uva.png'
    WHERE id = 'prod-suco-leite-uva'
      AND image_url = 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-morango.png'
    WHERE id = 'prod-suco-agua-morango'
      AND image_url = 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-morango.png'
    WHERE id = 'prod-suco-leite-morango'
      AND image_url = 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-caja.png'
    WHERE id = 'prod-suco-agua-caja'
      AND image_url = 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/suco-caja.png'
    WHERE id = 'prod-suco-leite-caja'
      AND image_url = 'https://images.unsplash.com/photo-1546883446-2433f4a080eb?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/tapioca-carne-de-sol.png'
    WHERE id = 'prod-tapioca-carne-sol-nata'
      AND image_url = 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/tapioca-frango.png'
    WHERE id = 'prod-tapioca-frango'
      AND image_url = 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80'
  `).run();
  db.prepare(`
    UPDATE products
    SET image_url = '/images/products/tapioca-calabresa.png'
    WHERE id = 'prod-tapioca-calabresa'
      AND image_url = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
  `).run();
}

function seedDefaultData() {
  const catCount = db.prepare('SELECT count(*) as count FROM categories').get() as { count: number };
  if (catCount.count > 0) {
    return; // Já populado
  }

  // 1. Configurações da loja
  const insertSetting = db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)');
  const defaultSettings: [string, string][] = [
    ['store_name', 'Snoopy Lanchonete e Hamburgueria'],
    ['slogan', 'Sabor que todo mundo ama!'],
    ['whatsapp_number', '5584991517640'],
    ['address', 'Rua Principal, Centro'],
    ['is_open', '1'],
    ['opening_hours', '18:00 às 23:30'],
    ['delivery_time', '35-50 min'],
    ['delivery_fee', '3.00'],
    ['min_order', '10.00'],
    ['pix_key', '84991517640'],
    ['pix_key_type', 'Telefone'],
    ['admin_password', 'snoopy123']
  ];

  for (const [key, val] of defaultSettings) {
    insertSetting.run(key, val);
  }

  // 2. Categorias
  const insertCat = db.prepare('INSERT INTO categories (id, slug, name, icon, sort_order) VALUES (?, ?, ?, ?, ?)');
  const categories = [
    { id: 'cat-hamburgueres', slug: 'hamburgueres', name: 'Hambúrgueres', icon: 'Flame', sort_order: 1 },
    { id: 'cat-combos', slug: 'combos', name: 'Combos Especiais', icon: 'UtensilsCrossed', sort_order: 2 },
    { id: 'cat-porcoes', slug: 'porcoes', name: 'Porções', icon: 'Salad', sort_order: 3 },
    { id: 'cat-pratos', slug: 'pratos-executivos', name: 'Pratos Executivos', icon: 'Soup', sort_order: 4 },
    { id: 'cat-acai', slug: 'acai', name: 'Açaí', icon: 'Sparkles', sort_order: 5 },
    { id: 'cat-pasteis', slug: 'pasteis', name: 'Pastéis', icon: 'ChefHat', sort_order: 6 },
    { id: 'cat-tapiocas', slug: 'tapiocas', name: 'Tapiocas', icon: 'Wheat', sort_order: 7 },
    { id: 'cat-hotdog', slug: 'cachorro-quente', name: 'Cachorro-Quente', icon: 'Sandwich', sort_order: 8 },
    { id: 'cat-milkshake', slug: 'milk-shakes', name: 'Milk-Shakes', icon: 'IceCream', sort_order: 9 },
    { id: 'cat-sucos-agua', slug: 'sucos-agua', name: 'Sucos na Água', icon: 'GlassWater', sort_order: 10 },
    { id: 'cat-sucos-leite', slug: 'sucos-leite', name: 'Sucos no Leite', icon: 'Milk', sort_order: 11 },
    { id: 'cat-bebidas', slug: 'bebidas', name: 'Bebidas', icon: 'CupSoda', sort_order: 12 },
  ];

  for (const cat of categories) {
    insertCat.run(cat.id, cat.slug, cat.name, cat.icon, cat.sort_order);
  }

  // 3. Opções de Personalização (Açaí recheios/coberturas, sabores milkshake, etc.)
  const insertOption = db.prepare('INSERT INTO customization_options (id, group_type, name, price, is_active) VALUES (?, ?, ?, ?, ?)');

  // Recheios de Açaí
  const acaiFillings = [
    'Leite em Pó',
    'Granola Crocante',
    'Paçoca',
    'Banana Fatiada',
    'Morango Fresco',
    'Gotas de Chocolate',
    'Leite Condensado',
    'Flocos de Arroz',
    'Castanha Triturada',
    'Amendoim'
  ];
  acaiFillings.forEach((name, idx) => {
    insertOption.run(`fill-${idx + 1}`, 'acai_filling', name, 0, 1);
  });

  // Coberturas de Açaí
  const acaiToppings = [
    'Calda de Chocolate',
    'Calda de Morango',
    'Calda de Caramelo',
    'Mel de Abelha',
    'Calda de Maracujá',
    'Sem Calda'
  ];
  acaiToppings.forEach((name, idx) => {
    insertOption.run(`top-${idx + 1}`, 'acai_topping', name, 0, 1);
  });

  // Sabores de Milkshake
  const milkshakeFlavors = [
    'Chocolate Belga',
    'Morango Especial',
    'Ovomaltine Crocante',
    'Ninho com Nutella',
    'Baunilha Tradicional',
    'Maracujá Gourmet'
  ];
  milkshakeFlavors.forEach((name, idx) => {
    insertOption.run(`ms-${idx + 1}`, 'milkshake_flavor', name, 0, 1);
  });

  // Opções para Combo 4 Família
  insertOption.run('combo4-opt1', 'combo_option', '3 PCQ', 0, 1);
  insertOption.run('combo4-opt2', 'combo_option', '3 Snoopy Clássico', 0, 1);

  // 4. Bairros e Taxas de Entrega
  const insertNeigh = db.prepare('INSERT INTO neighborhoods (id, name, fee, is_active, estimated_time) VALUES (?, ?, ?, ?, ?)');
  const neighborhoods = [
    { id: 'bairro-1', name: 'Centro', fee: 3.00, time: '25-35 min' },
    { id: 'bairro-2', name: 'Nova Descoberta', fee: 3.00, time: '30-40 min' },
    { id: 'bairro-3', name: 'Bela Vista', fee: 3.00, time: '30-45 min' },
    { id: 'bairro-4', name: 'Boa Passagem', fee: 3.00, time: '35-45 min' },
    { id: 'bairro-5', name: 'Paraíba', fee: 3.00, time: '35-50 min' },
    { id: 'bairro-6', name: 'Castelo Branco', fee: 3.00, time: '35-50 min' },
    { id: 'bairro-7', name: 'Samanaú', fee: 3.00, time: '40-55 min' },
    { id: 'bairro-8', name: 'Maynard', fee: 3.00, time: '30-45 min' },
    { id: 'bairro-9', name: 'Soledade', fee: 3.00, time: '40-50 min' },
    { id: 'bairro-10', name: 'Vila do Príncipe', fee: 3.00, time: '40-55 min' },
    { id: 'bairro-11', name: 'Walfredo Gurgel', fee: 3.00, time: '35-45 min' },
    { id: 'bairro-12', name: 'Barra Nova', fee: 3.00, time: '40-50 min' },
  ];
  for (const n of neighborhoods) {
    insertNeigh.run(n.id, n.name, n.fee, 1, n.time);
  }

  // 5. Produtos Completos conforme o Briefing
  const insertProd = db.prepare(`
    INSERT INTO products (
      id, category_id, name, slug, description, price, original_price, image_url, is_active, is_featured, options_config, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    // HAMBÚRGUERES
    {
      id: 'prod-pcq-kids',
      category_id: 'cat-hamburgueres',
      name: 'Snoopy PCQ Kids',
      slug: 'snoopy-pcq-kids',
      description: 'Pão brioche fofinho, hambúrguer artesanal na brasa de 50g, generoso queijo cheddar cremoso e maionese especial temperada da casa.',
      price: 9.90,
      original_price: 12.00,
      image_url: '/images/products/snoopy-pcq-kids.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 1
    },
    {
      id: 'prod-pcq',
      category_id: 'cat-hamburgueres',
      name: 'Snoopy PCQ',
      slug: 'snoopy-pcq',
      description: 'Pão brioche selado na manteiga, burger suculento na brasa de 125g, queijo cheddar derretido e nossa maionese temperada artesanal.',
      price: 13.90,
      original_price: null,
      image_url: '/images/products/snoopy-pcq.jpg',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 2
    },
    {
      id: 'prod-classico',
      category_id: 'cat-hamburgueres',
      name: 'Snoopy Clássico',
      slug: 'snoopy-classico',
      description: 'Pão brioche tostado, hambúrguer na brasa de 125g, queijo cheddar, alface americana fresca, tomate maduro, cebola roxa crocante e maionese temperada.',
      price: 16.90,
      original_price: 18.90,
      image_url: '/images/products/snoopy-classico.jpg',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 3
    },
    {
      id: 'prod-bacon',
      category_id: 'cat-hamburgueres',
      name: 'Snoopy Bacon',
      slug: 'snoopy-bacon',
      description: 'Pão brioche, burger na brasa de 125g, queijo cheddar derretido, cebola caramelizada artesanal, fatias crocantes de bacon em tiras e molho barbecue defumado.',
      price: 19.90,
      original_price: 22.90,
      image_url: '/images/products/snoopy-bacon.jpg',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 4
    },
    {
      id: 'prod-bacon-salada',
      category_id: 'cat-hamburgueres',
      name: 'Snoopy Bacon Salada',
      slug: 'snoopy-bacon-salada',
      description: 'Pão brioche, burger na brasa de 125g, queijo cheddar, fatias de bacon crocante, alface, tomate fresco, cebola roxa e maionese temperada.',
      price: 18.90,
      original_price: null,
      image_url: '/images/products/snoopy-bacon-salada.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 5
    },
    {
      id: 'prod-monstrao',
      category_id: 'cat-hamburgueres',
      name: 'Snoopy Monstrão',
      slug: 'snoopy-monstrao',
      description: 'Para quem tem fome de verdade! Pão brioche, 2 hambúrgueres na brasa de 125g cada (250g de carne pura!), queijo cheddar em dobro, bacon em tiras duplo e muito molho barbecue.',
      price: 27.90,
      original_price: 32.00,
      image_url: '/images/products/snoopy-monstrao.jpg',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 6
    },
    {
      id: 'prod-havai',
      category_id: 'cat-hamburgueres',
      name: 'Snoopy Havaí',
      slug: 'snoopy-havai',
      description: 'Uma explosão agridoce única! Pão brioche, hambúrguer na brasa de 125g, queijo cheddar, bacon, suculento abacaxi grelhado na brasa, alface fresca e maionese temperada especial.',
      price: 31.90,
      original_price: null,
      image_url: '/images/products/snoopy-havai.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 7
    },

    // PORÇÕES
    {
      id: 'prod-batata-150',
      category_id: 'cat-porcoes',
      name: 'Batata Frita 150g',
      slug: 'batata-frita-150g',
      description: 'Porção individual de batatas selecionadas, super crocantes por fora e macias por dentro, com leve toque de sal.',
      price: 9.90,
      original_price: null,
      image_url: '/images/products/batata-frita-150g.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 1
    },
    {
      id: 'prod-batata-300',
      category_id: 'cat-porcoes',
      name: 'Batata Frita 300g',
      slug: 'batata-frita-300g',
      description: 'Porção generosa para compartilhar de batatas douradas e estaladiças.',
      price: 14.90,
      original_price: null,
      image_url: '/images/products/batata-frita-300g.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 2
    },
    {
      id: 'prod-batata-bacon-cheddar',
      category_id: 'cat-porcoes',
      name: 'Batata com Bacon e Cheddar 300g',
      slug: 'batata-com-bacon-e-cheddar-300g',
      description: '300g de pura tentação: batatas fritas crocantes cobertas com uma avalanche de queijo cheddar cremoso e cubos crocantes de bacon frito.',
      price: 24.90,
      original_price: 28.90,
      image_url: '/images/products/batata-com-bacon-e-cheddar-300g.jpg',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 3
    },

    // PRATOS EXECUTIVOS
    {
      id: 'prod-cuscuz-guisado',
      category_id: 'cat-pratos',
      name: 'Cuscuz com Guisado e Vinagrete',
      slug: 'cuscuz-com-guisado-e-vinagrete',
      description: 'Cuscuz nordestino fofinho e quentinho, servido com carne guisada bem suculenta e saborosa, acompanhado de vinagrete fresco.',
      price: 16.90,
      original_price: null,
      image_url: '/images/products/cuscuz-com-guisado-e-vinagrete.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 1
    },
    {
      id: 'prod-cuscuz-frango',
      category_id: 'cat-pratos',
      name: 'Cuscuz com Creme de Frango e Vinagrete',
      slug: 'cuscuz-com-creme-de-frango-e-vinagrete',
      description: 'Cuscuz tradicional quentinho com farto creme de frango cremoso, tempero caseiro e vinagrete especial.',
      price: 14.90,
      original_price: null,
      image_url: '/images/products/cuscuz-com-creme-de-frango-e-vinagrete.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 2
    },
    {
      id: 'prod-cuscuz-calabresa',
      category_id: 'cat-pratos',
      name: 'Cuscuz com Calabresa e Vinagrete',
      slug: 'cuscuz-com-calabresa-e-vinagrete',
      description: 'Cuscuz quentinho servido com calabresa acebolada tostadinha e vinagrete refrescante.',
      price: 14.90,
      original_price: null,
      image_url: '/images/products/cuscuz-com-calabresa-e-vinagrete.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 3
    },
    {
      id: 'prod-cuscuz-carne-sol',
      category_id: 'cat-pratos',
      name: 'Cuscuz com Carne de Sol na Nata e Vinagrete',
      slug: 'cuscuz-com-carne-de-sol-na-nata-e-vinagrete',
      description: 'O autêntico sabor potiguar: cuscuz quentinho com deliciosa carne de sol desfiada puxada na nata cremosa e vinagrete da casa.',
      price: 19.90,
      original_price: 22.90,
      image_url: '/images/products/cuscuz-com-carne-de-sol-na-nata-e-vinagrete.jpg',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 4
    },
    {
      id: 'prod-arroz-creme-frango',
      category_id: 'cat-pratos',
      name: 'Arroz com Creme de Frango e Batata Palha',
      slug: 'arroz-com-creme-de-frango-e-batata-palha',
      description: 'Arroz branco soltinho, creme de frango super cremoso e finalizado com batata palha crocante.',
      price: 15.90,
      original_price: null,
      image_url: '/images/products/arroz-com-creme-de-frango-e-batata-palha.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 5
    },

    // COMBOS
    {
      id: 'prod-combo-1',
      category_id: 'cat-combos',
      name: 'Combo 1',
      slug: 'combo-1',
      description: 'O combo perfeito para dividir: 2 burgers Snoopy Clássico + 1 batata frita grande + 1 refrigerante de 1 litro.',
      price: 50.00,
      original_price: 58.00,
      image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({
        allowsNotes: true,
        beverageChoice: ['Coca-Cola 1L', 'Guaraná Antarctica 1L']
      }),
      sort_order: 1
    },
    {
      id: 'prod-combo-2',
      category_id: 'cat-combos',
      name: 'Combo 2',
      slug: 'combo-2',
      description: 'Para os apaixonados por bacon: 2 burgers Snoopy Bacon + 1 batata frita grande + 1 refrigerante de 1 litro.',
      price: 60.00,
      original_price: 68.00,
      image_url: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&w=800&q=80',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({
        allowsNotes: true,
        beverageChoice: ['Coca-Cola 1L', 'Guaraná Antarctica 1L']
      }),
      sort_order: 2
    },
    {
      id: 'prod-combo-3',
      category_id: 'cat-combos',
      name: 'Combo 3',
      slug: 'combo-3',
      description: 'Super econômico e gostoso: 2 burgers PCQ + 2 batatas pequenas + 2 garrafinhas de refrigerante grátis!',
      price: 45.00,
      original_price: 52.00,
      image_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({
        allowsNotes: true,
        beverageChoice: ['Coca-Cola 250ml', 'Guaraná Antarctica 250ml']
      }),
      sort_order: 3
    },
    {
      id: 'prod-combo-4',
      category_id: 'cat-combos',
      name: 'Combo 4 Família',
      slug: 'combo-4-familia',
      description: 'A refeição da família completa: Escolha entre 3 PCQ ou 3 Snoopy Clássico + 1 batata frita grande + 1 refrigerante de 1 litro.',
      price: 65.00,
      original_price: 74.00,
      image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({
        allowsNotes: true,
        burgerChoice: ['3 PCQ', '3 Snoopy Clássico'],
        beverageChoice: ['Coca-Cola 1L', 'Guaraná Antarctica 1L']
      }),
      sort_order: 4
    },

    // AÇAÍ
    {
      id: 'prod-acai-300',
      category_id: 'cat-acai',
      name: 'Açaí 300ml',
      slug: 'acai-300ml',
      description: 'Açaí puro e super cremoso de 300ml. Monte do seu jeito: escolha até 4 recheios deliciosos e 1 cobertura especial!',
      price: 12.90,
      original_price: null,
      image_url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({
        isAcai: true,
        maxFillings: 4,
        maxToppings: 1,
        allowsNotes: true
      }),
      sort_order: 1
    },

    // PASTÉIS
    {
      id: 'prod-pastel-frango',
      category_id: 'cat-pasteis',
      name: 'Pastel de Frango',
      slug: 'pastel-de-frango',
      description: 'Massa crocante sequinha e dourada, recheada com frango desfiado temperado com ervas e especiarias.',
      price: 12.00,
      original_price: null,
      image_url: '/images/products/pastel-de-frango.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 1
    },
    {
      id: 'prod-pastel-carne',
      category_id: 'cat-pasteis',
      name: 'Pastel de Carne',
      slug: 'pastel-de-carne',
      description: 'Pastel gigante com massa crocante frita na hora, recheado com carne bovina moída bem temperada e molhadinha.',
      price: 14.00,
      original_price: null,
      image_url: '/images/products/pastel-de-carne.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 2
    },
    {
      id: 'prod-pastel-calabresa',
      category_id: 'cat-pasteis',
      name: 'Pastel de Calabresa',
      slug: 'pastel-de-calabresa',
      description: 'Massa estaladiça com calabresa moída/fatiada com cebola e orégano.',
      price: 10.00,
      original_price: null,
      image_url: '/images/products/pastel-de-calabresa.jpg',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 3
    },

    // TAPIOCAS
    {
      id: 'prod-tapioca-carne-sol-nata',
      category_id: 'cat-tapiocas',
      name: 'Tapioca de Carne de Sol na Nata',
      slug: 'tapioca-de-carne-de-sol-na-nata',
      description: 'Deliciosa tapioca tradicional quentinha e recheada com carne de sol desfiada e legítima nata cremosa da terra.',
      price: 14.00,
      original_price: null,
      image_url: '/images/products/tapioca-carne-de-sol.png',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 1
    },
    {
      id: 'prod-tapioca-frango',
      category_id: 'cat-tapiocas',
      name: 'Tapioca de Frango',
      slug: 'tapioca-de-frango',
      description: 'Tapioca macia e fresquinha, recheada com frango desfiado suculento bem temperado com ervas especiais.',
      price: 12.00,
      original_price: null,
      image_url: '/images/products/tapioca-frango.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 2
    },
    {
      id: 'prod-tapioca-calabresa',
      category_id: 'cat-tapiocas',
      name: 'Tapioca de Calabresa',
      slug: 'tapioca-de-calabresa',
      description: 'Tapioca dobrada na chapa com fatias saborosas de calabresa acebolada com orégano e toque especial.',
      price: 10.00,
      original_price: null,
      image_url: '/images/products/tapioca-calabresa.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 3
    },
    {
      id: 'prod-tapioca-queijo',
      category_id: 'cat-tapiocas',
      name: 'Tapioca de Queijo',
      slug: 'tapioca-de-queijo',
      description: 'Clássica tapioca nordestina feita na hora com generoso queijo derretido e manteiga da terra.',
      price: 9.00,
      original_price: null,
      image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 4
    },

    // CACHORRO-QUENTE
    {
      id: 'prod-hotdog-completo',
      category_id: 'cat-hotdog',
      name: 'Cachorro-Quente Completo',
      slug: 'cachorro-quente-completo',
      description: 'Pão macio recheado com: salsicha, frango desfiado, carne moída, ovo de codorna, batata palha crocante e queijo ralado.',
      price: 8.00,
      original_price: 10.00,
      image_url: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true }),
      sort_order: 1
    },

    // MILK-SHAKE
    {
      id: 'prod-milkshake-400',
      category_id: 'cat-milkshake',
      name: 'Milk-shake 400ml',
      slug: 'milk-shake-400ml',
      description: 'Milk-shake super cremoso batido com sorvete premium e calda especial no copo de 400ml. Escolha seu sabor favorito!',
      price: 19.90,
      original_price: null,
      image_url: '/images/products/milk-shake-400ml.jpg',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({
        isMilkshake: true,
        allowsNotes: true
      }),
      sort_order: 1
    },

    // SUCOS NA ÁGUA
    {
      id: 'prod-suco-agua-caju',
      category_id: 'cat-sucos-agua',
      name: 'Suco de Caju (Água)',
      slug: 'suco-caju-agua',
      description: 'Polpa de caju selecionada batida com água mineral e açúcar a gosto.',
      price: 6.00,
      original_price: null,
      image_url: '/images/products/suco-caju.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 1
    },
    {
      id: 'prod-suco-agua-goiaba',
      category_id: 'cat-sucos-agua',
      name: 'Suco de Goiaba (Água)',
      slug: 'suco-goiaba-agua',
      description: 'Suco natural de goiaba vermelha bem geladinho e refrescante.',
      price: 6.00,
      original_price: null,
      image_url: '/images/products/suco-goiaba.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 2
    },
    {
      id: 'prod-suco-agua-graviola',
      category_id: 'cat-sucos-agua',
      name: 'Suco de Graviola (Água)',
      slug: 'suco-graviola-agua',
      description: 'Polpa nobre de graviola batida na água gelada.',
      price: 8.00,
      original_price: null,
      image_url: '/images/products/suco-graviola.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 3
    },
    {
      id: 'prod-suco-agua-uva',
      category_id: 'cat-sucos-agua',
      name: 'Suco de Uva (Água)',
      slug: 'suco-uva-agua',
      description: 'Suco de uva saboroso e muito refrescante.',
      price: 8.00,
      original_price: null,
      image_url: '/images/products/suco-uva.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 4
    },
    {
      id: 'prod-suco-agua-morango',
      category_id: 'cat-sucos-agua',
      name: 'Suco de Morango (Água)',
      slug: 'suco-morango-agua',
      description: 'Morangos selecionados batidos na hora na água.',
      price: 8.00,
      original_price: null,
      image_url: '/images/products/suco-morango.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 5
    },
    {
      id: 'prod-suco-agua-caja',
      category_id: 'cat-sucos-agua',
      name: 'Suco de Cajá (Água)',
      slug: 'suco-caja-agua',
      description: 'O autêntico e ácido cajá do Nordeste batido com água bem gelada.',
      price: 8.00,
      original_price: null,
      image_url: '/images/products/suco-caja.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 6
    },

    // SUCOS NO LEITE
    {
      id: 'prod-suco-leite-caju',
      category_id: 'cat-sucos-leite',
      name: 'Suco de Caju (no Leite)',
      slug: 'suco-caju-leite',
      description: 'Polpa de caju batida com leite integral geladinho, super encorpado.',
      price: 8.00,
      original_price: null,
      image_url: '/images/products/suco-caju.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 1
    },
    {
      id: 'prod-suco-leite-goiaba',
      category_id: 'cat-sucos-leite',
      name: 'Suco de Goiaba (no Leite)',
      slug: 'suco-goiaba-leite',
      description: 'Vitamina de goiaba com leite, cremosa e saborosa.',
      price: 8.00,
      original_price: null,
      image_url: '/images/products/suco-goiaba.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 2
    },
    {
      id: 'prod-suco-leite-graviola',
      category_id: 'cat-sucos-leite',
      name: 'Suco de Graviola (no Leite)',
      slug: 'suco-graviola-leite',
      description: 'Deliciosa combinação de graviola com leite cremoso.',
      price: 9.00,
      original_price: null,
      image_url: '/images/products/suco-graviola.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 3
    },
    {
      id: 'prod-suco-leite-uva',
      category_id: 'cat-sucos-leite',
      name: 'Suco de Uva (no Leite)',
      slug: 'suco-uva-leite',
      description: 'Vitamina de uva batida no leite gelado.',
      price: 9.00,
      original_price: null,
      image_url: '/images/products/suco-uva.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 4
    },
    {
      id: 'prod-suco-leite-morango',
      category_id: 'cat-sucos-leite',
      name: 'Suco de Morango (no Leite)',
      slug: 'suco-morango-leite',
      description: 'A clássica vitamina de morango bem cremosa e aveludada.',
      price: 9.00,
      original_price: null,
      image_url: '/images/products/suco-morango.png',
      is_active: 1,
      is_featured: 1,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 5
    },
    {
      id: 'prod-suco-leite-caja',
      category_id: 'cat-sucos-leite',
      name: 'Suco de Cajá (no Leite)',
      slug: 'suco-caja-leite',
      description: 'O sabor marcante do cajá combinado com a cremosidade do leite.',
      price: 9.00,
      original_price: null,
      image_url: '/images/products/suco-caja.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({ allowsNotes: true, sweetOptions: ['Com açúcar', 'Sem açúcar', 'Adoçante'] }),
      sort_order: 6
    },

    // BEBIDAS
    {
      id: 'prod-agua-510',
      category_id: 'cat-bebidas',
      name: 'Água Mineral 510ml',
      slug: 'agua-mineral-510ml',
      description: 'Garrafa 510ml bem geladinha. Escolha com ou sem gás.',
      price: 3.00,
      original_price: null,
      image_url: '/images/products/agua-mineral.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({
        choice: ['Sem Gás', 'Com Gás']
      }),
      sort_order: 1
    },
    {
      id: 'prod-refri-250',
      category_id: 'cat-bebidas',
      name: 'Refrigerante 250ml',
      slug: 'refrigerante-250ml',
      description: 'Garrafinha caçulinha 250ml gelada. Escolha o sabor.',
      price: 3.00,
      original_price: null,
      image_url: '/images/products/refrigerante-250ml.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({
        choice: ['Coca-Cola', 'Guaraná Antarctica']
      }),
      sort_order: 2
    },
    {
      id: 'prod-refri-lata',
      category_id: 'cat-bebidas',
      name: 'Refrigerante Lata 350ml',
      slug: 'refrigerante-lata-350ml',
      description: 'Lata 350ml trincando de gelada. Escolha sua preferência.',
      price: 6.00,
      original_price: null,
      image_url: '/images/products/refrigerante-lata-350ml.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({
        choice: ['Coca-Cola Normal', 'Coca-Cola Zero', 'Guaraná Antarctica', 'Fanta Laranja', 'Sprite']
      }),
      sort_order: 3
    },
    {
      id: 'prod-refri-1l',
      category_id: 'cat-bebidas',
      name: 'Refrigerante 1L',
      slug: 'refrigerante-1l',
      description: 'Garrafa 1 Litro gelada para acompanhar seu lanche.',
      price: 9.00,
      original_price: null,
      image_url: '/images/products/refrigerante-1l.png',
      is_active: 1,
      is_featured: 0,
      options_config: JSON.stringify({
        choice: ['Coca-Cola 1L', 'Guaraná Antarctica 1L']
      }),
      sort_order: 4
    }
  ];

  for (const p of products) {
    insertProd.run(
      p.id,
      p.category_id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.original_price,
      p.image_url,
      p.is_active,
      p.is_featured,
      p.options_config,
      p.sort_order
    );
  }
}

// Inicializa os dados padrão em memória para importá-los uma vez ao Supabase.
initDb();

export function getSeedData() {
  return {
    categories: db.prepare('SELECT * FROM categories').all(),
    products: (db.prepare('SELECT * FROM products').all() as Array<Record<string, unknown>>).map((product) => ({
      ...product,
      options_config: product.options_config ? JSON.parse(String(product.options_config)) : null,
    })),
    neighborhoods: db.prepare('SELECT * FROM neighborhoods').all(),
    customization_options: db.prepare('SELECT * FROM customization_options').all(),
    store_settings: db.prepare('SELECT * FROM store_settings').all(),
  };
}

export default db;


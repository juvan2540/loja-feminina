// API de Pedidos - Marcia Lojas
module.exports = { default: function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { items, payment, customer } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }

  // Calcular totais
  const subtotal = items.reduce((t, i) => t + (i.price * i.qty), 0);
  let discount = 0;
  if (payment === 'pix') discount = subtotal * 0.10;
  else if (payment === 'debito') discount = subtotal * 0.05;
  const total = subtotal - discount;

  // Gerar número do pedido
  const orderNumber = 'ML-' + Date.now().toString(36).toUpperCase();

  const order = {
    orderNumber,
    items,
    payment,
    customer: customer || {},
    subtotal: subtotal.toFixed(2),
    discount: discount.toFixed(2),
    total: total.toFixed(2),
    status: 'confirmado',
    createdAt: new Date().toISOString()
  };

  // Em produção, aqui salvaria no banco de dados (Vercel Postgres, Supabase, etc.)
  console.log('📦 Novo pedido recebido:', JSON.stringify(order));

  return res.status(201).json({
    success: true,
    message: 'Pedido realizado com sucesso!',
    order
  });
}};

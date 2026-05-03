// API de Produtos - Marcia Lojas
const products = [
  { id:1, name:"Vestido Cocktail Rosé", category:"vestidos", price:289.90, oldPrice:349.90, img:"img/prod-vestido1.png", badge:"Novo", stock: 15 },
  { id:2, name:"Vestido Floral Verão", category:"vestidos", price:199.90, oldPrice:259.90, img:"img/prod-vestido2.png", badge:"", stock: 22 },
  { id:3, name:"Blusa Seda Blush", category:"blusas", price:149.90, oldPrice:189.90, img:"img/prod-blusa1.png", badge:"Destaque", stock: 30 },
  { id:4, name:"Top Ombro a Ombro", category:"blusas", price:119.90, oldPrice:0, img:"img/prod-blusa2.png", badge:"", stock: 18 },
  { id:5, name:"Saia Plissada Nude", category:"saias", price:179.90, oldPrice:219.90, img:"img/prod-saia1.png", badge:"Promo", stock: 10 },
  { id:6, name:"Calça Pantalona Preta", category:"calcas", price:229.90, oldPrice:0, img:"img/prod-calca1.png", badge:"Novo", stock: 25 },
  { id:7, name:"Skinny Jeans Premium", category:"calcas", price:189.90, oldPrice:249.90, img:"img/prod-calca2.png", badge:"", stock: 20 },
  { id:8, name:"Vestido Midi Elegante", category:"vestidos", price:319.90, oldPrice:399.90, img:"img/prod-vestido1.png", badge:"Destaque", stock: 8 }
];

module.exports = { default: function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { category } = req.query;
  
  if (category && category !== 'todos') {
    const filtered = products.filter(p => p.category === category);
    return res.status(200).json({ success: true, products: filtered, total: filtered.length });
  }
  
  return res.status(200).json({ success: true, products, total: products.length });
}};

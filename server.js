const express = require('express');
const path = require('path');
const app = express();

// Importar API routes
const productsHandler = require('./api/products.js');
const ordersHandler = require('./api/orders.js');
const newsletterHandler = require('./api/newsletter.js');

// Servir arquivos estáticos
app.use(express.static(__dirname));
app.use(express.json());

// API Routes
app.all('/api/products', (req, res) => productsHandler.default(req, res));
app.all('/api/orders', (req, res) => ordersHandler.default(req, res));
app.all('/api/newsletter', (req, res) => newsletterHandler.default(req, res));

// Fallback para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🛍️  Marcia Lojas rodando em http://localhost:${PORT}`);
});

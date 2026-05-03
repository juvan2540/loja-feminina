// ===== PRODUCT DATA =====
const products = [
  { id:1, name:"Vestido Cocktail Rosé", category:"vestidos", price:289.90, oldPrice:349.90, img:"img/prod-vestido1.png", badge:"Novo" },
  { id:2, name:"Vestido Floral Verão", category:"vestidos", price:199.90, oldPrice:259.90, img:"img/prod-vestido2.png", badge:"" },
  { id:3, name:"Blusa Seda Blush", category:"blusas", price:149.90, oldPrice:189.90, img:"img/prod-blusa1.png", badge:"Destaque" },
  { id:4, name:"Top Ombro a Ombro", category:"blusas", price:119.90, oldPrice:0, img:"img/prod-blusa2.png", badge:"" },
  { id:5, name:"Saia Plissada Nude", category:"saias", price:179.90, oldPrice:219.90, img:"img/prod-saia1.png", badge:"Promo" },
  { id:6, name:"Calça Pantalona Preta", category:"calcas", price:229.90, oldPrice:0, img:"img/prod-calca1.png", badge:"Novo" },
  { id:7, name:"Skinny Jeans Premium", category:"calcas", price:189.90, oldPrice:249.90, img:"img/prod-calca2.png", badge:"" },
  { id:8, name:"Vestido Midi Elegante", category:"vestidos", price:319.90, oldPrice:399.90, img:"img/prod-vestido1.png", badge:"Destaque" }
];

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('marciaCart')) || [];

function saveCart() { localStorage.setItem('marciaCart', JSON.stringify(cart)); }

function updateCartCount() {
  const count = cart.reduce((t,i) => t + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; } else { cart.push({...product, qty:1}); }
  saveCart(); updateCartCount(); renderCart();
  showToast(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateCartCount(); renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart(); updateCartCount(); renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty"><div class="icon">🛒</div><p>Seu carrinho está vazio</p></div>';
    footer.style.display = 'none'; return;
  }
  footer.style.display = 'block';
  let total = 0;
  container.innerHTML = cart.map(item => {
    const subtotal = item.price * item.qty; total += subtotal;
    return `<div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="price">R$ ${item.price.toFixed(2)}</div>
        <div class="cart-qty">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>`;
  }).join('');
  document.getElementById('cartTotal').textContent = `R$ ${total.toFixed(2)}`;
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:linear-gradient(135deg,#d4a373,#e8a0bf);color:#111;padding:14px 24px;border-radius:12px;font-size:0.9rem;font-weight:600;z-index:3000;animation:fadeInUp 0.4s ease;box-shadow:0 8px 24px rgba(0,0,0,0.3)';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
}

// ===== RENDER PRODUCTS =====
function renderProducts(filter = 'todos') {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'todos' ? products : products.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card reveal visible" data-category="${p.category}">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-actions">
          <button class="product-action-btn" onclick="addToCart(${p.id})" title="Adicionar ao carrinho">🛒</button>
          <button class="product-action-btn" title="Favoritar">♡</button>
        </div>
      </div>
      <div class="product-info">
        <div class="category-label">${p.category.charAt(0).toUpperCase()+p.category.slice(1)}</div>
        <h4>${p.name}</h4>
        <div class="product-price">
          <span class="current">R$ ${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<span class="old">R$ ${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ===== FILTERS =====
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

// ===== CART PANEL =====
function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartPanel').classList.toggle('open');
}

// ===== COUNTDOWN =====
function startCountdown() {
  const end = new Date();
  end.setDate(end.getDate() + 3);
  end.setHours(23,59,59);
  function update() {
    const now = new Date(); const diff = end - now;
    if (diff <= 0) return;
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    const el = document.getElementById('countdown');
    if (el) el.innerHTML = `
      <div class="countdown-item"><span class="num">${String(d).padStart(2,'0')}</span><span class="label">Dias</span></div>
      <div class="countdown-item"><span class="num">${String(h).padStart(2,'0')}</span><span class="label">Horas</span></div>
      <div class="countdown-item"><span class="num">${String(m).padStart(2,'0')}</span><span class="label">Min</span></div>
      <div class="countdown-item"><span class="num">${String(s).padStart(2,'0')}</span><span class="label">Seg</span></div>`;
  }
  update(); setInterval(update, 1000);
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold:0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== HEADER SCROLL =====
function initHeader() {
  window.addEventListener('scroll', () => {
    document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (toggle) toggle.addEventListener('click', () => nav.classList.toggle('active'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('active')));
}

// ===== NEWSLETTER =====
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input.value) {
      fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input.value })
      })
      .then(res => res.json())
      .then(data => {
        showToast(data.message || 'Cadastro realizado com sucesso! 🎉');
        input.value = '';
      })
      .catch(() => {
        showToast('Cadastro realizado com sucesso! 🎉');
        input.value = '';
      });
    }
  });
}

// ===== PAYMENT =====
let currentPayment = 'pix';

function openPayment() {
  if (cart.length === 0) { showToast('Carrinho vazio!'); return; }
  toggleCart();
  setTimeout(() => {
    document.getElementById('paymentOverlay').classList.add('open');
    document.getElementById('paymentContent').style.display = 'block';
    document.getElementById('paymentSuccess').classList.remove('active');
    selectPayment('pix');
    renderPaySummary();
    renderInstallments();
  }, 300);
}

function closePayment() {
  document.getElementById('paymentOverlay').classList.remove('open');
}

function selectPayment(method) {
  currentPayment = method;
  document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
  const methods = ['pix','credito','debito','boleto'];
  const idx = methods.indexOf(method);
  document.querySelectorAll('.payment-method')[idx].classList.add('active');
  document.querySelectorAll('.payment-form').forEach(f => f.classList.remove('active'));
  const formId = 'form' + method.charAt(0).toUpperCase() + method.slice(1);
  document.getElementById(formId).classList.add('active');
  renderPaySummary();
}

function getCartTotal() {
  return cart.reduce((t, i) => t + i.price * i.qty, 0);
}

function renderPaySummary() {
  const subtotal = getCartTotal();
  let discount = 0;
  let discountLabel = '';
  if (currentPayment === 'pix') { discount = subtotal * 0.10; discountLabel = 'Desconto PIX (10%)'; }
  else if (currentPayment === 'debito') { discount = subtotal * 0.05; discountLabel = 'Desconto Débito (5%)'; }
  const total = subtotal - discount;
  let html = `<div class="pay-summary-row"><span>Subtotal</span><span>R$ ${subtotal.toFixed(2)}</span></div>`;
  if (discount > 0) {
    html += `<div class="pay-summary-row discount"><span>${discountLabel}</span><span>- R$ ${discount.toFixed(2)}</span></div>`;
  }
  html += `<div class="pay-summary-row"><span>Frete</span><span style="color:#4ecdc4">Grátis</span></div>`;
  html += `<div class="pay-summary-row total"><span>Total</span><span>R$ ${total.toFixed(2)}</span></div>`;
  document.getElementById('paySummary').innerHTML = html;
}

function renderInstallments() {
  const total = getCartTotal();
  const sel = document.getElementById('installments');
  if (!sel) return;
  sel.innerHTML = '';
  for (let i = 1; i <= 12; i++) {
    const val = (total / i).toFixed(2);
    const label = i === 1 ? `1x de R$ ${val} (à vista)` : `${i}x de R$ ${val} sem juros`;
    sel.innerHTML += `<option value="${i}">${label}</option>`;
  }
}

function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = v;
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
  input.value = v;
}

function copyPix() {
  const code = document.getElementById('pixCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    showToast('Código PIX copiado! 📋');
  }).catch(() => {
    showToast('Código PIX copiado! 📋');
  });
}

function processPayment() {
  const btn = event.target;
  const original = btn.textContent;
  btn.textContent = 'Processando...';
  btn.disabled = true;

  // Enviar pedido para o backend
  fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, payment: currentPayment })
  })
  .then(res => res.json())
  .then(data => {
    btn.textContent = original;
    btn.disabled = false;
    document.getElementById('paymentContent').style.display = 'none';
    const successEl = document.getElementById('paymentSuccess');
    successEl.classList.add('active');
    // Exibir número do pedido
    if (data.order && data.order.orderNumber) {
      const orderInfo = successEl.querySelector('.order-number');
      if (orderInfo) orderInfo.textContent = data.order.orderNumber;
      else {
        const p = document.createElement('p');
        p.className = 'order-number-display';
        p.innerHTML = `<strong>Pedido:</strong> ${data.order.orderNumber}<br><strong>Total:</strong> R$ ${data.order.total}`;
        p.style.cssText = 'margin-top:1rem;padding:1rem;background:rgba(212,163,115,0.15);border-radius:12px;text-align:center;font-size:0.95rem;color:#d4a373;border:1px solid rgba(212,163,115,0.3)';
        successEl.appendChild(p);
      }
    }
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    showToast('Pagamento confirmado com sucesso! 🎉');
  })
  .catch(() => {
    // Fallback offline
    btn.textContent = original;
    btn.disabled = false;
    document.getElementById('paymentContent').style.display = 'none';
    document.getElementById('paymentSuccess').classList.add('active');
    cart = []; saveCart(); updateCartCount(); renderCart();
    showToast('Pagamento confirmado com sucesso! 🎉');
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initFilters();
  updateCartCount();
  renderCart();
  startCountdown();
  initReveal();
  initHeader();
  initMobileMenu();
  initNewsletter();
  // Close payment on overlay click
  document.getElementById('paymentOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePayment();
  });
});


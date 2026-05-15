// ===========================
//   GREEN MARKET - APP.JS
// ===========================

// Product Data
const products = [
  {
    id: 1, name: "Fresh Spinach", category: "leafy", price: 45, unit: "500g bunch",
    badge: "Organic", badgeType: "",
    img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80"
  },
  {
    id: 2, name: "Red Tomatoes", category: "fruits", price: 60, oldPrice: 80, unit: "1 kg bag",
    badge: "Sale", badgeType: "sale",
    img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80"
  },
  {
    id: 3, name: "Baby Carrots", category: "root", price: 55, unit: "500g pack",
    badge: "Fresh", badgeType: "",
    img: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=400&q=80"
  },
  {
    id: 4, name: "Broccoli", category: "exotic", price: 90, unit: "400g head",
    badge: "Exotic", badgeType: "",
    img: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80"
  },
  {
    id: 5, name: "Fresh Coriander", category: "herbs", price: 20, unit: "100g bunch",
    badge: "Organic", badgeType: "",
    img: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&q=80"
  },
  {
    id: 6, name: "Green Capsicum", category: "fruits", price: 50, oldPrice: 65, unit: "500g pack",
    badge: "Sale", badgeType: "sale",
    img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80"
  },
  {
    id: 7, name: "Sweet Potato", category: "root", price: 70, unit: "1 kg bag",
    badge: "Seasonal", badgeType: "",
    img: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&q=80"
  },
  {
    id: 8, name: "Kale Leaves", category: "leafy", price: 65, unit: "300g bunch",
    badge: "Organic", badgeType: "",
    img: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=400&q=80"
  },
  {
    id: 9, name: "Cucumber", category: "fruits", price: 35, unit: "2 pieces",
    badge: "Fresh", badgeType: "",
    img: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&q=80"
  },
  {
    id: 10, name: "Beetroot", category: "root", price: 55, unit: "500g pack",
    badge: "Seasonal", badgeType: "",
    img: "https://images.unsplash.com/photo-1550411294-28e6fdf43cc9?w=400&q=80"
  },
  {
    id: 11, name: "Mint Leaves", category: "herbs", price: 18, unit: "50g bunch",
    badge: "Organic", badgeType: "",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
  },
  {
    id: 12, name: "Baby Corn", category: "exotic", price: 75, unit: "200g pack",
    badge: "Exotic", badgeType: "",
    img: "https://images.unsplash.com/photo-1601593346740-925612772716?w=400&q=80"
  },
];

let cart = [];
let activeFilter = 'all';

// ==================
//  RENDER PRODUCTS
// ==================
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80'" />
        <span class="product-badge ${p.badgeType}">${p.badge}</span>
      </div>
      <div class="product-body">
        <div class="product-category">${getCategoryLabel(p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-unit">${p.unit}</div>
        <div class="product-footer">
          <div class="product-price">
            ₹${p.price}
            ${p.oldPrice ? `<span class="old-price">₹${p.oldPrice}</span>` : ''}
          </div>
          <button class="btn-add-cart" onclick="addToCart(${p.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryLabel(cat) {
  const labels = {
    leafy: 'Leafy Greens',
    root: 'Root Vegetables',
    fruits: 'Fruit Vegetables',
    herbs: 'Herbs & Spices',
    exotic: 'Exotic Veggies',
    seasonal: 'Seasonal Picks'
  };
  return labels[cat] || cat;
}

// ==================
//  FILTER
// ==================
function setFilter(btn, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = filter;
  renderProducts(filter);
}

function filterProducts(filter) {
  const btn = [...document.querySelectorAll('.filter-btn')].find(b => b.getAttribute('onclick')?.includes(filter));
  if (btn) setFilter(btn, filter);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ==================
//  CART
// ==================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`🛒 ${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = total;

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty 🌿</div>';
    footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}" />
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
        <div class="cart-item-controls">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button onclick="removeFromCart(${item.id})" style="color:#e53935;border-color:#ffcdd2;margin-left:4px;">✕</button>
        </div>
      </div>
    </div>
  `).join('');

  const grandTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = `₹${grandTotal}`;
  footerEl.style.display = 'block';
}

function toggleCart() {
  document.getElementById('cartModal').classList.toggle('open');
}

// Cart button
document.getElementById('cartBtn').addEventListener('click', toggleCart);

// ==================
//  TOAST
// ==================
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ==================
//  NAVBAR SCROLL
// ==================
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 30) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Active nav link
  const sections = ['home', 'products', 'about', 'farmers', 'contact'];
  const scrollPos = window.scrollY + 100;
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  });
});

// ==================
//  MOBILE MENU
// ==================
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ==================
//  CONTACT FORM
// ==================
function submitForm(e) {
  e.preventDefault();
  showToast('✅ Message sent! We\'ll get back to you soon.');
  e.target.reset();
}

// ==================
//  SCROLL ANIMATIONS
// ==================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

function initAnimations() {
  const animEls = document.querySelectorAll(
    '.product-card, .farmer-card, .testimonial-card, .category-card, .feature-item'
  );
  animEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    observer.observe(el);
  });
}

// ==================
//  INIT
// ==================
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setTimeout(initAnimations, 100);
});

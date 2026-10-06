// Main Application Controller for OgaBassey Storefront

// Global Toast Messenger
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Cart Manager
  window.cart = new CartManager();

  // Render Category Hubs
  renderCategoryHubs();

  // Render Product Grids
  renderProductSections();

  // Initialize Search Controller
  initSearch();

  // Initialize Hero Carousel
  initHeroCarousel();

  // Initialize Utility Hub Services
  initUtilityHub();

  // Initialize Interactive Modals (IMEI, BNPL, QuickView)
  initModals();

  // Initialize Notifications and Mobile Sidebar
  initChromeNav();

  // Initialize Flash Sale Countdown Timer
  initFlashCountdown();
});

// Render Category Hubs
function renderCategoryHubs() {
  const container = document.getElementById('category-hubs-list');
  if (!container) return;

  const iconSVGs = {
    smartphone: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>',
    laptop: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>',
    tablet: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>',
    gamepad: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="6"/></svg>',
    watch: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.85 3.83a2 2 0 0 1-2 1.82H10.34a2 2 0 0 1-2-1.82l-.85-3.83m.85-10.7l.85-3.83A2 2 0 0 1 10.34 1h3.32a2 2 0 0 1 2 1.82l.85 3.83"/></svg>',
    headphones: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>',
    tv: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>',
    cable: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1v2"/><path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9"/><path d="M21 21v-2h-4v2"/></svg>',
    monitor: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
    camera: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>'
  };

  container.innerHTML = STORE_DATA.categories.map(cat => `
    <div class="category-hub-card" onclick="filterByCategory('${cat.id}')">
      <div class="category-hub-icon-wrap">
        ${iconSVGs[cat.icon] || iconSVGs.smartphone}
      </div>
      <span class="category-hub-name">${cat.name}</span>
    </div>
  `).join('');
}

// Render Product Sections
function renderProductSections() {
  const featuredGrid = document.getElementById('featured-products-grid');
  const flashSaleGrid = document.getElementById('flash-sale-grid');
  const allProductsGrid = document.getElementById('all-products-grid');

  if (featuredGrid) {
    const featured = STORE_DATA.products.filter(p => p.isFeatured);
    featuredGrid.innerHTML = featured.map(createProductCardHTML).join('');
  }

  if (flashSaleGrid) {
    const flash = STORE_DATA.products.filter(p => p.isFlashSale);
    flashSaleGrid.innerHTML = flash.map(createProductCardHTML).join('');
  }

  if (allProductsGrid) {
    allProductsGrid.innerHTML = STORE_DATA.products.map(createProductCardHTML).join('');
  }
}

// Helper to create product card HTML matching exact Ogabassey layout
function createProductCardHTML(p) {
  const isPreOwned = p.conditionType === 'pre-owned';
  const conditionClass = isPreOwned ? 'condition-pre-owned' : 'condition-brand-new';
  const formattedPrice = '₦' + p.price.toLocaleString('en-NG');
  const formattedOldPrice = p.oldPrice ? '₦' + p.oldPrice.toLocaleString('en-NG') : '';

  return `
    <article class="ogabassey-product-card" id="card-${p.id}">
      <div class="product-card-top-badges">
        <span class="product-condition-tag ${conditionClass}">${p.condition}</span>
        <button type="button" class="product-wishlist-btn" onclick="toggleWishlist('${p.id}', this)" aria-label="Add to wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
      </div>
      <div class="product-card-media" onclick="openQuickView('${p.id}')" style="cursor:pointer">
        <img src="${p.image}" alt="${p.name}" class="product-card-img" loading="lazy">
      </div>
      <div class="product-card-body">
        <span class="product-card-brand">${p.brand}</span>
        <h3 class="product-card-title" onclick="openQuickView('${p.id}')" style="cursor:pointer" title="${p.name}">${p.name}</h3>
        <div class="product-card-specs">
          ${p.specs.slice(0, 2).map(s => `<span class="spec-pill">${s}</span>`).join('')}
        </div>
        <div class="product-card-pricing">
          <span class="product-current-price">${formattedPrice}</span>
          ${p.oldPrice ? `<span class="product-old-price">${formattedOldPrice}</span>` : ''}
          ${p.discount ? `<span class="product-discount-pill">-${p.discount}%</span>` : ''}
        </div>
        <div class="product-card-actions">
          <button type="button" class="add-to-cart-btn" onclick="window.cart.addItem('${p.id}', 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Add to Cart
          </button>
          <button type="button" class="quick-view-btn" onclick="openQuickView('${p.id}')" aria-label="Quick preview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

// Toggle Wishlist
function toggleWishlist(productId, btn) {
  btn.classList.toggle('active');
  const isSaved = btn.classList.contains('active');
  showToast(isSaved ? 'Saved to your Wishlist!' : 'Removed from Wishlist');
}

// Filter by Category
function filterByCategory(categoryId) {
  const allGrid = document.getElementById('all-products-grid');
  const title = document.getElementById('catalog-section-title');
  if (!allGrid) return;

  const filtered = categoryId === 'all' 
    ? STORE_DATA.products 
    : STORE_DATA.products.filter(p => p.category === categoryId);

  allGrid.innerHTML = filtered.length > 0 
    ? filtered.map(createProductCardHTML).join('') 
    : `<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: #64748b;">No products found in this category.</div>`;

  if (title) {
    const cat = STORE_DATA.categories.find(c => c.id === categoryId);
    title.textContent = cat ? cat.name : 'All Products';
  }

  // Smooth scroll down to products section
  const section = document.getElementById('catalog-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Search Autocomplete Controller
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!searchInput || !dropdown) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q.length < 2) {
      dropdown.classList.remove('active');
      return;
    }

    const matches = STORE_DATA.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    ).slice(0, 5);

    if (matches.length > 0) {
      dropdown.innerHTML = matches.map(p => `
        <div class="search-result-item" onclick="openQuickView('${p.id}')">
          <img src="${p.image}" alt="${p.name}" class="search-result-thumb">
          <div class="search-result-info">
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-price">₦${p.price.toLocaleString('en-NG')}</div>
          </div>
        </div>
      `).join('');
      dropdown.classList.add('active');
    } else {
      dropdown.innerHTML = `<div style="padding: 1rem; text-align: center; color: #64748b; font-size: 0.85rem;">No gadgets found matching "${e.target.value}"</div>`;
      dropdown.classList.add('active');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

// Hero Carousel (Mobile & Tablets)
function initHeroCarousel() {
  const track = document.getElementById('mobile-hero-track');
  const indicators = document.querySelectorAll('.ogabassey-indicator');
  const counter = document.getElementById('hero-slide-counter');
  if (!track || indicators.length === 0) return;

  let currentSlide = 0;
  const totalSlides = indicators.length;

  function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === currentSlide);
    });

    if (counter) {
      counter.textContent = `${currentSlide + 1} of ${totalSlides}`;
    }
  }

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => goToSlide(i));
  });

  // Auto rotate every 5 seconds
  setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
}

// Utility Hub Tab Switcher
function initUtilityHub() {
  const buttons = document.querySelectorAll('.utility-tab-button');
  const rotatingText = document.getElementById('utility-rotating-word');
  const providerSelect = document.getElementById('utility-provider-select');
  const cashbackDesc = document.getElementById('utility-cashback-desc');
  const submitBtn = document.getElementById('utility-submit-btn');

  const words = ['Airtime!', 'Data!', 'TV!', 'Power!', 'Gaming!'];
  let wordIndex = 0;

  setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    if (rotatingText) {
      rotatingText.style.opacity = '0';
      setTimeout(() => {
        rotatingText.textContent = words[wordIndex];
        rotatingText.style.opacity = '1';
      }, 200);
    }
  }, 2500);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const utilityKey = btn.dataset.utility;
      const data = STORE_DATA.utilityDiscounts[utilityKey];

      if (data && providerSelect) {
        providerSelect.innerHTML = data.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
      }

      if (data && cashbackDesc) {
        cashbackDesc.textContent = `Get ${data.discount} credited directly to your BABA TEE GLOBAL Wallet!`;
      }
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const phoneInput = document.getElementById('utility-phone-input');
      const val = phoneInput ? phoneInput.value.trim() : '';
      if (!val) {
        showToast('Please enter your phone number or meter number!');
        return;
      }
      showToast('Processing utility purchase with instant cashback! 🎉');
      if (phoneInput) phoneInput.value = '';
    });
  }
}

// Flash Sale Countdown
function initFlashCountdown() {
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');
  const secsEl = document.getElementById('countdown-secs');
  if (!hoursEl || !minsEl || !secsEl) return;

  let totalSeconds = (14 * 3600) + (42 * 60) + 15;

  setInterval(() => {
    if (totalSeconds > 0) totalSeconds--;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

// Interactive Modals Controller
function initModals() {
  // IMEI Checker Modal
  const imeiModal = document.getElementById('imei-modal');
  const imeiInput = document.getElementById('imei-input-field');
  const imeiCheckBtn = document.getElementById('imei-submit-check');
  const imeiResultArea = document.getElementById('imei-result-display');

  document.querySelectorAll('[data-open-imei]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('imei-modal');
    });
  });

  if (imeiCheckBtn && imeiInput) {
    imeiCheckBtn.addEventListener('click', () => {
      const val = imeiInput.value.trim();
      if (val.length < 14) {
        showToast('Please enter a valid 15-digit IMEI number.');
        return;
      }

      imeiResultArea.innerHTML = `
        <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:1rem; margin-top:1rem; color:#065f46;">
          <div style="font-weight:800; font-size:1rem; margin-bottom:0.35rem;">✓ Valid Genuine Device Verified</div>
          <div style="font-size:0.85rem; line-height:1.5;">
            <strong>Detected Device:</strong> Apple iPhone 15 Pro / Galaxy S24 Ultra<br>
            <strong>Warranty Status:</strong> Active Official Manufacturer Warranty<br>
            <strong>Blacklist Status:</strong> Clean (Not reported stolen/lost)<br>
            <strong>Activation Date:</strong> Certified BABA TEE GLOBAL Clean Stock
          </div>
        </div>
      `;
    });
  }

  // Installment Plan Modal Initializer & Trigger
  document.querySelectorAll('[data-open-bnpl]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openInstallmentModal();
    });
  });

  initInstallmentPlanFeature();

  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });
}

// Global Installment Plan State & Controller
const INSTALLMENT_PLANS = [
  { id: '3m', durationMonths: 3, name: '3 Months', downPaymentRate: 0.25, interestRate: 0.00, badge: 'Zero Interest', sub: '25% down, 3 monthly payments' },
  { id: '6m', durationMonths: 6, name: '6 Months', downPaymentRate: 0.20, interestRate: 0.05, badge: 'Most Popular', sub: '20% down, 5% markup' },
  { id: '12m', durationMonths: 12, name: '12 Months', downPaymentRate: 0.15, interestRate: 0.10, badge: 'Lowest Monthly', sub: '15% down, 10% markup' }
];

let selectedInstallmentPlanId = '3m';
let selectedInstallmentProductId = null;
let installmentSearchQuery = '';

function initInstallmentPlanFeature() {
  const searchInput = document.getElementById('installment-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      installmentSearchQuery = e.target.value.toLowerCase().trim();
      renderInstallmentProducts();
    });
  }

  const proceedBtn = document.getElementById('installment-proceed-btn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      const prod = STORE_DATA.products.find(p => p.id === selectedInstallmentProductId) || STORE_DATA.products[0];
      const plan = INSTALLMENT_PLANS.find(p => p.id === selectedInstallmentPlanId) || INSTALLMENT_PLANS[0];
      const downPayment = Math.round(prod.price * plan.downPaymentRate);
      showToast(`Installment pre-approved for ${prod.name}! Initial deposit: ₦${downPayment.toLocaleString('en-NG')}`);
      closeAllModals();
    });
  }
}

function openInstallmentModal(productId = null) {
  if (productId) {
    selectedInstallmentProductId = productId;
  } else if (!selectedInstallmentProductId && STORE_DATA.products.length > 0) {
    selectedInstallmentProductId = STORE_DATA.products[0].id;
  }

  renderInstallmentPlans();
  renderInstallmentProducts();
  updateInstallmentTerms();
  openModal('bnpl-modal');
}

function renderInstallmentPlans() {
  const container = document.getElementById('installment-plans-selector');
  if (!container) return;

  container.innerHTML = INSTALLMENT_PLANS.map(plan => {
    const isSelected = plan.id === selectedInstallmentPlanId;
    return `
      <div class="installment-plan-card ${isSelected ? 'active' : ''}" onclick="selectInstallmentPlan('${plan.id}')">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
          <span style="font-weight:800; font-size:1rem; color:#0f172a;">${plan.name}</span>
          <span style="font-size:0.7rem; font-weight:700; color:${isSelected ? 'var(--store-primary)' : '#64748b'}; background:${isSelected ? 'rgba(235,94,40,0.1)' : '#f1f5f9'}; padding:2px 8px; border-radius:999px;">${plan.badge}</span>
        </div>
        <div style="font-size:0.78rem; color:#64748b; line-height:1.4;">${plan.sub}</div>
        <div style="margin-top:0.5rem; font-size:0.75rem; font-weight:700; color:#059669;">
          Deposit: ${(plan.downPaymentRate * 100)}%
        </div>
      </div>
    `;
  }).join('');
}

function selectInstallmentPlan(planId) {
  selectedInstallmentPlanId = planId;
  renderInstallmentPlans();
  updateInstallmentTerms();
}

function renderInstallmentProducts() {
  const container = document.getElementById('installment-products-container');
  if (!container) return;

  const filtered = STORE_DATA.products.filter(p => {
    if (!installmentSearchQuery) return true;
    return p.name.toLowerCase().includes(installmentSearchQuery) ||
           p.brand.toLowerCase().includes(installmentSearchQuery) ||
           p.category.toLowerCase().includes(installmentSearchQuery);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:1.5rem; color:#64748b; font-size:0.85rem;">No gadgets match "${installmentSearchQuery}". Try another keyword.</div>`;
    return;
  }

  container.innerHTML = filtered.map(prod => {
    const isSelected = prod.id === selectedInstallmentProductId;
    return `
      <div class="installment-product-item ${isSelected ? 'selected' : ''}" onclick="selectInstallmentProduct('${prod.id}')">
        <img src="${prod.image}" alt="${prod.name}">
        <div style="font-size:0.72rem; font-weight:700; color:var(--store-primary); text-transform:uppercase;">${prod.brand}</div>
        <div style="font-weight:700; font-size:0.82rem; color:#0f172a; line-height:1.3; margin:0.15rem 0 0.35rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${prod.name}</div>
        <div style="font-weight:800; font-size:0.85rem; color:#0f172a;">₦${prod.price.toLocaleString('en-NG')}</div>
      </div>
    `;
  }).join('');
}

function selectInstallmentProduct(prodId) {
  selectedInstallmentProductId = prodId;
  renderInstallmentProducts();
  updateInstallmentTerms();
}

function updateInstallmentTerms() {
  const container = document.getElementById('installment-terms-breakdown');
  const badge = document.getElementById('installment-selected-prod-badge');
  if (!container) return;

  const product = STORE_DATA.products.find(p => p.id === selectedInstallmentProductId) || STORE_DATA.products[0];
  const plan = INSTALLMENT_PLANS.find(p => p.id === selectedInstallmentPlanId) || INSTALLMENT_PLANS[0];

  if (!product) return;

  if (badge) {
    badge.textContent = `Selected: ${product.name}`;
  }

  const downPayment = Math.round(product.price * plan.downPaymentRate);
  const remaining = product.price - downPayment;
  const totalFinanced = Math.round(remaining * (1 + plan.interestRate));
  const monthlyRepayment = Math.round(totalFinanced / plan.durationMonths);
  const totalInstallmentCost = downPayment + totalFinanced;

  container.innerHTML = `
    <div style="margin-bottom:0.75rem; padding-bottom:0.75rem; border-bottom:1px dashed #cbd5e1; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-size:0.75rem; font-weight:700; color:var(--store-primary); text-transform:uppercase;">${product.brand} • ${product.condition}</div>
        <div style="font-weight:800; font-size:0.95rem; color:#0f172a;">${product.name}</div>
      </div>
      <div style="text-align:right;">
        <span style="font-size:0.75rem; color:#64748b;">Retail Cash Price</span>
        <div style="font-weight:800; font-size:0.95rem; color:#0f172a;">₦${product.price.toLocaleString('en-NG')}</div>
      </div>
    </div>

    <div class="installment-terms-row">
      <span>Installment Plan Duration:</span>
      <strong>${plan.durationMonths} Months (${plan.badge})</strong>
    </div>
    <div class="installment-terms-row">
      <span>Initial Down Payment (${(plan.downPaymentRate * 100)}%):</span>
      <strong style="color:var(--store-primary); font-size:0.95rem;">₦${downPayment.toLocaleString('en-NG')}</strong>
    </div>
    <div class="installment-terms-row">
      <span>Monthly Repayment (${plan.durationMonths} installments):</span>
      <strong style="color:#059669; font-size:0.95rem;">₦${monthlyRepayment.toLocaleString('en-NG')} / month</strong>
    </div>
    <div class="installment-terms-row">
      <span>Total Installment Cost:</span>
      <strong style="color:#0f172a;">₦${totalInstallmentCost.toLocaleString('en-NG')}</strong>
    </div>
    <div class="installment-terms-row" style="margin-top:0.35rem; padding-top:0.35rem; border-top:1px solid #f1f5f9; font-size:0.78rem;">
      <span style="color:#64748b;">Delivery & Pickup:</span>
      <span style="color:#0284c7; font-weight:700;">Instant Pickup at UnderG Ogbomoso or Nationwide Delivery</span>
    </div>
  `;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

// Quick View Modal
function openQuickView(productId) {
  const product = STORE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const body = document.getElementById('quickview-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:1.25rem;">
      <div style="background:#f8fafc; border-radius:12px; padding:1.5rem; text-align:center;">
        <img src="${product.image}" alt="${product.name}" style="max-height:240px; margin:0 auto; object-fit:contain;">
      </div>
      <div>
        <span style="font-size:0.75rem; font-weight:700; color:var(--store-primary); text-transform:uppercase;">${product.brand} • ${product.condition}</span>
        <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0.35rem 0 0.75rem;">${product.name}</h2>
        <div style="display:flex; align-items:baseline; gap:0.75rem; margin-bottom:1rem;">
          <span style="font-size:1.6rem; font-weight:800; color:var(--store-primary);">₦${product.price.toLocaleString('en-NG')}</span>
          ${product.oldPrice ? `<span style="font-size:1.1rem; color:#94a3b8; text-decoration:line-through;">₦${product.oldPrice.toLocaleString('en-NG')}</span>` : ''}
        </div>
        <div style="background:#f1f5f9; padding:0.75rem 1rem; border-radius:8px; font-size:0.85rem; margin-bottom:1.25rem;">
          <strong>Key Specifications:</strong>
          <ul style="margin-top:0.35rem; padding-left:1.25rem;">
            ${product.specs.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <button type="button" class="add-to-cart-btn" style="width:100%; padding:0.85rem; font-size:1rem;" onclick="window.cart.addItem('${product.id}', 1); closeAllModals();">
          Add to Cart • ₦${product.price.toLocaleString('en-NG')}
        </button>
        <button type="button" class="utility-action-btn" style="width:100%; margin-top:0.65rem; background:transparent; border:1.5px solid var(--store-primary); color:var(--store-primary); font-weight:700;" onclick="closeAllModals(); openInstallmentModal('${product.id}');">
          View Installment Plan Terms
        </button>
      </div>
    </div>
  `;

  openModal('quickview-modal');
}

// Chrome Navigation and Notifications
function initChromeNav() {
  const notifBtn = document.getElementById('notif-toggle-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('mobile-sidebar');
  const sidebarOverlay = document.getElementById('mobile-sidebar-overlay');
  const sidebarClose = document.getElementById('mobile-sidebar-close');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
        notifDropdown.classList.remove('active');
      }
    });
  }

  if (menuBtn && sidebar && sidebarOverlay) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeSidebar = () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
  }
}

// Cart State & Drawer Controller for OgaBassey Storefront
const CART_STORAGE_KEY = 'ogabassey_cart_items_v1';
const FREE_SHIPPING_THRESHOLD = 150000; // Free nationwide shipping over ₦150k

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {}
    this.render();
  }

  initElements() {
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('cart-drawer-overlay');
    this.itemsList = document.getElementById('cart-items-container');
    this.emptyState = document.getElementById('cart-empty-view');
    this.subtotalEl = document.getElementById('cart-subtotal-val');
    this.totalEl = document.getElementById('cart-total-val');
    this.freeShippingFill = document.getElementById('free-shipping-bar-fill');
    this.freeShippingText = document.getElementById('free-shipping-text-desc');
    this.badges = document.querySelectorAll('[data-cart-badge]');
  }

  bindEvents() {
    // Open cart drawer triggers
    document.querySelectorAll('[data-open-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close cart drawer triggers
    document.querySelectorAll('[data-close-cart]').forEach(btn => {
      btn.addEventListener('click', () => this.closeDrawer());
    });

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeDrawer());
    }

    // Checkout button
    const checkoutBtn = document.getElementById('cart-checkout-button');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) {
          showToast('Your cart is empty! Add products first.');
          return;
        }
        showToast('Proceeding to Paystack secure checkout...');
        setTimeout(() => {
          alert('Mock Checkout: Order initialized via Paystack gateway for ' + this.formatCurrency(this.calculateTotal()));
        }, 600);
      });
    }
  }

  openDrawer() {
    if (this.drawer && this.overlay) {
      this.drawer.classList.add('active');
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer() {
    if (this.drawer && this.overlay) {
      this.drawer.classList.remove('active');
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  addItem(productId, qty = 1) {
    const product = STORE_DATA.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.items.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.items[existingIndex].qty += qty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty
      });
    }

    this.saveCart();
    showToast(`Added "${product.name.slice(0, 30)}..." to your cart!`);
    this.openDrawer();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQty(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.removeItem(productId);
    } else {
      this.saveCart();
    }
  }

  calculateTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  calculateCount() {
    return this.items.reduce((count, item) => count + item.qty, 0);
  }

  formatCurrency(amount) {
    return '₦' + amount.toLocaleString('en-NG');
  }

  render() {
    const totalCount = this.calculateCount();
    const totalPrice = this.calculateTotal();

    // Update all badges
    this.badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    });

    if (this.subtotalEl) this.subtotalEl.textContent = this.formatCurrency(totalPrice);
    if (this.totalEl) this.totalEl.textContent = this.formatCurrency(totalPrice);

    // Free shipping calculation
    if (this.freeShippingFill && this.freeShippingText) {
      const percentage = Math.min(100, Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100));
      this.freeShippingFill.style.width = `${percentage}%`;

      if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
        this.freeShippingText.innerHTML = `<strong>Free Nationwide Delivery unlocked!</strong> 🎉`;
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;
        this.freeShippingText.innerHTML = `Add <strong>${this.formatCurrency(remaining)}</strong> more to get <strong>FREE Delivery</strong>`;
      }
    }

    // Render items or empty view
    if (!this.itemsList || !this.emptyState) return;

    if (this.items.length === 0) {
      this.itemsList.style.display = 'none';
      this.emptyState.style.display = 'block';
    } else {
      this.emptyState.style.display = 'none';
      this.itemsList.style.display = 'flex';
      
      this.itemsList.innerHTML = this.items.map(item => `
        <div class="cart-item-card" data-cart-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">${this.formatCurrency(item.price)}</div>
            <div class="cart-item-controls">
              <div class="cart-qty-picker">
                <button type="button" class="cart-qty-btn" onclick="window.cart.updateQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                <span class="cart-qty-num">${item.qty}</span>
                <button type="button" class="cart-qty-btn" onclick="window.cart.updateQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="cart-remove-btn" onclick="window.cart.removeItem('${item.id}')">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

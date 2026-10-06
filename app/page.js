'use client';

import React, { useState, useEffect } from 'react';

export default function StorefrontPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeUtility, setActiveUtility] = useState('airtime');
  const [utilityWordIndex, setUtilityWordIndex] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Modals state
  const [imeiModalOpen, setImeiModalOpen] = useState(false);
  const [imeiInput, setImeiInput] = useState('');
  const [imeiResult, setImeiResult] = useState(null);
  const [imeiLoading, setImeiLoading] = useState(false);

  const [installmentModalOpen, setInstallmentModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('3m');
  const [selectedInstallmentProduct, setSelectedInstallmentProduct] = useState(null);
  const [installmentSearchQuery, setInstallmentSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Countdown timer
  const [countdown, setCountdown] = useState({ hours: '14', mins: '42', secs: '15' });

  const utilityWords = ['Airtime!', 'Data!', 'TV!', 'Power!', 'Gaming!'];
  const FREE_SHIPPING_THRESHOLD = 150000;

  // Categories
  const categories = [
    { id: 'smartphones', name: 'Smartphones', count: 142, icon: '📱' },
    { id: 'laptops', name: 'Laptops', count: 86, icon: '💻' },
    { id: 'tablets', name: 'Tablets', count: 48, icon: '📟' },
    { id: 'gaming', name: 'Gaming', count: 64, icon: '🎮' },
    { id: 'wearables', name: 'Wearables', count: 52, icon: '⌚' },
    { id: 'audio', name: 'Audio', count: 78, icon: '🎧' },
    { id: 'monitors', name: 'Monitors', count: 35, icon: '🖥️' },
    { id: 'accessories', name: 'Accessories', count: 210, icon: '🔌' },
    { id: 'desktops', name: 'Desktops', count: 29, icon: '🖲️' },
    { id: 'cameras', name: 'Cameras', count: 31, icon: '📷' }
  ];

  const utilityOptions = {
    airtime: ['MTN Nigeria (3% Instant Cashback)', 'Airtel Nigeria (3% Instant Cashback)', 'Globacom (4% Instant Cashback)', '9mobile (4% Instant Cashback)'],
    data: ['MTN SME 10GB Data', 'Airtel Unlimited Monthly', 'Glo Mega Data Bundle', '9mobile Heavy User Bundle'],
    tv: ['DSTV Premium & Compact', 'GOtv Supa Plus', 'Showmax Pro Entertainment'],
    power: ['IKEDC Prepaid Token', 'EKEDC Prepaid Token', 'AEDC Abuja Token', 'IBEDC Ibadan Token'],
    gaming: ['PlayStation Store $50 Gift Card', 'Steam Wallet NGN/USD', 'Xbox Game Pass Ultimate']
  };

  // Trigger Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Fetch Products from Backend API (PostgreSQL or fallback)
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setProducts(data.data);
        }
      })
      .catch(() => {
        // Handled silently
      });

    // Load Cart from localStorage
    try {
      const savedCart = localStorage.getItem('ogabassey_cart_items_v1');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) { }

    // Utility word rotator
    const wordInterval = setInterval(() => {
      setUtilityWordIndex(prev => (prev + 1) % utilityWords.length);
    }, 2500);

    // Hero carousel rotator
    const heroInterval = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % 3);
    }, 5000);

    // Flash countdown timer
    let totalSecs = (14 * 3600) + (42 * 60) + 15;
    const timerInterval = setInterval(() => {
      if (totalSecs > 0) totalSecs--;
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      setCountdown({
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0')
      });
    }, 1000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(heroInterval);
      clearInterval(timerInterval);
    };
  }, []);

  // Save Cart Changes
  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('ogabassey_cart_items_v1', JSON.stringify(newCart));
    } catch (e) { }
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    const existing = cart.find(item => item.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
    } else {
      updated = [...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.image_url,
        qty
      }];
    }
    saveCart(updated);
    triggerToast(`Added "${product.name.slice(0, 26)}..." to cart!`);
    setIsCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    const updated = cart.map(i => {
      if (i.id === id) {
        const newQty = i.qty + delta;
        return newQty > 0 ? { ...i, qty: newQty } : null;
      }
      return i;
    }).filter(Boolean);
    saveCart(updated);
  };

  const removeCartItem = (id) => {
    saveCart(cart.filter(i => i.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.qty, 0);

  // Search filter
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  // Backend IMEI Check API Call
  const handleImeiCheck = async () => {
    if (!imeiInput || imeiInput.length < 14) {
      triggerToast('Please enter a valid 15-digit IMEI number.');
      return;
    }
    setImeiLoading(true);
    try {
      const res = await fetch('/api/imei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imei: imeiInput })
      });
      const data = await res.json();
      setImeiResult(data);
    } catch (e) {
      triggerToast('Error verifying IMEI. Please try again.');
    } finally {
      setImeiLoading(false);
    }
  };

  // Backend Checkout Initializer
  const handleCheckout = async () => {
    if (cart.length === 0) {
      triggerToast('Your cart is empty!');
      return;
    }
    try {
      triggerToast('Initializing Paystack secure gateway...');
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount: cartTotal,
          customer: { name: 'Customer', email: 'guest@babateeglobal.com', phone: '+2348146978921' }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Order ${data.reference} initialized for ₦${cartTotal.toLocaleString('en-NG')} via Paystack!`);
      }
    } catch (e) {
      triggerToast('Checkout initialization failed.');
    }
  };

  // Filtered Products
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const featuredProducts = products.filter(p => p.isFeatured || p.is_featured);
  const flashSaleProducts = products.filter(p => p.isFlashSale || p.is_flash_sale);

  // Installment Plans & Calculations
  const installmentPlans = [
    {
      id: '3m',
      name: '3 Months Plan',
      badge: '0% Interest',
      downPercent: 25,
      months: 3,
      interestRate: 0,
      description: 'Pay 25% down payment today, remainder split across 3 equal monthly payments with zero markup.'
    },
    {
      id: '6m',
      name: '6 Months Plan',
      badge: 'Most Popular',
      downPercent: 20,
      months: 6,
      interestRate: 0.05,
      description: 'Pay 20% down payment today, balance spread comfortably across 6 monthly debits.'
    },
    {
      id: '12m',
      name: '12 Months Plan',
      badge: 'Lowest Monthly',
      downPercent: 15,
      months: 12,
      interestRate: 0.10,
      description: 'Pay 15% down payment today, balance spread across 12 flexible monthly installments.'
    }
  ];

  const activePlan = installmentPlans.find(p => p.id === selectedPlanId) || installmentPlans[0];
  const activeInstallmentProduct = selectedInstallmentProduct || products[0] || null;
  const planProductPrice = activeInstallmentProduct ? (activeInstallmentProduct.price || 0) : 0;
  const downPaymentAmount = Math.round(planProductPrice * (activePlan.downPercent / 100));
  const financedPrincipal = Math.max(0, planProductPrice - downPaymentAmount);
  const totalFinancedWithInterest = Math.round(financedPrincipal * (1 + activePlan.interestRate));
  const monthlyRepayment = activePlan.months > 0 ? Math.round(totalFinancedWithInterest / activePlan.months) : 0;
  const totalPayable = downPaymentAmount + totalFinancedWithInterest;

  const installmentFilteredProducts = products.filter(p => {
    if (!installmentSearchQuery.trim()) return true;
    const q = installmentSearchQuery.toLowerCase();
    return (p.name && p.name.toLowerCase().includes(q)) || (p.brand && p.brand.toLowerCase().includes(q));
  });

  return (
    <div>
      {/* Toast Messenger */}
      <div className={`toast-notification ${showToast ? 'show' : ''}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
        <span>{toastMessage}</span>
      </div>

      {/* Header Chrome */}
      <header className="ogabassey-navbar">
        <div className="ogabassey-navbar__top">
          {/* Top Pattern */}
          <svg aria-hidden="true" className="ogabassey-navbar__pattern" role="presentation">
            <defs>
              <pattern id="gadget-pattern-top" width="140" height="140" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="#ffffff" strokeWidth="1.5" transform="scale(0.93333)">
                  <g transform="translate(20, 20) rotate(-15 6 10)"><rect x="0" y="0" width="12" height="20" rx="2" /><circle cx="6" cy="16" r="1" /></g>
                  <path d="M40 10 l5 5 l-5 5" opacity="0.6" strokeWidth="1" />
                  <g transform="translate(120, 15) rotate(10 9 6)"><rect x="0" y="0" width="18" height="12" rx="2" /><line x1="4" x2="14" y1="6" y2="6" opacity="0.5" /></g>
                  <circle cx="100" cy="30" r="1.5" fill="#ffffff" opacity="0.6" />
                  <g transform="translate(15, 70) rotate(45)"><rect x="0" y="0" width="10" height="10" rx="1" /></g>
                  <path d="M35 80 l10 0 m-5 -5 l0 10" opacity="0.7" strokeWidth="1" />
                  <g transform="translate(120, 90) rotate(5 9 6)"><rect x="0" y="3" width="18" height="12" rx="2" /><circle cx="14" cy="9" r="2" /></g>
                  <g transform="translate(30, 120) rotate(-25 10 6)"><circle cx="6" cy="6" r="2" /><path d="M0 6 l-4 0 m16 0 l4 0 m-8 -8 l0 -4 m0 16 l0 4" strokeWidth="1" /></g>
                  <g transform="translate(90, 125) rotate(15)"><rect x="0" y="0" width="8" height="14" rx="1.5" /></g>
                  <circle cx="140" cy="70" r="2" fill="#ffffff" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gadget-pattern-top)"></rect>
          </svg>

          <div className="ogabassey-navbar__inner">
            <div className="ogabassey-navbar__primary-row">
              {/* Brand Row */}
              <div className="ogabassey-navbar__brand-row">
                <button type="button" className="ogabassey-navbar__menu-button" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                </button>
                <a href="/" className="ogabassey-navbar__logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #d62027 0%, #991b1b 100%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    letterSpacing: '-0.5px',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(214, 32, 39, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: 1
                  }}>
                    BTG
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                    <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                      BABA TEE <span style={{ color: '#ef4444' }}>GLOBAL</span>
                    </span>
                    <span style={{ color: '#cbd5e1', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2px' }}>
                      UnderG Ogbomoso · Nationwide Delivery
                    </span>
                  </div>
                </a>
              </div>

              {/* Live Search */}
              <div className="ogabassey-navbar__search-wrap">
                <form className="ogabassey-navbar-search" onSubmit={(e) => e.preventDefault()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ogabassey-navbar-search__icon"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  <input
                    type="search"
                    className="ogabassey-navbar-search__input"
                    placeholder="Search products, brands and categories..."
                    value={searchQuery}
                    onChange={handleSearch}
                    autoComplete="off"
                  />
                </form>
                {showSearchDropdown && (
                  <div className="search-results-dropdown active">
                    {searchResults.length > 0 ? (
                      searchResults.map(p => (
                        <div key={p.id} className="search-result-item" onClick={() => { setQuickViewProduct(p); setShowSearchDropdown(false); }}>
                          <img src={p.image || p.image_url} alt={p.name} className="search-result-thumb" />
                          <div className="search-result-info">
                            <div className="search-result-name">{p.name}</div>
                            <div className="search-result-price">₦{p.price.toLocaleString('en-NG')}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>No gadgets found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop Actions */}
              <div className="ogabassey-navbar__desktop-actions">
                <div style={{ position: 'relative' }}>
                  <button type="button" className="ogabassey-navbar__icon-button" onClick={() => setNotifOpen(!notifOpen)} aria-label="Toggle notifications">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                    <span className="ogabassey-navbar__notif-badge">2</span>
                  </button>
                  {notifOpen && (
                    <div className="notif-dropdown active">
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#0f172a' }}>Store Notifications</div>
                      <div className="notif-item">
                        <div className="notif-item-title">⚡ Flash Sale Live: Galaxy Z Fold8 Cases</div>
                        <div className="notif-item-time">10 minutes ago</div>
                      </div>
                      <div className="notif-item">
                        <div className="notif-item-title">📦 Free Nationwide Delivery on orders over ₦150k</div>
                        <div className="notif-item-time">2 hours ago</div>
                      </div>
                    </div>
                  )}
                </div>

                <button type="button" className="ogabassey-navbar__icon-link" onClick={() => setIsCartOpen(true)} aria-label="Open Shopping Cart">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                  {cartItemCount > 0 && <span className="ogabassey-navbar__cart-badge">{cartItemCount}</span>}
                </button>

                <button type="button" className="ogabassey-navbar__icon-link" onClick={() => triggerToast('Welcome to BABA TEE GLOBAL!')} aria-label="User Account">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navbar */}
        <div className="ogabassey-navbar-secondary">
          <div className="ogabassey-navbar-secondary__inner">
            <div className="ogabassey-navbar-secondary__list">
              <div className="ogabassey-navbar-secondary__category">
                <button type="button" className="ogabassey-navbar-secondary__button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                  Shop by Category
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ogabassey-navbar-secondary__chevron"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                <div className="category-dropdown-menu">
                  {categories.slice(0, 6).map(c => (
                    <a key={c.id} href="#catalog" className="category-dropdown-item" onClick={() => setActiveCategory(c.id)}>
                      <span>{c.icon}</span> {c.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="ogabassey-navbar-secondary__divider"></div>

              <button type="button" className="ogabassey-navbar-secondary__link" onClick={() => setImeiModalOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><line x1="8" x2="8" y1="7" y2="17" /><line x1="12" x2="12" y1="7" y2="17" /></svg>
                IMEI Checker
              </button>

              <div className="ogabassey-navbar-secondary__divider"></div>

              <a href="#store-info" className="ogabassey-navbar-secondary__link" style={{ textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                UnderG Ogbomoso Store
              </a>

              <div className="ogabassey-navbar-secondary__divider"></div>

              <button type="button" className="ogabassey-navbar-secondary__link" onClick={() => setInstallmentModalOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                Installment Plan
              </button>
            </div>

            <div className="ogabassey-navbar-secondary__right">
              <span className="ogabassey-navbar-secondary__badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="13" x="1" y="3" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                Nationwide Premium Delivery
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Storefront Body */}
      <main id="main-content" className="ogabassey-storefront-main">
        {/* Hero Section */}
        <section className="ogabassey-hero-section">
          <div className="ogabassey-hero-container">
            {/* Desktop 5-Col Hero Grid */}
            <div className="ogabassey-desktop-hero">
              <div className="ogabassey-hero-main" onClick={() => {
                const item = products.find(p => p.id === 'prod-7');
                if (item) setQuickViewProduct(item);
              }}>
                <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&auto=format&fit=crop&q=80" alt="Alienware M18 R2" className="ogabassey-hero-bg" />
                <div className="ogabassey-hero-overlay"></div>
                <div className="ogabassey-hero-content">
                  <span className="ogabassey-hero-badge">Flagship Powerhouse</span>
                  <h1 className="ogabassey-hero-title">Dell Alienware m18 R2</h1>
                  <p className="ogabassey-hero-description">Experience uncompromised gaming with Intel Core i9-14900HX, RTX 4090 16GB, and a blazing 18-inch 165Hz QHD+ display.</p>
                  <div className="ogabassey-hero-pricing">
                    <span className="ogabassey-hero-price">₦4,950,000</span>
                    <span className="ogabassey-hero-price-old">₦5,300,000</span>
                  </div>
                  <button type="button" className="ogabassey-hero-cta" onClick={(e) => {
                    e.stopPropagation();
                    const item = products.find(p => p.id === 'prod-7');
                    if (item) addToCart(item, 1);
                  }}>
                    Buy Now
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                </div>
              </div>

              <div className="ogabassey-hero-side">
                <div className="ogabassey-side-card" onClick={() => {
                  const item = products.find(p => p.id === 'prod-1');
                  if (item) setQuickViewProduct(item);
                }}>
                  <img src="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80" alt="Galaxy Z Fold8 Carbon Case" className="ogabassey-hero-bg" />
                  <div className="ogabassey-hero-overlay"></div>
                  <div className="ogabassey-hero-content">
                    <span className="ogabassey-hero-badge" style={{ background: '#0284c7' }}>Official Launch</span>
                    <h2 className="ogabassey-hero-title">Galaxy Z Fold8 Carbon Case</h2>
                    <p className="ogabassey-hero-description">Aramid fiber body with integrated MagSafe magnets.</p>
                    <div className="ogabassey-hero-price">₦75,163</div>
                  </div>
                </div>

                <div className="ogabassey-side-card" onClick={() => {
                  const item = products.find(p => p.id === 'prod-6');
                  if (item) setQuickViewProduct(item);
                }}>
                  <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80" alt="iPhone 17 Pro Max" className="ogabassey-hero-bg" />
                  <div className="ogabassey-hero-overlay"></div>
                  <div className="ogabassey-hero-content">
                    <span className="ogabassey-hero-badge" style={{ background: '#10b981' }}>New Arrival</span>
                    <h2 className="ogabassey-hero-title">iPhone 17 Pro Max</h2>
                    <p className="ogabassey-hero-description">Grade 5 Titanium with breakthrough A19 Pro Bionic.</p>
                    <div className="ogabassey-hero-price">₦2,450,000</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Utility Services Hub */}
            <div className="ogabassey-hero-utility">
              <div className="utility-headline">
                <span className="utility-headline-text">
                  We Pay <span className="utility-highlight">YOU</span> When You Buy{' '}
                  <span className="utility-rotating-text">{utilityWords[utilityWordIndex]}</span>
                </span>
              </div>
              <div className="utility-tabs-grid">
                {['airtime', 'data', 'tv', 'power', 'gaming'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    className={`utility-tab-button ${activeUtility === u ? 'active' : ''}`}
                    onClick={() => setActiveUtility(u)}
                  >
                    <div className="utility-tab-icon">
                      {u === 'airtime' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}
                      {u === 'data' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" x2="12.01" y1="20" y2="20" /></svg>}
                      {u === 'tv' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="15" x="2" y="7" rx="2" /><polyline points="17 2 12 7 7 2" /></svg>}
                      {u === 'power' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                      {u === 'gaming' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="12" x="2" y="6" rx="6" /><line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /></svg>}
                    </div>
                    <span className="utility-tab-label" style={{ textTransform: 'capitalize' }}>{u}</span>
                  </button>
                ))}
              </div>
              <div className="utility-panel-body active">
                <div className="utility-form-row">
                  <select className="utility-provider-select" aria-label="Select provider">
                    {utilityOptions[activeUtility].map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <input type="text" className="utility-input" placeholder="Phone or Account Number" defaultValue="08146978921" />
                  <input type="number" className="utility-input" placeholder="Amount (₦)" defaultValue="2000" style={{ maxWidth: '140px' }} />
                  <button type="button" className="utility-action-btn" onClick={() => triggerToast(`Recharged ${activeUtility}! ₦80 instant cashback added to wallet.`)}>
                    Recharge & Earn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Hubs */}
        <section className="ogabassey-category-section">
          <div className="section-container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">Explore Collections</span>
                <h2 className="section-title">Shop by Category</h2>
              </div>
              <button type="button" className="section-view-all" onClick={() => setActiveCategory('all')}>
                View All Categories
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
            <div className="category-hubs-scroll">
              {categories.map(c => (
                <div key={c.id} className="category-hub-card" onClick={() => setActiveCategory(c.id)}>
                  <div className="category-hub-icon-wrap" style={{ fontSize: '1.75rem' }}>
                    {c.icon}
                  </div>
                  <span className="category-hub-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sales Grid */}
        <section className="ogabassey-products-section" style={{ background: '#fdf2f2', padding: '2.5rem 0' }}>
          <div className="section-container">
            <div className="section-header">
              <div>
                <div className="flash-sale-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  Limited Time Deals
                </div>
                <h2 className="section-title" style={{ marginTop: '0.35rem' }}>Flash Sales</h2>
              </div>
              <div className="flash-countdown">
                <span style={{ fontSize: '0.85rem', color: '#475569', marginRight: '0.25rem' }}>Ends In:</span>
                <span className="countdown-box">{countdown.hours}</span> :
                <span className="countdown-box">{countdown.mins}</span> :
                <span className="countdown-box">{countdown.secs}</span>
              </div>
            </div>
            <div className="ogabassey-products-grid">
              {flashSaleProducts.slice(0, 4).map(p => (
                <article key={p.id} className="ogabassey-product-card">
                  <div className="product-card-top-badges">
                    <span className={`product-condition-tag ${p.conditionType === 'pre-owned' ? 'condition-pre-owned' : 'condition-brand-new'}`}>{p.condition}</span>
                    <button type="button" className="product-wishlist-btn" onClick={() => triggerToast('Saved to Wishlist!')} aria-label="Add to wishlist">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </button>
                  </div>
                  <div className="product-card-media" onClick={() => setQuickViewProduct(p)} style={{ cursor: 'pointer' }}>
                    <img src={p.image || p.image_url} alt={p.name} className="product-card-img" />
                  </div>
                  <div className="product-card-body">
                    <span className="product-card-brand">{p.brand}</span>
                    <h3 className="product-card-title" onClick={() => setQuickViewProduct(p)} style={{ cursor: 'pointer' }}>{p.name}</h3>
                    <div className="product-card-pricing">
                      <span className="product-current-price">₦{p.price.toLocaleString('en-NG')}</span>
                      {p.oldPrice && <span className="product-old-price">₦{p.oldPrice.toLocaleString('en-NG')}</span>}
                      {p.discount && <span className="product-discount-pill">-{p.discount}%</span>}
                    </div>
                    <div className="product-card-actions">
                      <button type="button" className="add-to-cart-btn" onClick={() => addToCart(p, 1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                        Add to Cart
                      </button>
                      <button type="button" className="quick-view-btn" onClick={() => setQuickViewProduct(p)} aria-label="Quick view">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Value-Add Promotion Cards */}
        <section className="section-container">
          <div className="storefront-promo-grid">
            <div className="promo-banner-card promo-banner-imei">
              <div>
                <span className="promo-banner-badge">Device Verification</span>
                <h3 className="promo-banner-title">Check Phone IMEI</h3>
                <p className="promo-banner-copy">Verify blacklist status, official warranty, and authenticity before you buy in Nigeria.</p>
              </div>
              <button type="button" className="promo-banner-btn" onClick={() => setImeiModalOpen(true)}>
                Run IMEI Check
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>

            <div className="promo-banner-card promo-banner-store" style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#fff' }}>
              <div>
                <span className="promo-banner-badge" style={{ background: 'rgba(214, 32, 39, 0.25)', color: '#f87171' }}>Physical Store</span>
                <h3 className="promo-banner-title" style={{ color: '#ffffff' }}>UnderG Ogbomoso</h3>
                <p className="promo-banner-copy" style={{ color: '#94a3b8' }}>Visit our walk-in showroom at UnderG Ogbomoso for gadget purchases, or order online for fast, secure Nationwide Premium Delivery.</p>
              </div>
              <a href="#store-info" className="promo-banner-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                Store & Delivery Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
              </a>
            </div>

            <div className="promo-banner-card promo-banner-bnpl">
              <div>
                <span className="promo-banner-badge">Flexible Repayment</span>
                <h3 className="promo-banner-title">Installment Plan</h3>
                <p className="promo-banner-copy">Choose an installment plan, pick your dream gadget, and review instant monthly repayment terms.</p>
              </div>
              <button type="button" className="promo-banner-btn" onClick={() => setInstallmentModalOpen(true)}>
                Select Installment Plan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </section>

        {/* All Products Catalog */}
        <section className="ogabassey-products-section" id="catalog">
          <div className="section-container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">Browse All Inventory</span>
                <h2 className="section-title">All Products ({filteredProducts.length})</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button type="button" className="section-view-all" onClick={() => setActiveCategory('all')}>All</button>
                <button type="button" className="section-view-all" onClick={() => setActiveCategory('smartphones')}>Phones</button>
                <button type="button" className="section-view-all" onClick={() => setActiveCategory('laptops')}>Laptops</button>
                <button type="button" className="section-view-all" onClick={() => setActiveCategory('accessories')}>Cases</button>
              </div>
            </div>
            <div className="ogabassey-products-grid">
              {filteredProducts.map(p => (
                <article key={p.id} className="ogabassey-product-card">
                  <div className="product-card-top-badges">
                    <span className={`product-condition-tag ${p.conditionType === 'pre-owned' ? 'condition-pre-owned' : 'condition-brand-new'}`}>{p.condition}</span>
                    <button type="button" className="product-wishlist-btn" onClick={() => triggerToast('Saved to Wishlist!')} aria-label="Add to wishlist">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </button>
                  </div>
                  <div className="product-card-media" onClick={() => setQuickViewProduct(p)} style={{ cursor: 'pointer' }}>
                    <img src={p.image || p.image_url} alt={p.name} className="product-card-img" />
                  </div>
                  <div className="product-card-body">
                    <span className="product-card-brand">{p.brand}</span>
                    <h3 className="product-card-title" onClick={() => setQuickViewProduct(p)} style={{ cursor: 'pointer' }}>{p.name}</h3>
                    <div className="product-card-pricing">
                      <span className="product-current-price">₦{p.price.toLocaleString('en-NG')}</span>
                      {p.oldPrice && <span className="product-old-price">₦{p.oldPrice.toLocaleString('en-NG')}</span>}
                      {p.discount && <span className="product-discount-pill">-{p.discount}%</span>}
                    </div>
                    <div className="product-card-actions">
                      <button type="button" className="add-to-cart-btn" onClick={() => addToCart(p, 1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                        Add to Cart
                      </button>
                      <button type="button" className="quick-view-btn" onClick={() => setQuickViewProduct(p)} aria-label="Quick view">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="ogabassey-trust-section" id="store-info">
          <div className="section-container">
            <div className="trust-props-grid">
              <div className="trust-prop-card">
                <div className="trust-prop-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                </div>
                <div>
                  <div className="trust-prop-title">7-Day Return Policy</div>
                  <div className="trust-prop-desc">Eligible items may be returned within 7 days in original condition.</div>
                </div>
              </div>
              <div className="trust-prop-card">
                <div className="trust-prop-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                </div>
                <div>
                  <div className="trust-prop-title">100% Genuine Guaranteed</div>
                  <div className="trust-prop-desc">Direct from verified manufacturers and certified distribution.</div>
                </div>
              </div>
              <div className="trust-prop-card">
                <div className="trust-prop-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </div>
                <div>
                  <div className="trust-prop-title">24/7 Dedicated Support</div>
                  <div className="trust-prop-desc">Prompt assistance via phone, WhatsApp, or in-store at UnderG Ogbomoso.</div>
                </div>
              </div>
              <div className="trust-prop-card">
                <div className="trust-prop-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="13" x="1" y="3" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                </div>
                <div>
                  <div className="trust-prop-title">Nationwide Premium Delivery</div>
                  <div className="trust-prop-desc">UnderG Ogbomoso physical store with insured doorstep delivery across Nigeria.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="ogabassey-footer" aria-label="Semantic storefront footer">
        <div className="footer-container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <a href="/" aria-label="BABA TEE GLOBAL Home" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #d62027 0%, #991b1b 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  letterSpacing: '-0.5px',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(214, 32, 39, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 1
                }}>
                  BTG
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                  <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                    BABA TEE <span style={{ color: '#ef4444' }}>GLOBAL</span>
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2px' }}>
                    UnderG Ogbomoso · Nationwide Delivery
                  </span>
                </div>
              </a>
              <p className="footer-about-text">
                BABA TEE GLOBAL is your trusted destination for genuine smartphones, laptops, electronics, and accessories. Visit our physical store at UnderG Ogbomoso or enjoy Nationwide Premium Delivery to any state in Nigeria.
              </p>
              <div className="footer-contact-info">
                <div className="footer-contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>UnderG Ogbomoso, Oyo State, Nigeria</span>
                </div>
                <div className="footer-contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="13" x="1" y="3" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                  <span>Nationwide Premium Delivery (All 36 States)</span>
                </div>
                <div className="footer-contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <span>+234 814 697 8921</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="footer-col-title">Categories</h4>
              <ul className="footer-links-list">
                {categories.slice(0, 5).map(c => (
                  <li key={c.id}>
                    <button type="button" className="footer-link" onClick={() => setActiveCategory(c.id)}>{c.name}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Services & Tools</h4>
              <ul className="footer-links-list">
                <li><button type="button" className="footer-link" onClick={() => setImeiModalOpen(true)}>IMEI Status Checker</button></li>
                <li><a href="#store-info" className="footer-link" style={{ textDecoration: 'none' }}>UnderG Ogbomoso Store</a></li>
                <li><button type="button" className="footer-link" onClick={() => setInstallmentModalOpen(true)}>Installment Plan</button></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Help & Trust</h4>
              <ul className="footer-links-list">
                <li><button type="button" className="footer-link" onClick={() => triggerToast('Terms of service')}>Terms of Service</button></li>
                <li><button type="button" className="footer-link" onClick={() => triggerToast('Privacy policy')}>Privacy Policy</button></li>
                <li><button type="button" className="footer-link" onClick={() => triggerToast('7-Day return policy')}>Return Policy</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div className="footer-copyright">
              © 2026 BABA TEE GLOBAL. All rights reserved.
            </div>
            <div className="footer-payment-badges">
              <span className="payment-badge">PAYSTACK</span>
              <span className="payment-badge">MASTERCARD</span>
              <span className="payment-badge">VISA</span>
              <span className="payment-badge">VERVE</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <aside className={`cart-drawer ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
            Your Shopping Bag
          </div>
          <button type="button" className="modal-close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
          </button>
        </div>

        <div className="cart-free-shipping-bar">
          <div className="free-shipping-text">
            {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
              <span><strong>Free Nationwide Delivery unlocked!</strong> 🎉</span>
            ) : (
              <span>Add <strong>₦{(FREE_SHIPPING_THRESHOLD - cartTotal).toLocaleString('en-NG')}</strong> more for <strong>FREE Delivery</strong></span>
            )}
          </div>
          <div className="free-shipping-progress">
            <div className="free-shipping-fill" style={{ width: `${Math.min(100, Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100))}%` }}></div>
          </div>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b', marginBottom: '0.25rem' }}>Your cart is empty</div>
              <p style={{ fontSize: '0.85rem' }}>Add smartphones, laptops or cases to continue.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-thumb" />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-price">₦{item.price.toLocaleString('en-NG')}</div>
                  <div className="cart-item-controls">
                    <div className="cart-qty-picker">
                      <button type="button" className="cart-qty-btn" onClick={() => updateCartQty(item.id, -1)}>−</button>
                      <span className="cart-qty-num">{item.qty}</span>
                      <button type="button" className="cart-qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                    </div>
                    <button type="button" className="cart-remove-btn" onClick={() => removeCartItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-subtotal-row">
            <span>Subtotal</span>
            <span style={{ fontWeight: 700, color: '#1e293b' }}>₦{cartTotal.toLocaleString('en-NG')}</span>
          </div>
          <div className="cart-total-row">
            <span>Estimated Total</span>
            <span style={{ color: 'var(--store-primary)' }}>₦{cartTotal.toLocaleString('en-NG')}</span>
          </div>
          <button type="button" className="cart-checkout-btn" onClick={handleCheckout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
            Checkout Securely via Paystack
          </button>
        </div>
      </aside>

      {/* IMEI Modal */}
      <div className={`modal-backdrop ${imeiModalOpen ? 'active' : ''}`} onClick={() => setImeiModalOpen(false)}>
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><line x1="8" x2="8" y1="7" y2="17" /><line x1="12" x2="12" y1="7" y2="17" /></svg>
              Device IMEI Checker
            </div>
            <button type="button" className="modal-close-btn" onClick={() => setImeiModalOpen(false)} aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
            </button>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Check device status in PostgreSQL database before you buy. Dial <strong>*#06#</strong> on your phone to get your 15-digit IMEI.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                className="utility-input"
                placeholder="e.g. 352849102847592"
                maxLength={15}
                value={imeiInput}
                onChange={(e) => setImeiInput(e.target.value)}
              />
              <button type="button" className="utility-action-btn" onClick={handleImeiCheck} disabled={imeiLoading}>
                {imeiLoading ? 'Checking...' : 'Verify IMEI'}
              </button>
            </div>
            {imeiResult && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '1rem', color: '#065f46' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.35rem' }}>{imeiResult.message}</div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                  <strong>Device:</strong> {imeiResult.brand} {imeiResult.model}<br />
                  <strong>Warranty:</strong> {imeiResult.warranty}<br />
                  <strong>Status:</strong> {imeiResult.status.toUpperCase()} (Clean / Genuine Stock)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Installment Plan Interactive Modal */}
      <div className={`modal-backdrop ${installmentModalOpen ? 'active' : ''}`} onClick={() => setInstallmentModalOpen(false)}>
        <div className="modal-dialog modal-dialog-large" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <div className="modal-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                Installment Plan Calculator
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', marginBottom: 0 }}>
                Select an installment tenure, pick any device, and get parsed payment terms.
              </p>
            </div>
            <button type="button" className="modal-close-btn" onClick={() => setInstallmentModalOpen(false)} aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
            </button>
          </div>
          <div className="modal-body">
            {/* Step 1: Select Plan Duration */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--store-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>1</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Select Installment Plan</span>
              </div>
              <div className="installment-plan-grid">
                {installmentPlans.map(plan => (
                  <div
                    key={plan.id}
                    className={`installment-plan-card ${selectedPlanId === plan.id ? 'active' : ''}`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <span className="installment-plan-badge">{plan.badge}</span>
                    <span className="installment-plan-name">{plan.name}</span>
                    <span className="installment-plan-down">{plan.downPercent}% Down Payment</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.35rem' }}>{plan.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Product of Choice */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--store-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>2</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Choose Product of Choice</span>
                </div>
                <input
                  type="search"
                  placeholder="Filter phones, laptops, consoles..."
                  value={installmentSearchQuery}
                  onChange={(e) => setInstallmentSearchQuery(e.target.value)}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.65rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    outline: 'none',
                    minWidth: '220px'
                  }}
                />
              </div>

              <div className="installment-product-picker">
                {installmentFilteredProducts.map(p => {
                  const isSelected = activeInstallmentProduct && activeInstallmentProduct.id === p.id;
                  const itemDown = Math.round(p.price * (activePlan.downPercent / 100));
                  return (
                    <div
                      key={p.id}
                      className={`installment-product-item ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedInstallmentProduct(p)}
                    >
                      <img src={p.image || p.image_url} alt={p.name} className="installment-product-thumb" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--store-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {p.brand}
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                          ₦{p.price.toLocaleString('en-NG')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Down payment: <strong>₦{itemDown.toLocaleString('en-NG')}</strong>
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--store-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Parsed Installment Payment Terms */}
            {activeInstallmentProduct && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--store-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>3</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                    Parsed Installment Payment Terms for {activeInstallmentProduct.name}
                  </span>
                </div>

                <div className="installment-terms-box">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img src={activeInstallmentProduct.image || activeInstallmentProduct.image_url} alt={activeInstallmentProduct.name} style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{activeInstallmentProduct.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Retail Price: <strong>₦{planProductPrice.toLocaleString('en-NG')}</strong></div>
                      </div>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.55rem', borderRadius: '999px' }}>
                      {activePlan.name}
                    </span>
                  </div>

                  <div className="installment-terms-row">
                    <span>Initial Down Payment ({activePlan.downPercent}% payable today):</span>
                    <strong style={{ color: 'var(--store-primary)', fontSize: '1rem' }}>₦{downPaymentAmount.toLocaleString('en-NG')}</strong>
                  </div>
                  <div className="installment-terms-row">
                    <span>Financed Balance:</span>
                    <span>₦{financedPrincipal.toLocaleString('en-NG')}</span>
                  </div>
                  <div className="installment-terms-row">
                    <span>Interest / Markup:</span>
                    <span style={{ color: activePlan.interestRate === 0 ? '#16a34a' : '#0f172a', fontWeight: 700 }}>
                      {activePlan.interestRate === 0 ? '0% Free (Zero Markup)' : `${activePlan.interestRate * 100}% Total Markup`}
                    </span>
                  </div>
                  <div className="installment-terms-row">
                    <span>Monthly Repayment:</span>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>₦{monthlyRepayment.toLocaleString('en-NG')} / month</strong>
                  </div>
                  <div className="installment-terms-row">
                    <span>Repayment Timeline:</span>
                    <span>{activePlan.months} Monthly Payments</span>
                  </div>
                  <div className="installment-terms-row">
                    <span>Total Cost Outlay:</span>
                    <strong>₦{totalPayable.toLocaleString('en-NG')}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="utility-action-btn"
                    style={{ flex: 1, height: '48px', fontSize: '0.95rem' }}
                    onClick={() => {
                      addToCart({
                        ...activeInstallmentProduct,
                        name: `${activeInstallmentProduct.name} (Installment Plan: ${activePlan.name})`,
                        price: downPaymentAmount,
                        originalPrice: planProductPrice,
                        installmentNote: `${activePlan.name} • ₦${monthlyRepayment.toLocaleString('en-NG')}/mo for ${activePlan.months} months`
                      }, 1);
                      setInstallmentModalOpen(false);
                      setIsCartOpen(true);
                      triggerToast(`Installment plan applied for ${activeInstallmentProduct.name}! Down payment of ₦${downPaymentAmount.toLocaleString('en-NG')} added to bag.`);
                    }}
                  >
                    Proceed with Installment Order • ₦{downPaymentAmount.toLocaleString('en-NG')} Down
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="modal-backdrop active" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Product Details</div>
              <button type="button" className="modal-close-btn" onClick={() => setQuickViewProduct(null)} aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
                <img src={quickViewProduct.image || quickViewProduct.image_url} alt={quickViewProduct.name} style={{ maxHeight: '220px', margin: '0 auto', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--store-primary)', textTransform: 'uppercase' }}>
                {quickViewProduct.brand} • {quickViewProduct.condition}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.75rem' }}>
                {quickViewProduct.name}
              </h2>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--store-primary)', marginBottom: '1rem' }}>
                ₦{quickViewProduct.price.toLocaleString('en-NG')}
              </div>
              <button
                type="button"
                className="add-to-cart-btn"
                style={{ width: '100%', padding: '0.85rem' }}
                onClick={() => {
                  addToCart(quickViewProduct, 1);
                  setQuickViewProduct(null);
                }}
              >
                Add to Cart • ₦{quickViewProduct.price.toLocaleString('en-NG')}
              </button>
              <button
                type="button"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: '#fef2f2',
                  color: 'var(--store-primary)',
                  border: '1.5px solid var(--store-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
                onClick={() => {
                  setSelectedInstallmentProduct(quickViewProduct);
                  setQuickViewProduct(null);
                  setInstallmentModalOpen(true);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                View Installment Plan Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

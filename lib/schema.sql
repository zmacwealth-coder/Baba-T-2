-- PostgreSQL Schema for OgaBassey Storefront
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(12, 2) NOT NULL,
  old_price NUMERIC(12, 2),
  discount INT DEFAULT 0,
  condition VARCHAR(50) NOT NULL,
  condition_type VARCHAR(30) NOT NULL, -- 'brand-new' | 'pre-owned'
  image_url TEXT NOT NULL,
  specs JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  is_flash_sale BOOLEAN DEFAULT FALSE,
  stock_quantity INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(150),
  customer_email VARCHAR(150),
  customer_phone VARCHAR(50),
  shipping_address TEXT,
  total_amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'NGN',
  payment_reference VARCHAR(100) UNIQUE,
  payment_status VARCHAR(50) DEFAULT 'pending',
  order_status VARCHAR(50) DEFAULT 'processing',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS imei_records (
  imei VARCHAR(15) PRIMARY KEY,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'clean',
  warranty_status VARCHAR(100),
  activation_status VARCHAR(100),
  check_count INT DEFAULT 1,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS repair_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_model VARCHAR(150) NOT NULL,
  issue_type VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  estimated_cost NUMERIC(12, 2),
  status VARCHAR(50) DEFAULT 'received',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS utility_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  cashback_amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'success',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

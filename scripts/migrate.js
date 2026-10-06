const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is missing.');
    console.log('Set DATABASE_URL in .env.local or your environment before running migration.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    console.log('Running PostgreSQL Schema Migration...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../lib/schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('✓ Tables created successfully.');

    // Seed Categories
    console.log('Seeding initial categories...');
    const categories = [
      { id: 'smartphones', name: 'Smartphones', icon: 'smartphone', order: 1 },
      { id: 'laptops', name: 'Laptops', icon: 'laptop', order: 2 },
      { id: 'tablets', name: 'Tablets', icon: 'tablet', order: 3 },
      { id: 'gaming', name: 'Gaming', icon: 'gamepad', order: 4 },
      { id: 'wearables', name: 'Wearables', icon: 'watch', order: 5 },
      { id: 'audio', name: 'Audio', icon: 'headphones', order: 6 },
      { id: 'monitors', name: 'Monitors', icon: 'tv', order: 7 },
      { id: 'accessories', name: 'Accessories', icon: 'cable', order: 8 },
      { id: 'desktops', name: 'Desktops', icon: 'monitor', order: 9 },
      { id: 'cameras', name: 'Cameras', icon: 'camera', order: 10 }
    ];

    for (const cat of categories) {
      await pool.query(
        `INSERT INTO categories (id, name, icon, display_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET name = $2, icon = $3, display_order = $4`,
        [cat.id, cat.name, cat.icon, cat.order]
      );
    }

    // Seed Sample Products
    console.log('Seeding initial products...');
    const products = [
      {
        id: 'prod-1',
        name: 'Samsung Galaxy Z Fold8 Series Carbon Magnet Case',
        brand: 'Samsung',
        category_id: 'accessories',
        price: 75163,
        old_price: 92000,
        discount: 18,
        condition: 'Brand New',
        condition_type: 'brand-new',
        image_url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
        specs: JSON.stringify(['Ultra-slim Carbon', 'MagSafe Compatible', 'Drop Tested 10ft']),
        is_featured: true,
        is_flash_sale: true
      },
      {
        id: 'prod-5',
        name: 'Samsung Galaxy S26 FE (256GB / 8GB RAM)',
        brand: 'Samsung',
        category_id: 'smartphones',
        price: 830000,
        old_price: 950000,
        discount: 13,
        condition: 'Official Warranty',
        condition_type: 'brand-new',
        image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
        specs: JSON.stringify(['Snapdragon 8 Gen 3', '120Hz Dynamic AMOLED', '50MP OIS']),
        is_featured: true,
        is_flash_sale: true
      },
      {
        id: 'prod-6',
        name: 'Apple iPhone 17 Pro Max 256GB Natural Titanium',
        brand: 'Apple',
        category_id: 'smartphones',
        price: 2450000,
        old_price: 2650000,
        discount: 8,
        condition: 'Brand New Sealed',
        condition_type: 'brand-new',
        image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
        specs: JSON.stringify(['A19 Pro Chip', '48MP Triple Camera', 'ProMotion 120Hz']),
        is_featured: true,
        is_flash_sale: true
      },
      {
        id: 'prod-7',
        name: 'Dell Alienware m18 R2 Gaming Laptop (RTX 4090 / 64GB / 2TB)',
        brand: 'Dell',
        category_id: 'laptops',
        price: 4950000,
        old_price: 5300000,
        discount: 7,
        condition: 'Brand New',
        condition_type: 'brand-new',
        image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
        specs: JSON.stringify(['Intel Core i9-14900HX', 'RTX 4090 16GB', '18" QHD+ 165Hz']),
        is_featured: true,
        is_flash_sale: false
      }
    ];

    for (const p of products) {
      await pool.query(
        `INSERT INTO products (id, name, brand, category_id, price, old_price, discount, condition, condition_type, image_url, specs, is_featured, is_flash_sale)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO UPDATE SET price = $5, old_price = $6, stock_quantity = 15`,
        [p.id, p.name, p.brand, p.category_id, p.price, p.old_price, p.discount, p.condition, p.condition_type, p.image_url, p.specs, p.is_featured, p.is_flash_sale]
      );
    }

    console.log('✓ Seeding completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();

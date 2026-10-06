import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const FALLBACK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Samsung Galaxy Z Fold8 Series Carbon Magnet Case',
    brand: 'Samsung',
    category: 'accessories',
    price: 75163,
    oldPrice: 92000,
    discount: 18,
    condition: 'Brand New',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    specs: ['Ultra-slim Carbon', 'MagSafe Compatible', 'Drop Tested 10ft'],
    isFeatured: true,
    isFlashSale: true
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy Z Fold8 Series Carbon Standing Case',
    brand: 'Samsung',
    category: 'accessories',
    price: 58837,
    oldPrice: 72000,
    discount: 18,
    condition: 'Brand New',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80',
    specs: ['Built-in Kickstand', 'Aramid Fiber', 'Tactile Grip'],
    isFeatured: true,
    isFlashSale: false
  },
  {
    id: 'prod-3',
    name: 'Samsung Galaxy Z Fold8 Series Silicone Magnet Case',
    brand: 'Samsung',
    category: 'accessories',
    price: 38428,
    oldPrice: 48000,
    discount: 20,
    condition: 'Brand New',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    specs: ['Soft-Touch Silicone', 'Magnetic Ring', 'Microfiber Interior'],
    isFeatured: true,
    isFlashSale: true
  },
  {
    id: 'prod-4',
    name: 'Samsung Galaxy Z Fold8 Series Clear Magnet Case',
    brand: 'Samsung',
    category: 'accessories',
    price: 30270,
    oldPrice: 40000,
    discount: 24,
    condition: 'Brand New',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
    specs: ['Non-Yellowing Bayer TPU', 'Reinforced Corners', 'Air Cushion'],
    isFeatured: true,
    isFlashSale: false
  },
  {
    id: 'prod-5',
    name: 'Samsung Galaxy S26 FE (256GB / 8GB RAM)',
    brand: 'Samsung',
    category: 'smartphones',
    price: 830000,
    oldPrice: 950000,
    discount: 13,
    condition: 'Official Warranty',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    specs: ['Snapdragon 8 Gen 3', '120Hz Dynamic AMOLED', '50MP OIS'],
    isFeatured: true,
    isFlashSale: true
  },
  {
    id: 'prod-6',
    name: 'Apple iPhone 17 Pro Max 256GB Natural Titanium',
    brand: 'Apple',
    category: 'smartphones',
    price: 2450000,
    oldPrice: 2650000,
    discount: 8,
    condition: 'Brand New Sealed',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    specs: ['A19 Pro Chip', '48MP Triple Camera', 'ProMotion 120Hz'],
    isFeatured: true,
    isFlashSale: true
  },
  {
    id: 'prod-7',
    name: 'Dell Alienware m18 R2 Gaming Laptop (RTX 4090 / 64GB / 2TB)',
    brand: 'Dell',
    category: 'laptops',
    price: 4950000,
    oldPrice: 5300000,
    discount: 7,
    condition: 'Brand New',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    specs: ['Intel Core i9-14900HX', 'RTX 4090 16GB', '18" QHD+ 165Hz'],
    isFeatured: true,
    isFlashSale: false
  },
  {
    id: 'prod-8',
    name: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
    brand: 'Apple',
    category: 'laptops',
    price: 4200000,
    oldPrice: 4500000,
    discount: 7,
    condition: 'Pre-Owned Grade A+',
    conditionType: 'pre-owned',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    specs: ['M3 Max 14-core CPU', '30-core GPU', 'Liquid Retina XDR'],
    isFeatured: false,
    isFlashSale: true
  },
  {
    id: 'prod-9',
    name: 'Sony PlayStation 5 Slim 1TB Console (Disc Edition)',
    brand: 'Sony',
    category: 'gaming',
    price: 780000,
    oldPrice: 850000,
    discount: 8,
    condition: 'Brand New',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    specs: ['1TB High-Speed SSD', '4K 120Hz Output', 'DualSense Haptic'],
    isFeatured: false,
    isFlashSale: false
  },
  {
    id: 'prod-10',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    category: 'audio',
    price: 485000,
    oldPrice: 540000,
    discount: 10,
    condition: 'Brand New',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    specs: ['Industry Leading ANC', '30-Hour Battery', 'LDAC Hi-Res Audio'],
    isFeatured: false,
    isFlashSale: true
  },
  {
    id: 'prod-11',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium',
    brand: 'Apple',
    category: 'wearables',
    price: 1150000,
    oldPrice: 1280000,
    discount: 10,
    condition: 'Brand New Sealed',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&auto=format&fit=crop&q=80',
    specs: ['Grade 5 Titanium Case', '3000 nits Display', 'Up to 72h Battery'],
    isFeatured: false,
    isFlashSale: false
  },
  {
    id: 'prod-12',
    name: 'Apple iPad Pro 13" M4 Ultra Thin (256GB Wi-Fi)',
    brand: 'Apple',
    category: 'tablets',
    price: 1850000,
    oldPrice: 1980000,
    discount: 7,
    condition: 'Brand New',
    conditionType: 'brand-new',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    specs: ['Apple M4 Chip', 'Tandem OLED Display', 'Pencil Pro Support'],
    isFeatured: false,
    isFlashSale: false
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const flashSale = searchParams.get('flash_sale');

  try {
    const dbRes = await query(`
      SELECT id, name, brand, category_id as category, price, old_price as "oldPrice", 
             discount, condition, condition_type as "conditionType", 
             image_url as image, specs, is_featured as "isFeatured", 
             is_flash_sale as "isFlashSale", stock_quantity as "stock"
      FROM products
      ORDER BY created_at DESC
    `);

    let list = dbRes && dbRes.rows && dbRes.rows.length > 0 ? dbRes.rows : FALLBACK_PRODUCTS;

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (featured === 'true') {
      list = list.filter(p => p.isFeatured);
    }
    if (flashSale === 'true') {
      list = list.filter(p => p.isFlashSale);
    }

    return NextResponse.json({
      success: true,
      source: dbRes && dbRes.rows ? 'postgresql' : 'seeded_fallback',
      total: list.length,
      data: list
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      source: 'seeded_fallback',
      total: FALLBACK_PRODUCTS.length,
      data: FALLBACK_PRODUCTS
    });
  }
}

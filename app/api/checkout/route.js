import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const reference = 'BTG-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Save to PostgreSQL if available
    try {
      await query(
        `INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_reference, payment_status, items)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)`,
        [
          customer?.name || 'Customer',
          customer?.email || 'customer@babateeglobal.com',
          customer?.phone || '+234',
          customer?.address || 'UnderG Ogbomoso, Oyo State, Nigeria',
          totalAmount || 0,
          reference,
          JSON.stringify(items)
        ]
      );
    } catch (dbErr) {
      console.warn('Database insert deferred or not connected, proceeding with transaction ref generation.');
    }

    return NextResponse.json({
      success: true,
      message: 'Order initialized successfully',
      reference,
      totalAmount,
      currency: 'NGN',
      paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_sample',
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/verify?reference=${reference}`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
  }
}

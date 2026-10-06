import './globals.css';

export const metadata = {
  title: 'BABA TEE GLOBAL - Phones, Laptops & Gadgets | UnderG Ogbomoso & Nationwide Premium Delivery',
  description: 'Shop BABA TEE GLOBAL for genuine smartphones, laptops, gaming consoles, accessories, and flexible payment options. Physical store at UnderG Ogbomoso with Nationwide Premium Delivery across Nigeria.',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0F0F0F' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="ogabassey-storefront-shell">
        <a href="#main-content" className="baci-skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}

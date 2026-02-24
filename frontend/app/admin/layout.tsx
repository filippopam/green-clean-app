import Link from 'next/link';

export const metadata = {
  title: 'Admin - GreenClean',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <div className="flex">
          <aside className="w-64 bg-white border-r p-6 min-h-screen">
            <h2 className="text-lg font-bold mb-4">Portal Admin</h2>
            <nav className="space-y-2">
              <Link href="/admin" className="block text-sm text-gray-700 hover:text-green-600">Dashboard</Link>
              <Link href="/admin/products" className="block text-sm text-gray-700 hover:text-green-600">Productos</Link>
              <Link href="/admin/orders" className="block text-sm text-gray-700 hover:text-green-600">Pedidos</Link>
              <Link href="/" className="block text-sm text-gray-500 mt-4">Volver a la App</Link>
            </nav>
          </aside>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}

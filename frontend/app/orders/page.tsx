'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MisPedidosPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Buscamos al usuario en la memoria del navegador
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      setError('Debes iniciar sesión para ver tus pedidos.');
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);

    // 2. Traemos las órdenes del usuario REAL usando su ID
    fetch(`http://localhost:4000/api/orders/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error cargando historial:", err);
        setIsLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, React.ReactNode> = {
      SCHEDULED: <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Programado</span>,
      PICKED_UP: <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Recolectado</span>,
      IN_PROCESS: <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">En Lavado</span>,
      DELIVERED: <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Entregado</span>,
      CANCELLED: <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Cancelado</span>,
    };
    return badges[status] || <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-800">Mi Historial</h1>
        <Link href="/booking" className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-xl transition-colors">
          + Nuevo Pedido
        </Link>
      </div>

      {error ? (
        <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-100 text-red-600 font-medium">
          {error}
        </div>
      ) : isLoading ? (
        <p className="text-gray-500 text-center py-10">Cargando tus pedidos...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 mb-4">Aún no tienes pedidos registrados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-black text-gray-800">Orden #{order.id}</span>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-gray-500">
                  Fecha de recolección: {new Date(order.pickupDate).toLocaleDateString('es-MX')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {order.items?.length || 0} prenda(s)
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-black text-green-600">${parseFloat(order.finalAmount).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
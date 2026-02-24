// frontend/app/admin/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Package, MapPin, Phone, Calendar, Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos al entrar
  const fetchOrders = () => {
    fetch('http://localhost:4000/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Función para mover el estatus
  const cambiarEstatus = async (orderId: number, nuevoEstatus: string) => {
    if (!confirm(`¿Cambiar pedido #${orderId} a ${nuevoEstatus}?`)) return;

    await fetch(`http://localhost:4000/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nuevoEstatus })
    });
    
    fetchOrders(); // Recargar la lista para ver el cambio
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control 👔</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-600">Volver a la App</Link>
        </div>

        {loading ? <p>Cargando pedidos...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                
                {/* Header de la Tarjeta */}
                <div className={`p-4 border-b flex justify-between items-center
                  ${order.status === 'PENDIENTE' ? 'bg-yellow-50' : 
                    order.status === 'RECOGIDO' ? 'bg-blue-50' : 'bg-green-50'}`}>
                  <span className="font-bold text-gray-700">#{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${order.status === 'PENDIENTE' ? 'bg-yellow-200 text-yellow-800' : 
                      order.status === 'RECOGIDO' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Info del Cliente */}
                <div className="p-5 flex-1 space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Cliente</p>
                    <p className="font-medium text-gray-800">{order.user.fullName}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone size={14}/> <a href={`tel:${order.user.phone}`} className="hover:text-blue-600">{order.user.phone}</a>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Dirección</p>
                    <div className="flex items-start gap-1 text-sm text-gray-700">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-red-500"/>
                      <span>{order.address.street}, {order.address.neighborhood}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Fecha Programada</p>
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Calendar size={16} className="text-green-600"/>
                      <span>{new Date(order.scheduledDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="p-4 bg-gray-50 border-t grid grid-cols-2 gap-2">
                  {order.status === 'PENDIENTE' && (
                    <button 
                      onClick={() => cambiarEstatus(order.id, 'RECOGIDO')}
                      className="col-span-2 w-full bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Truck size={16} /> Ya lo recogí
                    </button>
                  )}

                  {order.status === 'RECOGIDO' && (
                    <button 
                      onClick={() => cambiarEstatus(order.id, 'ENTREGADO')}
                      className="col-span-2 w-full bg-green-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Ya lo entregué
                    </button>
                  )}

                  {order.status === 'ENTREGADO' && (
                    <div className="col-span-2 text-center text-green-600 font-bold text-sm flex items-center justify-center gap-2">
                      <CheckCircle size={18} /> Pedido Completado
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
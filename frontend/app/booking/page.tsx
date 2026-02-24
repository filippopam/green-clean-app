'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Guardamos el ID del usuario real
  const [userId, setUserId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    street: '',
    number: '',
    neighborhood: '',
    zipCode: '27018', 
    scheduledDate: ''
  });

  useEffect(() => {
    // 1. Obtener el usuario logueado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserId(JSON.parse(storedUser).id);
    } else {
      // Si entra aquí sin login, lo mandamos a que inicie sesión
      router.push('/login');
    }

    // 2. Traer el catálogo de productos
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error cargando catálogo:", err));
  }, [router]);

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const estimatedTotal = products.reduce((acc, product) => {
    const qty = cart[product.id] || 0;
    return acc + (parseFloat(product.price) * qty);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return; // Seguridad extra

    setIsLoading(true);
    setError('');

    const itemsPayload = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({
        productId: Number(id),
        quantity: qty
      }));

    if (itemsPayload.length === 0) {
      setError('Por favor selecciona al menos una prenda.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId, // AQUÍ ESTÁ LA MAGIA: Enviamos el ID real
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          zipCode: formData.zipCode,
          scheduledDate: formData.scheduledDate,
          items: itemsPayload
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/confirmacion'); 
      } else {
        setError(data.error || 'Ocurrió un error al crear la orden.');
      }
    } catch (err) {
      setError('No pudimos conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen mt-10 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-black text-green-600 mb-2">Arma tu pedido</h1>
      <p className="text-gray-500 mb-8">Selecciona tus prendas y dinos dónde recogemos.</p>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-2">1</span> 
            Datos de Recolección
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="Calle" className="col-span-2 p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
            <input required type="text" placeholder="Número (Ej. 123)" className="p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
            <input required type="text" placeholder="Colonia" className="p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
            <input required type="date" className="col-span-2 p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none text-gray-600" value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} />
          </div>
        </section>

        <section>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-2">2</span> 
            Tus Prendas
          </h2>
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div>
                  <p className="font-bold text-gray-800">{product.name}</p>
                  <p className="text-sm text-green-600 font-medium">${product.price} c/u</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 rounded-lg border border-gray-200 p-1">
                  <button type="button" onClick={() => updateQuantity(product.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 font-bold text-xl rounded-md hover:bg-white transition-colors">-</button>
                  <span className="w-4 text-center font-bold text-gray-800">{cart[product.id] || 0}</span>
                  <button type="button" onClick={() => updateQuantity(product.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 font-bold text-xl rounded-md hover:bg-white transition-colors">+</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="sticky bottom-4 bg-gray-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total estimado</p>
            <p className="text-2xl font-black">${estimatedTotal.toFixed(2)}</p>
          </div>
          <button type="submit" disabled={isLoading || estimatedTotal === 0} className="bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
            {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
}
// frontend/app/mis-pedidos/page.tsx
import Link from 'next/link';

export default function MisPedidosPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 mt-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="bg-green-100 text-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h1 className="text-4xl font-black text-gray-800 mb-4">¡Pedido Confirmado!</h1>
      <p className="text-gray-500 mb-8 text-lg">
        Tu orden ha sido registrada con éxito. Nuestro equipo pasará a recolectar tus prendas a la dirección indicada.
      </p>

      <div className="flex justify-center gap-4">
        <Link 
          href="/booking" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Hacer otro pedido
        </Link>
        <button 
          className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Ver historial
        </button>
      </div>
    </div>
  );
}
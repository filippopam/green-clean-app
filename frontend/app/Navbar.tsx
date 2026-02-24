'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Buscamos quién inició sesión realmente
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Recarga y manda al inicio
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="text-2xl font-black text-green-600 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
          GreenClean
        </span>
      </Link>
      
      <div className="flex items-center gap-2 md:gap-4">
        {user ? (
          // SI HAY SESIÓN: Mostramos sus pedidos y su nombre real
          <>
            <Link href="/orders" className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-xl font-medium transition-colors">
              📦 Mis Pedidos
            </Link>
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
              <span className="text-green-700 font-bold">👤 {user.name.split(' ')[0]}</span>
              <div className="h-4 w-px bg-green-200 mx-1"></div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Cerrar Sesión">
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          // SI NO HAY SESIÓN: Mostramos botón de Iniciar Sesión
          <Link href="/login" className="text-sm font-bold text-green-700 hover:underline bg-white px-4 py-2 rounded-full shadow border border-green-100 hover:shadow-md transition-all">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
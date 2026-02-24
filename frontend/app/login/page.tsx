// frontend/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');

      // GUARDAMOS EL TOKEN (LA LLAVE DE ACCESO)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert('¡Bienvenido de vuelta!');
      router.push('/'); // Redirigir al inicio (luego cambiaremos esto al Dashboard)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <Link href="/" className="text-gray-400 hover:text-green-600 flex items-center gap-1 mb-6 text-sm">
          <ArrowLeft size={16} /> Volver
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido</h1>
        <p className="text-gray-500 mb-6 text-sm">Ingresa a tu cuenta GreenClean.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              required
              type="email" 
              placeholder="Correo Electrónico"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              required
              type="password" 
              placeholder="Contraseña"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          ¿No tienes cuenta? <Link href="/register" className="text-green-600 font-bold hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
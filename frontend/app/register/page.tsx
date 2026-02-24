// frontend/app/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al registrarse');

      // Si todo sale bien, guardamos el token y vamos al dashboard (o login)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('¡Cuenta creada con éxito! Bienvenido a GreenClean.');
      router.push('/'); // Por ahora mandamos al home
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
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Crea tu cuenta</h1>
        <p className="text-gray-500 mb-6 text-sm">Únete a GreenClean y olvídate de lavar ropa.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              required
              type="text" 
              placeholder="Nombre Completo"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black"
              onChange={(e) => setForm({...form, fullName: e.target.value})}
            />
          </div>

          {/* Email */}
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

          {/* Teléfono */}
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              required
              type="tel" 
              placeholder="Teléfono Celular"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black"
              onChange={(e) => setForm({...form, phone: e.target.value})}
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              required
              type="password" 
              placeholder="Contraseña segura"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Registrarme'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          ¿Ya tienes cuenta? <Link href="/login" className="text-green-600 font-bold hover:underline">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}
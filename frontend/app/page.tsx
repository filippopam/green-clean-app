'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Truck, CheckCircle, Search, Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<any>(null); 
  const [step, setStep] = useState(1);
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [colonias, setColonias] = useState<string[]>([]);
  const [selectedColonia, setSelectedColonia] = useState('');
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const buscarCobertura = async () => {
    if (zip.length < 5) return;
    setLoading(true);
    setError('');
    setColonias([]);
    try {
      const res = await fetch(`http://localhost:4000/api/locations/neighborhoods?zipCode=${zip}`);
      if (!res.ok) throw new Error('Error de conexión');
      const data = await res.json();

      if (!data.covered) {
        setError('Lo sentimos, aún no cubrimos esta zona de Torreón.');
      } else {
        setColonias(data.neighborhoods);
        setStep(2);
      }
    } catch (err) {
      setError('No pudimos conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const confirmarRuta = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/locations/validate-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipCode: zip, neighborhood: selectedColonia })
      });
      const data = await res.json();
      if (data.success) {
        setRouteInfo(data);
        setStep(3);
      } else {
        setError('Hubo un problema validando la ruta.');
      }
    } catch (err) {
      setError('Error técnico al confirmar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-800 relative">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-10">
        <div className="bg-green-600 p-6 text-white text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Truck className="w-8 h-8" /> GreenClean
          </h1>
          <p className="text-green-100 mt-2 text-sm font-medium">Tintorería a Domicilio en Torreón</p>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="block text-sm font-semibold text-gray-700">¿Cuál es tu Código Postal?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej: 27018"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-lg outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all text-gray-900"
                />
                <button
                  onClick={buscarCobertura}
                  disabled={loading || zip.length < 5}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Search />}
                </button>
              </div>
              <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Prueba con: <b>27018</b> (Viñedos) o <b>27250</b> (Campestre).</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl border border-green-100">
                <CheckCircle className="w-6 h-6 shrink-0" />
                <span className="font-semibold text-sm">¡Sí tenemos cobertura en el {zip}!</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selecciona tu Colonia</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-3 bg-white text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none cursor-pointer"
                    onChange={(e) => setSelectedColonia(e.target.value)}
                    value={selectedColonia}
                  >
                    <option value="">-- Toca para elegir --</option>
                    {colonias.map((col) => <option key={col} value={col}>{col}</option>)}
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">▼</div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setStep(1); setColonias([]); }} className="px-4 py-3 text-gray-500 font-medium hover:bg-gray-100 rounded-xl">Atrás</button>
                <button onClick={confirmarRuta} disabled={!selectedColonia || loading} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 shadow-md">
                  {loading ? 'Cargando...' : 'Ver Horarios'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && routeInfo && (
            <div className="text-center animate-in zoom-in duration-300 py-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner">
                <MapPin className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">¡Ruta Disponible!</h2>
              <p className="text-gray-600 mt-2 text-lg">Tu zona es atendida por la:</p>
              <div className="mt-2 inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full font-bold text-sm border border-green-200">
                {routeInfo.route}
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">Días de Recolección</p>
                <div className="flex justify-center flex-wrap gap-2">
                  {routeInfo.days.includes(1) && <span className="dia-badge">Lunes</span>}
                  {routeInfo.days.includes(2) && <span className="dia-badge">Martes</span>}
                  {routeInfo.days.includes(3) && <span className="dia-badge">Miércoles</span>}
                  {routeInfo.days.includes(4) && <span className="dia-badge">Jueves</span>}
                  {routeInfo.days.includes(5) && <span className="dia-badge">Viernes</span>}
                </div>
              </div>
              
              {user ? (
                <Link 
                  href={`/booking?zip=${zip}&colonia=${selectedColonia}&days=${routeInfo.days.join(',')}`}
                  className="block w-full mt-6 bg-black text-white py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all text-center"
                >
                   📅 Agendar Recolección
                </Link>
              ) : (
                <Link href="/register" className="block w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all text-center">
                  Crear cuenta para pedir
                </Link>
              )}

              <button onClick={() => {setStep(1); setZip(''); setSelectedColonia('');}} className="mt-6 text-sm text-gray-400 hover:text-green-600 font-medium underline">
                Probar otra dirección
              </button>
            </div>
          )}

          {error && <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100">{error}</div>}
        </div>
      </div>
      <style jsx>{`
        .dia-badge { background-color: white; color: #15803d; border: 1px solid #bbf7d0; padding: 6px 16px; border-radius: 99px; font-weight: 700; font-size: 0.9rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      `}</style>
    </main>
  );
}
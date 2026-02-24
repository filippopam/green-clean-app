import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './Navbar'; // <--- Importamos nuestra nueva barra

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GreenClean - Tintorería',
  description: 'Tintorería a Domicilio en Torreón',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-800 min-h-screen flex flex-col`}>
        {/* Usamos el componente Navbar en lugar del código estático */}
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}

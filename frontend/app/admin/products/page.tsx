'use client';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setShowForm(true);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="flex items-center gap-2">
          <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded">Nuevo producto</button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">${p.price.toFixed(2)}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-sm px-3 py-1 bg-yellow-200 rounded">Editar</button>
                    <button onClick={() => deleteProduct(p.id)} className="text-sm px-3 py-1 bg-red-200 rounded">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '0');
  const [description, setDescription] = useState(product?.description || '');
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { name, price: Number(price), description };
      if (product) {
        await fetch(`/api/admin/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <form onSubmit={save} className="bg-white p-6 rounded shadow max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4">{product ? 'Editar producto' : 'Nuevo producto'}</h2>

        <label className="block mb-2 text-sm">Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-3 border rounded px-3 py-2" />

        <label className="block mb-2 text-sm">Precio</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mb-3 border rounded px-3 py-2" type="number" step="0.01" />

        <label className="block mb-2 text-sm">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-4 border rounded px-3 py-2" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-green-600 text-white">{saving ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}

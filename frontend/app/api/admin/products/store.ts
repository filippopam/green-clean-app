type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
};

let products: Product[] = [
  { id: 1, name: 'Lavado de ropa', price: 120.0, description: 'Lavado y secado estándar' },
  { id: 2, name: 'Tintorería - Camisa', price: 35.0, description: 'Tintorería profesional para camisa' },
];

let nextId = products.length + 1;

export function getAll() {
  return products;
}

export function createOne(data: { name: string; price: number; description?: string }) {
  const p: Product = { id: nextId++, name: data.name, price: data.price, description: data.description };
  products.push(p);
  return p;
}

export function findById(id: number) {
  return products.find((p) => p.id === id) || null;
}

export function updateOne(id: number, data: Partial<Product>) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...data };
  return products[idx];
}

export function deleteOne(id: number) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  return products.splice(idx, 1)[0];
}

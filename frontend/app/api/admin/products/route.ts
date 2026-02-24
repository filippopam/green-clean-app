import { NextResponse } from 'next/server';
import { getAll, createOne } from './store';
import { getSupabaseClient } from '../../../lib/supabase';

export async function GET() {
  const sb = getSupabaseClient();
  if (sb) {
    const { data, error } = await sb.from('products').select('*').order('id', { ascending: true });
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  return NextResponse.json(getAll());
}

export async function POST(req: Request) {
  const body = await req.json();
  const sb = getSupabaseClient();
  if (sb) {
    const { data, error } = await sb.from('products').insert([{ name: body.name || 'Sin nombre', price: Number(body.price) || 0, description: body.description }]).select().limit(1);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] ?? null, { status: 201 });
  }

  const p = createOne({ name: body.name || 'Sin nombre', price: Number(body.price) || 0, description: body.description });
  return NextResponse.json(p, { status: 201 });
}

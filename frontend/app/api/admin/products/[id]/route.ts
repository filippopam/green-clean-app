import { NextResponse } from 'next/server';
import { findById, updateOne, deleteOne } from '../store';
import { getSupabaseClient } from '../../../../lib/supabase';

export async function GET(req: Request, context: any) {
  const params = context?.params ? (typeof context.params.then === 'function' ? await context.params : context.params) : {};
  const id = Number(params.id);
  const sb = getSupabaseClient();
  if (sb) {
    const { data, error } = await sb.from('products').select('*').eq('id', id).limit(1).single();
    if (error) return NextResponse.json({ message: error.message }, { status: 404 });
    return NextResponse.json(data);
  }

  const prod = findById(id);
  if (!prod) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(prod);
}

export async function PUT(req: Request, context: any) {
  const params = context?.params ? (typeof context.params.then === 'function' ? await context.params : context.params) : {};
  const id = Number(params.id);
  const body = await req.json();
  const sb = getSupabaseClient();
  if (sb) {
    const { data, error } = await sb.from('products').update({ name: body.name, price: Number(body.price), description: body.description }).eq('id', id).select().limit(1);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] ?? null);
  }

  const updated = updateOne(id, { name: body.name, price: Number(body.price), description: body.description });
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, context: any) {
  const params = context?.params ? (typeof context.params.then === 'function' ? await context.params : context.params) : {};
  const id = Number(params.id);
  const sb = getSupabaseClient();
  if (sb) {
    const { data, error } = await sb.from('products').delete().eq('id', id).select().limit(1);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] ?? null);
  }

  const removed = deleteOne(id);
  if (!removed) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(removed);
}

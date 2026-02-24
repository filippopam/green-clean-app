import { NextResponse } from 'next/server';
import { getAll } from '../store';
import { getSupabaseClient } from '../../../../lib/supabase';

export async function POST(req: Request) {
  const secretHeader = req.headers.get('x-migrate-secret');
  const expected = process.env.MIGRATE_SECRET;

  if (!expected || !secretHeader || secretHeader !== expected) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = getAll();
  const sb = getSupabaseClient();
  if (!sb) {
    return NextResponse.json({ message: 'Supabase not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });
  }

  try {
    // Upsert by id to avoid duplicates; assumes table `products` with columns id, name, price, description
    const { data: inserted, error } = await sb.from('products').upsert(data, { onConflict: 'id' }).select();
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ migrated: inserted?.length ?? 0, rows: inserted });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || String(e) }, { status: 500 });
  }
}

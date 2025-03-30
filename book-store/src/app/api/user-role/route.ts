// app/api/user-role/route.ts

import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) return NextResponse.json({ error: 'Missing UID' }, { status: 400 });

  const userDoc = await getDoc(doc(db, 'users', uid));
  const role = userDoc.exists() ? userDoc.data().role : null;

  return NextResponse.json({ role });
}

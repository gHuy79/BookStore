// app/api/session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin';
import { serialize } from 'cookie';

const serviceAccount: ServiceAccount = {
  projectId: 'h-bookstore',
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    // Xác thực token
    // const decoded = await getAuth().verifyIdToken(token);

    // Tạo session cookie có thời hạn 5 ngày
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 ngày

    const sessionCookie = await getAuth().createSessionCookie(token, { expiresIn });

    const cookie = serialize('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn / 1000,
    });

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
      },
    });
  } catch (err) {
    console.error('[SESSION ERROR]', err);
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
}

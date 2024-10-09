import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n') ,
        }),
    });
}

export async function POST(req: Request) {
    const token = req.headers.get('cookie');

    if (!token) {
        return NextResponse.json({ message: 'Token not found' }, { status: 401 });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        return NextResponse.json({ valid: true, decodedToken }, { status: 200 });
    } catch (error) {
        console.error('Error de verificación del token:', error); 
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}

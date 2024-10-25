import { NextResponse } from 'next/server';
import { admin } from '../../../config/firebase/firebaseAdmin'

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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const publicPaths = ['/login'];

    if (publicPaths.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Llamar a la API interna para verificar el token
    const verifyUrl = new URL('/api/verifyToken', req.url);

    return fetch(verifyUrl.toString(), {
        method: 'POST',
        headers: {
            cookie: token || '',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            return NextResponse.next();  // Token válido, continuar
        } else {
            return NextResponse.redirect(new URL('/login', req.url));  // Token inválido, redirigir
        }
    })
    .catch((error) => {
        console.error('Error verificando el token:', error);
        return NextResponse.redirect(new URL('/login', req.url));  // Redirigir si hay error
    });
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

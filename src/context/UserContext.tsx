/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/config/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Escuchar cambios en el estado de autenticación de Firebase
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        // Limpiar la suscripción cuando el componente se desmonte
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para acceder al usuario desde cualquier parte de la aplicación
export const useUser = () => useContext(UserContext);

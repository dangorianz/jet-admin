/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/config/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Escuchar cambios en el estado de autenticación de Firebase
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true)
            if (currentUser) {
                setUser(currentUser);
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setRole(userData.role || null); 
                } else {
                    console.error("No se encontró el documento del usuario en Firestore");
                }
            } else {
                setUser(null);
                setRole(null); 
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, role, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para acceder al usuario desde cualquier parte de la aplicación
export const useUser = () => useContext(UserContext);

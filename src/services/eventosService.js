import { addDoc, collection, getDocs, query } from "firebase/firestore";

import { db } from "../config/firebase/firebaseConfig"

export const createEventService = async (payload, user) => {

    const body = {
        date: payload.date,
        name: payload.name,
        sectores: {
            general: payload.general,
            vip: payload.vip,
            supervip: payload.supervip
        },
        estado: 'activo',
        usuario: {
            id: user?.uid,
            nombre: user?.displayName || '',
            email: user?.email,
        },
        createAt: new Date(),
    }
    try {
        const docRef = await addDoc(collection(db, 'eventos'), body)
        console.log('Documento escrito con ID: ', docRef.id);
        return true;
    } catch (error) {
        console.error('Error al crear los documentos: ', error);
        return false
    }
}

export const getEventsService = async () => {
    try {
        const inventoriesRef = collection(db, 'eventos');
        const q = query( inventoriesRef )
        const snapshot = await getDocs(q)
        const dataEvents = snapshot.docs.map(doc => ({ id: doc.id, name:doc.name, ...doc.data() }));
        return { events: dataEvents };
    } catch (error) {
        console.error('Error al obtener los documentos: ', error);
        return { events: [] }
    }
}
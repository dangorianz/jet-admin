import { addDoc, collection, doc, getDoc, getDocs, query } from "firebase/firestore";

import { db } from "../config/firebase/firebaseConfig"

export const createTicketService = async (payload, user) => {
    // 4SCg8Y2PMduCn3qlXaY9

    const body = {
        evento: payload.evento,
        precio: payload.precio,
        cliente: {
            nombre: payload.nombre,
            edad: payload.edad,
            telefono: payload.telefono
        },
        usuario: {
            id: user?.uid,
            nombre: user?.displayName || '',
            email: user?.email,
        },
        sector: payload.sector,
        estado:'activo',
        createAt: new Date()
    }
    try {
        const docRef = await addDoc(collection(db, 'entradas'), body)
        console.log('Documento escrito con ID: ', docRef.id);
        return { ok:true, ticketId: docRef.id };
    } catch (error) {
        console.error('Error al crear los documentos: ', error);
        return { ok:false };
    }
}

export const getTickesService = async () => {
    try {
        const ticketsRef = collection(db, 'entradas');
        const q = query( ticketsRef )
        const snapshot = await getDocs(q)
        const dataEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { events: dataEvents };
    } catch (error) {
        console.error('Error al obtener los documentos: ', error);
        return { events: [] }
    }
}

export const getTicketByIdService = async (id) => {
    try {
        const ticketRef = doc(db, 'entradas', id);
        const snapshot = await getDoc(ticketRef)
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() };
        } 
        console.log('No se encontró el documento');
        return null;
    } catch (error) {
        console.error('Error al obtener los documento: ', error);
        return null;
    }
}
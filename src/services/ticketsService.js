import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

import { db } from "../config/firebase/firebaseConfig"
import moment from "moment";

export const createTicketService = async (payload, user) => {

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
        createAt: moment().format('DD/MM/YYYY hh:mm:ss')
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
export const getTickesServiceByEvent = async (id) => {
    try {
        const ticketsRef = collection(db, 'entradas');
        const q = query( ticketsRef , where("evento", "==", id))
        const snapshot = await getDocs(q)
        const dataEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { tickets: dataEvents };
    } catch (error) {
        console.error('Error al obtener los documentos: ', error);
        return { tickets: [] }
    }
}

export const getTicketByIdService = async (id) => {
    try {
        const ticketRef = doc(db, 'entradas', id);
        const snapshot = await getDoc(ticketRef)
        if (snapshot.exists()) {
            const ticket = { id: snapshot.id, ...snapshot.data() };
            const eventRef = doc(db,'eventos', ticket?.evento)
            const snapshotEvent = await getDoc(eventRef)
            const evento = { id: snapshotEvent.id, ...snapshotEvent.data()}

            return {...ticket, artImageUrl: evento.artImageUrl};
        } 
        console.log('No se encontró el documento');
        return null;
    } catch (error) {
        console.error('Error al obtener los documento: ', error);
        return null;
    }
}

export const updateTicket = async (ticket) => {
    try {
        const ticketRef = doc(db, 'entradas', ticket);
        const snapshot = await getDoc(ticketRef)
        if (snapshot.exists()) {
            const ticketResponse = { id: snapshot.id, ...snapshot.data() };

            if (ticketResponse.estado === 'activo') {
                await updateDoc(ticketRef, {
                    estado: 'usado'
                })
                return { ok: true, msg:''};
            }
            if (ticketResponse.estado === 'usado') {
                return { ok: false, msg:'Entrada ya utilizada'}
            }
        }else{
            return { ok: false, msg:'Esta entrada no existe' };
        }

        
    } catch (error) {
        console.error('Error al actualizar entrada: ', error);
        return { ok: false, msg:'Error al verificar entrada'};
    }
}
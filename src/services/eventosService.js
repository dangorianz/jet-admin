import {  getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import moment from "moment";

import { db, storage } from "../config/firebase/firebaseConfig"


const uploadImageToFirebase = async (imageFile) => {
    const nameArte = `${imageFile.name}-${Date.now()}`
    const storageRef = ref(storage, `eventos/${nameArte}`);
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);
    return {downloadURL, nameArte};
};

export const createEventService = async (payload, user) => {

    let imageURL = '';
    let art = '';
    if (payload.artImage) {
        try {
            const resp = await uploadImageToFirebase(payload.artImage);
            imageURL = resp.downloadURL
            art = resp.nameArte
        } catch (error) {
            console.log('Error al subir la imagen: ', error);
            return false
        }
    }

    const body = {
        date: moment(payload.date).format('DD/MM/YYYY'),
        name: payload.name,
        sectores: {
            camel: payload.camel,
            cbn: payload.cbn,
            parrales: payload.parrales,
            experiencia: payload.experiencia,
            mambo: payload.mambo,
            digestan: payload.digestan
        },
        artImageUrl: imageURL,
        artImage: art,
        estado: 'activo',
        usuario: {
            id: user?.uid,
            nombre: user?.displayName || '',
            email: user?.email,
        },
        urls:[],
        createAt: moment().format('DD/MM/YYYY hh:mm:ss')
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

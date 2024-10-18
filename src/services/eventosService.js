import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import moment from "moment";

import { db, storage } from "../config/firebase/firebaseConfig"


const uploadImageToFirebase = async (imageFile) => {
    const storageRef = ref(storage, `eventos/${imageFile.name}-${Date.now()}`);
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export const loadImage = async () => {
    try {
        const imageRef = ref(storage, 'eventos/jet.png-1729026423156');
        const url = await getDownloadURL(imageRef);
        return url; // Devuelve la URL de la imagen
    } catch (error) {
        console.error('Error al obtener la URL de descarga:', error);
        return null;
    }
};

export const createEventService = async (payload, user) => {

    let imageURL = '';
    if (payload.artImage) {
        try {
            imageURL = await uploadImageToFirebase(payload.artImage);
        } catch (error) {
            console.log('Error al subir la imagen: ', error);
            return false
        }
    }

    const body = {
        date: moment(payload.date).format('DD/MM/YYYY'),
        name: payload.name,
        sectores: {
            general: payload.general,
            vip: payload.vip,
            supervip: payload.supervip
        },
        artImageUrl: imageURL, 
        estado: 'activo',
        usuario: {
            id: user?.uid,
            nombre: user?.displayName || '',
            email: user?.email,
        },
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

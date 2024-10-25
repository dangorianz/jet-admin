import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from "../config/firebase/firebaseConfig"
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';

export const createUserService = async (usuario) => {
    const {email, nombre, password, rol} = usuario;
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;

        await updateProfile(user, { displayName: nombre})

        await setDoc(doc(db,'users', user.uid), {
            name: nombre,
            email: email,
            role: rol,
            createdAt: new Date(),
        })

        return { ok: true}
    } catch (error) {
        console.error("Error al crear el usuario o guardar datos:", error.message);
        return { ok: false }
    }
}

export const getUsers = async () => {
    try {
        const usersRef = collection(db, 'users');
        const q = query( usersRef )
        const snapshot = await getDocs(q)
        const dataUsers = snapshot.docs.map(doc => ({ id: doc.id, name:doc.name, ...doc.data() }));
        return { users: dataUsers };
    } catch (error) {
        console.error('Error al obtener los ususarios: ', error);
        return { users: [] }
    }
}
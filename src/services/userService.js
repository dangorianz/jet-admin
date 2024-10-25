import { admin } from '../config/firebase/firebaseAdmin'

export const getAllUsers = async () => {
    try {
        const listUserResult = await admin.auth().listUsers();
        const users = listUserResult.users.map( user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            disabled: user.disabled,
        }))
        return { users }
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return { users: [] };
    }
}

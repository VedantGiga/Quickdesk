import * as admin from 'firebase-admin';

export enum UserRole {
  AGENT = 'agent',
  END_USER = 'end_user'
}

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
}

export const createUserWithRole = async (email: string, password: string, role: UserRole) => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    return { uid: userRecord.uid, email, role };
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
};

export const updateUserRole = async (uid: string, role: UserRole) => {
  try {
    await admin.firestore().collection('users').doc(uid).update({ role });
    await admin.auth().setCustomUserClaims(uid, { role });
    return true;
  } catch (error) {
    throw new Error(`Failed to update user role: ${error}`);
  }
};
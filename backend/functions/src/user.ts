import * as admin from 'firebase-admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  company?: string;
  timezone?: string;
  avatar?: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  ticketUpdates: boolean;
  agentReplies: boolean;
  statusChanges: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  language: string;
  theme: 'light' | 'dark';
}

export const getUserProfile = async (uid: string) => {
  const doc = await admin.firestore().collection('user_profiles').doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const updateUserProfile = async (uid: string, profileData: Partial<UserProfile>) => {
  const updateData = {
    ...profileData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await admin.firestore().collection('user_profiles').doc(uid).set(updateData, { merge: true });
  return updateData;
};

export const getUserSettings = async (uid: string) => {
  const doc = await admin.firestore().collection('user_settings').doc(uid).get();
  return doc.exists ? doc.data() : getDefaultSettings();
};

export const updateUserSettings = async (uid: string, settings: Partial<UserSettings>) => {
  await admin.firestore().collection('user_settings').doc(uid).set(settings, { merge: true });
  return settings;
};

const getDefaultSettings = (): UserSettings => ({
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    ticketUpdates: true,
    agentReplies: true,
    statusChanges: true,
  },
  language: 'en',
  theme: 'light',
});
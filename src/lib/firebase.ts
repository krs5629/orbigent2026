import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "positive-composite-26pck",
  appId: "1:703930129101:web:7b2b2575ff36e81bafa784",
  apiKey: "AIzaSyAxZPjaoL_Ii60O_TUA885W860-dC7Y1tc",
  authDomain: "positive-composite-26pck.firebaseapp.com",
  storageBucket: "positive-composite-26pck.firebasestorage.app",
  messagingSenderId: "703930129101"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-nrl2026innovatio-08858706-99bd-4cc0-87ce-02b0cc21b25d");
export const auth = getAuth(app);
export const storage = getStorage(app);

export const ADMIN_EMAILS = [
  'iniziofuturo@gmail.com',
  'kyathi5629@gmail.com'
];

export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

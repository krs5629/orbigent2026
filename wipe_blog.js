import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "positive-composite-26pck",
  appId: "1:703930129101:web:7b2b2575ff36e81bafa784",
  apiKey: "AIzaSyAxZPjaoL_Ii60O_TUA885W860-dC7Y1tc",
  authDomain: "positive-composite-26pck.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-nrl2026innovatio-08858706-99bd-4cc0-87ce-02b0cc21b25d");

async function wipe() {
  const snap = await getDocs(collection(db, 'blog'));
  for (const d of snap.docs) {
    await deleteDoc(doc(db, 'blog', d.id));
  }
  console.log("Wiped " + snap.docs.length + " docs.");
  process.exit(0);
}
wipe();

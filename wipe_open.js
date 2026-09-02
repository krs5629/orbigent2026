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

const collections = [
  'mechanical_cad', 'mechanical_evolution',
  'electronics_diagrams', 'electronics_issues',
  'programming_logic', 'programming_media',
  'challenges', 'media_highlights', 'resources',
  'team', 'blog'
];

async function wipe() {
  let total = 0;
  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, col, d.id));
      total++;
    }
  }
  console.log("Wiped " + total + " docs total.");
  process.exit(0);
}
wipe();

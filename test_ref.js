import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';
const firebaseConfig = {
  projectId: "positive-composite-26pck",
  appId: "1:703930129101:web:7b2b2575ff36e81bafa784",
  apiKey: "AIzaSyAxZPjaoL_Ii60O_TUA885W860-dC7Y1tc",
  authDomain: "positive-composite-26pck.firebaseapp.com",
  storageBucket: "positive-composite-26pck.firebasestorage.app"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
try {
  ref(storage, "https://images.unsplash.com/photo-1518770660439-4636190af475");
  console.log("Success");
} catch(e) {
  console.log("Caught:", e.message);
}

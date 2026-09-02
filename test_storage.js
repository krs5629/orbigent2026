import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  projectId: "positive-composite-26pck",
  appId: "1:703930129101:web:7b2b2575ff36e81bafa784",
  apiKey: "AIzaSyAxZPjaoL_Ii60O_TUA885W860-dC7Y1tc",
  authDomain: "positive-composite-26pck.firebaseapp.com",
  storageBucket: "positive-composite-26pck.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

async function test() {
  try {
    try {
      await signInAnonymously(auth);
    } catch(e) {}
    const r = ref(storage, 'test.txt');
    await uploadString(r, 'hello world');
    console.log("Success");
  } catch(e) {
    console.error("Caught:", e);
  }
  process.exit(0);
}
test();

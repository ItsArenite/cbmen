import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9yCoGjoFAlvs3fNBOAYTsXcN86nCpOYY",
  authDomain: "chatjoabuttdev.firebaseapp.com",
  projectId: "chatjoabuttdev",
  storageBucket: "chatjoabuttdev.appspot.com",
  messagingSenderId: "479546095872",
  appId: "1:479546095872:web:3ebae01123ae2a6d09dbe5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    const { user } = await signInWithPopup(auth, provider);

    return { uid: user.uid, displayName: user.displayName };
  } catch (error) {
    if (error.code !== "auth/cancelled-popup-request") {
      console.error(error);
    }
    return null;
  }
}

async function sendMessage(roomId, user, text) {
  try {
    await addDoc(collection(db, "chat-rooms", roomId, "messages"), {
      uid: user.uid,
      displayName: user.displayName,
      text: text.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

function getMessages(roomId, callback) {
  return onSnapshot(
    query(
      collection(db, "chat-rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    ),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((x) => ({
        id: x.id,
        ...x.data(),
      }));

      callback(messages);
    }
  );
}

async function sendMessageBot(roomId, text) {
  try {
    await addDoc(collection(db, "chat-rooms", roomId, "messages"), {
      uid: "bPiif3D8nGPqDT3EDjNeggIkzSy2",
      displayName: "Chatty Businessman",
      text: text.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

export { loginWithGoogle, sendMessage, getMessages, sendMessageBot };

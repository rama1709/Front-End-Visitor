import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDPEDU-iZUQ6aXaqFmpOOH1jMnYn771CVE",
  authDomain: "visitor-management-ad43d.firebaseapp.com",
  projectId: "visitor-management-ad43d",
  storageBucket: "visitor-management-ad43d.firebasestorage.app",
  messagingSenderId: "1073225773127",
  appId: "1:1073225773127:web:292689f26b3a2c44a74162",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const messagingPromise =
  typeof window !== "undefined"
    ? isSupported().then((ok) => (ok ? getMessaging(app) : null))
    : Promise.resolve(null);

export default app;
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDPEDU-iZUQ6aXaqFmp0OH1jMnYn771CVE",
  authDomain: "visitor-management-ad43d.firebaseapp.com",
  projectId: "visitor-management-ad43d",
  storageBucket: "visitor-management-ad43d.firebasestorage.app",
  messagingSenderId: "1073225773127",
  appId: "1:1073225773127:web:292689f26b3a2c44a74162",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || "Notification",
    {
      body: payload.notification?.body || "",
      icon: "/favicon.ico",
    }
  );
});
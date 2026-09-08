importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBERJXhe8vT70lu0RKLfSz0571PfbTBicA",
  authDomain: "oandd-116b5.firebaseapp.com",
  projectId: "oandd-116b5",
  storageBucket: "oandd-116b5.firebasestorage.app",
  messagingSenderId: "1015861654341",
  appId: "1:1015861654341:web:5307eb430927a6275a442c",
  measurementId: "G-0GRFB9F8LM"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Ouiya Offer Update';
  const notificationOptions = {
    body: payload.notification?.body || 'Check out the latest deals!',
    icon: payload.notification?.icon || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

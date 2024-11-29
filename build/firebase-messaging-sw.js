importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDLu_SNw66YIVs8ruwMGwxnv1DDcxuzbKQ",
  authDomain: "test-1ed88.firebaseapp.com",
  projectId: "test-1ed88",
  storageBucket: "test-1ed88.firebasestorage.app",
  messagingSenderId: "240250228794",
  appId: "1:240250228794:web:ddef4fee8b65752e5d6503"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Assurez-vous que cette icône est accessible
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
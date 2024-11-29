import React, { useEffect, useState } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken as getFCMToken, onMessage } from 'firebase/messaging';
import { register } from './serviceWorkerRegistration'; // Assurez-vous que ce chemin est correct

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLu_SNw66YIVs8ruwMGwxnv1DDcxuzbKQ",
  authDomain: "test-1ed88.firebaseapp.com",
  projectId: "test-1ed88",
  storageBucket: "test-1ed88.firebasestorage.app",
  messagingSenderId: "240250228794",
  appId: "1:240250228794:web:ddef4fee8b65752e5d6503",
  measurementId: "G-NCX2XWPCS9"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function App() {
  const [notification, setNotification] = useState({ title: '', body: '' });

  // Enregistrement du service worker
  useEffect(() => {
    register({
      onUpdate: registration => {
        console.log('Service Worker updated:', registration);
      },
      onSuccess: registration => {
        console.log('Service Worker registered:', registration);
      }
    });
  }, []);

  // Demande de permission pour les notifications
  const requestPermission = async () => {
    console.log('Demande de permission...');
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permission accordée.');
        await fetchFCMToken(); // Appel à la fonction pour récupérer le token FCM
      } else {
        console.error('Permission refusée');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
    }
  };

  // Récupération du token FCM
  const fetchFCMToken = async () => {
    try {
      const vapidKey = 'BIsFRIerqr3JOxS93ZSk5Giq-Rt81E2sdErv5HGKOA-hS8t3mTxtQQr8jwLDqRomJ3STyTNSlbv_SXBL97IdJiA';
      const token = await getFCMToken(messaging, { vapidKey });
      
      if (token) {
        console.log('Token FCM:', token);
        // Envoyez ce token à votre serveur ici
      } else {
        console.log('Aucun token d\'enregistrement disponible.');
      }
    } catch (err) {
      console.error('Une erreur est survenue lors de la récupération du token :', err);
    }
  };

  // Gestion des messages reçus lorsque l'application est au premier plan
  useEffect(() => {
    requestPermission(); // Demande de permission lors du premier rendu

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message reçu:', payload);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body
      });
    });

    return () => unsubscribe(); // Nettoyage à la désinscription
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ma PWA React avec Notifications Push</h1>
        <button onClick={requestPermission}>Demander la permission pour les notifications</button>
        {notification.title && (
          <div>
            <h2>Dernière notification :</h2>
            <p>{notification.title}</p>
            <p>{notification.body}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
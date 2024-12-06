import React, { useEffect, useState } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken as getFCMToken, onMessage } from 'firebase/messaging';
import { register } from './serviceWorkerRegistration';

const firebaseConfig = {
  apiKey: "AIzaSyDLu_SNw66YIVs8ruwMGwxnv1DDcxuzbKQ",
  authDomain: "test-1ed88.firebaseapp.com",
  projectId: "test-1ed88",
  storageBucket: "test-1ed88.firebasestorage.app",
  messagingSenderId: "240250228794",
  appId: "1:240250228794:web:ddef4fee8b65752e5d6503",
  measurementId: "G-NCX2XWPCS9"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function App() {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [fcmToken, setFcmToken] = useState('');
  const [isInstallable, setIsInstallable] = useState(false);
  let deferredPrompt;
  
  // Utilisation d'une référence mutable pour unsubscribe
  const unsubscribeRef = React.useRef(null);

  useEffect(() => {
    // Enregistrement du service worker
    register({
      onUpdate: registration => console.log('Service Worker updated:', registration),
      onSuccess: registration => console.log('Service Worker registered:', registration)
    });

    // Demande de permission pour les notifications
    requestPermission();

    // Gestion des messages reçus
    unsubscribeRef.current = onMessage(messaging, (payload) => {
      console.log('Message reçu:', payload);
      if (payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon
        });
      }
    });

    // Gestion de l'événement beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setIsInstallable(true); // Affichez le bouton d'installation
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current(); // Appel de unsubscribe si défini
      }
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Utilisateur a accepté l\'installation');
        } else {
          console.log('Utilisateur a refusé l\'installation');
        }
        deferredPrompt = null;
        setIsInstallable(false); // Masquez le bouton après utilisation
      });
    }
  };

  const requestPermission = async () => {
    console.log('Demande de permission...');
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permission accordée.');
        await fetchFCMToken();
      } else {
        console.error('Permission refusée');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
    }
  };

  const fetchFCMToken = async () => {
    try {
      const vapidKey = 'BIsFRIerqr3JOxS93ZSk5Giq-Rt81E2sdErv5HGKOA-hS8t3mTxtQQr8jwLDqRomJ3STyTNSlbv_SXBL97IdJiA';
      const token = await getFCMToken(messaging, { vapidKey });
      
      if (token) {
        console.log('Token FCM:', token);
        setFcmToken(token);
        sendTokenToServer(token);
      } else {
        console.log('Aucun token d\'enregistrement disponible.');
      }
    } catch (err) {
      console.error('Une erreur est survenue lors de la récupération du token :', err);
    }
  };

  const sendTokenToServer = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'kiki'  
        },
        body: JSON.stringify({ token }),
      });
      
      if (response.ok) {
        console.log('Token envoyé au serveur avec succès');
      } else {
        console.error('Erreur lors de l\'envoi du token au serveur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du token au serveur:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ma PWA React avec Notifications Push</h1>
        
        {isInstallable && (
          <button onClick={handleInstallClick}>Installer l'application</button>
        )}
        
        <button onClick={requestPermission}>Demander la permission pour les notifications</button>
        
        {fcmToken && <p>Token FCM: {fcmToken}</p>}
        
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
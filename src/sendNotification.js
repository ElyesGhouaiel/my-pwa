const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Remplacez par le chemin vers votre fichier JSON

// Initialisez l'application avec les informations du compte de service
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Fonction pour envoyer une notification
const sendNotification = async (token) => {
  const message = {
    notification: {
      title: 'Titre de la notification',
      body: 'Corps de la notification',
    },
    token: token, // Remplacez par le token FCM du destinataire
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification envoyée avec succès:', response);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
  }
};

// Exemple d'utilisation : remplacez par un token valide
const recipientToken = 'TOKEN_DU_DESTINATAIRE'; // Remplacez par le token FCM du destinataire
sendNotification(recipientToken);
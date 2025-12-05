import * as api from './supabase/api';

// Fonction pour initialiser les données de démo dans Supabase
export async function initDemoData(userId: string) {
  try {
    console.log('Initialisation des données de démo pour', userId);

    // Textes de démo
    const demoTexts = [
      {
        author: { name: 'Sophie Mercier', avatar: '' },
        title: 'Lueur du matin',
        content: `L'aube se lève doucement
Sur les toits endormis
Un frisson de lumière
Traverse mon cœur meurtri
Dans le silence du petit jour
Je retrouve mes souvenirs
Et dans tes yeux d'amour
L'espoir de te retenir`,
        category: 'Poème',
        date: 'il y a 2h',
        publishedAt: new Date('2025-11-17T08:00:00'),
        isEchoed: false,
        isSaved: false,
        hasAudioRecording: true,
        subscribersOnly: true,
      },
      {
        author: { name: 'Sophie Mercier', avatar: '' },
        title: "Souvenirs d'octobre",
        content: `Les feuilles tombent une à une
Comme les pages d'un livre ancien
Chaque couleur, chaque parfum
Me rappelle que rien n'est vain
Octobre m'a appris à lâcher prise
À accepter que tout s'en aille
Mais dans cette douce reprise
Je trouve enfin ma bataille`,
        category: 'Poème',
        date: 'il y a 15 jours',
        publishedAt: new Date('2025-10-28T14:00:00'),
        isEchoed: false,
        isSaved: false,
        hasAudioRecording: false,
        subscribersOnly: true,
      },
      {
        author: { name: userId, avatar: '' },
        title: 'Entre les lignes',
        content: `Il y a des mots qui ne se disent pas
Des silences qui parlent plus fort
Entre nous, il y a tout ça
Des non-dits qui nous réconfortent encore
Je t'écris sans vraiment t'écrire
Dans l'espace entre les lignes
Où nos âmes peuvent se dire
Ce que nos bouches dessinent`,
        category: 'Poème',
        date: 'il y a 1 jour',
        publishedAt: new Date('2025-11-16T18:00:00'),
        isEchoed: false,
        isSaved: false,
        hasAudioRecording: false,
        subscribersOnly: false,
      },
    ];

    // Sauvegarder les textes
    for (const text of demoTexts) {
      await api.saveText(text);
    }

    // Abonnement de démo
    await api.saveSubscription(userId, 'Sophie Mercier', 3.99);

    // Duos de démo
    await api.saveDuo(userId, 'Sophie Mercier');
    await api.saveDuo(userId, 'Lucas Bernard');

    console.log('Données de démo initialisées avec succès');
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données de démo:", error);
    return false;
  }
}

// Vérifier si les données de démo ont déjà été initialisées
export async function checkDemoDataExists(userId: string): Promise<boolean> {
  try {
    const { texts } = await api.getTexts();
    return texts && texts.length > 0;
  } catch (error) {
    return false;
  }
}



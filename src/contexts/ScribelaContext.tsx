import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import * as api from '../utils/supabase/api';
import { initDemoData, checkDemoDataExists } from '../utils/initDemoData';

// Types
export interface Text {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  title: string;
  content: string;
  category: string;
  themes?: string;
  location?: string;
  date: string;
  publishedAt: Date;
  isEchoed?: boolean;
  isSaved?: boolean;
  hasNewComments?: boolean;
  hasAudioRecording?: boolean;
  subscribersOnly?: boolean;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  memberCount?: number;
  isDuo?: boolean;
}

export interface GardenComment {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  date: string;
  timestamp: Date;
}

export interface DuoMessage {
  id: string;
  user: { name: string };
  content: string;
  date: string;
  timestamp: Date;
}

export interface Subscriber {
  name: string;
  subscribedAt: Date;
}

export interface Donor {
  name: string;
  amount: number;
  message?: string;
  donatedAt: Date;
}

export interface SubscribedAuthor {
  authorName: string;
  price: number;
  subscribedAt: Date;
}

export interface Duo {
  name: string;
  createdAt: Date;
}

export interface Sponsorship {
  id: string;
  brand: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  createdAt?: number;
}

// Context Type
interface ScribelaContextType {
  // Textes
  texts: Text[];
  addText: (text: Omit<Text, 'id'>) => Promise<void>;
  deleteText: (textId: string) => Promise<void>;
  toggleEcho: (textId: string) => Promise<void>;
  toggleSave: (textId: string) => void;

  // Commentaires des jardins
  gardenComments: { [textId: string]: GardenComment[] };
  addGardenComment: (
    textId: string,
    comment: Omit<GardenComment, 'id' | 'timestamp'>
  ) => Promise<void>;
  deleteGardenComment: (textId: string, commentId: string) => Promise<void>;
  reloadGardenComments: () => Promise<void>;

  // Abonnements
  subscribedAuthors: SubscribedAuthor[];
  addSubscription: (authorName: string, price: number) => Promise<void>;
  removeSubscription: (authorName: string) => Promise<void>;

  // Abonnés de l'utilisateur
  mySubscribers: Subscriber[];

  // Donateurs
  myDonors: Donor[];
  addDonation: (donor: Donor) => Promise<void>;

  // Duos
  myDuos: Duo[];
  addDuo: (name: string) => Promise<void>;
  deleteDuo: (name: string) => Promise<void>;

  // Messages de duos
  duoMessages: { [key: string]: DuoMessage[] };
  addDuoMessage: (
    duoName: string,
    message: Omit<DuoMessage, 'id' | 'timestamp'>
  ) => Promise<void>;
  reloadDuoMessages: () => Promise<void>;

  // Cercles personnalisés
  customCircles: Circle[];
  addCircle: (circle: Omit<Circle, 'id'>) => Promise<void>;
  deleteCircle: (circleId: string) => Promise<void>;

  // Dernières lectures (pour messages non lus)
  lastReads: { [key: string]: string };
  markAsRead: (
    conversationId: string,
    conversationType: 'circle' | 'duo' | 'garden'
  ) => Promise<void>;

  // Loading state
  isLoading: boolean;

  // User
  currentUser: string;
  setCurrentUser: (name: string) => void;

  // Admin
  isAdmin: boolean;
  accessToken: string | null;
  checkAdminAccess: (token: string) => Promise<boolean>;

  // Sponsorships
  sponsorships: Sponsorship[];
  reloadSponsorships: () => Promise<void>;

  // Bios des auteurs
  updateAuthorBio: (authorName: string, bio: string) => Promise<void>;
  getAuthorBio: (authorName: string) => Promise<string>;
}

const ScribelaContext = createContext<ScribelaContextType | undefined>(
  undefined
);

export function ScribelaProvider({
  children,
  currentUser,
}: {
  children: ReactNode;
  currentUser: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [texts, setTexts] = useState<Text[]>([]);
  const [gardenComments, setGardenComments] = useState<{
    [textId: string]: GardenComment[];
  }>({});
  const [subscribedAuthors, setSubscribedAuthors] = useState<
    SubscribedAuthor[]
  >([]);
  const [mySubscribers, setMySubscribers] = useState<Subscriber[]>([]);
  const [myDonors, setMyDonors] = useState<Donor[]>([]);
  const [myDuos, setMyDuos] = useState<Duo[]>([]);
  const [duoMessages, setDuoMessages] = useState<{
    [key: string]: DuoMessage[];
  }>({});
  const [customCircles, setCustomCircles] = useState<Circle[]>([]);
  const [lastReads, setLastReads] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState(currentUser);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Vérifier le statut admin
  const checkAdminAccess = async (token: string): Promise<boolean> => {
    try {
      const response = await api.checkAdminStatus(token);
      const adminStatus = response.isAdmin || false;
      setIsAdmin(adminStatus);
      if (adminStatus) {
        setAccessToken(token);
      }
      return adminStatus;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut admin:', error);
      setIsAdmin(false);
      return false;
    }
  };

  // Charger toutes les données au montage
  useEffect(() => {
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Vérifier et initialiser les données de démo si nécessaire
      const dataExists = await checkDemoDataExists(user);
      if (!dataExists) {
        console.log('Initialisation des données de démo...');
        await initDemoData(user);
      }

      // Charger toutes les données en parallèle
      const [
        textsData,
        commentsData,
        subscriptionsData,
        subscribersData,
        donorsData,
        duosData,
        messagesData,
        circlesData,
        echosData,
        lastReadsData,
        sponsorshipsData,
      ] = await Promise.all([
        api.getTexts(),
        api.getAllComments(),
        api.getSubscriptions(user),
        api.getSubscribers(user),
        api.getDonors(user),
        api.getDuos(user),
        api.getAllDuoMessages(user),
        api.getCircles(user),
        api.getEchos(user),
        api.getLastReads(user),
        api.getSponsorships(),
      ]);

      // Marquer les textes en écho
      const echoedTextIds = echosData.echos || [];
      const textsWithEchos = (textsData.texts || []).map((text: Text) => ({
        ...text,
        publishedAt: new Date(text.publishedAt),
        isEchoed: echoedTextIds.includes(text.id),
      }));

      setTexts(textsWithEchos);
      setGardenComments(commentsData.comments || {});
      setSubscribedAuthors(subscriptionsData.subscriptions || []);
      setMySubscribers(subscribersData.subscribers || []);
      setMyDonors(donorsData.donors || []);
      setMyDuos(duosData.duos || []);
      setDuoMessages(messagesData.messages || {});
      setCustomCircles(circlesData.circles || []);
      setLastReads(lastReadsData.lastReads || {});
      setSponsorships(sponsorshipsData.sponsorships || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions pour gérer les textes
  const addText = async (text: Omit<Text, 'id'>) => {
    try {
      const result = await api.saveText(text);
      setTexts((prev) => [
        { ...result.data, publishedAt: new Date(result.data.publishedAt) },
        ...prev,
      ]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du texte:', error);
      throw error;
    }
  };

  const deleteText = async (textId: string) => {
    try {
      await api.deleteText(textId);
      setTexts((prev) => prev.filter((t) => t.id !== textId));
    } catch (error) {
      console.error('Erreur lors de la suppression du texte:', error);
      throw error;
    }
  };

  const toggleEcho = async (textId: string) => {
    try {
      const text = texts.find((t) => t.id === textId);
      const newEchoedState = !text?.isEchoed;

      if (newEchoedState) {
        await api.saveEcho(user, textId);
      } else {
        await api.deleteEcho(user, textId);
      }

      setTexts((prev) =>
        prev.map((t) =>
          t.id === textId ? { ...t, isEchoed: newEchoedState } : t
        )
      );
    } catch (error) {
      console.error('Erreur lors du toggle echo:', error);
      throw error;
    }
  };

  const toggleSave = (textId: string) => {
    setTexts((prev) =>
      prev.map((text) =>
        text.id === textId ? { ...text, isSaved: !text.isSaved } : text
      )
    );
  };

  // Fonctions pour les commentaires
  const addGardenComment = async (
    textId: string,
    comment: Omit<GardenComment, 'id' | 'timestamp'>
  ) => {
    try {
      const result = await api.saveComment(textId, comment);
      setGardenComments((prev) => ({
        ...prev,
        [textId]: [
          ...(prev[textId] || []),
          {
            ...result.comment,
            timestamp: new Date(result.comment.timestamp),
          },
        ],
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du commentaire:', error);
      throw error;
    }
  };

  const deleteGardenComment = async (textId: string, commentId: string) => {
    try {
      await api.deleteComment(textId, commentId);
      setGardenComments((prev) => ({
        ...prev,
        [textId]: (prev[textId] || []).filter((c) => c.id !== commentId),
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      throw error;
    }
  };

  const reloadGardenComments = async () => {
    try {
      const commentsData = await api.getAllComments();
      setGardenComments(commentsData.comments || {});
    } catch (error) {
      console.error('Erreur lors du rechargement des commentaires:', error);
      throw error;
    }
  };

  // Fonctions pour les abonnements
  const addSubscription = async (authorName: string, price: number) => {
    try {
      await api.saveSubscription(user, authorName, price);
      setSubscribedAuthors((prev) => [
        ...prev,
        { authorName, price, subscribedAt: new Date() },
      ]);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'abonnement:", error);
      throw error;
    }
  };

  const removeSubscription = async (authorName: string) => {
    try {
      await api.deleteSubscription(user, authorName);
      setSubscribedAuthors((prev) =>
        prev.filter((s) => s.authorName !== authorName)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'abonnement:", error);
      throw error;
    }
  };

  // Fonctions pour les donations
  const addDonation = async (donor: Donor) => {
    try {
      await api.saveDonation(user, donor);
      setMyDonors((prev) => [...prev, donor]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du don:', error);
      throw error;
    }
  };

  // Fonctions pour les duos
  const addDuo = async (name: string) => {
    try {
      await api.saveDuo(user, name);
      setMyDuos((prev) => [...prev, { name, createdAt: new Date() }]);
    } catch (error) {
      console.error("Erreur lors de la création du duo:", error);
      throw error;
    }
  };

  const deleteDuo = async (name: string) => {
    try {
      await api.deleteDuo(user, name);
      setMyDuos((prev) => prev.filter((duo) => duo.name !== name));
      setDuoMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[name];
        return newMessages;
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du duo:', error);
      throw error;
    }
  };

  // Fonctions pour les messages de duos
  const addDuoMessage = async (
    duoName: string,
    message: Omit<DuoMessage, 'id' | 'timestamp'>
  ) => {
    try {
      const result = await api.saveDuoMessage(user, duoName, message);
      setDuoMessages((prev) => ({
        ...prev,
        [duoName]: [
          ...(prev[duoName] || []),
          {
            ...result.message,
            timestamp: new Date(result.message.timestamp),
          },
        ],
      }));

      const timestamp = new Date().toISOString();
      await api.saveLastRead(user, duoName, 'duo', timestamp);
      const key = `duo_${duoName}`;
      setLastReads((prev) => ({
        ...prev,
        [key]: timestamp,
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
      throw error;
    }
  };

  const reloadDuoMessages = async () => {
    try {
      const messagesData = await api.getAllDuoMessages(user);
      setDuoMessages(messagesData.messages || {});
    } catch (error) {
      console.error(
        'Erreur lors du rechargement des messages de duo:',
        error
      );
      throw error;
    }
  };

  // Fonctions pour les sponsorships
  const reloadSponsorships = async () => {
    try {
      const sponsorshipsData = await api.getSponsorships();
      setSponsorships(sponsorshipsData.sponsorships || []);
    } catch (error) {
      console.error('Erreur lors du rechargement des sponsorships:', error);
      throw error;
    }
  };

  // Fonctions pour les cercles
  const addCircle = async (circle: Omit<Circle, 'id'> & { members?: string[] }) => {
    try {
      const result = await api.saveCircle(user, circle);
      setCustomCircles((prev) => [...prev, result.circle]);

      const membersToAdd = circle.members || [user];
      for (const memberName of membersToAdd) {
        await api.addCircleMember(result.circle.id, memberName);
      }
    } catch (error) {
      console.error("Erreur lors de la création du cercle:", error);
      throw error;
    }
  };

  const deleteCircle = async (circleId: string) => {
    try {
      await api.deleteCircle(circleId);
      setCustomCircles((prev) => prev.filter((c) => c.id !== circleId));
    } catch (error) {
      console.error('Erreur lors de la suppression du cercle:', error);
      throw error;
    }
  };

  // Fonction pour marquer une conversation comme lue
  const markAsRead = async (
    conversationId: string,
    conversationType: 'circle' | 'duo' | 'garden'
  ) => {
    try {
      const timestamp = new Date().toISOString();
      // Convertir 'garden' en 'circle' pour l'API
      const apiType = conversationType === 'garden' ? 'circle' : conversationType;
      await api.saveLastRead(user, conversationId, apiType, timestamp);
      const key = `${conversationType}_${conversationId}`;
      setLastReads((prev) => ({
        ...prev,
        [key]: timestamp,
      }));
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de la dernière lecture:',
        error
      );
      throw error;
    }
  };

  // Bios des auteurs
  const updateAuthorBio = async (authorName: string, bio: string) => {
    try {
      await api.updateAuthorBio(authorName, bio);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bio:', error);
      throw error;
    }
  };

  const getAuthorBio = async (authorName: string): Promise<string> => {
    try {
      const result = await api.getAuthorBio(authorName);
      return result.bio || '';
    } catch (error) {
      console.error('Erreur lors de la récupération de la bio:', error);
      return '';
    }
  };

  const value: ScribelaContextType = {
    texts,
    addText,
    deleteText,
    toggleEcho,
    toggleSave,
    gardenComments,
    addGardenComment,
    deleteGardenComment,
    reloadGardenComments,
    subscribedAuthors,
    addSubscription,
    removeSubscription,
    mySubscribers,
    myDonors,
    addDonation,
    myDuos,
    addDuo,
    deleteDuo,
    duoMessages,
    addDuoMessage,
    reloadDuoMessages,
    customCircles,
    addCircle,
    deleteCircle,
    lastReads,
    markAsRead,
    isLoading,
    currentUser: user,
    setCurrentUser: setUser,
    isAdmin,
    accessToken,
    checkAdminAccess,
    sponsorships,
    reloadSponsorships,
    updateAuthorBio,
    getAuthorBio,
  };

  return (
    <ScribelaContext.Provider value={value}>
      {children}
    </ScribelaContext.Provider>
  );
}

// Hook personnalisé
export function useScribela() {
  const context = useContext(ScribelaContext);
  if (!context) {
    throw new Error('useScribela doit être utilisé dans un ScribelaProvider');
  }
  return context;
}


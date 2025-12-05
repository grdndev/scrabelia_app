import { projectId, publicAnonKey } from './info';
import { supabase } from './client';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-6c6fe53f`;

// Helper pour faire des requêtes au serveur
async function apiRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Request failed for ${path}:`, errorText);
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// Helper pour faire des requêtes authentifiées (avec token utilisateur)
async function authenticatedApiRequest(
  path: string,
  accessToken: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${error}`);
  }

  return response.json();
}

// ========== TEXTES ==========
export async function saveText(textData: any) {
  return apiRequest('/texts', {
    method: 'POST',
    body: JSON.stringify(textData),
  });
}

export async function getTexts() {
  return apiRequest('/texts', { method: 'GET' });
}

export async function deleteText(textId: string) {
  return apiRequest(`/texts/${encodeURIComponent(textId)}`, {
    method: 'DELETE',
  });
}

// ========== COMMENTAIRES ==========
export async function saveComment(textId: string, comment: any) {
  return apiRequest(`/texts/${encodeURIComponent(textId)}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
  });
}

export async function getComments(textId: string) {
  return apiRequest(`/texts/${encodeURIComponent(textId)}/comments`, {
    method: 'GET',
  });
}

export async function getAllComments() {
  return apiRequest('/comments', { method: 'GET' });
}

export async function deleteComment(textId: string, commentId: string) {
  return apiRequest(
    `/texts/${encodeURIComponent(textId)}/comments/${encodeURIComponent(commentId)}`,
    {
      method: 'DELETE',
    }
  );
}

// ========== BIOS DES AUTEURS ==========
export async function updateAuthorBio(authorName: string, bio: string) {
  return apiRequest(`/authors/${encodeURIComponent(authorName)}/bio`, {
    method: 'PUT',
    body: JSON.stringify({ bio }),
  });
}

export async function getAuthorBio(authorName: string) {
  return apiRequest(`/authors/${encodeURIComponent(authorName)}/bio`, {
    method: 'GET',
  });
}

// ========== ABONNEMENTS ==========
export async function saveSubscription(
  userId: string,
  authorName: string,
  price: number
) {
  return apiRequest('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ userId, authorName, price }),
  });
}

export async function getSubscriptions(userId: string) {
  return apiRequest(`/subscriptions/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}

export async function deleteSubscription(userId: string, authorName: string) {
  return apiRequest(
    `/subscriptions/${encodeURIComponent(userId)}/${encodeURIComponent(authorName)}`,
    {
      method: 'DELETE',
    }
  );
}

// ========== ABONNÉS ==========
export async function getSubscribers(userId: string) {
  return apiRequest(`/subscribers/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}

// ========== DONATIONS ==========
export async function saveDonation(userId: string, donor: any) {
  return apiRequest('/donations', {
    method: 'POST',
    body: JSON.stringify({ userId, donor }),
  });
}

export async function getDonors(userId: string) {
  return apiRequest(`/donations/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}

// ========== DUOS ==========
export async function saveDuo(userId: string, duoName: string) {
  return apiRequest('/duos', {
    method: 'POST',
    body: JSON.stringify({ userId, duoName }),
  });
}

export async function getDuos(userId: string) {
  return apiRequest(`/duos/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}

export async function deleteDuo(userId: string, duoName: string) {
  return apiRequest(
    `/duos/${encodeURIComponent(userId)}/${encodeURIComponent(duoName)}`,
    {
      method: 'DELETE',
    }
  );
}

// ========== MESSAGES DE DUOS ==========
export async function saveDuoMessage(
  userId: string,
  duoName: string,
  message: any
) {
  return apiRequest(
    `/duos/${encodeURIComponent(userId)}/${encodeURIComponent(duoName)}/messages`,
    {
      method: 'POST',
      body: JSON.stringify({ message }),
    }
  );
}

export async function getAllDuoMessages(userId: string) {
  return apiRequest(`/duos/${encodeURIComponent(userId)}/messages`, {
    method: 'GET',
  });
}

// ========== CERCLES ==========
export async function saveCircle(userId: string, circle: any) {
  return apiRequest('/circles', {
    method: 'POST',
    body: JSON.stringify({ userId, circle }),
  });
}

export async function getCircles(userId: string) {
  return apiRequest(`/circles/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}

export async function deleteCircle(circleId: string) {
  return apiRequest(`/circles/${encodeURIComponent(circleId)}`, {
    method: 'DELETE',
  });
}

export async function addCircleMember(circleId: string, userName: string) {
  return apiRequest(`/circles/${encodeURIComponent(circleId)}/members`, {
    method: 'POST',
    body: JSON.stringify({ userName }),
  });
}

export async function getCircleMembers(circleId: string) {
  return apiRequest(`/circles/${encodeURIComponent(circleId)}/members`, {
    method: 'GET',
  });
}

export async function removeCircleMember(circleId: string, userName: string) {
  return apiRequest(
    `/circles/${encodeURIComponent(circleId)}/members/${encodeURIComponent(userName)}`,
    {
      method: 'DELETE',
    }
  );
}

export async function saveCircleMessage(circleId: string, message: any) {
  return apiRequest(`/circles/${encodeURIComponent(circleId)}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function getCircleMessages(circleId: string) {
  return apiRequest(`/circles/${encodeURIComponent(circleId)}/messages`, {
    method: 'GET',
  });
}

export async function deleteCircleMessage(circleId: string, messageId: string) {
  return apiRequest(
    `/circles/${circleId}/messages/${messageId}`,
    {
      method: 'DELETE',
    }
  );
}

// ========== UTILISATEURS ==========
export async function getUsers() {
  return apiRequest('/users', { method: 'GET' });
}

// ========== ÉCHOS ==========
export async function saveEcho(userId: string, textId: string) {
  return apiRequest('/echos', {
    method: 'POST',
    body: JSON.stringify({ userId, textId }),
  });
}

export async function deleteEcho(userId: string, textId: string) {
  return apiRequest(
    `/echos/${encodeURIComponent(userId)}/${encodeURIComponent(textId)}`,
    {
      method: 'DELETE',
    }
  );
}

export async function getEchos(userId: string) {
  return apiRequest(`/echos/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}

export async function getResonances(userId: string) {
  return apiRequest(`/resonances/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}

// ========== DERNIÈRES LECTURES ==========
export async function saveLastRead(
  userId: string,
  conversationId: string,
  conversationType: 'circle' | 'duo',
  timestamp?: string
) {
  return apiRequest('/last-read', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      conversationId,
      conversationType,
      timestamp: timestamp || new Date().toISOString(),
    }),
  });
}

export async function getLastReads(userId: string) {
  return apiRequest(`/last-read/${userId}`, {
    method: 'GET',
  });
}

// ========== CANAL OFFICIEL SCRIBELA ==========
export async function checkAdminStatus(accessToken: string) {
  return authenticatedApiRequest('/check-admin', accessToken, {
    method: 'GET',
  });
}

export async function getAnnouncements() {
  return apiRequest('/announcements', { method: 'GET' });
}

export async function saveAnnouncement(announcement: any, accessToken: string) {
  return authenticatedApiRequest('/announcements', accessToken, {
    method: 'POST',
    body: JSON.stringify(announcement),
  });
}

export async function deleteAnnouncement(
  announcementId: string,
  accessToken: string
) {
  return authenticatedApiRequest(`/announcements/${announcementId}`, accessToken, {
    method: 'DELETE',
  });
}

// ========== SPONSORINGS ==========
export async function getSponsorships() {
  return apiRequest('/sponsorships', { method: 'GET' });
}

export async function createSponsorship(
  sponsorshipData: any,
  accessToken: string
) {
  return authenticatedApiRequest('/sponsorships', accessToken, {
    method: 'POST',
    body: JSON.stringify(sponsorshipData),
  });
}

export async function updateSponsorship(
  sponsorshipId: string,
  sponsorshipData: any,
  accessToken: string
) {
  return authenticatedApiRequest(`/sponsorships/${sponsorshipId}`, accessToken, {
    method: 'PUT',
    body: JSON.stringify(sponsorshipData),
  });
}

export async function deleteSponsorship(
  sponsorshipId: string,
  accessToken: string
) {
  return authenticatedApiRequest(`/sponsorships/${sponsorshipId}`, accessToken, {
    method: 'DELETE',
  });
}

// ========== SIGNALEMENTS ==========
export async function createReport(
  textId: string,
  reason: string,
  reportedBy?: string
) {
  return apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify({ textId, reason, reportedBy }),
  });
}

export async function getReports(accessToken: string) {
  return authenticatedApiRequest('/reports', accessToken, {
    method: 'GET',
  });
}

export async function deleteReport(reportId: string, accessToken: string) {
  return authenticatedApiRequest(`/reports/${reportId}`, accessToken, {
    method: 'DELETE',
  });
}

export async function deleteReportedText(textId: string, accessToken: string) {
  return authenticatedApiRequest(`/reported-texts/${textId}`, accessToken, {
    method: 'DELETE',
  });
}

export async function createContentReport(data: {
  contentType: 'comment' | 'circle_message' | 'duo_message';
  contentId: string;
  textId?: string;
  circleId?: string;
  duoName?: string;
  reason: string;
  reportedBy?: string;
}) {
  return apiRequest('/content-reports', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getContentReports(accessToken: string) {
  return authenticatedApiRequest('/content-reports', accessToken, {
    method: 'GET',
  });
}

export async function deleteContentReport(
  reportId: string,
  accessToken: string
) {
  return authenticatedApiRequest(`/content-reports/${reportId}`, accessToken, {
    method: 'DELETE',
  });
}

export async function deleteReportedContent(
  data: {
    contentType: 'comment' | 'circle_message' | 'duo_message';
    contentId: string;
    textId?: string;
    circleId?: string;
    duoName?: string;
  },
  accessToken: string
) {
  return authenticatedApiRequest('/reported-content', accessToken, {
    method: 'DELETE',
    body: JSON.stringify(data),
  });
}

// ========== AUTHENTIFICATION ==========
export async function signup(email: string, password: string, authorName: string) {
  const availabilityCheck = await checkAuthorNameAvailability(authorName);
  if (!availabilityCheck.available) {
    throw new Error("Ce nom d'auteur est déjà pris");
  }

  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, authorName }),
  });
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Messages d'erreur plus explicites
    if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
      throw new Error('Email ou mot de passe incorrect. Vérifiez vos identifiants ou créez un compte.');
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.');
    }
    throw new Error(error.message || 'Erreur lors de la connexion');
  }

  // Si l'email n'est pas confirmé mais que la connexion a réussi (cas où email_confirm est désactivé)
  // On continue quand même pour permettre le développement
  // if (!data.user.email_confirmed_at) {
  //   throw new Error(
  //     'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.'
  //   );
  // }

  const authorName = data.user.user_metadata?.author_name;

  if (!authorName) {
    try {
      const userData = await apiRequest(`/users/${data.user.id}`);
      if (userData.user && userData.user.authorName) {
        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            authorName: userData.user.authorName,
          },
          session: data.session,
        };
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du nom d\'auteur:', err);
    }
    throw new Error("Nom d'auteur introuvable. Veuillez contacter le support.");
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      authorName,
    },
    session: data.session,
  };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
}

export async function resendConfirmationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
}

export async function checkAuthorNameAvailability(authorName: string) {
  return apiRequest(`/auth/check-author-name/${encodeURIComponent(authorName)}`);
}

export default {
  signup,
  login,
  logout,
  resendConfirmationEmail,
  checkAuthorNameAvailability,
  saveText,
  getTexts,
  deleteText,
  saveComment,
  getComments,
  getAllComments,
  deleteComment,
  saveSubscription,
  getSubscriptions,
  deleteSubscription,
  getSubscribers,
  saveDonation,
  getDonors,
  saveDuo,
  getDuos,
  deleteDuo,
  saveDuoMessage,
  getAllDuoMessages,
  saveCircle,
  getCircles,
  deleteCircle,
  addCircleMember,
  getCircleMembers,
  removeCircleMember,
  saveCircleMessage,
  getCircleMessages,
  deleteCircleMessage,
  getUsers,
  saveEcho,
  deleteEcho,
  getEchos,
  getResonances,
  saveLastRead,
  getLastReads,
  checkAdminStatus,
  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  getSponsorships,
  createSponsorship,
  updateSponsorship,
  deleteSponsorship,
  createReport,
  getReports,
  deleteReport,
  deleteReportedText,
  createContentReport,
  getContentReports,
  deleteContentReport,
  deleteReportedContent,
};



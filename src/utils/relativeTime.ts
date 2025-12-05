/**
 * Calcule et retourne le temps écoulé depuis une date donnée
 * en format relatif (ex: "il y a 5 minutes", "il y a 2 heures")
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const pastDate = date instanceof Date ? date : new Date(date);

  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  if (seconds < 60) {
    return "à l'instant";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? 'il y a 1 minute' : `il y a ${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? 'il y a 1 heure' : `il y a ${hours} heures`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? 'il y a 1 jour' : `il y a ${days} jours`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return weeks === 1 ? 'il y a 1 semaine' : `il y a ${weeks} semaines`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? 'il y a 1 mois' : `il y a ${months} mois`;
  }

  const years = Math.floor(days / 365);
  return years === 1 ? 'il y a 1 an' : `il y a ${years} ans`;
}



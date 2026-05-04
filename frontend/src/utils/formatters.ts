/**
 * Format a number with commas (e.g., 15000 -> 15,000)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format a decimal to 2 decimal places
 */
export const formatDecimal = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

/**
 * Format a date to readable string
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to readable string
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format duration in seconds to MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a score display (e.g., 250/4)
 */
export const formatScore = (runs: number, wickets: number): string => {
  return `${runs}/${wickets}`;
};

/**
 * Format overs (e.g., 45.3 overs)
 */
export const formatOvers = (overs: number, balls?: number): string => {
  if (balls !== undefined) {
    return `${overs}.${balls}`;
  }
  return `${overs}`;
};

/**
 * Calculate and format run rate
 */
export const formatRunRate = (runs: number, overs: number): string => {
  const runRate = runs / overs;
  return runRate.toFixed(2);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Get flag emoji from country code
 */
export const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

/**
 * Format player name for display
 */
export const formatPlayerName = (firstName: string, lastName: string, commonName?: string): string => {
  if (commonName) return commonName;
  return `${firstName} ${lastName}`;
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Format batting average
 */
export const formatBattingAverage = (runs: number, dismissals: number): string => {
  if (dismissals === 0) return '-';
  return (runs / dismissals).toFixed(2);
};

/**
 * Format bowling economy
 */
export const formatEconomy = (runs: number, overs: number): string => {
  if (overs === 0) return '-';
  return (runs / overs).toFixed(2);
};

/**
 * Format for leaderboard display
 */
export const formatLeaderboardScore = (score: number, gameType: string): string => {
  if (gameType === 'quick_cricket') return `${score} runs`;
  if (gameType === 'quiz') return `${score} points`;
  return score.toString();
};
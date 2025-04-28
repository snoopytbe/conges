/**
 * @fileoverview Générateur d'UUID version 4 conforme à la RFC 4122
 * @module uuid
 */

/**
 * Génère un UUID version 4 (aléatoire) conforme à la RFC 4122
 * @function uuidv4
 * @returns {string} Un UUID version 4 sous forme de chaîne de caractères
 * @example
 * const id = uuidv4(); // "123e4567-e89b-12d3-a456-426614174000"
 */
export function uuidv4() {
  // Utilisation de crypto.getRandomValues pour une meilleure sécurité
  const randomValues = crypto.getRandomValues(new Uint8Array(16));
  
  // Configuration des bits selon la RFC 4122
  randomValues[6] = (randomValues[6] & 0x0f) | 0x40; // Version 4
  randomValues[8] = (randomValues[8] & 0x3f) | 0x80; // Variant RFC 4122

  // Conversion en chaîne hexadécimale
  return Array.from(randomValues)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}

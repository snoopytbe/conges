/**
 * Fonction utilitaire pour mémoriser les résultats d'une fonction
 * @template T
 * @param {(...args: any[]) => T} fn - La fonction à mémoriser
 * @param {number} [maxCacheSize=1000] - Taille maximale du cache
 * @returns {(...args: any[]) => T} - La fonction mémorisée
 */
export const memoize = (fn, maxCacheSize = 1000) => {
  // Cache pour stocker les résultats mémorisés
  const cache = {};
  // Compteur pour suivre la taille du cache
  let cacheSize = 0;

  return (...args) => {
    try {
      // Création d'une clé unique basée sur les arguments
      const key = JSON.stringify(args);
      
      // Si le résultat est déjà en cache, on le retourne
      if (key in cache) {
        return cache[key];
      }

      // Si le cache atteint sa taille maximale, on le vide
      if (cacheSize >= maxCacheSize) {
        Object.keys(cache).forEach(k => delete cache[k]);
        cacheSize = 0;
      }

      // Exécution de la fonction et stockage du résultat
      const result = fn(...args);
      cache[key] = result;
      cacheSize++;
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la mémorisation:', error);
      throw error;
    }
  };
};

import deepEqual from "fast-deep-equal";

/**
 * Compare deux dates au format DDMMYY
 * @param {Object} prevProps - Les propriétés précédentes
 * @param {Object} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les dates sont identiques
 */
export function compareDates(prevProps, nextProps) {
  return prevProps.myDate.format("DDMMYY") === nextProps.myDate.format("DDMMYY");
}

/**
 * Compare deux valeurs de type de surbrillance
 * @param {Object} prevProps - Les propriétés précédentes
 * @param {Object} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les types de surbrillance sont identiques
 */
export function compareHighlightType(prevProps, nextProps) {
  return prevProps.typeHighlight === nextProps.typeHighlight;
}

/**
 * Compare deux tableaux de congés en profondeur
 * @param {Object} prevProps - Les propriétés précédentes
 * @param {Object} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les congés sont identiques
 */
export function compareConges(prevProps, nextProps) {
  return deepEqual(prevProps.conges, nextProps.conges);
}

/**
 * Compare deux valeurs de demi-journée
 * @param {Object} prevProps - Les propriétés précédentes
 * @param {Object} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les demi-journées sont identiques
 */
export function compareHalfDay(prevProps, nextProps) {
  return prevProps.demiJournee === nextProps.demiJournee;
}

/**
 * Crée un comparateur personnalisé pour React.memo
 * @param {...Function} comparators - Liste des fonctions de comparaison à utiliser
 * @returns {Function} - Fonction de comparaison combinée
 */
export function createMemoComparator(...comparators) {
  return (prevProps, nextProps) => {
    return comparators.every(comparator => comparator(prevProps, nextProps));
  };
}

// Comparateurs prédéfinis
export const dateComparator = createMemoComparator(compareDates);
export const highlightComparator = createMemoComparator(compareDates, compareHighlightType);
export const congesComparator = createMemoComparator(compareDates, compareHighlightType, compareConges);
export const halfDayComparator = createMemoComparator(compareDates, compareHighlightType, compareConges, compareHalfDay); 
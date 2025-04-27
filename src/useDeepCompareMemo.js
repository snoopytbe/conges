import deepEqual from "fast-deep-equal";

/**
 * Comparateur de base pour React.memo qui compare uniquement les dates
 * @param {Object} prevProps - Les propriétés précédentes
 * @param {Object} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les dates sont identiques
 */
export function useDeepCompareMemoDate(prevProps, nextProps) {
  return prevProps.myDate.format("DDMMYY") === nextProps.myDate.format("DDMMYY");
}

/**
 * Comparateur pour React.memo qui inclut le type de surbrillance
 * @param {Object} prevProps - Les propriétés précédentes
 * @param {Object} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les dates et les types de surbrillance sont identiques
 */
export function useDeepCompareMemoHighlight(prevProps, nextProps) {
  return (
    useDeepCompareMemoDate(prevProps, nextProps) &&
    prevProps.typeHighlight === nextProps.typeHighlight
  );
}

/**
 * Comparateur pour React.memo qui inclut les congés
 * @param {Object} prevProps - Les propriétés précédentes
 * @param {Object} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les dates, types de surbrillance et congés sont identiques
 */
export function useDeepCompareMemoConge(prevProps, nextProps) {
  return (
    useDeepCompareMemoHighlight(prevProps, nextProps) &&
    deepEqual(prevProps.conges, nextProps.conges)
  );
}

/**
 * Comparateur pour React.memo qui inclut la demi-journée
 * @param {Object} prevProps - Les propriétés précédentes
 * @param {Object} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si tous les éléments sont identiques
 */
export function useDeepCompareMemoHalfDay(prevProps, nextProps) {
  return (
    useDeepCompareMemoConge(prevProps, nextProps) &&
    prevProps.demiJournee === nextProps.demiJournee
  );
}


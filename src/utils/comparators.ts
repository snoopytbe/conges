import deepEqual from "fast-deep-equal";
import { format } from "date-fns";

// Interface pour les props contenant une date
interface DateProps {
  myDate: Date;
}

// Interface pour les props contenant un type de surbrillance
interface HighlightProps {
  typeHighlight: string;
}

// Interface pour les props contenant des congés
interface CongesProps {
  conges: unknown[];
}

/**
 * Compare deux dates au format DDMMYY
 * @param {DateProps} prevProps - Les propriétés précédentes
 * @param {DateProps} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les dates sont identiques
 */
function compareDates(prevProps: DateProps, nextProps: DateProps): boolean {
  return format(prevProps.myDate, "ddMMyy") === format(nextProps.myDate, "ddMMyy");
}

/**
 * Compare deux valeurs de type de surbrillance
 * @param {HighlightProps} prevProps - Les propriétés précédentes
 * @param {HighlightProps} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les types de surbrillance sont identiques
 */
export function compareHighlightType(prevProps: HighlightProps, nextProps: HighlightProps): boolean {
  return prevProps.typeHighlight === nextProps.typeHighlight;
}

/**
 * Compare deux tableaux de congés en profondeur
 * @param {CongesProps} prevProps - Les propriétés précédentes
 * @param {CongesProps} nextProps - Les propriétés suivantes
 * @returns {boolean} - True si les congés sont identiques
 */
export function compareConges(prevProps: CongesProps, nextProps: CongesProps): boolean {
  return deepEqual(prevProps.conges, nextProps.conges);
}

/**
 * Crée un comparateur personnalisé pour React.memo
 * @param {...Function} comparators - Liste des fonctions de comparaison à utiliser
 * @returns {Function} - Fonction de comparaison combinée
 */
export function createMemoComparator<T>(...comparators: Array<(prev: T, next: T) => boolean>) {
  return (prevProps: T, nextProps: T): boolean => {
    return comparators.every(comparator => comparator(prevProps, nextProps));
  };
}

// Comparateurs prédéfinis
export const highlightComparator = createMemoComparator<DateProps & HighlightProps>(compareDates, compareHighlightType);
export const congesComparator = createMemoComparator<DateProps & HighlightProps & CongesProps>(compareDates, compareHighlightType, compareConges);
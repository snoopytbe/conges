/**
 * Fichier de styles pour les cellules du calendrier
 * Contient les styles de base et les variations pour différents types de cellules
 */

import { withBase, vacationStyle, hoverable, highlighted } from "../utils/helpers";

// Style de base pour toutes les cellules
const baseStyle = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};

// =============================================
// 1. Styles des en-têtes
// =============================================

/**
 * Style pour l'en-tête d'année
 */
export const annee = withBase({
  backgroundColor: "var(--year-bg)",
  fontSize: "var(--font-large)",
  ...baseStyle
});

/**
 * Style pour l'en-tête de mois
 */
export const mois = withBase({
  backgroundColor: "var(--month-bg)",
  fontSize: "var(--font-medium)",
  ...baseStyle
});

// =============================================
// 2. Styles des cellules de date
// =============================================

/**
 * Style de base pour les cellules de date
 */
export const date = hoverable(
  withBase({
    color: "var(--text-dark)",
    width: "var(--w-date)",
    borderColor: "var(--bg-base)",
    ...baseStyle
  })
);

/**
 * Style pour la date du jour
 */
export const dateToday = {
  ...date,
  color: "var(--white)",
  backgroundColor: "var(--red)",
  borderColor: "var(--red)",
};

/**
 * Style pour les cellules sans date
 */
export const sansDate = withBase({});

// =============================================
// 3. Styles des jours spéciaux
// =============================================

/**
 * Style pour les week-ends
 */
export const WE = withBase({
  backgroundColor: "var(--weekend-bg)",
  borderColor: "var(--weekend-bg)",
  color: "var(--black)"
});

/**
 * Style pour les jours fériés
 */
export const ferie = withBase({
  backgroundColor: "var(--holiday-bg)",
  borderColor: "var(--holiday-bg)",
  color: "var(--white)",
});

// =============================================
// 4. Styles des congés
// =============================================

/**
 * Style pour les jours sans congé
 */
export const sansConge = withBase({
  color: "var(--black)",
  width: "var(--w-full-day)",
});

/**
 * Style pour les journées de congé
 */
export const journeeConge = sansConge;

/**
 * Style pour les demi-journées sans congé
 */
export const demiJourneeSansConge = withBase({
  width: "var(--w-half-day)",
  padding: `var(--pad-v) var(--pad-half-h)`,
});

/**
 * Style pour les demi-journées de congé
 */
export const demiJourneeConge = demiJourneeSansConge;

// =============================================
// 5. Styles des types d'absence
// =============================================

/**
 * Style pour les congés annuels
 */
export const CA = withBase({
  backgroundColor: "var(--CA)",
  color: "var(--text-dark)",
});

/**
 * Style pour les temps libres
 */
export const TL = withBase({
  backgroundColor: "var(--TL)",
  color: "var(--text-dark)",
});

/**
 * Style pour les RTT
 */
export const RTT = withBase({
  backgroundColor: "var(--RTT)",
  color: "var(--text-dark)",
});

/**
 * Style pour les CET
 */
export const CET = withBase({
  backgroundColor: "var(--CET)",
  color: "var(--text-dark)",
});

/**
 * Style pour les arrêts maladie
 */
export const MAL = withBase({
  backgroundColor: "var(--MAL)",
  color: "var(--text-dark)",
});

/**
 * Style pour les formations
 */
export const FOR = withBase({
  backgroundColor: "var(--FOR)",
  color: "var(--text-dark)",
});

/**
 * Style pour les déplacements
 */
export const DEP = withBase({
  backgroundColor: "var(--DEP)",
  color: "var(--text-dark)",
});

// =============================================
// 6. Styles des zones de vacances
// =============================================

/**
 * Style pour la zone de vacances principale
 */
export const maZone = vacationStyle("--vac-primary");

/**
 * Style pour les autres zones de vacances
 */
export const autresZones = vacationStyle("--vac-secondary");

/**
 * Style pour les périodes sans vacances
 */
export const sansVacances = vacationStyle("--vac-tertiary");

// =============================================
// 7. Styles de surbrillance (sélection)
// =============================================

/**
 * Style de base pour la surbrillance
 */
export const highlight = highlighted({});

/**
 * Style pour la surbrillance du bord gauche
 */
export const highlightedLeft = highlighted({
  borderLeftColor: "var(--black)",
});

/**
 * Style pour la surbrillance du bord droit
 */
export const highlightedRight = highlighted({
  borderRightColor: "var(--black)",
});

/**
 * Style pour la surbrillance du bord supérieur
 */
export const highlightedTop = highlighted({
  borderTopColor: "var(--black)",
});

/**
 * Style pour la surbrillance du bord inférieur
 */
export const highlightedBottom = highlighted({
  borderBottomColor: "var(--black)",
});

/**
 * Style pour la surbrillance du premier et dernier jour
 */
export const highlightedFirstLast = highlighted({
  opacity: "0.3",
});

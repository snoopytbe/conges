/**
 * Fichier de styles pour les cellules du calendrier
 * Contient les styles de base et les variations pour différents types de cellules
 */

import { withBase, vacationStyle, hoverable, highlighted } from "./helpers";

// =============================================
// 1. Styles des en-têtes
// =============================================

/**
 * Style pour l'en-tête d'année
 * @type {Object}
 */
export const annee = withBase({
  backgroundColor: "var(--year-bg)",
  fontSize: "var(--font-large)",
});

/**
 * Style pour l'en-tête de mois
 * @type {Object}
 */
export const mois = withBase({
  backgroundColor: "var(--month-bg)",
  fontSize: "var(--font-medium)",
});

// =============================================
// 2. Styles des cellules de date
// =============================================

/**
 * Style de base pour les cellules de date
 * @type {Object}
 */
export const date = hoverable(
  withBase({
    color: "var(--text-dark)",
    width: "var(--w-date)",
    borderColor: "var(--bg-base)",
  })
);

/**
 * Style pour la date du jour
 * @type {Object}
 */
export const dateToday = {
  ...date,
  color: "var(--white)",
  backgroundColor: "var(--red)",
  borderColor: "var(--red)",
};

/**
 * Style pour les cellules sans date
 * @type {Object}
 */
export const sansDate = withBase();

// =============================================
// 3. Styles des jours spéciaux
// =============================================

/**
 * Style pour les week-ends
 * @type {Object}
 */
export const WE = withBase({
  backgroundColor: "var(--weekend-bg)",
  borderColor: "var(--weekend-bg)",
  color: "var(--black)"
});

/**
 * Style pour les jours fériés
 * @type {Object}
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
 * @type {Object}
 */
export const sansConge = withBase({
  color: "var(--black)",
  width: "var(--w-full-day)",
});

/**
 * Style pour les journées de congé
 * @type {Object}
 */
export const journeeConge = sansConge;

/**
 * Style pour les demi-journées sans congé
 * @type {Object}
 */
export const demiJourneeSansConge = withBase({
  width: "var(--w-half-day)",
  padding: `var(--pad-v) var(--pad-half-h)`,
});

/**
 * Style pour les demi-journées de congé
 * @type {Object}
 */
export const demiJourneeConge = demiJourneeSansConge;

// =============================================
// 5. Styles des types d'absence
// =============================================

/**
 * Style pour les congés annuels
 * @type {Object}
 */
export const CA = withBase({
  backgroundColor: "var(--CA)",
  color: "var(--text-dark)",
});

/**
 * Style pour les temps libres
 * @type {Object}
 */
export const TL = withBase({
  backgroundColor: "var(--TL)",
  color: "var(--text-dark)",
});

/**
 * Style pour les RTT
 * @type {Object}
 */
export const RTT = withBase({
  backgroundColor: "var(--RTT)",
  color: "var(--text-dark)",
});

/**
 * Style pour les CET
 * @type {Object}
 */
export const CET = withBase({
  backgroundColor: "var(--CET)",
  color: "var(--text-dark)",
});

/**
 * Style pour les arrêts maladie
 * @type {Object}
 */
export const MAL = withBase({
  backgroundColor: "var(--MAL)",
  color: "var(--text-dark)",
});

/**
 * Style pour les formations
 * @type {Object}
 */
export const FOR = withBase({
  backgroundColor: "var(--FOR)",
  color: "var(--text-dark)",
});

/**
 * Style pour les déplacements
 * @type {Object}
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
 * @type {Object}
 */
export const maZone = vacationStyle("--vac-primary");

/**
 * Style pour les autres zones de vacances
 * @type {Object}
 */
export const autresZones = vacationStyle("--vac-secondary");

/**
 * Style pour les périodes sans vacances
 * @type {Object}
 */
export const sansVacances = vacationStyle("--vac-tertiary");

// =============================================
// 7. Styles de surbrillance (sélection)
// =============================================

/**
 * Style de base pour la surbrillance
 * @type {Object}
 */
export const highlight = highlighted();

/**
 * Style pour la surbrillance du bord gauche
 * @type {Object}
 */
export const highlightedLeft = highlighted({
  borderLeftColor: "var(--black)",
});

/**
 * Style pour la surbrillance du bord droit
 * @type {Object}
 */
export const highlightedRight = highlighted({
  borderRightColor: "var(--black)",
});

/**
 * Style pour la surbrillance du bord supérieur
 * @type {Object}
 */
export const highlightedTop = highlighted({
  borderTopColor: "var(--black)",
});

/**
 * Style pour la surbrillance du bord inférieur
 * @type {Object}
 */
export const highlightedBottom = highlighted({
  borderBottomColor: "var(--black)",
});

/**
 * Style pour la surbrillance du premier et dernier jour
 * @type {Object}
 */
export const highlightedFirstLast = highlighted({ opacity: 0.3 });

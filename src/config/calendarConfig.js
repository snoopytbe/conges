/**
 * @fileoverview Configuration du calendrier
 * @module calendarConfig
 */

/**
 * Options du menu contextuel pour les types de congés
 * @type {Array<{menu: string, value: string}>}
 */
export const MENU_OPTIONS = [
  { menu: "CA", value: "CA" },
  { menu: "RTT", value: "RTT" },
  { menu: "Déplacement", value: "DEP" },
  { menu: "Formation", value: "FOR" },
  { menu: "Maladie", value: "MAL" },
  { menu: "Présent", value: "" },
  { menu: "Télétravail", value: "TL" },
];

/**
 * Options du sous-menu pour les durées
 * @type {Array<{menu: string, value: string}>}
 */
export const SUB_MENU_OPTIONS = [
  { menu: "Journée", value: "J" },
  { menu: "Matin", value: "AM" },
  { menu: "Après-midi", value: "PM" },
];

/**
 * Configuration du loader
 * @type {Object}
 */
export const LOADER_CONFIG = {
  color: "#0000FF",
  size: "35px",
  cssOverride: { display: "block", margin: "0 auto" }
};

/**
 * Configuration du calendrier
 * @type {Object}
 */
export const CALENDAR_CONFIG = {
  maxMonths: 12,
  cellWidth: 139,
  title: "Congés"
}; 
/**
 * Fonction utilitaire pour créer des styles de base avec possibilité de surcharge
 * @param {Object} overrides - Objet contenant les styles à surcharger
 * @returns {Object} - Objet de styles CSS
 */
export const withBase = (overrides: Record<string, string>) => ({
  border: `0.5px solid var(--bg-base)`,
  backgroundColor: "var(--bg-base)",
  padding: `var(--pad-v) var(--pad-h)`,
  fontSize: "var(--font-small)",
  textAlign: "center",
  color: "var(--text-primary)",
  userSelect: "none",
  transition: "box-shadow 0.2s ease",
  ...overrides,
});

/**
 * Crée un style spécifique pour les périodes de vacances
 * @param {string} colorVar - Nom de la variable CSS pour la couleur
 * @returns {Object} - Objet de styles CSS pour les vacances
 */
export const vacationStyle = (colorVar: string) =>
  withBase({
    width: "var(--w-vacation)",
    padding: "var(--pad-v)",
    backgroundColor: `var(${colorVar})`,
    borderLeftColor: `var(${colorVar})`,
  });

/**
 * Ajoute des styles de survol à un objet de style existant
 * @param {Object} styleObj - Objet de styles CSS à enrichir
 * @returns {Object} - Objet de styles CSS avec effets de survol
 */
export const hoverable = (styleObj: Record<string, string>) => ({
  ...styleObj,
  cursor: "pointer",
  ":hover": {
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
});

/**
 * Crée un style avec effet de surbrillance (opacité réduite)
 * @param {Object} styleObj - Objet de styles CSS à modifier
 * @returns {Object} - Objet de styles CSS avec effet de surbrillance
 */
export const highlighted = (styleObj: Record<string, string>) => ({
  ...styleObj,
  opacity: 0.5,
  ":hover": {
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
});

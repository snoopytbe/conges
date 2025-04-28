import { estFerie } from "../services/joursFeries";
import { useMemo } from "react";
import PropTypes from "prop-types";

/**
 * Hook personnalisé pour déterminer le type de cellule en fonction de la date et des congés
 * @param {Object} myDate - Objet date à analyser
 * @param {Object} conge - Objet contenant les informations de congé
 * @param {string} defaultType - Type par défaut à retourner si aucune condition n'est remplie
 * @returns {string} Le type de cellule déterminé
 */
export function useTypeCell(myDate, conge, defaultType) {
  // Utilisation de useMemo pour mémoriser le résultat et éviter les recalculs inutiles
  return useMemo(() => {
    // Vérification de la validité de la date
    if (!myDate.isValid()) return "sansDate";
    
    // Vérification si la date est un jour férié
    if (estFerie(myDate)) return "ferie";
    
    // Vérification si la date est un week-end
    if ([0, 6].includes(myDate.day())) return "WE";
    
    // Si pas de congé, retourne le type par défaut
    if (!conge) return defaultType;
    
    // Gestion des différents types de congés
    if (conge.duree === "J") return "journeeConge";
    return conge.duree.includes("M")
      ? "demiJourneeConge"
      : "demiJourneeSansConge";
  }, [myDate, conge, defaultType]); // Dépendances du useMemo
}

// Validation des props avec PropTypes
useTypeCell.propTypes = {
  myDate: PropTypes.object.isRequired,
  conge: PropTypes.shape({
    duree: PropTypes.string
  }),
  defaultType: PropTypes.string.isRequired
};

// Valeurs par défaut pour les props
useTypeCell.defaultProps = {
  conge: null
};

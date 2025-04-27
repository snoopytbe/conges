import React from "react";
import PropTypes from "prop-types";

/**
 * Hook personnalisé qui calcule le nombre de mois à afficher dans le calendrier
 * en fonction de la largeur de la fenêtre.
 * 
 * @param {Object} props - Les propriétés du hook
 * @param {number} props.monthWidth - La largeur d'un mois en pixels (par défaut 139)
 * @returns {number} Le nombre de mois à afficher
 */
export const useWindowWidth = ({ monthWidth = 139 } = {}) => {
  // Utilisation de useMemo pour mémoriser la valeur calculée
  const [nbMonths, setNbMonths] = React.useState();

  // Utilisation de useCallback pour mémoriser la fonction de gestion du redimensionnement
  const handleWindowResize = React.useCallback(() => {
    setNbMonths(Math.floor(window.innerWidth / monthWidth));
  }, [monthWidth]);

  React.useEffect(() => {
    // Calcul initial
    handleWindowResize();

    // Ajout de l'écouteur d'événement
    window.addEventListener("resize", handleWindowResize);
    
    // Nettoyage lors du démontage
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [handleWindowResize]);

  return nbMonths;
};

// Validation des props avec PropTypes
useWindowWidth.propTypes = {
  monthWidth: PropTypes.number
};

// Valeurs par défaut des props
useWindowWidth.defaultProps = {
  monthWidth: 139
};

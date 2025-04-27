import * as S from "./styleTableCell";
import PropTypes from 'prop-types';

/**
 * Hook personnalisé pour gérer les styles de surbrillance des cellules
 * @param {string} typeHighlight - Type de surbrillance ('first', 'last', 'solo')
 * @param {string} cellPosition - Position de la cellule ('left' ou 'right')
 * @returns {Object} Styles de surbrillance à appliquer
 */
export function useStyleHighlight(typeHighlight, cellPosition) {
    // Si pas de surbrillance demandée, retourne un objet vide
    if (!typeHighlight) return {};

    // Création d'une copie du style de base en fonction de la position
    const baseStyle = cellPosition === "right" 
        ? { ...S.highlightedRight }
        : { ...S.highlightedLeft };

    // Application des styles supplémentaires selon le type de surbrillance
    const additionalStyles = {
        first: S.highlightedTop,
        last: S.highlightedBottom,
        solo: { ...S.highlightedTop, ...S.highlightedBottom }
    };

    // Fusion des styles de base avec les styles additionnels
    const finalStyle = {
        ...S.highlight,
        ...baseStyle,
        ...(additionalStyles[typeHighlight] || {})
    };

    return finalStyle;
}

// Validation des props avec PropTypes
useStyleHighlight.propTypes = {
    typeHighlight: PropTypes.oneOf(['first', 'last', 'solo']),
    cellPosition: PropTypes.oneOf(['left', 'right']).isRequired
};

// Valeurs par défaut pour les props
useStyleHighlight.defaultProps = {
    typeHighlight: null
};

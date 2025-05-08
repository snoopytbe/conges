import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import {
  startOfMonth,
  endOfMonth,
  format,
  isValid
} from "date-fns";
import { fr } from "date-fns/locale";

import { StyleTableCell } from "../../styles";
import { compteCongesPeriode, nbJourOuvrables } from "../../services";

// Types de congés disponibles avec leurs descriptions
const TYPES_CONGES = {
  CA: "CA",  // Congés Annuels
  RTT: "RTT", // RTT
  TL: "TL",   // Temps Libre
  MAL: "MAL"  // Maladie
};

/**
 * Calcule le titre du tooltip avec les informations de congés pour un mois donné
 * @param {Date} month - Le mois à analyser
 * @param {Array} conges - Liste des congés
 * @returns {string} - Chaîne formatée contenant les informations de congés
 */
const useTooltipTitle = (month, conges) => {
  return useMemo(() => {
    if (!isValid(month)) return "";
    // Création de la période du mois
    const debutMois = startOfMonth(month);
    const finMois = endOfMonth(month);
    const periodeCalcul = { start: debutMois, end: finMois };

    // Calcul des jours de congés par type
    const joursConges = Object.entries(TYPES_CONGES).reduce((acc, [key, type]) => ({
      ...acc,
      [key]: compteCongesPeriode(type, conges, periodeCalcul)
    }), {});

    // Calcul des jours ouvrés
    const joursOuvresInitial = nbJourOuvrables(periodeCalcul);
    const joursOuvresAuBureau = joursOuvresInitial - Object.values(joursConges).reduce((a, b) => a + b, 0);

    // Construction du message du tooltip
    return Object.entries(joursConges)
      .map(([type, jours]) => `${type} : ${jours}`)
      .concat(`BUR : ${joursOuvresAuBureau}`)
      .join(", ");
  }, [month, conges]); // Dépendances du useMemo
};

/**
 * Composant de cellule de tableau affichant un mois avec un tooltip d'informations
 * @param {Object} props - Les propriétés du composant
 * @param {Date} props.month - Le mois à afficher
 * @param {Array} props.conges - Liste des congés
 * @param {Function} props.onContextMenu - Gestionnaire d'événement du clic droit
 */
export default function TableCellMois({ month, conges, onContextMenu }) {
  // Mémoïsation du titre du tooltip pour éviter les recalculs inutiles
  const tooltipTitle = useTooltipTitle(month, conges);

  // Mémoïsation du gestionnaire d'événement pour éviter les recréations inutiles
  const handleContextMenu = useCallback((event) => {
    onContextMenu(event, month);
  }, [month, onContextMenu]);

  return (
    <Tooltip title={tooltipTitle} placement="right" arrow>
      <TableCell
        sx={{ ...StyleTableCell.mois }}
        colSpan={4}
        onContextMenu={handleContextMenu}
      >
        {format(month, "MMMM", { locale: fr })}
      </TableCell>
    </Tooltip>
  );
}

// Validation des props avec PropTypes
TableCellMois.propTypes = {
  month: PropTypes.instanceOf(Date).isRequired,
  conges: PropTypes.array.isRequired,
  onContextMenu: PropTypes.func.isRequired
};

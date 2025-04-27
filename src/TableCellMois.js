import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import * as StyleTableCell from "./styleTableCell";
import { compteCongesPeriode } from "./conges";
import { nbJourOuvrables } from "./joursFeries";
import Moment from "moment";
import { extendMoment } from "moment-range";

// Types de congés disponibles avec leurs descriptions
const TYPES_CONGES = {
  CA: "CA",  // Congés Annuels
  RTT: "RTT", // RTT
  TL: "TL",   // Temps Libre
  MAL: "MAL"  // Maladie
};

const moment = extendMoment(Moment);

/**
 * Calcule le titre du tooltip avec les informations de congés pour un mois donné
 * @param {Moment} month - Le mois à analyser
 * @param {Array} conges - Liste des congés
 * @returns {string} - Chaîne formatée contenant les informations de congés
 */
const useTooltipTitle = (month, conges) => {
  return useMemo(() => {
    // Création de la période du mois
    const debutMois = moment([month.year(), month.month(), 1]);
    const finMois = debutMois.clone().add(1, "month").subtract(1, "day");
    const periodeCalcul = moment.range(debutMois, finMois);

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
 * @param {Moment} props.month - Le mois à afficher
 * @param {Array} props.conges - Liste des congés
 * @param {Function} props.onContextMenu - Gestionnaire d'événement du clic droit
 */
function TableCellMois({ month, conges, onContextMenu }) {
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
        {month.locale("fr-FR").format("MMMM")}
      </TableCell>
    </Tooltip>
  );
}

// Validation des props avec PropTypes
TableCellMois.propTypes = {
  month: PropTypes.instanceOf(moment).isRequired,
  conges: PropTypes.array.isRequired,
  onContextMenu: PropTypes.func.isRequired
};

export default React.memo(TableCellMois); // Optimisation du rendu avec React.memo

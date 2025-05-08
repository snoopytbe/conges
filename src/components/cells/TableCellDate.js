import React from "react";
import TableCell from "@mui/material/TableCell";
import { isSameDay, isWeekend, isValid, format } from "date-fns";
import { fr } from "date-fns/locale";

import { StyleTableCell } from "../../styles";
import { useStyleHighlight } from "../../hooks";
import { estFerie } from "../../services";
import { highlightComparator } from "../../utils";

/**
 * Composant TableCellDate - Affiche une cellule de tableau avec une date formatée
 * @param {Object} params - Les propriétés du composant
 * @param {Date} params.myDate - La date à afficher
 * @param {Function} params.onContextMenu - Gestionnaire d'événement pour le clic droit
 * @param {Function} params.onClick - Gestionnaire d'événement pour le clic
 * @param {string} params.typeHighlight - Type de surbrillance à appliquer
 */
function TableCellDateForMemo(params) {
  const { myDate, onContextMenu, onClick, typeHighlight } = params;

  // Détermination du type de cellule en fonction de la date
  let cellType = "date";
  if (isValid(myDate)) {
    // Vérification si c'est un week-end
    if (isWeekend(myDate)) {
      cellType = "WE";
    }
    // Vérification si c'est un jour férié
    if (estFerie(myDate)) {
      cellType = "ferie";
    }
  }

  // Application des styles de base
  let cellStyle = isValid(myDate)
    ? StyleTableCell[cellType]
    : StyleTableCell.sansDate;

  // Application de la surbrillance
  const highlightStyle = useStyleHighlight(typeHighlight, "left");
  cellStyle = { ...cellStyle, ...highlightStyle };

  // Application du style spécial pour la date du jour
  if (isSameDay(new Date(), myDate)) {
    cellStyle = { ...cellStyle, ...StyleTableCell.dateToday };
  }

  // Formatage de la date : jour + première lettre du jour de la semaine
  const formattedDate = isValid(myDate)
    ? `${format(myDate, "dd", { locale: fr })} ${format(myDate, "EEEEE", { locale: fr }).toUpperCase()}`
    : "";

  return (
    <TableCell
      sx={{ ...cellStyle }}
      onMouseDown={(event) => onClick(event, myDate)}
      onContextMenu={(event) => onContextMenu(event)}
    >
      {formattedDate}
    </TableCell>
  );
}

// Export du composant avec memoization pour optimiser les performances
export default React.memo(TableCellDateForMemo, highlightComparator);

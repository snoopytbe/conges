import React, { useMemo } from "react";
import PropTypes from "prop-types";
import TableCell from "@mui/material/TableCell";
import { isValid } from "date-fns";

import { StyleTableCell } from "../../styles";
import { estVacances } from "../../services";
/**
 * Composant TableCellVacances
 * Affiche une cellule de tableau avec un style différent selon les vacances scolaires
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Date} props.myDate - La date à analyser (objet Date natif)
 * @returns {JSX.Element} - Une cellule de tableau avec le style approprié
 */
function TableCellVacancesForMemo({ myDate }) {
  // Zone scolaire par défaut
  const zone = "C";

  // Mémoïse le style de la cellule pour éviter les recalculs inutiles
  const cellStyle = useMemo(() => {
    // Vérification de la validité de la date
    if (!isValid(myDate)) {
      return StyleTableCell.sansVacances;
    }

    // Détermination du style en fonction des vacances
    if (estVacances(myDate, zone)) {
      return StyleTableCell.maZone;
    }
    if (estVacances(myDate, "A") || estVacances(myDate, "B")) {
      return StyleTableCell.autresZones;
    }
    return StyleTableCell.sansVacances;
  }, [myDate]); // Ne se recalcule que si myDate change

  return <TableCell sx={cellStyle} />;
}

// Validation des props avec PropTypes
TableCellVacancesForMemo.propTypes = {
  myDate: PropTypes.instanceOf(Date).isRequired, // Doit être un objet Date natif valide
};

// Exporte le composant avec memoization pour optimiser les performances
export default function TableCellVacances({ myDate }) {
  // Zone scolaire par défaut
  const zone = "C";

  // Mémoïse le style de la cellule pour éviter les recalculs inutiles
  const cellStyle = useMemo(() => {
    // Vérification de la validité de la date
    if (!isValid(myDate)) {
      return StyleTableCell.sansVacances;
    }

    // Détermination du style en fonction des vacances
    if (estVacances(myDate, zone)) {
      return StyleTableCell.maZone;
    }
    if (estVacances(myDate, "A") || estVacances(myDate, "B")) {
      return StyleTableCell.autresZones;
    }
    return StyleTableCell.sansVacances;
  }, [myDate]); // Ne se recalcule que si myDate change

  return (
    <TableCell 
      sx={cellStyle}
    />
  );
}

// Validation des props avec PropTypes
TableCellVacances.propTypes = {
  myDate: PropTypes.instanceOf(Date).isRequired, // Doit être un objet Date natif valide
};

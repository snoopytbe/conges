/**
 * TableCellCalendrier.js
 * 
 * Ce module gère l'affichage des cellules du calendrier avec les congés.
 * Il est composé de plusieurs sous-composants et hooks personnalisés pour optimiser les performances.
 * 
 * Structure principale :
 * - SingleCell : Composant de base pour afficher une demi-journée ou journée entière
 * - CellCalendrier : Composant parent qui gère l'affichage d'une ou deux SingleCell selon la durée du congé
 * - TableCellCalendrier : Version memoïsée de CellCalendrier pour optimiser les rendus
 */

import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  endOfYear
} from "date-fns";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";

import { StyleTableCell } from "../../styles";
import { useStyleHighlight, useTypeCell } from "../../hooks";
import { 
  calculeSoldeCongesAtDate, 
  giveCongeFromDate,
  estDernierJourMois,
  prochain30avril
} from "../../services";
import { highlightComparator, congesComparator } from "../../utils";

// ====== UTILITAIRES ======

/**
 * getSoldeText :
 * Calcule le solde de congés pour une période donnée et un type de congé.
 * Pour "CA" (Congés Payés), inclut également le solde au 30 avril suivant.
 * 
 * @param {Date} date - Date de référence pour le calcul du solde actuel
 * @param {Date} endOfYear - Dernier jour de l'année en cours
 * @param {Date} nextApril30 - Date du 30 avril suivant
 * @param {string} type - Type de congé ("CA", "RTT" ou "TL")
 * @param {Array} conges - Historique des congés
 * @returns {string} - Chaîne formatée du solde
 * 
 * Complexité : O(n) où n est le nombre de congés
 */
const getSoldeText = (date, endOfYearDate, nextApril30, type, conges) => {
  const actuel = calculeSoldeCongesAtDate(date, type, conges);
  const finAn = calculeSoldeCongesAtDate(endOfYearDate, type, conges);
  if (type === "CA") {
    const soldeAvril = calculeSoldeCongesAtDate(nextApril30, type, conges);
    return `CA : ${actuel} / ${finAn} / ${soldeAvril}`;
  }
  return `${type} : ${actuel} / ${finAn}`;
};

/**
 * useTooltipTitle :
 * Hook personnalisé pour générer et mémoriser le contenu du tooltip.
 * Ne se recalculera que si `date` ou `conges` changent.
 * 
 * @param {Date} date - Date à inspecter
 * @param {Array} conges - Historique des congés
 * @returns {string} - Contenu du tooltip
 */
function useTooltipTitle(date, conges) {
  return useMemo(() => {
    const congeDuJour = giveCongeFromDate(date, conges);
    const relevant = congeDuJour?.abr?.match(/CA|RTT|TL/) || estDernierJourMois(date);
    if (!relevant) return "";
    const endOfYearDate = endOfYear(date);
    const nextApril30 = prochain30avril(date);
    return ["CA", "RTT", "TL"]
      .map((type) => getSoldeText(date, endOfYearDate, nextApril30, type, conges))
      .join(", ");
  }, [date, conges]);
}

/**
 * getAbr :
 * Extrait la bonne abréviation selon la durée et la partie de journée (dayType).
 * 
 * @param {string} abr - Chaîne initiale (ex: "CA;RTT", "CA")
 * @param {string} duree - Durée du congé ("J", "AM", "PM")
 * @param {string} dayType - Partie de la journée à afficher ("J", "AM", "PM")
 * @returns {string} - Abréviation correcte ou chaîne vide
 */
const getAbr = (abr, duree, dayType) => {
  if (!abr) return "";
  if (duree === "J" || duree === dayType) return abr;
  const [matin, aprem = ""] = abr.split(";");
  return dayType === "AM" ? matin : aprem;
};

// ====== COMPOSANTS ======

/**
 * SingleCell :
 * Composant memoïsé qui affiche une seule cellule pour un dayType donné.
 */
const SingleCell = React.memo(
  ({ myDate, conges, onClick, onContextMenu, typeHighlight, dayType }) => {
    const conge = useMemo(
      () => giveCongeFromDate(myDate, conges),
      [myDate, conges]
    );
    const abr = useMemo(
      () => getAbr(conge?.abr, conge?.duree, dayType),
      [conge, dayType]
    );
    const tooltip = useTooltipTitle(myDate, conges);
    const typeCell = useTypeCell(myDate, conge, "sansConge");
    const styleConge = useMemo(() => {
      const base = StyleTableCell[typeCell] || StyleTableCell.sansDate;
      return typeCell.includes("Conge")
        ? { ...base, ...(StyleTableCell[abr] || {}) }
        : base;
    }, [typeCell, abr]);
    const styleHighlight = useStyleHighlight(typeHighlight, "right");
    const sx = useMemo(
      () => ({ ...styleConge, ...styleHighlight }),
      [styleConge, styleHighlight]
    );
    const handleClick = useCallback(
      (e) => {
        if (onClick && myDate) {
          onClick(e, myDate);
        }
      },
      [onClick, myDate]
    );
    const handleContext = useCallback(
      (e) => {
        if (onContextMenu && myDate) {
          onContextMenu(e, myDate);
        }
      },
      [onContextMenu, myDate]
    );
    const colSpan = typeCell.includes("demi") ? 1 : 2;
    return (
      <Tooltip title={tooltip} placement="right" arrow>
        <TableCell
          colSpan={colSpan}
          sx={sx}
          onClick={handleClick}
          onContextMenu={handleContext}
        >
          {abr}
        </TableCell>
      </Tooltip>
    );
  },
  congesComparator
);
SingleCell.propTypes = {
  myDate: PropTypes.instanceOf(Date).isRequired, // Date natif
  conges: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  typeHighlight: PropTypes.string,
  dayType: PropTypes.oneOf(["J", "AM", "PM"]).isRequired,
};
SingleCell.displayName = "SingleCell";

/**
 * CellCalendrier :
 * Composant parent qui gère l'affichage d'une ou deux SingleCell selon la durée du congé.
 */
const CellCalendrier = ({
  myDate,
  conges,
  onClick,
  onContextMenu,
  typeHighlight = "",
}) => {
  const conge = useMemo(
    () => giveCongeFromDate(myDate, conges),
    [myDate, conges]
  );
  if (conge && conge.duree !== "J") {
    return (
      <>
        <SingleCell
          myDate={myDate}
          conges={conges}
          onClick={onClick}
          onContextMenu={onContextMenu}
          typeHighlight={typeHighlight}
          dayType="AM"
        />
        <SingleCell
          myDate={myDate}
          conges={conges}
          onClick={onClick}
          onContextMenu={onContextMenu}
          typeHighlight={typeHighlight}
          dayType="PM"
        />
      </>
    );
  }
  return (
    <SingleCell
      myDate={myDate}
      conges={conges}
      onClick={onClick}
      onContextMenu={onContextMenu}
      typeHighlight={typeHighlight}
      dayType="J"
    />
  );
};

CellCalendrier.propTypes = {
  myDate: PropTypes.instanceOf(Date).isRequired,
  conges: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  typeHighlight: PropTypes.string,
};
CellCalendrier.displayName = "CellCalendrier";

const TableCellCalendrierMemo = React.memo(CellCalendrier, highlightComparator);

export default function TableCellCalendrier({
  myDate,
  conges,
  onClick,
  onContextMenu,
  typeHighlight = "",
}) {
  return (
    <TableCellCalendrierMemo
      myDate={myDate}
      conges={conges}
      onClick={onClick}
      onContextMenu={onContextMenu}
      typeHighlight={typeHighlight}
    />
  );
}

TableCellCalendrier.propTypes = {
  myDate: PropTypes.instanceOf(Date).isRequired,
  conges: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  typeHighlight: PropTypes.string,
};

TableCellCalendrier.displayName = "TableCellCalendrier";

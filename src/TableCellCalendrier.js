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
import moment from "moment";

import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";

import * as StyleTableCell from "./styleTableCell";
import { useStyleHighlight } from "./useStyleHighLight";
import { calculeSoldeCongesAtDate, giveCongeFromDate } from "./conges";
import { estDernierJourMois, prochain30avril } from "./vacances";

// Import des comparateurs extraits dans un hook personnalisé
import {
  useDeepCompareMemoHighlight,
  useDeepCompareMemoConge,
} from "./useDeepCompareMemo";
import { useTypeCell } from "./useTypeCell";

// ====== UTILITAIRES ======

/**
 * getSoldeText :
 * Calcule le solde de congés pour une période donnée et un type de congé.
 * Pour "CA" (Congés Payés), inclut également le solde au 30 avril suivant.
 * 
 * @param {moment} date - Date de référence pour le calcul du solde actuel
 * @param {moment} endOfYear - Dernier jour de l'année en cours
 * @param {moment} nextApril30 - Date du 30 avril suivant
 * @param {string} type - Type de congé ("CA", "RTT" ou "TL")
 * @param {Array} conges - Historique des congés
 * @returns {string} - Chaîne formatée du solde
 * 
 * Complexité : O(n) où n est le nombre de congés
 */
const getSoldeText = (date, endOfYear, nextApril30, type, conges) => {
  const actuel = calculeSoldeCongesAtDate(date, type, conges);
  const finAn = calculeSoldeCongesAtDate(endOfYear, type, conges);
  
  // Optimisation : Vérification rapide du type CA avant de calculer le solde d'avril
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
 * @param {moment} date - Date à inspecter
 * @param {Array} conges - Historique des congés
 * @returns {string} - Contenu du tooltip
 * 
 * Optimisations :
 * - Utilisation de useMemo pour éviter les recalculs inutiles
 * - Vérification rapide de la pertinence avant calcul
 */
function useTooltipTitle(date, conges) {
  return useMemo(() => {
    const congeDuJour = giveCongeFromDate(date, conges);
    const relevant = congeDuJour?.abr?.match(/CA|RTT|TL/) || estDernierJourMois(date);
    
    // Retour rapide si pas pertinent
    if (!relevant) return "";

    const endOfYear = moment([date.year(), 11, 31]);
    const nextApril30 = prochain30avril(date);

    // Utilisation de map pour une meilleure lisibilité et maintenabilité
    return ["CA", "RTT", "TL"]
      .map((type) => getSoldeText(date, endOfYear, nextApril30, type, conges))
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
 * 
 * Optimisations :
 * - Retour rapide si pas d'abréviation
 * - Vérification simple pour journée entière
 * - Destructuring optimisé pour les demi-journées
 */
const getAbr = (abr, duree, dayType) => {
  if (!abr) return "";
  if (duree === "J" || duree === dayType) return abr;
  
  // Optimisation : Destructuring avec valeur par défaut
  const [matin, aprem = ""] = abr.split(";");
  return dayType === "AM" ? matin : aprem;
};

// ====== COMPOSANTS ======

/**
 * SingleCell :
 * Composant memoïsé qui affiche une seule cellule pour un dayType donné.
 * Utilise un comparateur deep pour n'être rendu que si les props changent réellement.
 * 
 * Optimisations :
 * - Utilisation intensive de useMemo pour les calculs coûteux
 * - useCallback pour les handlers d'événements
 * - Comparateur personnalisé pour éviter les re-rendus inutiles
 * - Calcul optimisé du colspan
 */
const SingleCell = React.memo(
  ({ myDate, conges, onClick, onContextMenu, typeHighlight, dayType }) => {
    // 1. Récupération du congé du jour (mémoïsé)
    const conge = useMemo(
      () => giveCongeFromDate(myDate, conges),
      [myDate, conges]
    );

    // 2. Calcul de l'abréviation à afficher
    const abr = useMemo(
      () => getAbr(conge?.abr, conge?.duree, dayType),
      [conge, dayType]
    );

    // 3. Contenu du tooltip (mémoïsé via hook)
    const tooltip = useTooltipTitle(myDate, conges);

    // 4. Détermination du type de cellule (week-end, férié, sans congé, etc.)
    const typeCell = useTypeCell(myDate, conge, "sansConge");

    // 5. Assemblage du style de base + couleur congé
    const styleConge = useMemo(() => {
      const base = StyleTableCell[typeCell] || StyleTableCell.sansDate;
      return typeCell.includes("Conge")
        ? { ...base, ...(StyleTableCell[abr] || {}) }
        : base;
    }, [typeCell, abr]);

    // 6. Style de surbrillance
    const styleHighlight = useStyleHighlight(typeHighlight, "right");

    // 7. Synthèse finale des styles
    const sx = useMemo(
      () => ({ ...styleConge, ...styleHighlight }),
      [styleConge, styleHighlight]
    );

    // 8. Handlers stables pour éviter re-création à chaque rendu
    const handleClick = useCallback(
      (e) => onClick(e, myDate),
      [onClick, myDate]
    );
    const handleContext = useCallback(
      (e) => onContextMenu(e, myDate),
      [onContextMenu, myDate]
    );

    // 9. Détermination du colspan (1 si demi, 2 pour journée entière)
    const colSpan = typeCell.includes("demi") ? 1 : 2;

    // 10. Rendu
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
  useDeepCompareMemoConge
);
SingleCell.propTypes = {
  myDate: PropTypes.object.isRequired, // moment instance
  conges: PropTypes.array.isRequired, // array of congé objects
  onClick: PropTypes.func.isRequired, // click handler
  onContextMenu: PropTypes.func.isRequired, // right-click handler
  typeHighlight: PropTypes.string, // "first", "last", "solo" or empty
  dayType: PropTypes.oneOf(["J", "AM", "PM"]).isRequired, // partie de journée
};
SingleCell.displayName = "SingleCell";

/**
 * CellCalendrier :
 * Composant parent qui gère l'affichage d'une ou deux SingleCell selon la durée du congé.
 * 
 * Optimisations :
 * - Pré-chargement du congé avec useMemo
 * - Rendu conditionnel optimisé
 * - Props stables pour les composants enfants
 */
const CellCalendrier = ({
  myDate,
  conges,
  onClick,
  onContextMenu,
  typeHighlight = "",
}) => {
  // 1. Pré-chargement du congé du jour (mémoïsé)
  const conge = useMemo(
    () => giveCongeFromDate(myDate, conges),
    [myDate, conges]
  );

  // 2. renvoie deux cellules AM + PM si demi-journée
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

  // 3. Sinon, une cellule pour journée entière
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
  myDate: PropTypes.object.isRequired,
  conges: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  typeHighlight: PropTypes.string,
};
CellCalendrier.displayName = "CellCalendrier";

// 4. Export memoïsé avec comparateur deep personnalisé
export const TableCellCalendrier = React.memo(
  CellCalendrier,
  useDeepCompareMemoHighlight
);
TableCellCalendrier.displayName = "TableCellCalendrier";

import React from "react";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import { estFerie } from "./joursFeries";
import * as StyleTableCell from "./styleTableCell";
import { calculeSoldeCongesAtDate, giveCongeFromDate } from "./conges";
import { estDernierJourMois, prochain30avril } from "./vacances";
import moment from "moment";

function tooltipTitle(myDate, conges) {
  var result = "";
  var conge = giveCongeFromDate(myDate, conges);

  if (
    conge?.abr.includes("CA") ||
    conge?.abr.includes("RTT") ||
    conge?.abr.includes("TL") ||
    //conge?.abr.includes("CET") ||
    estDernierJourMois(myDate)
  ) {
    result =
      "Solde CA : " +
      calculeSoldeCongesAtDate(myDate, "CA", conges) +
      " / " +
      calculeSoldeCongesAtDate(moment([myDate.year(), 11, 31]), "CA", conges) +
      " / " +
      calculeSoldeCongesAtDate(prochain30avril(myDate), "CA", conges);
    result +=
      ", solde RTT : " +
      calculeSoldeCongesAtDate(myDate, "RTT", conges) +
      " / " +
      calculeSoldeCongesAtDate(moment([myDate.year(), 11, 31]), "RTT", conges);
    result +=
      ", solde TL : " +
      calculeSoldeCongesAtDate(myDate, "TL", conges) +
      " / " +
      calculeSoldeCongesAtDate(moment([myDate.year(), 11, 31]), "TL", conges);
    //result +=
    //  ", CET utilisés : " + calculeSoldeCongesAtDate(myDate, "CET", conges);
  }
  return result;
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.myDate?.format("DDMMYY") === nextProps.myDate?.format("DDMMYY") &&
    prevProps.typeHighlight === nextProps.typeHighlight &&
    JSON.stringify(prevProps.conges) === JSON.stringify(nextProps.conges)
  );
}

function getAbr(abr, duree, demiJournee) {
  var result = "";
  if (duree === "J" || duree === demiJournee) result = abr;
  if (duree?.includes(";") && demiJournee === "AM") {
    result = abr.split(";")[0];
  }
  if (duree?.includes(";") && demiJournee === "PM") {
    result = abr.split(";")[1];
  }
  return result;
}

function CellCalendrier(params) {
  const { myDate, conges, onContextMenu, onClick, typeHighlight, demiJournee } =
    params;

  //console.log("CellCalendrier " + JSON.stringify(myDate));
  var conge = giveCongeFromDate(myDate, conges);
  var abr = getAbr(conge?.abr, conge?.duree, demiJournee);

  var type = "";
  if (!conge) type = "sansConge";
  else if (conge?.duree === "J") type = "journeeConge";
  else if (conge?.duree.includes("M")) type = "demiJourneeConge";
  else type = "demiJourneeSansConge";

  var colSpan = type.includes("demi") ? 1 : 2;

  if (myDate.isValid()) {
    if (myDate.day() === 0 || myDate.day() === 6) type = "WE";
    if (estFerie(myDate)) type = "ferie";
  }

  var couleurConge = StyleTableCell[abr] ?? "";

  var styleToApply = myDate.isValid()
    ? StyleTableCell[type]
    : StyleTableCell.base;

  if (type === "journeeConge" || type === "demiJourneeConge")
    styleToApply = {
      ...styleToApply,
      ...couleurConge,
    };

  var styleHighlight;
  if (typeHighlight !== "")
    if (conge?.duree.includes("AM") && demiJournee == "AM")
      // Pour les journées highlightées :
      // on met le style hightlightedRight sauf pour le cas particulier
      // d'une demi-journée de congé le matin uniquement
      styleHighlight = StyleTableCell.highlighted;
    else styleHighlight = StyleTableCell.highlightedRight;

  switch (typeHighlight) {
    case "first":
      styleHighlight = {
        ...styleHighlight,
        ...StyleTableCell.highlightedTop,
      };
      break;
    case "last":
      styleHighlight = {
        ...styleHighlight,
        ...StyleTableCell.highlightedBottom,
      };
      break;
    case "solo":
      styleHighlight = {
        ...styleHighlight,
        ...StyleTableCell.highlightedTop,
        ...StyleTableCell.highlightedBottom,
      };
      break;
    default:
  }

  styleToApply = { ...styleToApply, ...styleHighlight };

  return (
    <Tooltip title={tooltipTitle(myDate, conges)} placement="right" arrow>
      <TableCell
        colSpan={colSpan}
        sx={{ ...styleToApply }}
        onClick={(event) => onClick(event, myDate)}
        onContextMenu={(event) => onContextMenu(event, myDate)}
      >
        {abr}
      </TableCell>
    </Tooltip>
  );
}

function TableCellCalendrierForMemo(params) {
  const { myDate, conges } = params;

  var conge = giveCongeFromDate(myDate, conges);

  if (!conge || conge?.duree === "J")
    return <CellCalendrier {...params} demiJournee="J" />;
  else
    return (
      <>
        <CellCalendrier {...params} demiJournee="AM" />
        <CellCalendrier {...params} demiJournee="PM" />
      </>
    );
}

export const TableCellCalendrier = React.memo(
  TableCellCalendrierForMemo,
  areEqual
);

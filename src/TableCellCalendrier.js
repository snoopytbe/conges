import React from "react";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import { estFerie } from "./joursFeries";
import * as StyleTableCell from "./styleTableCell";

function areEqual(prevProps, nextProps) {
  return (
    prevProps.myDate?.format("DDMMYY") === nextProps.myDate?.format("DDMMYY") &&
    prevProps.conge?.duree === nextProps.conge?.duree &&
    prevProps.conge?.abr === nextProps.conge?.abr &&
    prevProps.colSpan === nextProps.colSpan &&
    prevProps.demiJournee === nextProps.demiJournee &&
    prevProps.typeHighlight === nextProps.typeHighlight &&
    prevProps.tooltipTitle === nextProps.tooltipTitle
  );
}

function CellCalendrier(params) {
  const {
    myDate,
    conge,
    type,
    colSpan,
    onContextMenu,
    onClick,
    demiJournee,
    typeHighlight,
    tooltipTitle,
  } = params;

  //console.log("CellCalendrier " + JSON.stringify(myDate));

  var abr = conge?.abr;
  var value = conge?.duree === demiJournee ? conge?.abr : "";
  var localType = type;

  if (myDate.isValid()) {
    if (myDate.day() === 0 || myDate.day() === 6) localType = "WE";
    if (estFerie(myDate)) localType = "ferie";
  }

  var couleurConge = StyleTableCell[abr] ?? "";

  var styleToApply = myDate.isValid()
    ? StyleTableCell[localType]
    : StyleTableCell.base;

  if (localType === "journeeConge" || localType === "demiJourneeConge")
    styleToApply = {
      ...styleToApply,
      ...couleurConge,
    };

  var styleHighlight;
  if (typeHighlight !== "")
    styleHighlight = conge?.duree !== "AM" && StyleTableCell.highlightedRight;

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
    <Tooltip title={tooltipTitle} placement="right" arrow>
      <TableCell
        colSpan={colSpan}
        sx={{ ...styleToApply }}
        onClick={(event) => onClick(event, myDate)}
        onContextMenu={(event) => onContextMenu(event)}
      >
        {value}
      </TableCell>
    </Tooltip>
  );
}

function TableCellCalendrierForMemo(params) {
  const { conge, ...others } = params;

  if (!conge || conge?.duree === "J")
    return (
      <CellCalendrier
        {...params}
        colSpan={2}
        type={conge ? "journeeConge" : "sansConge"}
        demiJournee="J"
      />
    );
  else
    return (
      <>
        <CellCalendrier
          {...params}
          type={
            conge.duree === "AM" ? "demiJourneeConge" : "demiJourneeSansConge"
          }
          demiJournee="AM"
        />

        <CellCalendrier
          {...params}
          type={
            conge.duree === "PM" ? "demiJourneeConge" : "demiJourneeSansConge"
          }
          demiJournee="PM"
        />
      </>
    );
}

export const TableCellCalendrier = React.memo(
  TableCellCalendrierForMemo,
  areEqual
);

import React from "react";
import TableCell from "@mui/material/TableCell";
import { estFerie } from "./joursFeries";
import * as StyleTableCell from "./styleTableCell";
import moment from "moment";
import "moment/min/locales.min";
moment.locale("fr-FR");

function areEqual(prevProps, nextProps) {
  return (
    prevProps.myDate &&
    nextProps.myDate &&
    prevProps.myDate.format("DDMMYY") === nextProps.myDate.format("DDMMYY") &&
    prevProps.typeHighlight === nextProps.typeHighlight
  );
}

function TableCellDateForMemo(params) {
  const { myDate, onContextMenu, onClick, typeHighlight } = params;

  //console.log("TableCellDate " + JSON.stringify(myDate));

  var localType = "date";
  if (myDate.isValid()) {
    if (myDate.day() === 0 || myDate.day() === 6) localType = "WE";
    if (estFerie(myDate)) localType = "ferie";
  }

  var styleToApply = myDate.isValid()
    ? StyleTableCell[localType]
    : StyleTableCell.base;

  var styleHighlight;
  switch (typeHighlight) {
    case "middle":
      styleHighlight = StyleTableCell.highlightedLeft;
      break;
    case "first":
      styleHighlight = {
        ...StyleTableCell.highlightedLeft,
        ...StyleTableCell.highlightedTop,
      };
      break;
    case "last":
      styleHighlight = {
        ...StyleTableCell.highlightedLeft,
        ...StyleTableCell.highlightedBottom,
      };
      break;
    case "solo":
      styleHighlight = {
        ...StyleTableCell.highlightedLeft,
        ...StyleTableCell.highlightedTop,
        ...StyleTableCell.highlightedBottom,
      };
      break;
    default:
  }

  styleToApply = { ...styleToApply, ...styleHighlight };
  if (moment().isSame(myDate, "day"))
    styleToApply = { ...styleToApply, ...StyleTableCell.dateToday };

  return (
    <TableCell
      sx={{ ...styleToApply }}
      onMouseDown={(event) => onClick(event, myDate)}
      onContextMenu={(event) => onContextMenu(event)}
    >
      {myDate.isValid() &&
        myDate.format("DD") + " " + myDate.format("dd")[0].toUpperCase()}
    </TableCell>
  );
}

export const TableCellDate = React.memo(TableCellDateForMemo, areEqual);

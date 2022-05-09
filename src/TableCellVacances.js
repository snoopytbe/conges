import React from "react";
import { estVacances } from "./vacances";
import * as StyleTableCell from "./styleTableCell";
import TableCell from "@mui/material/TableCell";

function areEqual(prevProps, nextProps) {
  return (
    prevProps.myDate?.format("DDMMYY") === nextProps.myDate?.format("DDMMYY")
  );
}

function TableCellVacancesForMemo(props) {
  // eslint-disable-next-line react/prop-types
  const { myDate } = props;
  const zone = "C";

  //console.log("TableCellVacances " + JSON.stringify(myDate));

  return (
    <TableCell
      sx={{
        ...(estVacances(myDate, zone)
          ? StyleTableCell.maZone
          : estVacances(myDate, "A") || estVacances(myDate, "B")
          ? StyleTableCell.autresZones
          : StyleTableCell.vacances),
      }}
    />
  );
}

export const TableCellVacances = React.memo(TableCellVacancesForMemo, areEqual);

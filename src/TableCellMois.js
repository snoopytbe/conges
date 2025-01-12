import React from "react";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import * as StyleTableCell from "./styleTableCell";
import { compteCongesPeriode } from "./conges";
import { nbJourOuvrables } from "./joursFeries";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

function tooltipTitle(month, conges) {
  const periodeCalcul = moment.range(
    moment([month.year(), month.month(), 1]),
    moment([month.year(), month.month(), 1]).add(1,"month").subtract(1, "day")
  );

  const ca = compteCongesPeriode("CA", conges, periodeCalcul);
  const rtt = compteCongesPeriode("RTT", conges, periodeCalcul);
  const tl = compteCongesPeriode("TL", conges, periodeCalcul);
  const mal = compteCongesPeriode("MAL", conges, periodeCalcul);

  // total business days
  const buInitial = nbJourOuvrables(periodeCalcul);
  const bu = buInitial - (ca + rtt + tl + mal);

  // build your string
  const result = `CA : ${ca}, RTT : ${rtt}, TL : ${tl}, MAL : ${mal}, BU : ${bu}`;

  return result;
}

export default function TableCellMois(params) {
  const { month, conges, onContextMenu } = params;

  return (
    <Tooltip title={tooltipTitle(month, conges)} placement="right" arrow>
      <TableCell
        sx={{ ...StyleTableCell.mois }}
        colSpan={4}
        onContextMenu={(event) => onContextMenu(event, month)}
      >
        {month.locale("fr-FR").format("MMMM")}
      </TableCell>
    </Tooltip>
  );
}

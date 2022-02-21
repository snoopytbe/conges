import React from 'react';
import TableCell from '@mui/material/TableCell';
import { estFerie } from './joursFeries';
import moment from 'moment';
import * as StyleTableCell from './styleTableCell';

function styleHighlight(myDate, type, duree, highlighted) {
  var result = '';
  var isHighlighted = highlighted?.includes(myDate.format('yyyy-MM-DD'));

  if (isHighlighted) {
    var tomorrowHighlighted = highlighted.includes(
      myDate.clone().add(1, 'day').format('yyyy-MM-DD')
    );

    var tomorrowSameMonth = myDate.clone().add(1, 'day').month === myDate.month;
    tomorrowHighlighted = tomorrowHighlighted && tomorrowSameMonth;

    var yesterdayHighlighted = highlighted.includes(
      myDate.clone().add(-1, 'day').format('yyyy-MM-DD')
    );

    var yesterdaySameMonth =
      myDate.clone().add(-1, 'day').month === myDate.month;
    yesterdayHighlighted = yesterdayHighlighted && yesterdaySameMonth;

    if (tomorrowHighlighted && !yesterdayHighlighted)
      result = StyleTableCell.highlightedTop;
    if (!tomorrowHighlighted && yesterdayHighlighted)
      result = StyleTableCell.highlightedBottom;
    if (!tomorrowHighlighted && !yesterdayHighlighted)
      result = {
        ...StyleTableCell.highlightedBottom,
        ...StyleTableCell.highlightedTop,
      };

    switch (type) {
      case 'date':
        result = { ...result, ...StyleTableCell.highlightedLeft };
        break;
      case 'journeeConge':
        result = { ...result, ...StyleTableCell.highlightedRight };
        break;
      case ('demiJourneeConge', 'demiJourneeSansConge'):
        if (duree === 'PM')
          result = { ...result, ...StyleTableCell.highlightedRight };
        break;
      default:
    }
  }
  return result;
}

export default function TableCellCalendrier(params) {
  const { myDate, type, duree, children, ...others } = params;

  var styleToApply = StyleTableCell.base;

  if (moment(myDate)?.isValid) {
    if (estFerie(myDate)) styleToApply = StyleTableCell.ferie;
    else if (myDate.day() === 0 || myDate.day() === 6)
      styleToApply = StyleTableCell.WE;
    else {
      switch (type) {
        case 'date':
          styleToApply = StyleTableCell.date;
          break;
        case 'journeeConge':
          styleToApply = StyleTableCell.journeeConge;
          break;
        case 'demiJourneeConge':
          styleToApply = StyleTableCell.demiJourneeConge;
          break;
        case 'demiJourneeSansConge':
          styleToApply = StyleTableCell.demiJourneeSansConge;
          break;
        default:
          styleToApply = StyleTableCell.sansConge;
      }
    }
    styleToApply = {
      ...styleToApply,
      ...styleHighlight(myDate, type, duree),
    };
  }

  return (
    <TableCell
      {...others}
      sx={{ ...styleToApply }}
      onContextMenu={(event) => handleCellClick(event, myDate)}
      onMouseDown={(event) => onMouseDown(event, myDate)}
      onMouseUp={(event) => onMouseUp(event, myDate)}
      onMouseOver={(event) => onMouseOver(event, myDate)}
    >
      {children}
    </TableCell>
  );
}

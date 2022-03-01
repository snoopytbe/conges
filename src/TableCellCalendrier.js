import React from 'react';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import { estFerie } from './joursFeries';
import * as StyleTableCell from './styleTableCell';
import moment from 'moment';
import { extendMoment } from 'moment-range';
moment = extendMoment(moment);

function isFirstDayHighlighted(myDate, highlighted) {
  var result = false;
  if (highlighted?.contains(myDate))
    result = !highlighted?.contains(myDate.clone().add(-1, 'day'));
  return result;
}

function isLastDayHighlighted(myDate, highlighted) {
  return !highlighted?.contains(myDate.clone().add(1, 'day'));
}

function styleHighlight(myDate, type, duree, highlighted) {
  var result = '';

  if (highlighted?.contains(myDate)) {
    // On regarde si le lendemain est aussi highlighted et fait partie du même mois
    var tomorrowHighlighted =
      !isLastDayHighlighted(myDate, highlighted) &&
      myDate.clone().add(1, 'day').month === myDate.month;

    if (!tomorrowHighlighted) result = StyleTableCell.highlightedBottom;

    // On regarde si la veille est aussi highlighted et fait partie du même mois
    var yesterdayHighlighted =
      !isFirstDayHighlighted(myDate, highlighted) &&
      myDate.clone().add(-1, 'day').month === myDate.month;

    if (!yesterdayHighlighted)
      result = { ...result, ...StyleTableCell.highlightedTop };

    switch (type) {
      case 'date':
        result = { ...result, ...StyleTableCell.highlightedLeft };
        break;
      case 'sansConge':
      case 'journeeConge':
        result = { ...result, ...StyleTableCell.highlightedRight };
        break;
      case 'demiJourneeConge':
      case 'demiJourneeSansConge':
        if (duree === 'PM')
          result = { ...result, ...StyleTableCell.highlightedRight };
        else result = { ...result, ...StyleTableCell.highlighted };
        break;
      default:
        result = { ...result, ...StyleTableCell.highlighted };
    }

    if (
      isFirstDayHighlighted(myDate, highlighted) ||
      isLastDayHighlighted(myDate, highlighted)
    ) {
      result = { ...result, ...StyleTableCell.highlightedFirstLast };
    }
  }
  return result;
}

function showTooltip(myDate, highlighted, duree) {
  var result = false;
  console.log(duree)
  if (duree === 'J' || duree === 'AM')
    result = isFirstDayHighlighted(myDate, highlighted);
  return result;
}

export default function TableCellCalendrier(params) {
  const {
    myDate,
    highlighted,
    onContextMenu,
    onClick,
    type,
    duree,
    children,
    ...others
  } = params;

  var styleToApply = StyleTableCell.base;

  if (myDate?.isValid) {
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
      ...styleHighlight(myDate, type, duree, highlighted),
    };
  }

  return (
    <Tooltip
      title={
        showTooltip(myDate, highlighted, duree)
          ? 'Cliquez sur la date de fin'
          : ''
      }
      open={true}
      placement="right"
      arrow
    >
      <TableCell
        {...others}
        sx={{ ...styleToApply }}
        onClick={(event) => onClick(event, myDate)}
        onContextMenu={(event) => onContextMenu(event)}
      >
        {children}
      </TableCell>
    </Tooltip>
  );
}

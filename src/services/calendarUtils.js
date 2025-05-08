/**
 * Détermine le type d'highlight pour une date donnée
 * @param {Date} myDate - La date à analyser
 * @param {Object} highlighted - La plage de dates highlightées (doit avoir start et end)
 * @returns {string} Le type d'highlight : "solo", "first", "last" ou "middle"
 */
import { subDays, addDays, isWithinInterval, isValid } from "date-fns";

export const giveHighlightType = (myDate, highlighted) => {
  let result = "";
  if (
    highlighted &&
    highlighted.start &&
    highlighted.end &&
    isValid(myDate) &&
    isWithinInterval(myDate, { start: highlighted.start, end: highlighted.end })
  ) {
    const isFirstDayHighlighted = !isWithinInterval(subDays(myDate, 1), { start: highlighted.start, end: highlighted.end });
    const isLastDayHighlighted = !isWithinInterval(addDays(myDate, 1), { start: highlighted.start, end: highlighted.end });
    if (isFirstDayHighlighted && isLastDayHighlighted) result = "solo";
    else if (isFirstDayHighlighted) result = "first";
    else if (isLastDayHighlighted) result = "last";
    else result = "middle";
  }
  return result;
};


import Moment from "moment";

/**
 * Détermine le type d'highlight pour une date donnée
 * @param {Moment} myDate - La date à analyser
 * @param {Object} highlighted - La plage de dates highlightées
 * @returns {string} Le type d'highlight : "solo", "first", "last" ou "middle"
 */
export const giveHighlightType = (myDate, highlighted) => {
  let result = "";
  if (highlighted?.contains(myDate)) {
    const isFirstDayHighlighted = !highlighted.contains(
      myDate.clone().add(-1, "day")
    );

    const isLastDayHighlighted = !highlighted.contains(
      myDate.clone().add(1, "day")
    );

    if (isFirstDayHighlighted && isLastDayHighlighted) result = "solo";
    else if (isFirstDayHighlighted) result = "first";
    else if (isLastDayHighlighted) result = "last";
    else result = "middle";
  }
  return result;
};


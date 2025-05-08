/**
 * @fileoverview Module de gestion des congés et des calculs associés
 * @module conges
 */

import {
  isBefore,
  isAfter,
  isSameDay,
  subYears,
  startOfMonth,
  startOfYear,
  endOfYear,
  getYear,
  getMonth,
  format,
  eachDayOfInterval,
  isWithinInterval,
  parseISO
} from "date-fns";
import { nbJourOuvrables, estFerie, estWE } from "../services/joursFeries";
// eslint-disable-next-line no-unused-vars
import { putApiData, deleteApiData } from "../services/ApiData";
import { memoize } from "../utils/memoize";
import { uuidv4 } from "../utils/uuid";
import { precedent1ermai, precedent30avril } from "../services/vacances";

// Constantes pour les calculs de congés
const JOURS_CA_ANNEE = 27; // Nombre de jours de congés annuels
const JOURS_TRAVAIL_ANNEE = 209; // Nombre de jours de travail par an
const DATE_TRANSITION_RTE = new Date(2023, 6, 1); // Date de transition vers RTE
const JOURS_TL_2023 = 54; // Nombre de jours TL en 2023
const JOURS_TL_NORMAL = 108; // Nombre de jours TL normal

/**
 * Formate une date Date en chaîne au format AAAA-MM-JJ
 * @param {Date} date - L'objet date à formater
 * @returns {string} La date formatée en AAAA-MM-JJ
 */
export const formatMoment = (date) => {
  return format(date, "yyyy-MM-dd");
};

/**
 * Trouve un congé correspondant à une date donnée
 * @param {Date} date - La date à rechercher
 * @param {Array<Object>} conges - Liste des congés
 * @returns {Object|undefined} Le congé correspondant ou undefined
 */
export const giveCongeFromDate = memoize((date, conges) => {
  return conges?.find((item) => item.date === formatMoment(date));
});

/**
 * Calcule le nombre de congés d'un type spécifique sur une période donnée
 * @param {string} abr - Type de congé (ex: "RTT", "CA", "TL")
 * @param {Array<Object>} conges - Liste des congés
 * @param {{start: Date, end: Date}} periodeDecompte - Période de décompte
 * @returns {number} Nombre de jours de congés
 */
export const compteCongesPeriode = memoize((abr, conges, periodeDecompte) => {
  return conges.reduce((result, oneConge) => {
    const congeDate = parseISO(oneConge.date);
    if (
      isWithinInterval(congeDate, periodeDecompte) &&
      oneConge.abr.includes(abr)
    ) {
      return result + (oneConge.duree === "J" ? 1 : 0.5);
    }
    return result;
  }, 0);
});

/**
 * Calcule le capital de jours de TL pour une année donnée
 * @param {number} annee - L'année de calcul
 * @returns {number} Nombre de jours de TL possibles
 */
const calculeCapitalTL = memoize((annee) => {
  return annee === 2023 ? JOURS_TL_2023 : JOURS_TL_NORMAL;
});

/**
 * Calcule le capital de RTT pour une date donnée
 * @param {Date} date - Date de calcul
 * @returns {number} Nombre de jours de RTT possibles
 */
const calculeCapitalRTT = memoize((date) => {
  let periodeCalcul;
  if (isBefore(date, DATE_TRANSITION_RTE)) {
    // Période EDF
    if (isAfter(date, new Date(2023, 3, 30))) return 0;
    const anneeDebutPeriode = getYear(date) + (getMonth(date) <= 3 ? -1 : 0);
    periodeCalcul = {
      start: new Date(anneeDebutPeriode, 4, 1),
      end: new Date(anneeDebutPeriode + 1, 3, 30)
    };
  } else {
    // Période RTE
    if (getYear(date) === 2023) return 8;
    periodeCalcul = {
      start: startOfYear(date),
      end: endOfYear(date)
    };
  }
  return nbJourOuvrables(periodeCalcul) - JOURS_CA_ANNEE - JOURS_TRAVAIL_ANNEE;
});

/**
 * Calcule le capital de congés pour un type donné
 * @param {Date} date - Date de calcul
 * @param {string} abr - Type de congé
 * @param {Array<Object>} conges - Liste des congés
 * @returns {number} Capital de congés
 */
const calculeCapitalConges = (date, abr, conges) => {
  let capital;
  switch (abr) {
    case "TL":
      capital = calculeCapitalTL(getYear(date));
      break;
    case "CA": {
      const lastCAperiod = {
        start: subYears(precedent1ermai(date), 1),
        end: precedent30avril(date)
      };
      const capitalRestantAnneePrecedente =
        JOURS_CA_ANNEE - compteCongesPeriode("CA", conges, lastCAperiod);
      capital =
        JOURS_CA_ANNEE +
        (getYear(precedent30avril(date)) <= 2018 ? 0 : capitalRestantAnneePrecedente);
      break;
    }
    case "RTT":
      capital = calculeCapitalRTT(date);
      break;
    default:
      capital = 0;
  }
  return capital;
};

/**
 * Calcule le solde de congés à une date donnée
 * @param {Date} date - Date de calcul
 * @param {string} abr - Type de congé
 * @param {Array<Object>} conges - Liste des congés
 * @returns {number} Solde de congés
 */
export const calculeSoldeCongesAtDate = (date, abr, conges) => {
  let debutPeriode;
  switch (abr) {
    case "RTT": {
      debutPeriode = isBefore(date, DATE_TRANSITION_RTE)
        ? precedent1ermai(date)
        : getYear(date) === 2023
        ? new Date(2023, 6, 1)
        : startOfYear(date);
      break;
    }
    case "TL": {
      debutPeriode = isBefore(date, DATE_TRANSITION_RTE)
        ? startOfMonth(date)
        : getYear(date) === 2023
        ? new Date(2023, 6, 1)
        : startOfYear(date);
      break;
    }
    case "CA": {
      debutPeriode = precedent1ermai(date);
      break;
    }
    default:
      return 0;
  }
  const periodeDecompte = { start: debutPeriode, end: date };
  return (
    calculeCapitalConges(date, abr, conges) -
    compteCongesPeriode(abr, conges, periodeDecompte)
  );
};

/**
 * Modifie les congés en fonction des sélections
 * @param {string} abr - Type de congé
 * @param {string} duree - Durée du congé
 * @param {{start: Date, end: Date}} joursSelectionnes - Jours sélectionnés (intervalle)
 * @param {Array<Object>} conges - Liste des congés
 * @returns {Array<Object>} Nouvelle liste des congés
 */
export function modifieConges(abr, duree, joursSelectionnes, conges) {
  let newConges = [];
  eachDayOfInterval(joursSelectionnes).forEach((jour) => {
    if (!estFerie(jour) && !estWE(jour)) {
      const prevConge = conges.find((item) => isSameDay(parseISO(item.date), jour));
      const id = prevConge?.id ?? uuidv4();
      const prevDuree = prevConge?.duree ?? "";
      let storedDuree = duree;
      let storedAbr = abr;
      // Gestion des cas particuliers de durée (AM/PM)
      if (prevDuree && duree) {
        const [duree1] = prevDuree.split(";");
        if (duree1 === "AM" && duree === "PM") {
          storedDuree = "AM;PM";
          storedAbr = abr ? `${prevConge.abr};${abr}` : prevConge.abr;
        } else if (duree1 === "PM" && duree === "AM") {
          storedDuree = "AM;PM";
          storedAbr = abr ? `${abr};${prevConge.abr}` : prevConge.abr;
        } else if (prevDuree === "AM;PM") {
          if (duree === "AM") {
            storedDuree = abr ? "AM;PM" : "PM";
            storedAbr = abr ? `${abr};${prevConge.abr.split(";")[1]}` : prevConge.abr.split(";")[1];
          } else if (duree === "PM") {
            storedDuree = abr ? "AM;PM" : "AM";
            storedAbr = abr ? `${prevConge.abr.split(";")[0]};${abr}` : prevConge.abr.split(";")[0];
          }
        }
      }
      const data = {
        date: formatMoment(jour),
        abr: storedAbr,
        id,
        duree: storedDuree
      };
      if (abr === "") {
        deleteApiData([data]);
      } else {
        putApiData([data]);
        newConges = [...newConges, data];
      }
    }
  });
  // Ajout des congés existants non modifiés
  conges?.forEach((oneConge) => {
    if (!isWithinInterval(parseISO(oneConge.date), joursSelectionnes)) {
      newConges = [...newConges, oneConge];
    }
  });
  return newConges;
}

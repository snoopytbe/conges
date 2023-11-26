import moment from "moment";
import { Ascension } from "./joursFeries";
import { memoize } from "./memoize";

export function nthDay(dt, day, number) {
  // Retourne le nième jour du mois par rapport à la date dt
  // dt : date de référence
  // day : jour de la semaine
  // number : numero du jour = nieme
  var firstDay = dt.clone().date(1).day(day);
  // Si firstDay est le mois précédent il faut décaler firstDay d'une semaine
  if (firstDay.isBefore(dt.startOf("month"))) firstDay.add(7, "days");
  var result = firstDay.clone().add((number - 1) * 7, "days");
  if (result.isAfter(dt.endOf("month"))) result = moment.invalid();
  return result;
}

/**
 * Retourne Vrai si la date donnée est le dernier jour du mois
 * @param dt - une date
 * @returns Une valeur booléenne.
 */
export function estDernierJourMois(dt) {
  return dt.isValid() && dt.clone().add(1, "days").month() !== dt.month();
}

function estToussaint(dt) {
  // Le 1/11 est dans la 2e semaine de vacances de la Toussaint
  var firstNov = moment([dt.year(), 10, 1]);
  var finVacances = firstNov.day() === 0 ? firstNov : firstNov.day(7);
  var debutVacances = finVacances.clone().add(-15, "days");
  return (
    debutVacances.diff(dt, "days") <= 0 && finVacances.diff(dt, "days") >= 0
  );
}

function debutVacancesNoel(annee) {
  // Démarre le samedi qui précède Noël
  // sauf si Noel est un dimanche auquel cas cela démarre le samedi 8 jours avant
  var Noel = moment([annee, 11, 25]);
  return Noel.clone().day(6 - (Noel.day() === 0 ? 2 : 1) * 7);
}

function finVacancesNoel(annee) {
  var Noel = moment([annee, 11, 25]);
  return debutVacancesNoel(annee).add(15 + (Noel.day() === 0 && 1), "days");
}

function estNoel(dt) {
  // Attention le début et la fin des vacances sont sur deux années différentes
  var debutVacances = debutVacancesNoel(dt.year());
  var finVacances = finVacancesNoel(dt.year() - 1);
  return (
    debutVacances.diff(dt, "days") <= 0 || finVacances.diff(dt, "days") >= 0
  );
}

function debutVacancesFevrier(annee, zone) {
  // Démarre 5 semaines après la fin des vacances de Noël pour la première zone
  var Numero;
  var anneeCalcul = annee;

  if (annee >= 2023) anneeCalcul -= 1;

  switch (zone) {
    case "A":
      Numero = ((anneeCalcul - 2018) % 3) + 1;
      break;
    case "B":
      Numero = ((((anneeCalcul - 2018) % 3) + 2) % 3) + 1;
      break;
    case "C":
      Numero = ((((anneeCalcul - 2018) % 3) + 1) % 3) + 1;
      break;
    default:
      Numero = 0;
  }

  return finVacancesNoel(annee - 1).day((4 + Numero) * 7 - 1);
}

function finVacancesFevrier(annee, zone) {
  return debutVacancesFevrier(annee, zone).add(15, "days");
}

function estFevrier(dt, zone) {
  var debutVacances = debutVacancesFevrier(dt.year(), zone);
  var finVacances = finVacancesFevrier(dt.year(), zone);
  return (
    debutVacances.diff(dt, "days") <= 0 && finVacances.diff(dt, "days") >= 0
  );
}

function debutVacancesPaques(annee, zone) {
  //Démarre 8 semaines après le début des vacances de février avant 2022 et 9 semaines à partir de 2022
  return debutVacancesFevrier(annee, zone).add(
    7 * 8 + ((annee == 2022 || annee == 2023) && 7),
    "days"
  );
}

function finVacancesPaques(annee, zone) {
  return debutVacancesPaques(annee, zone).add(15, "days");
}

function estPaques(dt, zone) {
  var debutVacances = debutVacancesPaques(dt.year(), zone);
  var finVacances = finVacancesPaques(dt.year(), zone);
  return (
    debutVacances.diff(dt, "days") <= 0 && finVacances.diff(dt, "days") >= 0
  );
}

function estAscencion(dt) {
  var debutVacances = Ascension(dt.year());
  var finVacances = Ascension(dt.year()).day(7);
  return (
    debutVacances.diff(dt, "days") <= 0 && finVacances.diff(dt, "days") >= 0
  );
}

function debutVacancesEte(annee) {
  // Date approximative
  // 1er jour avant le 8 juillet inclus qui est un samedi, un vendredi ou un mercredi
  var debutVacances = moment([annee, 6, 8]);
  var joursPossibles = [3, 5, 6];
  do {
    if (joursPossibles.includes(debutVacances.day())) break;
    debutVacances.add(-1, "days");
  } while (debutVacances.month() === 6);
  return debutVacances;
}

function finVacancesEte(annee) {
  // Date approximative
  // La rentrée est le premier lundi, mardi ou jeudi de septembre
  var finVacances = moment([annee, 8, 1]);
  var joursPossibles = [1, 2, 4];
  do {
    if (joursPossibles.includes(finVacances.day())) break;
    finVacances.add(1, "days");
  } while (finVacances.month() === 8);
  return finVacances.add(-1, "days");
}

function estEte(dt) {
  var debutVacances = debutVacancesEte(dt.year());
  var finVacances = finVacancesEte(dt.year());
  return (
    debutVacances.diff(dt, "days") <= 0 && finVacances.diff(dt, "days") >= 0
  );
}

export const estVacances = memoize((dt, zone) => {
  return dt.isValid()
    ? estToussaint(dt) ||
        estNoel(dt) ||
        estFevrier(dt, zone) ||
        estPaques(dt, zone) ||
        estAscencion(dt) ||
        estEte(dt)
    : false;
});

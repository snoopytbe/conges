import {
  addDays,
  subDays,
  set,
  getYear,
  getMonth,
  getDate,
  getDay,
  isBefore,
  isAfter,
  isSameDay,
  isValid,
  startOfMonth,
  lastDayOfMonth,
  eachMonthOfInterval
} from "date-fns";
import { Ascension } from "./joursFeries";
import { memoize } from "../utils/memoize";

/**
 * Calcule le nombre de mois dans une plage de dates qui appartiennent à une année donnée
 * @param {Object} range - La plage de dates {start, end}
 * @param {number} year - L'année à vérifier
 * @returns {number} Le nombre de mois dans la plage qui appartiennent à l'année
 */
export const nbMonthInYear = (range, year) => {
  const rangeFullYear = {
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31)
  };
  // Intersection
  const start = isAfter(range.start, rangeFullYear.start) ? range.start : rangeFullYear.start;
  const end = isBefore(range.end, rangeFullYear.end) ? range.end : rangeFullYear.end;
  if (isAfter(start, end)) return 0;
  return eachMonthOfInterval({ start, end }).length;
};

/**
 * Calcule l'occurrence précédente d'un mois et d'un jour spécifiques par rapport à une date de début.
 * @param {Date} startingDate - Date de référence à partir de laquelle chercher
 * @param {number} month - Mois recherché (1-12)
 * @param {number} day - Jour du mois recherché
 * @returns {Date} La date trouvée
 * @throws {Error} Si les paramètres ne sont pas valides
 */
const trouveDateAvant = (startingDate, month, day) => {
  if (!isValid(startingDate)) {
    throw new Error("La date de départ doit être valide");
  }
  if (month < 1 || month > 12) {
    throw new Error("Le mois doit être compris entre 1 et 12");
  }
  if (day < 1 || day > 31) {
    throw new Error("Le jour doit être compris entre 1 et 31");
  }
  const year = getYear(startingDate);
  const candidate = new Date(year, month - 1, day);
  const resultYear = isAfter(candidate, startingDate) || isSameDay(candidate, startingDate) ? year - 1 : year;
  return new Date(resultYear, month - 1, day);
};

/**
 * Calcule la prochaine occurrence d'une date spécifique après une date de début.
 * @param {Date} startingDate - Date de référence à partir de laquelle chercher
 * @param {number} month - Mois recherché (1-12)
 * @param {number} day - Jour du mois recherché
 * @returns {Date} La date trouvée
 * @throws {Error} Si les paramètres ne sont pas valides
 */
const trouveDateApres = (startingDate, month, day) => {
  if (!isValid(startingDate)) {
    throw new Error("La date de départ doit être valide");
  }
  if (month < 1 || month > 12) {
    throw new Error("Le mois doit être compris entre 1 et 12");
  }
  if (day < 1 || day > 31) {
    throw new Error("Le jour doit être compris entre 1 et 31");
  }
  const year = getYear(startingDate);
  const candidate = new Date(year, month - 1, day);
  const resultYear = isBefore(candidate, startingDate) || isSameDay(candidate, startingDate) ? year + 1 : year;
  return new Date(resultYear, month - 1, day);
};

export const precedent30avril = (date) => trouveDateAvant(date, 4, 30);
export const precedent1ermai = (date) => trouveDateAvant(date, 5, 1);
export const prochain30avril = (date) => trouveDateApres(date, 4, 30);

/**
 * Calcule le nième jour d'un mois spécifique.
 * @param {Date} dt - Date de référence
 * @param {number} day - Jour de la semaine (0-6, où 0 est dimanche)
 * @param {number} number - Numéro d'occurrence du jour dans le mois
 * @returns {Date} La date trouvée ou null si hors du mois
 */
export function nthDay(dt, day, number) {
  if (!isValid(dt)) {
    throw new Error("La date de référence doit être valide");
  }
  if (day < 0 || day > 6) {
    throw new Error("Le jour de la semaine doit être compris entre 0 et 6");
  }
  if (number < 1) {
    throw new Error("Le numéro d'occurrence doit être supérieur à 0");
  }

  const firstDay = set(startOfMonth(dt), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  let d = firstDay;
  while (getDay(d) !== day) {
    d = addDays(d, 1);
  }
  d = addDays(d, (number - 1) * 7);
  if (getMonth(d) !== getMonth(dt)) return null;
  return d;
}

/**
 * Retourne Vrai si la date donnée est le dernier jour du mois
 * @param dt - une date
 * @returns Une valeur booléenne.
 */
export function estDernierJourMois(dt) {
  if (!isValid(dt)) return false;
  return getDate(dt) === getDate(lastDayOfMonth(dt));
}

/**
 * Vérifie si une date correspond à la période des vacances de la Toussaint.
 * Les vacances de la Toussaint commencent 15 jours avant le 1er novembre
 * et se terminent le dimanche suivant le 1er novembre.
 * 
 * @param {Date} dt - La date à vérifier
 * @returns {boolean} true si la date est pendant les vacances de la Toussaint
 */
function estToussaint(dt) {
  if (!isValid(dt)) {
    throw new Error("La date doit être valide");
  }

  const year = getYear(dt);
  const firstNov = new Date(year, 10, 1);
  let finVacances = firstNov;
  if (getDay(firstNov) !== 0) {
    // Aller au dimanche suivant
    finVacances = addDays(firstNov, 7 - getDay(firstNov));
  }
  const debutVacances = subDays(finVacances, 15);
  
  return !isBefore(dt, debutVacances) && !isAfter(dt, finVacances);
}

/**
 * Calcule la date de début des vacances de Noël.
 * Les vacances commencent le samedi qui précède Noël,
 * sauf si Noël est un dimanche, auquel cas elles commencent le samedi 8 jours avant.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @returns {Date} La date de début des vacances
 */
function debutVacancesNoel(annee) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }

  const year = getYear(new Date(annee, 11, 25));
  const Noel = new Date(year, 11, 25);
  // Si Noël est un dimanche, samedi 8 jours avant, sinon samedi avant Noël
  if (getDay(Noel) === 0) {
    return subDays(Noel, 8);
  } else {
    // Trouver le samedi avant Noël
    let d = Noel;
    while (getDay(d) !== 6) {
      d = subDays(d, 1);
    }
    return d;
  }
}

/**
 * Calcule la date de fin des vacances de Noël.
 * Les vacances durent 15 jours, plus 1 jour si Noël est un dimanche.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @returns {Date} La date de fin des vacances
 */
function finVacancesNoel(annee) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }

  const debut = debutVacancesNoel(annee);
  const Noel = new Date(getYear(debut), 11, 25);
  let jours = 15;
  if (getDay(Noel) === 0) jours += 1;
  return addDays(debut, jours);
}

/**
 * Vérifie si une date correspond à la période des vacances de Noël.
 * 
 * @param {Date} dt - La date à vérifier
 * @returns {boolean} true si la date est pendant les vacances de Noël
 */
function estNoel(dt) {
  if (!isValid(dt)) {
    throw new Error("La date doit être valide");
  }

  const year = getYear(dt);
  const debutVacances = debutVacancesNoel(year);
  const finVacances = finVacancesNoel(year);
  
  return !isBefore(dt, debutVacances) && !isAfter(dt, finVacances);
}

/**
 * Calcule la date de début des vacances de février pour une zone donnée.
 * Les vacances commencent 5 semaines après la fin des vacances de Noël
 * pour la première zone. Le calcul varie selon la zone et l'année.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {Date} La date de début des vacances
 */
function debutVacancesFevrier(annee, zone) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  let anneeCalcul = annee;
  if (annee >= 2023) anneeCalcul -= 1;

  const Numero = {
    'A': ((anneeCalcul - 2018) % 3) + 1,
    'B': ((((anneeCalcul - 2018) % 3) + 2) % 3) + 1,
    'C': ((((anneeCalcul - 2018) % 3) + 1) % 3) + 1
  }[zone];

  const finNoel = finVacancesNoel(annee - 1);
  // Le jour (4 + Numero) * 7 - 1 (soit jeudi, vendredi, samedi)
  let d = addDays(finNoel, (4 + Numero) * 7 - 1);
  return d;
}

/**
 * Calcule la date de fin des vacances de février pour une zone donnée.
 * Les vacances durent 15 jours.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {Date} La date de fin des vacances
 */
function finVacancesFevrier(annee, zone) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  return addDays(debutVacancesFevrier(annee, zone), 15);
}

/**
 * Vérifie si une date correspond à la période des vacances de février.
 * 
 * @param {Date} dt - La date à vérifier
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {boolean} true si la date est pendant les vacances de février
 */
function estFevrier(dt, zone) {
  if (!isValid(dt)) {
    throw new Error("La date doit être valide");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  const year = getYear(dt);
  const debutVacances = debutVacancesFevrier(year, zone);
  const finVacances = finVacancesFevrier(year, zone);
  
  return !isBefore(dt, debutVacances) && !isAfter(dt, finVacances);
}

/**
 * Calcule la date de début des vacances de Pâques pour une zone donnée.
 * Les vacances commencent 8 semaines après le début des vacances de février
 * avant 2022, et 9 semaines à partir de 2022.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {Date} La date de début des vacances
 */
function debutVacancesPaques(annee, zone) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  let weeks = 8;
  if (annee === 2022 || annee === 2023) weeks = 9;
  return addDays(debutVacancesFevrier(annee, zone), weeks * 7);
}

/**
 * Calcule la date de fin des vacances de Pâques pour une zone donnée.
 * Les vacances durent 15 jours.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {Date} La date de fin des vacances
 */
function finVacancesPaques(annee, zone) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  return addDays(debutVacancesPaques(annee, zone), 15);
}

/**
 * Vérifie si une date correspond à la période des vacances de Pâques.
 * 
 * @param {Date} dt - La date à vérifier
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {boolean} true si la date est pendant les vacances de Pâques
 */
function estPaques(dt, zone) {
  if (!isValid(dt)) {
    throw new Error("La date doit être valide");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  const year = getYear(dt);
  const debutVacances = debutVacancesPaques(year, zone);
  const finVacances = finVacancesPaques(year, zone);
  
  return !isBefore(dt, debutVacances) && !isAfter(dt, finVacances);
}

/**
 * Vérifie si une date correspond à la période des vacances de l'Ascension.
 * Les vacances durent du jeudi de l'Ascension au dimanche suivant.
 * 
 * @param {Date} dt - La date à vérifier
 * @returns {boolean} true si la date est pendant les vacances de l'Ascension
 */
function estAscencion(dt) {
  if (!isValid(dt)) {
    throw new Error("La date doit être valide");
  }

  const year = getYear(dt);
  const debutVacances = Ascension(year);
  const finVacances = addDays(debutVacances, 7);
  
  return !isBefore(dt, debutVacances) && !isAfter(dt, finVacances);
}

/**
 * Calcule la date de début des vacances d'été.
 * Les vacances commencent le premier jour avant le 8 juillet inclus
 * qui est un samedi, un vendredi ou un mercredi.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @returns {Date} La date de début des vacances
 */
function debutVacancesEte(annee) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }

  let d = new Date(annee, 6, 8);
  const joursPossibles = [3, 5, 6]; // mercredi, vendredi, samedi
  
  while (getMonth(d) === 6) {
    if (joursPossibles.includes(getDay(d))) break;
    d = subDays(d, 1);
  }
  
  return d;
}

/**
 * Calcule la date de fin des vacances d'été.
 * La rentrée est le premier lundi, mardi ou jeudi de septembre.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @returns {Date} La date de fin des vacances
 */
function finVacancesEte(annee) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }

  let d = new Date(annee, 8, 1);
  const joursPossibles = [1, 2, 4]; // lundi, mardi, jeudi
  
  while (getMonth(d) === 8) {
    if (joursPossibles.includes(getDay(d))) break;
    d = addDays(d, 1);
  }
  
  return subDays(d, 1);
}

/**
 * Vérifie si une date correspond à la période des vacances d'été.
 * 
 * @param {Date} dt - La date à vérifier
 * @returns {boolean} true si la date est pendant les vacances d'été
 */
function estEte(dt) {
  if (!isValid(dt)) {
    throw new Error("La date doit être valide");
  }

  const year = getYear(dt);
  const debutVacances = debutVacancesEte(year);
  const finVacances = finVacancesEte(year);
  
  return !isBefore(dt, debutVacances) && !isAfter(dt, finVacances);
}

/**
 * Vérifie si une date donnée correspond à une période de vacances scolaires.
 * La fonction est mémoïsée pour améliorer les performances.
 * 
 * @param {Date} dt - La date à vérifier
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {boolean} true si la date est en période de vacances, false sinon
 * @throws {Error} Si la date n'est pas valide ou si la zone n'est pas reconnue
 */
export const estVacances = memoize((dt, zone) => {
  if (!isValid(dt)) {
    throw new Error("La date doit être valide");
  }

  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  return (
    estToussaint(dt) ||
    estNoel(dt) ||
    estFevrier(dt, zone) ||
    estPaques(dt, zone) ||
    estAscencion(dt) ||
    estEte(dt)
  );
});

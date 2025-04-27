import moment from "moment";
import { Ascension } from "./joursFeries";
import { memoize } from "./memoize";

/**
 * Calcule l'occurrence précédente d'un mois et d'un jour spécifiques par rapport à une date de début.
 * @param {moment.Moment} startingDate - Date de référence à partir de laquelle chercher
 * @param {number} month - Mois recherché (1-12)
 * @param {number} day - Jour du mois recherché
 * @returns {moment.Moment} La date trouvée
 * @throws {Error} Si les paramètres ne sont pas valides
 */
const trouveDateAvant = (startingDate, month, day) => {
  if (!startingDate?.isValid()) {
    throw new Error("La date de départ doit être valide");
  }
  if (month < 1 || month > 12) {
    throw new Error("Le mois doit être compris entre 1 et 12");
  }
  if (day < 1 || day > 31) {
    throw new Error("Le jour doit être compris entre 1 et 31");
  }

  return moment([
    startingDate.year() +
      (moment([startingDate.year(), month - 1, day]).isSameOrAfter(
        startingDate
      ) && -1),
    month - 1,
    day,
  ]);
};

/**
 * Calcule la prochaine occurrence d'une date spécifique après une date de début.
 * @param {moment.Moment} startingDate - Date de référence à partir de laquelle chercher
 * @param {number} month - Mois recherché (1-12)
 * @param {number} day - Jour du mois recherché
 * @returns {moment.Moment} La date trouvée
 * @throws {Error} Si les paramètres ne sont pas valides
 */
const trouveDateApres = (startingDate, month, day) => {
  if (!startingDate?.isValid()) {
    throw new Error("La date de départ doit être valide");
  }
  if (month < 1 || month > 12) {
    throw new Error("Le mois doit être compris entre 1 et 12");
  }
  if (day < 1 || day > 31) {
    throw new Error("Le jour doit être compris entre 1 et 31");
  }

  return moment([
    startingDate.year() +
      (moment([startingDate.year(), month - 1, day]).isSameOrBefore(
        startingDate
      ) && 1),
    month - 1,
    day,
  ]);
};

export const precedent30avril = (date) => trouveDateAvant(date, 4, 30);
export const precedent1ermai = (date) => trouveDateAvant(date, 5, 1);
export const prochain30avril = (date) => trouveDateApres(date, 4, 30);

/**
 * Calcule le nième jour d'un mois spécifique.
 * @param {moment.Moment} dt - Date de référence
 * @param {number} day - Jour de la semaine (0-6, où 0 est dimanche)
 * @param {number} number - Numéro d'occurrence du jour dans le mois
 * @returns {moment.Moment} La date trouvée ou un moment invalide si hors du mois
 */
export function nthDay(dt, day, number) {
  if (!dt?.isValid()) {
    throw new Error("La date de référence doit être valide");
  }
  if (day < 0 || day > 6) {
    throw new Error("Le jour de la semaine doit être compris entre 0 et 6");
  }
  if (number < 1) {
    throw new Error("Le numéro d'occurrence doit être supérieur à 0");
  }

  const firstDay = dt.clone().date(1).day(day);
  if (firstDay.isBefore(dt.startOf("month"))) {
    firstDay.add(7, "days");
  }
  const result = firstDay.clone().add((number - 1) * 7, "days");
  return result.isAfter(dt.endOf("month")) ? moment.invalid() : result;
}

/**
 * Retourne Vrai si la date donnée est le dernier jour du mois
 * @param dt - une date
 * @returns Une valeur booléenne.
 */
export function estDernierJourMois(dt) {
  return dt.isValid() && dt.clone().add(1, "days").month() !== dt.month();
}

/**
 * Vérifie si une date correspond à la période des vacances de la Toussaint.
 * Les vacances de la Toussaint commencent 15 jours avant le 1er novembre
 * et se terminent le dimanche suivant le 1er novembre.
 * 
 * @param {moment.Moment} dt - La date à vérifier
 * @returns {boolean} true si la date est pendant les vacances de la Toussaint
 */
function estToussaint(dt) {
  if (!dt?.isValid()) {
    throw new Error("La date doit être valide");
  }

  const firstNov = moment([dt.year(), 10, 1]);
  const finVacances = firstNov.day() === 0 ? firstNov : firstNov.day(7);
  const debutVacances = finVacances.clone().add(-15, "days");
  
  return (
    debutVacances.diff(dt, "days") <= 0 && 
    finVacances.diff(dt, "days") >= 0
  );
}

/**
 * Calcule la date de début des vacances de Noël.
 * Les vacances commencent le samedi qui précède Noël,
 * sauf si Noël est un dimanche, auquel cas elles commencent le samedi 8 jours avant.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @returns {moment.Moment} La date de début des vacances
 */
function debutVacancesNoel(annee) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }

  const Noel = moment([annee, 11, 25]);
  return Noel.clone().day(6 - (Noel.day() === 0 ? 2 : 1) * 7);
}

/**
 * Calcule la date de fin des vacances de Noël.
 * Les vacances durent 15 jours, plus 1 jour si Noël est un dimanche.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @returns {moment.Moment} La date de fin des vacances
 */
function finVacancesNoel(annee) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }

  const Noel = moment([annee, 11, 25]);
  return debutVacancesNoel(annee).add(15 + (Noel.day() === 0 && 1), "days");
}

/**
 * Vérifie si une date correspond à la période des vacances de Noël.
 * 
 * @param {moment.Moment} dt - La date à vérifier
 * @returns {boolean} true si la date est pendant les vacances de Noël
 */
function estNoel(dt) {
  if (!dt?.isValid()) {
    throw new Error("La date doit être valide");
  }

  const debutVacances = debutVacancesNoel(dt.year());
  const finVacances = finVacancesNoel(dt.year() - 1);
  
  return (
    debutVacances.diff(dt, "days") <= 0 || 
    finVacances.diff(dt, "days") >= 0
  );
}

/**
 * Calcule la date de début des vacances de février pour une zone donnée.
 * Les vacances commencent 5 semaines après la fin des vacances de Noël
 * pour la première zone. Le calcul varie selon la zone et l'année.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {moment.Moment} La date de début des vacances
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

  return finVacancesNoel(annee - 1).day((4 + Numero) * 7 - 1);
}

/**
 * Calcule la date de fin des vacances de février pour une zone donnée.
 * Les vacances durent 15 jours.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {moment.Moment} La date de fin des vacances
 */
function finVacancesFevrier(annee, zone) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  return debutVacancesFevrier(annee, zone).add(15, "days");
}

/**
 * Vérifie si une date correspond à la période des vacances de février.
 * 
 * @param {moment.Moment} dt - La date à vérifier
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {boolean} true si la date est pendant les vacances de février
 */
function estFevrier(dt, zone) {
  if (!dt?.isValid()) {
    throw new Error("La date doit être valide");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  const debutVacances = debutVacancesFevrier(dt.year(), zone);
  const finVacances = finVacancesFevrier(dt.year(), zone);
  
  return (
    debutVacances.diff(dt, "days") <= 0 && 
    finVacances.diff(dt, "days") >= 0
  );
}

/**
 * Calcule la date de début des vacances de Pâques pour une zone donnée.
 * Les vacances commencent 8 semaines après le début des vacances de février
 * avant 2022, et 9 semaines à partir de 2022.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {moment.Moment} La date de début des vacances
 */
function debutVacancesPaques(annee, zone) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  return debutVacancesFevrier(annee, zone).add(
    7 * 8 + ((annee === 2022 || annee === 2023) ? 7 : 0),
    "days"
  );
}

/**
 * Calcule la date de fin des vacances de Pâques pour une zone donnée.
 * Les vacances durent 15 jours.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {moment.Moment} La date de fin des vacances
 */
function finVacancesPaques(annee, zone) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  return debutVacancesPaques(annee, zone).add(15, "days");
}

/**
 * Vérifie si une date correspond à la période des vacances de Pâques.
 * 
 * @param {moment.Moment} dt - La date à vérifier
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {boolean} true si la date est pendant les vacances de Pâques
 */
function estPaques(dt, zone) {
  if (!dt?.isValid()) {
    throw new Error("La date doit être valide");
  }
  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  const debutVacances = debutVacancesPaques(dt.year(), zone);
  const finVacances = finVacancesPaques(dt.year(), zone);
  
  return (
    debutVacances.diff(dt, "days") <= 0 && 
    finVacances.diff(dt, "days") >= 0
  );
}

/**
 * Vérifie si une date correspond à la période des vacances de l'Ascension.
 * Les vacances durent du jeudi de l'Ascension au dimanche suivant.
 * 
 * @param {moment.Moment} dt - La date à vérifier
 * @returns {boolean} true si la date est pendant les vacances de l'Ascension
 */
function estAscencion(dt) {
  if (!dt?.isValid()) {
    throw new Error("La date doit être valide");
  }

  const debutVacances = Ascension(dt.year());
  const finVacances = Ascension(dt.year()).day(7);
  
  return (
    debutVacances.diff(dt, "days") <= 0 && 
    finVacances.diff(dt, "days") >= 0
  );
}

/**
 * Calcule la date de début des vacances d'été.
 * Les vacances commencent le premier jour avant le 8 juillet inclus
 * qui est un samedi, un vendredi ou un mercredi.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @returns {moment.Moment} La date de début des vacances
 */
function debutVacancesEte(annee) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }

  const debutVacances = moment([annee, 6, 8]);
  const joursPossibles = [3, 5, 6]; // mercredi, vendredi, samedi
  
  while (debutVacances.month() === 6) {
    if (joursPossibles.includes(debutVacances.day())) break;
    debutVacances.add(-1, "days");
  }
  
  return debutVacances;
}

/**
 * Calcule la date de fin des vacances d'été.
 * La rentrée est le premier lundi, mardi ou jeudi de septembre.
 * 
 * @param {number} annee - L'année pour laquelle calculer les vacances
 * @returns {moment.Moment} La date de fin des vacances
 */
function finVacancesEte(annee) {
  if (!Number.isInteger(annee)) {
    throw new Error("L'année doit être un nombre entier");
  }

  const finVacances = moment([annee, 8, 1]);
  const joursPossibles = [1, 2, 4]; // lundi, mardi, jeudi
  
  while (finVacances.month() === 8) {
    if (joursPossibles.includes(finVacances.day())) break;
    finVacances.add(1, "days");
  }
  
  return finVacances.add(-1, "days");
}

/**
 * Vérifie si une date correspond à la période des vacances d'été.
 * 
 * @param {moment.Moment} dt - La date à vérifier
 * @returns {boolean} true si la date est pendant les vacances d'été
 */
function estEte(dt) {
  if (!dt?.isValid()) {
    throw new Error("La date doit être valide");
  }

  const debutVacances = debutVacancesEte(dt.year());
  const finVacances = finVacancesEte(dt.year());
  
  return (
    debutVacances.diff(dt, "days") <= 0 && 
    finVacances.diff(dt, "days") >= 0
  );
}

/**
 * Vérifie si une date donnée correspond à une période de vacances scolaires.
 * La fonction est mémoïsée pour améliorer les performances.
 * 
 * @param {moment.Moment} dt - La date à vérifier
 * @param {string} zone - La zone scolaire ('A', 'B' ou 'C')
 * @returns {boolean} true si la date est en période de vacances, false sinon
 * @throws {Error} Si la date n'est pas valide ou si la zone n'est pas reconnue
 */
export const estVacances = memoize((dt, zone) => {
  // Validation des entrées
  if (!dt?.isValid()) {
    throw new Error("La date doit être valide");
  }

  if (!['A', 'B', 'C'].includes(zone)) {
    throw new Error(`Zone scolaire non reconnue: ${zone}. Utilisez 'A', 'B' ou 'C'.`);
  }

  // Vérification des différentes périodes de vacances
  return (
    estToussaint(dt) ||
    estNoel(dt) ||
    estFevrier(dt, zone) ||
    estPaques(dt, zone) ||
    estAscencion(dt) ||
    estEte(dt)
  );
});

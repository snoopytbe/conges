import { nbJourOuvrables, estFerie, estWE } from "./joursFeries";
// eslint-disable-next-line no-unused-vars
import { putApiData, deleteApiData } from "./ApiData";
import { memoize } from "./memoize";
import { uuidv4 } from "./uuid";
import { precedent1ermai, precedent30avril, prochain30avril } from "./vacances";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

/**
 * Prend un objet date moment.js et renvoie une chaîne au format AAAA-MM-JJ
 * @param date - L'objet date que vous souhaitez formater.
 * @returns Une fonction qui prend une date comme argument et renvoie une chaîne au format AAAA-MM-JJ.
 */
export const formatMoment = (date) => {
  // Permet d'écrire sur le nombre num sur 2 digits
  const TDM = (num) => `${num <= 8 ? "0" : ""}${num + 1}`;

  return `${date.year()}-${TDM(date.month())}-${TDM(date.date() - 1)}`;
};

/**
 * Il renvoie l'objet conge du tableau conges qui a la même date que la date passée en argument
 * @param date - la date à vérifier
 * @param conges - la liste des conges
 * @returns Le conge qui correspond à la date.
 */
export const giveCongeFromDate = memoize((date, conges) => {
  return conges?.find((item) => item.date === formatMoment(date));
});

/**
 * @description La fonction `compteCongesPeriode` compte le nombre de congés (vacances) d'un type spécifique (`abr`)
   pris pendant une période donnée (`periodeDecompte`). Il parcourt le tableau `conges` et vérifie si
   chaque congé tombe dans la période spécifiée. Si un congé correspond au type (`abr`), il incrémente
   la variable `result` en conséquence. La fonction renvoie le décompte final des congés pour le type
   et la période spécifiés.
 * @param abr - le type de congé (par exemple "RTT", "CA", "TL")
 * @param conges - un tableau d'objets, chaque objet représentant une jour de congés.
 * @param periodeDecompte - période de temps sur laquelle le décompte est réalisé
 * @return nombre de jours
 */
export const compteCongesPeriode = memoize((abr, conges, periodeDecompte) => {
  var result = 0;

  // On compte le nombre de jours avec abr
  conges.forEach((oneConge) => {
    if (periodeDecompte.contains(moment(oneConge.date, "yyyy-MM-DD")))
      if (oneConge.abr.includes(abr)) {
        // On décompte 1 journée pour les durées égales à J
        if (oneConge.duree === "J") result += 1;
        // Et une demi-journée sinon
        else result += 0.5;
      }
  });

  return result;
});

/**
 * Calcule le nombre de jours de TL possibles pour une année donnée
 * @param annee l'année où est réalisé le calcul
 * @return le nombre de jours de TL possibles
 */
const calculeCapitalTL = memoize((annee) => {
  // A RTE, le nombre de jours de TL est 108j/an sauf en 2023 où c'est 96
  return annee === 2023 ? 54 : 108;
});

/**
 * @description Calcule le nombre de jours total de RTT possibles à une date donnée
 * @param date - une date au sein de la période des RTT
 * @return le nombre de jours de RTT de la période
 */
const calculeCapitalRTT = memoize((date) => {
  // Le période de calcul du nombre de RTT dépend de la date :
  // avant le 1/7/23 c'est EDF, après c'est RTE
  if (date.isBefore(moment([2023, 6, 1]))) {
    // Période EDF
    // Cas particulier des derniers jours à EDF
    if (date.isAfter(moment([2023, 3, 30]))) return 0;

    // La période de calcul est la période de congé courante
    // l'année de congés va du 1/5 au 30/4 de l'année suivante
    // On commence par calculer l'année de début de période de congés
    // courante en fonction du mois de date
    var anneeDebutPeriode = date.year() + (date.month() <= 3 && -1);
    var periodeCalcul = moment.range(
      moment([anneeDebutPeriode, 4, 1]),
      moment([anneeDebutPeriode + 1, 3, 30])
    );
  } else {
    // Période RTE
    // La période de calcul est l'année civile
    // Cas particulier de l'année 2023
    if (date.year() === 2023) return 8;

    periodeCalcul = moment.range(
      moment([date.year(), 0, 1]),
      moment([date.year(), 11, 31])
    );
  }
  return nbJourOuvrables(periodeCalcul) - 27 - 209;
});

/**
 * Calcule le nombre de jours de nombre de congés possibles pour une date donnée
 * @param date - la date où est calculé le solde
 * @param abr - le type de congé (par exemple "RTT", "CA", "TL")
 * @param conges - un tableau d'objets, chaque objet représentant une jour de congés.
 * @returns La fonction retourne nombre de jours de nombre de congés possibles
 */
const calculeCapitalConges = (date, abr, conges) => {
  switch (abr) {
    case "TL":
      return calculeCapitalTL(date.year());
    case "CA":
      var lastCAperiod = moment.range(
        precedent1ermai(date).add(-1, "year"),
        precedent30avril(date)
      );
      var CapitalRestantAnneePrecedente =
        27 - compteCongesPeriode("CA", conges, lastCAperiod);
      if (precedent30avril(date, 4).year() <= 2018)
        CapitalRestantAnneePrecedente = 0;
      return 27 + CapitalRestantAnneePrecedente;
    case "RTT":
      return calculeCapitalRTT(date);
  }
};

/**
 * Calcule le nombre de jours de congés restants ou utilisés à une date donnée
 * @param date - la date où est calculé le solde
 * @param abr - le type de congé (par exemple "RTT", "CA")
 * @param conges - un tableau d'objets, chaque objet représentant une jour de congés.
 * @returns Le résultat de la fonction est la différence entre le capital de congés
 * et le nombre de congés posés
 */
export const calculeSoldeCongesAtDate = (date, abr, conges) => {
  // Date de début de la période de congés
  var debutPeriode;

  switch (abr) {
    case "RTT":
      // Pour un RTT :
      // avant le 1er juillet 2023, à EDF, la période de décompte démarre le 1er mai qui précède
      // Pour l'année 2023 à RTE la période de décompte démarre le 1er juillet
      // Après 2023 la période début le 1er janvier
      if (date.isBefore(moment([2023, 6, 1])))
        debutPeriode = precedent1ermai(date);
      else if (date.year() === 2023) debutPeriode = moment([2023, 6, 1]);
      else debutPeriode = moment([date.year(), 0, 1]);
      break;

    case "TL":
      // Pour un TL :
      // avant le 1er juillet 2023, à EDF, la période de décompte démarre le début du mois de "date"
      // Pour l'année 2023 à RTE la période de décompte démarre le 1er juillet
      // Après 2023 la période début le 1er janvier
      if (date.isBefore(moment([2023, 6, 1])))
        debutPeriode = moment([date.year(), date.month(), 1]);
      else if (date.year() === 2023) debutPeriode = moment([2023, 6, 1]);
      else debutPeriode = moment([date.year(), 0, 1]);
      break;

    case "CA":
      // Pour un CA la période débute le 1er mai qui précède date
      debutPeriode = precedent1ermai(date);
  }

  // La période de décompte se termine à "date"
  var periodeDecompte = moment.range(debutPeriode, date);

  return (
    calculeCapitalConges(date, abr, conges) -
    compteCongesPeriode(abr, conges, periodeDecompte)
  );
};

/**
 * @description Cette fonction ajoute/modifie/supprime les données en BDD en fonction des jours de congés
 * sélectionnés et de l'abr choisie
 * et retourne le nouveau tableau conges
 * @param abr - le type de congé (par exemple "RTT", "CA")
 * @param duree - la durée du congé ("AM", "PM", "AM;PM")
 * @param conges - un tableau d'objets, chaque objet représentant un jour de congés.
 * @param joursSelectionnes - jours de congés sélectionnés
 * @return nouveau tableau congés
 */
export function modifieConges(abr, duree, joursSelectionnes, conges) {
  // la variable newConges contient la nouvelle valeur du tableau conges
  let newConges = [];

  // on va ajouter/modifier tous les jours "joursSelectionnes" en base de donnée
  Array.from(joursSelectionnes.by("day")).forEach((itemjoursSelectionnes) => {
    // On n'ajoute en base que les conges sur des jours qui ne sont ni fériés, ni we
    if (!estFerie(itemjoursSelectionnes) && !estWE(itemjoursSelectionnes)) {
      // On commence par chercher s'il existe déjà une donnée à cette date
      let prevConge = conges.find((item) =>
        moment(item.date).isSame(itemjoursSelectionnes, "day")
      );

      // On récupère l'id en le créant s'il n'existe pas
      let id = prevConge?.id ?? uuidv4();

      // On retrouve la duree précédente
      let prevDuree = prevConge?.duree ?? "";

      let storedDuree = duree;
      let storedAbr = abr;

      if (prevDuree === "AM" && duree === "PM") {
        if (abr !== "") {
          storedDuree = "AM;PM";
          storedAbr = prevConge.abr + ";" + abr;
        } else {
          storedDuree = prevDuree;
          storedAbr = prevConge.abr;
        }
      }

      if (prevDuree === "PM" && duree === "AM") {
        if (abr !== "") {
          storedDuree = "AM;PM";
          storedAbr = abr + ";" + prevConge.abr;
        } else {
          storedDuree = prevDuree;
          storedAbr = prevConge.abr;
        }
      }

      if (prevDuree === "AM;PM" && duree === "AM") {
        if (abr !== "") {
          storedDuree = "AM;PM";
          storedAbr = abr + ";" + prevConge.abr.split(";")[1];
        } else {
          storedDuree = "PM";
          storedAbr = prevConge.abr.split(";")[1];
        }
      }

      if (prevDuree === "AM;PM" && duree === "PM") {
        if (abr !== "") {
          storedDuree = "AM;PM";
          storedAbr = prevConge.abr.split(";")[0] + ";" + abr;
        } else {
          storedDuree = "AM";
          storedAbr = prevConge.abr.split(";")[0];
        }
      }

      // On créé la nouvelle donnée à ajouter/supprimer dans la base
      let data = {
        date: formatMoment(itemjoursSelectionnes),
        abr: storedAbr,
        id: id,
        duree: storedDuree,
      };

      if (abr == "") {
        // Cas particulier où abr="" ce qui veut dire qu'on efface les données précédentes
        deleteApiData([data]);
      } else {
        putApiData([data]);
        newConges = [...newConges, data];
      }
    }
  });

  //on complète avec les jours présents dans "conges" qui n'étaient pas joursSelectionnes

  conges?.forEach((oneConge) => {
    if (!joursSelectionnes?.contains(moment(oneConge.date)))
      newConges = [...newConges, oneConge];
  });

  return newConges;
}

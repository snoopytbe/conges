import { nbJourOuvrables, estFerie, estWE } from "./joursFeries";
// eslint-disable-next-line no-unused-vars
import { putApiData, deleteApiData } from "./ApiData";
import { memoize } from "./memoize";
import { uuidv4 } from "./uuid";
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

// Calcule le nombre de jour de TL possibles pour une date donnée
// C'est le nombre de jour du mois travaillés / 2
const calculeCapitalTL = memoize((date, conges) => {
  // La période de calcul est le mois de "date"
  var periodeCalcul = moment.range(
    moment([date.year(), date.month(), 1]),
    moment([date.year(), date.month() + 1, 1]).add(-1, "days")
  );

  // Le nombre de jours travaillés est le nombre de jours ouvrables
  var nbJoursTravailles = nbJourOuvrables(periodeCalcul);

  // Auquel on déduit le nombre de journées complètes de CA, RTT ou MAL
  conges.forEach((oneConge) => {
    if (periodeCalcul.contains(moment(oneConge.date, "YYYY-MM-DD")))
      if (oneConge.duree === "J" && "CA;RTT;MAL".includes(oneConge.abr))
        nbJoursTravailles -= 1;
  });

  return Math.ceil(nbJoursTravailles / 2);
});

// Calcule le nombre de jours travaillés restants avec une date donnée
export const calculeDecompte = memoize((conges) => {
  // La période de calcul démarre aujourd'hui
  var periodeCalcul = moment.range(moment(), moment([2023, 6, 1]));

  // Le nombre de jours travaillés est le nombre de jours ouvrables
  var nbJoursTravailles = nbJourOuvrables(periodeCalcul);

  // Auquel on déduit le nombre de journées complètes de CA, RTT ou MAL
  conges.forEach((oneConge) => {
    if (periodeCalcul.contains(moment(oneConge.date, "YYYY-MM-DD"))) {
      if ("J".includes(oneConge.duree) && "CA;RTT;MAL".includes(oneConge.abr))
        nbJoursTravailles -= 1;
    }
  });
  return nbJoursTravailles;
});

// Calcule le nombre de jour de congés possibles pour une date donnée
// et un abr donné
const calculeCapitalAutres = memoize((date, abr) => {
  // Si abr est CA alors le résultat 27
  if (abr === "CA") return 27;

  // La période de calcul est la période de congé courante
  // l'année de congés va du 1/5 au 30/4 de l'année suivante
  // On commence par calculer l'année de début de période de congés
  // courante en fonction du mois de date
  var anneeDebutPeriode = date.year() + (date.month() <= 3 && -1);
  var periodeCalcul = moment.range(
    moment([anneeDebutPeriode, 4, 1]),
    moment([anneeDebutPeriode + 1, 3, 30])
  );

  return nbJourOuvrables(periodeCalcul) - 27 - 209;
});

/**
 * Calcule le nombre de jours de nombre de congés possibles pour une date donnée
 * @param date - la date où est calculé le solde
 * @param abr - le type de congé (par exemple "RTT", "CA")
 * @param conges - un tableau d'objets, chaque objet représentant une jour de congés.
 * @returns La fonction réoriente vers la bonne fonction de calcul en fonction
 * du type de congés
 */
const calculeCapitalConges = (date, abr, conges) => {
  if (abr === "TL") {
    return calculeCapitalTL(date, conges);
  } else {
    return calculeCapitalAutres(date, abr);
  }
};

// Compte le nombre de congés de type abr posés sur une période
const compteCongesPeriode = memoize((abr, conges, date) => {
  var result = 0;

  // Pour un TL la période de décompte est le début du mois de "date"
  // Sinon elle est le 1/5 qui précède "date"
  var debutPeriode =
    abr === "TL"
      ? moment([date.year(), date.month(), 1])
      : moment([date.year() + (date.month() <= 3 && -1), 4, 1]);

  // La période de décompte se termine à "date"
  var periodeDecompte = moment.range(debutPeriode, date);

  // On compte le nombre de jours avec abr
  conges.forEach((oneConge) => {
    if (periodeDecompte.contains(moment(oneConge.date, "yyyy-MM-DD")))
      if (oneConge.abr.includes(abr)) {
        // On décompte 1 journée pour les durées égales à J et les TL
        if (oneConge.duree === "J" || abr === "TL") result += 1;
        // Et une demi-journée sinon
        else result += 0.5;
      }
  });

  return result;
});

/**
 * Calcule le nombre de jours de congés restants ou utilisés à une date donnée
 * @param date - la date où est calculé le solde
 * @param abr - le type de congé (par exemple "RTT", "CA")
 * @param conges - un tableau d'objets, chaque objet représentant une jour de congés.
 * @returns Le résultat de la fonction est la différence entre le capital de congés
 * et le nombre de congés posés
 */
export const calculeSoldeCongesAtDate = (date, abr, conges) => {
  var result;

  if (abr === "CET") {
    result = compteCongesPeriode(abr, conges, date);
  } else {
    result =
      calculeCapitalConges(date, abr, conges) -
      compteCongesPeriode(abr, conges, date);
  }
  return result;
};

export function handleNewConge(abr, conges, highlighted) {
  let newConges = [];

  // on va ajouter/modifier avec le PUT tous les jours "highlighted"
  Array.from(highlighted.by("day")).forEach((oneHighlighted) => {
    // On ne sauvegarde les conges que pour les jours qui ne sont ni fériés, ni we
    if (!estFerie(oneHighlighted) && !estWE(oneHighlighted)) {
      // On commence par chercher s'il existe, un jour de congés à cette date
      let prevConge = conges.find((item) =>
        moment(item.date).isSame(oneHighlighted, "day")
      );

      // On créé l'id s'il n'existe pas
      let id = prevConge?.id ?? uuidv4();

      // On retrouve la duree précédente
      /*let prevDuree = prevConge?.duree ?? "";

      let storedDuree = "duree";
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
      }*/

      let data = {
        date: formatMoment(oneHighlighted),
        abr: abr, //storedAbr,
        id: id,
        duree: "J", //storedDuree,
      };

      //console.log(data)
      if (abr == "") {
        //(!storedAbr) {
        deleteApiData([data]);
      } else {
        putApiData([data]);
        newConges = [...newConges, data];
      }
    }
  });

  //on complète avec les jours présents dans "conges" qui n'étaient pas highlighted
  conges?.forEach((oneConge) => {
    if (!highlighted?.contains(moment(oneConge.date)))
      newConges = [...newConges, oneConge];
  });

  return newConges;
}

/* eslint-disable no-unused-vars */
import { estFerie } from "./joursFeries";
import { putApiData, deleteApiData } from "./ApiData";
import { memoize } from "./memoize";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function estWE(jour) {
  return jour.day() === 6 || jour.day() === 0;
}

const calculeCapitalTL = (date, conges) => {
  var periodeConges = moment.range(
    moment([date.year(), date.month(), 1]),
    moment([date.year(), date.month() + 1, 1]).add(-1, "days")
  );

  var nbJourOuvrables = 0;
  Array.from(periodeConges.by("day")).forEach((oneDay) => {
    if (!estFerie(oneDay) && !estWE(oneDay)) nbJourOuvrables += 1;
  });

  conges.forEach((oneConge) => {
    if (periodeConges.contains(moment(oneConge.date, "YYYY-MM-DD")))
      if (
        oneConge.duree === "J" &&
        (oneConge.abr === "CA" ||
          oneConge.abr === "RTT" ||
          oneConge.abr === "MAL")
      ) {
        nbJourOuvrables -= 1;
      }
  });

  return Math.ceil(nbJourOuvrables / 2);
};

const calculeCapitalConges = memoize((date, abr) => {
  var result;

  if (abr === "CA") result = 27;
  else {
    var periodeConges = moment.range(
      moment([date.year() + (date.month() <= 3 && -1), 4, 1]),
      moment([date.year() + (date.month() > 3 && 1), 3, 30])
    );

    var nbJourOuvrables = 0;
    Array.from(periodeConges.by("day")).forEach((oneDay) => {
      if (!estFerie(oneDay) && !estWE(oneDay)) nbJourOuvrables += 1;
    });
    result = nbJourOuvrables - 27 - 209;
  }
  return result;
});

const compteCongesPeriode = memoize((abr, conges, date) => {
  var result = 0;

  var periodeDecompte = moment.range(
    abr === "TL"
      ? moment([date.year(), date.month(), 1])
      : moment([date.year() + (date.month() <= 3 && -1), 4, 1]),
    date
  );

  conges.forEach((oneConge) => {
    if (periodeDecompte.contains(moment(oneConge.date, "yyyy-MM-DD")))
      if (abr === "TL" && oneConge.abr.includes(abr)) {
        result += 1;
      } else if (oneConge.abr === abr) {
        result += 1;
      } else if (oneConge.abr.includes(abr)) {
        result += 0.5;
      }
  });
  return result;
});

export const calculeSoldeCongesAtDate = memoize((date, abr, conges) => {
  var result;
  if (abr === "TL") {
    result = calculeCapitalTL(date, conges);
  } else {
    result = calculeCapitalConges(date, abr);
  }
  result -= compteCongesPeriode(abr, conges, date);
  return result;
});

export function handleNewConge(abr, duree, conges, highlighted) {
  let newConges = [];
  // on va ajouter/modifier avec le PUT tous les jours "highlighted"
  //console.log(abreviation);
  Array.from(highlighted.by("day")).forEach((oneHighlighted) => {
    // On ne sauvegarde les conges que pour les jours qui ne sont ni fériés, ni dimanche, ni samedi
    let day = oneHighlighted.day();

    if (!estFerie(oneHighlighted) && !(day === 0) && !(day === 6)) {
      // On commence par chercher s'il existe déjà un congé à cette date
      let prevConge = conges.find((item) =>
        moment(item.date).isSame(oneHighlighted, "day")
      );

      // On créé l'id s'il n'existe pas
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

      let data = {
        date: oneHighlighted.format("yyyy-MM-DD"),
        abr: storedAbr,
        id: id,
        duree: storedDuree,
      };

      //console.log(data)
      if (!storedAbr) {
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

  //console.log(conges)
  return newConges;
}

import React from "react";
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

export const calculeCapitalConges = memoize((anneeDebutPeriodeConges, abr) => {
  var result;
  var t0 = Date.now();
  if (abr === "CA") result = 27;
  else {
    var periodeConges = moment.range(
      moment([anneeDebutPeriodeConges, 4, 1]),
      moment([anneeDebutPeriodeConges + 1, 3, 30])
    );
    var nbJourOuvrables = 0;
    Array.from(periodeConges.by("day")).forEach((oneDay) => {
      if (!estFerie(oneDay) && !estWE(oneDay)) nbJourOuvrables += 1;
    });
    result = nbJourOuvrables - 27 - 209;
  }
  //console.log(`calculeCapitalConges: ${Date.now() - t0}`);
  return result;
});

export const calculeSoldeCongesAtDate = memoize((date, abr, conges) => {
  var t0 = Date.now();
  var anneeDebutPeriodeConges =
    date.month() <= 3 ? date.year() - 1 : date.year();
  var result = calculeCapitalConges(anneeDebutPeriodeConges, abr);
  result -= compteCongesPeriode(
    abr,
    conges,
    moment([anneeDebutPeriodeConges, 4, 1]),
    date
  );
  //console.log(`calculeSoldeCongesAtDate: ${Date.now() - t0}`);
  return result;
});

export const compteCongesPeriode = memoize(
  (abr, conges, dateDebut, dateFin) => {
    var result = 0;

    conges.forEach((oneConge) => {
      if (
        moment(oneConge.date, "yyyy-MM-DD").isSameOrAfter(dateDebut) &&
        moment(oneConge.date, "yyyy-MM-DD").isSameOrBefore(dateFin) &&
        oneConge.abr === abr
      ) {
        result += 1;
      }
    });
    return result;
  }
);

export function compteCongesAnnee(conges, anneeDebut) {
  var t0 = Date.now();
  var dateDebut = moment([anneeDebut, 4, 1]);
  var dateFin = moment([anneeDebut + 1, 3, 30]);

  var result = { CA: "", RTT: "", CET: "", FOR: "", MAL: "" };
  Object.keys(result).forEach(
    (key) =>
      (result[key] = compteCongesPeriode(key, conges, dateDebut, dateFin))
  );
  console.log(`compteCongesAnnee: ${Date.now() - t0}`);
  return result;
}

export function handleNewConge(abreviation, type, conges, highlighted) {
  let newConges = [];
  // on va ajouter/modifier avec le PUT tous les jours "highlighted"
  //console.log(abreviation);
  Array.from(highlighted.by("day")).forEach((oneHighlighted) => {
    // On ne sauvegarde les conges que pour les jours qui ne sont ni fériés, ni dimanche, ni samedi
    let day = oneHighlighted.day();

    if (!estFerie(oneHighlighted) && !(day === 0) && !(day === 6)) {
      // On commence par chercher l'id et on le créé s'il n'existe pas
      let id =
        conges.filter((oneConge) =>
          moment(oneConge.date).isSame(oneHighlighted, "day")
        )?.[0]?.id ?? uuidv4();

      let duree =
        type === "temps"
          ? abreviation
          : conges.filter((oneConge) =>
              moment(oneConge.date).isSame(oneHighlighted, "day")
            )?.[0]?.duree ?? "J";

      let abr =
        type === "temps"
          ? conges.filter((oneConge) =>
              moment(oneConge.date).isSame(oneHighlighted, "day")
            )?.[0]?.abr
          : abreviation;

      let data = {
        date: oneHighlighted.format("yyyy-MM-DD"),
        abr: abr,
        id: id,
        duree: duree,
      };

      //console.log(data)
      if (!abr) {
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

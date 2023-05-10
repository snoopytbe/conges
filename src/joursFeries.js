// Inspiré de github.com/martinjw/Holiday
import moment from "moment";
import { memoize } from "./memoize";

const Paques = (year) => {
  //Oudin's Algorithm
  var g = year % 19;
  var c = Math.floor(year / 100);
  var d = c - Math.floor(c / 4);
  var e = Math.floor((8 * c + 13) / 25);
  var h = (d - e + 19 * g + 15) % 30;
  var k = Math.floor(h / 28);
  var p = Math.floor(29 / (h + 1));
  var q = Math.floor((21 - g) / 11);
  var i = h - k * (1 - k * p * q);
  var j = (Math.floor(year / 4) + year + i + 2 - d) % 7;

  return moment([year, 2, 1]).add(27 + i - j, "days");
};

export function NouvelAn(year) {
  return moment([year, 0, 1]);
}

export function LundiDePaques(year) {
  var paq = Paques(year);
  return paq.add(1, "days");
}

export function PremierMai(year) {
  return moment([year, 4, 1]);
}

export function HuitMai(year) {
  return moment([year, 4, 8]);
}

export function Ascension(year) {
  var paq = Paques(year);
  return paq.add(4 + 7 * 5, "days");
}

export function LundiDePentecote(year) {
  var paq = Paques(year);
  return paq.add(1 + 7 * 7, "days");
}

export function FeteNationale(year) {
  return moment([year, 6, 14]);
}

export function Assomption(year) {
  return moment([year, 7, 15]);
}

export function Toussaint(year) {
  return moment([year, 10, 1]);
}

export function Armistice(year) {
  return moment([year, 10, 11]);
}

export function Noel(year) {
  return moment([year, 11, 25]);
}

export const estWE = (day) => {
  return day.day() === 6 || day.day() === 0;
};

// A EDF, le lundi 26/12 et le lundi 2/1 sont fériés
const estFerieEDF = (day) => {
  return (
    (day.day() === 1 && day.isSame(moment([day.year(), 11, 26]))) ||
    (day.day() === 1 && day.isSame(moment([day.year(), 0, 2])))
  );
};

export const estFerie = memoize((day) => {
  var year = day.year();

  return (
    NouvelAn(year).isSame(day, "day") ||
    LundiDePaques(year).isSame(day, "day") ||
    PremierMai(year).isSame(day, "day") ||
    Ascension(year).isSame(day, "day") ||
    HuitMai(year).isSame(day, "day") ||
    LundiDePentecote(year).isSame(day, "day") ||
    FeteNationale(year).isSame(day, "day") ||
    Assomption(year).isSame(day, "day") ||
    Toussaint(year).isSame(day, "day") ||
    Armistice(year).isSame(day, "day") ||
    Noel(year).isSame(day, "day") ||
    estFerieEDF(day)
  );
});

// Le nombre de jours ouvrables est le nombre de jours
// de la période de calcul qui ne sont ni fériés ni des WE
export const nbJourOuvrables = memoize((periodeCalcul) => {
  var result = 0;
  Array.from(periodeCalcul?.by("day")).forEach((oneDay) => {
    if (!estFerie(oneDay) && !estWE(oneDay)) result += 1;
  });
  return result;
});

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

function AreDateEquals(date1, date2) {
  return (
    date1.year() === date2.year() &&
    date1.month() === date2.month() &&
    date1.date() === date2.date()
  );
}

export const estFerie = memoize((myDate) => {
  var year = myDate.year();

  return (
    AreDateEquals(NouvelAn(year), myDate) ||
    AreDateEquals(LundiDePaques(year), myDate) ||
    AreDateEquals(PremierMai(year), myDate) ||
    AreDateEquals(Ascension(year), myDate) ||
    AreDateEquals(HuitMai(year), myDate) ||
    AreDateEquals(LundiDePentecote(year), myDate) ||
    AreDateEquals(Ascension(year), myDate) ||
    AreDateEquals(FeteNationale(year), myDate) ||
    AreDateEquals(Assomption(year), myDate) ||
    AreDateEquals(Toussaint(year), myDate) ||
    AreDateEquals(Armistice(year), myDate) ||
    AreDateEquals(Noel(year), myDate)
  );
});

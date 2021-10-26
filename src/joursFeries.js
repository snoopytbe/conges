// Inspiré de github.com/martinjw/Holiday

import moment from 'moment';

export function Paques(year) {
  //Oudin's Algorithm
  var g = year % 19;
  var c = year / 100;
  var h = (c - c / 4 - (8 * c + 13) / 25 + 19 * g + 15) % 30;
  var i = h - (h / 28) * (1 - (h / 28) * (29 / (h + 1)) * ((21 - g) / 11));
  var j = (year + year / 4 + i + 2 - c + c / 4) % 7;
  var p = i - j;
  var easterDay = 1 + ((p + 27 + (p + 6) / 40) % 31);
  var easterMonth = 3 + (p + 26) / 30;

  return moment([year, easterMonth - 1, easterDay]);
}

export function NouvelAn(year) {
  return moment([year, 0, 1]);
}

export function LundiDePaques(year) {
  var paq = Paques(year);
  return paq.add(1, 'days');
}

export function PremierMai(year) {
  return moment([year, 4, 1]);
}

export function HuitMai(year) {
  return moment([year, 4, 8]);
}

export function Ascension(year) {
  var paq = Paques(year);
  return paq.add(4 + 7 * 5, 'days');
}

export function LundiDePentecote(year) {
  var paq = Paques(year);
  return paq.add(1 + 7 * 7, 'days');
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

export function estFerie(myDate) {
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
}

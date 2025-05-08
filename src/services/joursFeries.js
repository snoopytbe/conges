// Inspiré de github.com/martinjw/Holiday
import { addDays, isSameDay, getDay, eachDayOfInterval } from "date-fns";
import { memoize } from "../utils/memoize";

const Paques = (year) => {
  //Oudin's Algorithm
  const g = year % 19;
  const c = Math.floor(year / 100);
  const d = c - Math.floor(c / 4);
  const e = Math.floor((8 * c + 13) / 25);
  const h = (d - e + 19 * g + 15) % 30;
  const k = Math.floor(h / 28);
  const p = Math.floor(29 / (h + 1));
  const q = Math.floor((21 - g) / 11);
  const i = h - k * (1 - k * p * q);
  const j = (Math.floor(year / 4) + year + i + 2 - d) % 7;

  // 1er mars (mois 2 car 0-indexé) + (27 + i - j) jours
  return addDays(new Date(year, 2, 1), 27 + i - j);
};

export function NouvelAn(year) {
  return new Date(year, 0, 1);
}

export function LundiDePaques(year) {
  const paq = Paques(year);
  return addDays(paq, 1);
}

export function PremierMai(year) {
  return new Date(year, 4, 1);
}

export function HuitMai(year) {
  return new Date(year, 4, 8);
}

export function Ascension(year) {
  const paq = Paques(year);
  return addDays(paq, 39); // 39 jours après Pâques
}

export function LundiDePentecote(year) {
  const paq = Paques(year);
  return addDays(paq, 50); // 50 jours après Pâques
}

export function FeteNationale(year) {
  return new Date(year, 6, 14);
}

export function Assomption(year) {
  return new Date(year, 7, 15);
}

export function Toussaint(year) {
  return new Date(year, 10, 1);
}

export function Armistice(year) {
  return new Date(year, 10, 11);
}

export function Noel(year) {
  return new Date(year, 11, 25);
}

export const estWE = (day) => {
  const dayOfWeek = getDay(day);
  return dayOfWeek === 6 || dayOfWeek === 0;
};

// A EDF, le lundi 26/12 et le lundi 2/1 sont fériés
const estFerieEDF = (day) => {
  // Lundi = 1
  return (
    (getDay(day) === 1 && isSameDay(day, new Date(day.getFullYear(), 11, 26))) ||
    (getDay(day) === 1 && isSameDay(day, new Date(day.getFullYear(), 0, 2)))
  );
};

export const estFerie = memoize((day) => {
  const year = day.getFullYear();

  return (
    isSameDay(NouvelAn(year), day) ||
    isSameDay(LundiDePaques(year), day) ||
    isSameDay(PremierMai(year), day) ||
    isSameDay(Ascension(year), day) ||
    isSameDay(HuitMai(year), day) ||
    isSameDay(LundiDePentecote(year), day) ||
    isSameDay(FeteNationale(year), day) ||
    isSameDay(Assomption(year), day) ||
    isSameDay(Toussaint(year), day) ||
    isSameDay(Armistice(year), day) ||
    isSameDay(Noel(year), day) ||
    estFerieEDF(day)
  );
});

// Le nombre de jours ouvrables est le nombre de jours
// de la période de calcul qui ne sont ni fériés ni des WE
export const nbJourOuvrables = memoize((periodeCalcul) => {
  let result = 0;
  // periodeCalcul doit avoir { start, end } (objets Date)
  eachDayOfInterval({ start: periodeCalcul.start, end: periodeCalcul.end }).forEach((oneDay) => {
    if (!estFerie(oneDay) && !estWE(oneDay)) result += 1;
  });
  return result;
});

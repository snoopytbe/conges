const couleurAnnee = "#070722ff";
const couleurMois = "#131347ff";
const couleurPolice = "#f8f4ffff";
const couleurDimanche = "#E0E0E0";
const couleurJourFerie = "#A2A2A2";
const couleurVacances = "#e60000";
const couleurVacancesAutres = "#FF8F8F";
const white = "#ffffff";
const black = "#000000";
const red = "#FF0000";

export const base = {
  border: `0.5px solid ${white}`,
  backgroundColor: "#F5F5F5",
  paddingBottom: "1px",
  paddingTop: "1px",
  paddingLeft: "5px",
  paddingRight: "5px",
  fontSize: "0.7em",
  textAlign: "center",
  color: couleurPolice,
  userSelect: "none",
};

export const annee = {
  ...base,
  backgroundColor: couleurAnnee,
  fontSize: "1em",
};

export const mois = {
  ...base,
  backgroundColor: couleurMois,
  fontSize: "0.8em",
};

export const date = {
  ...base,
  color: "#333333",
  width: "30px",
  borderColor: "#F5F5F5",
};

export const dateToday = {
  color: white,
  backgroundColor: red,
  borderColor: red,
};

export const WE = {
  ...date,
  backgroundColor: couleurDimanche,
  borderColor: couleurDimanche,
};

export const ferie = {
  ...date,
  backgroundColor: couleurJourFerie,
  borderColor: couleurJourFerie,
  color: white,
};

const colonneConges = {
  ...base,
  color: black,
  width: "63px",
  borderColor: "#F5F5F5",
};

export const sansConge = {
  ...colonneConges,
};

export const journeeConge = {
  ...sansConge,
};

export const demiJourneeSansConge = {
  ...colonneConges,
  width: "31px",
  paddingLeft: "2px",
  paddingRight: "2px",
};

export const demiJourneeConge = {
  ...demiJourneeSansConge,
};

export const CA = {
  backgroundColor: "#87CEEB",
  color: "#333333",
};

export const RTT = {
  backgroundColor: "#B3D9FF",
  color: "#333333",
};

export const CET = {
  backgroundColor: "#942192",
  color: "#333333",
};

export const MAL = {
  backgroundColor: "#eff705",
  color: "#333333",
};

export const FOR = {
  backgroundColor: "#FFD3B6",
  color: "#333333",
};

export const DEP = {
  backgroundColor: "#FFF2B3",
  color: "#333333",
};

export const vacances = {
  ...base,
  width: "2px",
  padding: "1px",
};

export const maZone = {
  ...vacances,
  backgroundColor: couleurVacances,
  borderLeftColor: couleurVacances,
};

export const autresZones = {
  ...vacances,
  backgroundColor: couleurVacancesAutres,
  borderLeftColor: couleurVacancesAutres,
};

export const highlighted = {
  opacity: 0.5,
};

export const highlightedLeft = {
  ...highlighted,
  borderLeftColor: black,
};

export const highlightedRight = {
  ...highlighted,
  borderRightColor: black,
};

export const highlightedTop = {
  ...highlighted,
  borderTopColor: black,
};

export const highlightedBottom = {
  ...highlighted,
  borderBottomColor: black,
};

export const highlightedFirstLast = {
  opacity: 0.3,
};

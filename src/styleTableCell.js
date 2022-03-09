const couleurAnnee = "#070722ff";
const couleurMois = "#131347ff";
const couleurPolice = "#f8f4ffff";
const couleurDimanche = "#aad5f4";
const couleurJourFerie = "#33cc66";
const couleurVacances = "#e60000";
const couleurVacancesAutres = "#FF8F8F";
const white = "#ffffff";
const black = "#000000";

export const base = {
  border: `0.5px solid ${white}`,
  backgroundColor: "white",
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
  color: black,
  width: "30px",
  backgroundColor: white,
  borderColor: white,
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
};

const colonneConges = {
  ...base,
  color: black,
};

export const sansConge = {
  ...colonneConges,
  width: "60px",
};

export const journeeConge = {
  ...sansConge,
};

export const demiJourneeSansConge = {
  ...colonneConges,
};

export const demiJourneeConge = {
  ...demiJourneeSansConge,
};

export const CA = {
  backgroundColor: "#993366",
  color: white,
};

export const RTT = {
  backgroundColor: "#cc99ff",
};

export const MAL = {
  backgroundColor: "#eff705",
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

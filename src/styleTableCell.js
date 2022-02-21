const couleurAnnee = '#070722ff';
const couleurMois = '#131347ff';
const couleurPolice = '#f8f4ffff';
const couleurDimanche = '#aad5f4';
const couleurNumeroJour = 'D1C7CF';
const couleurJourFerie = '#33cc66';
const couleurVacances = '#e60000';
const couleurVacancesAutres = '#FF8F8F';
const couleurBord = '#3F3F6E';
const couleurConges = '#fcc603';
const white = '#ffffff';
const black = '#000000';

export const base = {
  border: `0.5px solid ${white}`,
  backgroundColor: 'white',
  paddingBottom: '1px',
  paddingTop: '1px',
  paddingLeft: '5px',
  paddingRight: '5px',
  fontSize: '0.7em',
  textAlign: 'center',
  color: couleurPolice,
};

export const annee = {
  ...base,
  backgroundColor: couleurAnnee,
  fontSize: '1em',
};

export const mois = {
  ...base,
  backgroundColor: couleurMois,
  fontSize: '0.8em',
};

export const date = {
  ...base,
  color: black,
  width: '30px',
  backgroundColor: white,
  borderColor: 'D2D2D2',
};

export const WE = {
  ...date,
  backgroundColor: couleurDimanche,
  borderColor: couleurDimanche,
}

export const ferie = {
  ...date,
  backgroundColor: couleurJourFerie,
  borderColor: couleurJourFerie,
},

const colonneConges = {
  ...base,
  color: black,
};

export const sansConge = {
  ...colonneConges,
  width: '60px',
}

export const journeeConge = {
  ...sansConge,
  backgroundColor: couleurConges,
};

export const demiJourneeSansConge = {
  ...colonneConges,
};

export const demiJourneeConge = {
  ...demiJourneeSansConge,
  backgroundColor: couleurConges,
};

export const vacances = {
  ...base,
  width: '2px',
  padding: '1px',
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

const highlighted = {
  opacity: 0.5,
}

export const highlightedLeft = {
  ...highlighted,
  borderLeftColor: black,
}

export const highlightedRight = {
  ...highlighted,
  borderRightColor: black,
}

export const highlightedTop = {
  ...highlighted,
  borderBottomColor: black,
}

export const highlightedBottom = {
  ...highlighted,
  borderBottomColor: black,
}


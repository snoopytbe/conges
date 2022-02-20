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
  textAlign: 'left',
  color: black,
  width: '30px',
  paddingLeft: '10px',
  paddingRight: '5px',
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

const conges = {
  ...base,
  backgroundColor: couleurConges,
  color: black,
};

export const congeMatin = {
  ...conges,
  paddingLeft: '5px',
  paddingRight: '5px',
  width: '50px',
};

export const congeApresMidi = {
  ...conges,
  paddingLeft: '5px',
  paddingRight: '10px',
  width: '50px',
};

export const congeJournee = {
  ...conges,
  paddingLeft: '5px',
  paddingRight: '10px',
  width: '100px',
};

export const vacances = {
  ...base,
  width: '7px',
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

/*export const StyleTableCell = (theme) => ({


    '&.highlighted': {
      opacity: 0.5,
      left: {
        borderLeftColor: black,
      },
      right: {
        borderRightColor: black,
      },
      top: {
        borderTopColor: black,
      },
      bottom: {
        borderBottomColor: black,
      },
    },
  },
});

export default withStyles(StyleTableCell, { name: 'MyTableCell' })(TableCell);*/

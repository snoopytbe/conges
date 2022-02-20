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

const base = {
  border: `1px solid ${white}`,
  backgroundColor: 'white',
  paddingBottom: '1px',
  paddingTop: '1px',
  fontSize: '0.7em',
  color: couleurPolice,
};

export const annee = {
  ...base,
  textAlign: 'center',
  backgroundColor: couleurAnnee,
  fontSize: '1em',
};

export const mois = {
  ...base,
  textAlign: 'center',
  backgroundColor: couleurMois,
  fontSize: '0.8em',
};

export const date = {
  ...base,
  textAlign: 'left',
  color: black,
  width: '60px',
  paddingLeft: '10px',
  paddingRight: '5px',
  backgroundColor: white,
  borderColor: 'D2D2D2',
};

export const WE = {
  ...base,
  backgroundColor: couleurDimanche,
  borderColor: couleurDimanche,
}

export const ferie = {
  ...base,
  backgroundColor: couleurJourFerie,
  borderColor: couleurJourFerie,
},

const conges = {
  ...base,
  backgroundColor: couleurConges,
  textAlign: 'center',
  color: black,
};

export const congesMatin = {
  ...conges,
  width: '20px',
  paddingLeft: '5px',
  paddingRight: '5px',
};

export const congeApresMidi = {
  ...conges,
  width: '20px',
  paddingLeft: '5px',
  paddingRight: '10px',
};

export const congeJournee = {
  ...conges,
  width: '50px',
  paddingLeft: '5px',
  paddingRight: '10px',
};

const vacances = {
  ...base,
  width: '5px',
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


    '&.WE': {
      backgroundColor: couleurDimanche,
      borderColor: couleurDimanche,
    },
    '&.ferie': {
      backgroundColor: couleurJourFerie,
      borderColor: couleurJourFerie,
    },
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

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const couleurAnnee = '#070722ff';
const couleurMois = '#131347ff';
const couleurPolice = '#f8f4ffff';
const couleurDimanche = '#aad5f4';
const couleurNumeroJour = 'D1C7CF';
const couleurJourFerie = '#33cc66';
const couleurVacances = '#e60000';
const couleurBord = '#3F3F6E';
const white = '#ffffff';
const black = '#000000';

export const StyleTableCell = (theme) => ({
  root: {
    textAlign: 'center',
    border: `1px solid ${white}`,
    paddingBottom: '1px',
    paddingTop: '1px',
    fontSize: '0.7em',
    color: couleurPolice,

    '&.header': { backgroundColor: couleurAnnee },

    '&.row': {
      backgroundColor: couleurNumeroJour,
      color: black,
      border: `1px solid ${couleurBord}`,
    },

    '&.annee': {
      backgroundColor: couleurAnnee,
      fontSize: '1em',
    },
    '&.mois': {
      backgroundColor: couleurMois,
      fontSize: '0.8em',
    },
    '&.numerojour': {
      color: black,
      backgroundColor: couleurNumeroJour,
      borderColor: white,
    },
    '&.notWhiteRightBorder': {
      borderRightColor: couleurNumeroJour,
    },
    '&.notWhiteLeftBorder': {
      borderLeftColor: couleurNumeroJour,
    },
    '&.jour': {
      backgroundColor: white,
      borderColor: 'D2D2D2',
      color: black,
    },
    '&.dimanche': {
      backgroundColor: couleurDimanche,
      borderColor: couleurDimanche,
      color: black,
    },
    '&.ferie': {
      backgroundColor: couleurJourFerie,
      borderColor: couleurJourFerie,
      color: black,
    },
    '&.noDate': {
      backgroundColor: white,
    },
    '&.vacances': {
      backgroundColor: couleurVacances,
      borderLeftColor: couleurVacances,
      borderRightColor: couleurNumeroJour,
    },
    '&.largeurvacances': {
      width: '5px',
      padding: '1px',
    },
    '&.bordvacances': {
      borderRightColor: couleurNumeroJour,
    },
  },
});

export default withStyles(StyleTableCell, { name: 'MyTableCell' })(TableCell);

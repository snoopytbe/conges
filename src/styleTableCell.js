import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

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

export const StyleTableCell = (theme) => ({
  root: {
    border: `1px solid ${white}`,
    backgroundColor: 'white',
    paddingBottom: '1px',
    paddingTop: '1px',
    fontSize: '0.7em',
    color: couleurPolice,
    '&.annee': {
      textAlign: 'center',
      backgroundColor: couleurAnnee,
      fontSize: '1em',
      color: couleurPolice,
    },
    '&.mois': {
      textAlign: 'center',
      backgroundColor: couleurMois,
      fontSize: '0.8em',
      color: couleurPolice,
    },
    '&.date': {
      textAlign: 'left',
      color: black,
      width: '60px',
      paddingLeft: '10px',
      paddingRight: '5px',
      backgroundColor: white,
      borderColor: 'D2D2D2',
    },
    '&.conges': {
      backgroundColor: couleurConges,
      textAlign: 'center',
      color: black,
      '&.matin': {
        width: '20px',
        paddingLeft: '5px',
        paddingRight: '5px',
      },
      '&.apresmidi': {
        width: '20px',
        paddingLeft: '5px',
        paddingRight: '10px',
      },
      '&.journee': {
        width: '50px',
        paddingLeft: '5px',
        paddingRight: '10px',
      },
    },
    '&.vacances': {
      width: '5px',
      padding: '1px',
      maZone: {
        backgroundColor: couleurVacances,
        borderLeftColor: couleurVacances,
      },
      autresZones: {
        backgroundColor: couleurVacancesAutres,
        borderLeftColor: couleurVacancesAutres,
      },
      aucune: {},
    },
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

export default withStyles(StyleTableCell, { name: 'MyTableCell' })(TableCell);

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import TableCell from './styleTableCell';
import 'moment/min/locales.min';
import { estFerie } from './joursFeries';
import { estVacances } from './vacances';

export default function Calendrier() {
  const [lignes, setLignes] = React.useState([]);

  const mois = [
    { nom: 'Mai', numero: 5 },
    { nom: 'Juin', numero: 6 },
    { nom: 'Juillet', numero: 7 },
    { nom: 'Août', numero: 8 },
    { nom: 'Septembre', numero: 9 },
    { nom: 'Octobre', numero: 10 },
    { nom: 'Novembre', numero: 11 },
    { nom: 'Décembre', numero: 12 },
    { nom: 'Janvier', numero: 1 },
    { nom: 'Février', numero: 2 },
    { nom: 'Mars', numero: 3 },
    { nom: 'Avril', numero: 4 },
  ];

  const annee = 2021;

  const zone = 'C';

  function colonnes(index) {
    const result = [];

    function classDescription(jour) {
      return jour.isValid()
        ? estFerie(jour)
          ? 'ferie'
          : jour.day() === 0
          ? 'dimanche'
          : 'jour'
        : 'noDate';
    }

    mois.map((item) => {
      let myDate = moment([
        item.numero > 4 ? annee : annee + 1,
        item.numero - 1,
        index + 1,
      ]);
      myDate.locale('fr-FR');
      let isValidDate = myDate.isValid();
      let className = classDescription(myDate);
      result.push(
        // Numéro du jour
        <React.Fragment key={'colonne' + index + 'i' + item.numero}>
          <TableCell className={className}>
            {isValidDate && myDate.format('DD')}
          </TableCell>
          {/* Initiale du jour */}
          <TableCell className={className}>
            {isValidDate && myDate.format('dd')[0].toUpperCase()}
          </TableCell>
          {/* Vacances scolaires */}
          <TableCell
            className={
              (isValidDate
                ? estVacances(myDate, zone)
                  ? 'vacances'
                  : className + ' bordvacances'
                : 'noDate') + ' largeurvacances'
            }
            sx={{
              padding: 0,
              width: 1,
            }}
          />
        </React.Fragment>
      );
    });
    return result;
  }

  React.useEffect(() => {
    let newLigne = [];

    for (let i = 0; i < 31; i++)
      newLigne = [
        ...newLigne,
        <TableRow key={'colonne' + i}>{colonnes(i)}</TableRow>,
      ];

    setLignes(newLigne);
  }, []);

  return (
    <div style={{ width: '1200px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="annee" colSpan={24}>
                {annee}
              </TableCell>
              <TableCell className="annee" colSpan={12}>
                {annee + 1}
              </TableCell>
            </TableRow>
            <TableRow>
              {mois.map((item) => (
                <React.Fragment key={item.nom}>
                  <TableCell className="mois" colSpan={3}>
                    {item.nom}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            {lignes}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

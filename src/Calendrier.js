import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from './styleTableCell';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { extendMoment } from 'moment-range';
moment = extendMoment(moment);
import 'moment/min/locales.min';
import { estFerie } from './joursFeries';
import { estVacances } from './vacances';

export default function Calendrier() {
  const [lignes, setLignes] = React.useState([]);
  const [annee, setAnnee] = React.useState(2018);

  var dateDebut = moment([annee, 8, 1]);
  var dateFin = moment([annee + 1, 7, 30]);
  var range = moment.range(dateDebut, dateFin);

  const zone = 'C';

  function colonnes(index) {
    const result = [];

    function classDescription(jour) {
      return jour.isValid()
        ? estFerie(jour)
          ? 'ferie'
          : jour.day() === 0 || jour.day() === 6
          ? 'dimanche'
          : 'jour'
        : 'noDate';
    }

    Array.from(range.by('month')).map((month) => {
      let myDate = moment([month.year(), month.month(), index + 1]);
      myDate.locale('fr-FR');
      let isValidDate = myDate.isValid();
      let className = classDescription(myDate);
      result.push(
        // Numéro du jour
        <React.Fragment key={'colonne' + index + 'i' + month.month()}>
          <TableCell className={className}>
            {isValidDate &&
              myDate.format('DD') + ' ' + myDate.format('dd')[0].toUpperCase()}
          </TableCell>
          {/* Initiale du jour */}
          <TableCell className={className}></TableCell>
          {/* Vacances scolaires */}
          <TableCell
            className={
              (isValidDate
                ? estVacances(myDate, zone)
                  ? 'vacances'
                  : estVacances(myDate, 'A') || estVacances(myDate, 'B')
                  ? 'vacancesAutres'
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
    dateDebut = moment([annee, 8, 1]);
    dateFin = moment([annee + 1, 7, 30]);
    range = moment.range(dateDebut, dateFin);

    let newLigne = [];

    for (let i = 0; i < 31; i++)
      newLigne = [
        ...newLigne,
        <TableRow key={'colonne' + i}>{colonnes(i)}</TableRow>,
      ];

    setLignes(newLigne);
  }, [annee]);

  function NbMonthByYear(oneRange, year) {
    var rangeFullYear = moment.range(
      moment([year, 0, 1]),
      moment([year, 11, 31])
    );
    var rangeYear = rangeFullYear.intersect(oneRange);
    return Array.from(rangeYear.by('month')).length;
  }

  return (
    <div style={{ width: '1200px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              {Array.from(range.snapTo('year').by('year')).map((years) => (
                <React.Fragment key={years.format('Y')}>
                  <TableCell
                    className="annee"
                    colSpan={3 * NbMonthByYear(range, years.year())}
                  >
                    {years.format('YYYY')}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            <TableRow>
              {Array.from(range.by('month')).map((month) => (
                <React.Fragment key={month.format('M')}>
                  <TableCell className="mois" colSpan={3}>
                    {month.locale('fr-FR').format('MMMM')}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            {lignes}
          </TableBody>
        </Table>
      </TableContainer>
      <form>
        <button value="<<" onChange={(e) => setAnnee(annee - 1)} />
      </form>
    </div>
  );
}

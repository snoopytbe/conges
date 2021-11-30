import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from './styleTableCell';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from './styledMenuItem';
import moment from 'moment';
import { extendMoment } from 'moment-range';
moment = extendMoment(moment);
import 'moment/min/locales.min';
import { estFerie } from './joursFeries';
import { estVacances } from './vacances';

export default function Calendrier(props) {
  const { annee } = props;

  const [mousePos, setMousePos] = React.useState({
    mouseX: null,
    mouseY: null,
  });
  const [activeMenu, setActiveMenu] = React.useState(false);
  const [contextData, setContextData] = React.useState(null);

  const [lignes, setLignes] = React.useState([]);

  const [highlighted, setHighlighted] = React.useState([]);

  var dateDebut = moment([annee, 8, 1]);
  var dateFin = moment([annee + 1, 7, 30]);
  var range = moment.range(dateDebut, dateFin);

  const zone = 'C';

  function handleCellClick(event, myDate) {
    event.preventDefault();
    setMousePos({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setActiveMenu(true);
    setContextData({ date: myDate });
  }

  const handleDescrClose = () => {
    setActiveMenu(false);
  };

  function handleHighlight(event, myDate) {
    event.preventDefault();
    setHighlighted((prev) => {
      var result;
      if (prev.includes(myDate))
        result = prev.filter((item) => item !== myDate);
      else result = [...prev, myDate];
      return result;
    });
  }

  const handleCA = () => {};

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

      result.push(
        // Numéro du jour
        <React.Fragment key={'colonne' + index + 'i' + month.month()}>
          <TableCell
            className={`${classDescription(myDate)} ${
              highlighted.includes(myDate.format('DDMMyyyy')) && ' highlighted'
            }`}
            onContextMenu={(event) => handleCellClick(event, myDate)}
            onClick={(event) =>
              handleHighlight(event, myDate.format('DDMMyyyy'))
            }
          >
            {isValidDate &&
              myDate.format('DD') + ' ' + myDate.format('dd')[0].toUpperCase()}
          </TableCell>
          {/* Vacances scolaires */}
          <TableCell
            className={
              (isValidDate
                ? estVacances(myDate, zone)
                  ? 'vacances'
                  : estVacances(myDate, 'A') || estVacances(myDate, 'B')
                  ? 'vacancesAutres'
                  : classDescription(myDate) + ' bordvacances'
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
  }, [highlighted]);

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
        <Table style={{ borderCollapse: 'separate' }}>
          <TableBody>
            <TableRow>
              {Array.from(range.snapTo('year').by('year')).map((years) => (
                <React.Fragment key={years.format('Y')}>
                  <TableCell
                    className="annee"
                    colSpan={2 * NbMonthByYear(range, years.year())}
                  >
                    {years.format('YYYY')}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            <TableRow>
              {Array.from(range.by('month')).map((month) => (
                <React.Fragment key={month.format('M')}>
                  <TableCell className="mois" colSpan={2}>
                    {month.locale('fr-FR').format('MMMM')}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            {lignes}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        keepMounted
        open={activeMenu}
        onClose={handleDescrClose}
        anchorReference="anchorPosition"
        anchorPosition={
          mousePos.mouseY !== null && mousePos.mouseX !== null
            ? { top: mousePos.mouseY, left: mousePos.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleCA}>CA</MenuItem>
        <MenuItem onClick={handleCA}>RTT</MenuItem>{' '}
        <MenuItem onClick={handleCA}>Formation</MenuItem>{' '}
        <MenuItem onClick={handleCA}>Maladie</MenuItem>{' '}
        <MenuItem onClick={handleCA}>Autre</MenuItem>
        <MenuItem onClick={handleCA}>Présent</MenuItem>
      </Menu>
    </div>
  );
}

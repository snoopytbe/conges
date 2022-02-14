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
import { getApiData, putApiData } from './ApiData';

moment.locale('fr-FR');

export default function Calendrier(props) {
  const { annee } = props;

  const [mousePos, setMousePos] = React.useState({
    mouseX: null,
    mouseY: null,
  });
  const [activeMenu, setActiveMenu] = React.useState(false);

  const [lignes, setLignes] = React.useState([]);

  const [highlighted, setHighlighted] = React.useState([]);

  const [conges, setConges] = React.useState([]);
  const [error, setError] = React.useState(null);

  var dateDebut = moment([annee, 8, 1]);
  var dateFin = moment([annee + 1, 7, 30]);
  var range = moment.range(dateDebut, dateFin);

  const zone = 'C';

  const MenuOptions = ['CA', 'RTT', 'FOR', 'MAL', 'Présent'];

  function handleCellClick(event) {
    event.preventDefault();
    setMousePos({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setActiveMenu(true);
  }

  const handleDescrClose = () => {
    setActiveMenu(false);
  };

  const [mouseDown, setMouseDown] = React.useState(false);
  const [startDate, setStartDate] = React.useState(null);

  function onMouseDown(event, myDate) {
    event.preventDefault();
    setMouseDown(true);
    setStartDate(myDate);
    setHighlighted(myDate.format('yyyy-MM-DD'));
  }

  function onMouseOver(event, myDate) {
    event.preventDefault();
    if (mouseDown) {
      setHighlighted(() => {
        var result = [];
        for (let day of moment.range(startDate, myDate).by('day')) {
          result = [...result, day.format('yyyy-MM-DD')];
        }
        return result;
      });
    }
  }

  function onMouseUp(event) {
    event.preventDefault();
    setMouseDown(false);
    setMousePos({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setActiveMenu(true);
  }

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  const handleNewConge = (typeConge) => {
    let newConges = [];
    console.log(highlighted)
    // on va ajouter/modifier avec le PUT tous les jours "highlighted"
    highlighted.forEach((oneHighlighted) => {
      // On ne sauvegarde les conges que pour les jours qui ne sont ni fériés, ni dimanche, ni samedi
      let date = moment(oneHighlighted,"yyyy-MM-DD");
      let day = date.day();
      console.log(JSON.stringify(date));
      if (!estFerie(date) && !(day === 0) && !(day === 6)) {
        let id = conges.filter(
          (oneConge) => (oneConge.date = oneHighlighted)
        )?.id;

        // On créé un id s'il n'existe pas
        if (!id) id = uuidv4();

        newConges = [
          ...newConges,
          { date: oneHighlighted, conge: typeConge, id: id },
        ];
      }
    });

    setConges(newConges);
  };

  const handleMenuItemClick = (event, option) => {
    var typeConge = option === 'Present' ? '' : option;
    handleNewConge(typeConge);
  };

  function colonnes(index) {
    const result = [];

    function styleHighlight(myDate, colonne) {
      var result = '';
      var isHighlighted = highlighted.includes(myDate.format('yyyy-MM-DD'));
      if (isHighlighted) {
        var tomorrowHighlighted = highlighted.includes(
          myDate.clone().add(1, 'day').format('yyyy-MM-DD')
        );
        var tomorrowSameMonth =
          myDate.clone().add(1, 'day').month === myDate.month;
        tomorrowHighlighted = tomorrowHighlighted && tomorrowSameMonth;

        var yesterdayHighlighted = highlighted.includes(
          myDate.clone().add(-1, 'day').format('yyyy-MM-DD')
        );
        var yesterdaySameMonth =
          myDate.clone().add(-1, 'day').month === myDate.month;
        yesterdayHighlighted = yesterdayHighlighted && yesterdaySameMonth;

        if (tomorrowHighlighted && !yesterdayHighlighted)
          result = 'highlightedTop';
        if (!tomorrowHighlighted && yesterdayHighlighted)
          result = 'highlightedBottom';
        if (!tomorrowHighlighted && !yesterdayHighlighted)
          result = 'highlightedTop highlightedBottom';

        if (colonne == 'gauche') {
          result += ' highlightedLeft';
        } else {
          result += ' highlightedRight';
        }
      }
      return result;
    }

    Array.from(range.by('month')).map((month) => {
      let myDate = moment([month.year(), month.month(), index + 1]);

      let isValidDate = myDate.isValid();

      let classDescription = isValidDate
        ? estFerie(myDate)
          ? 'ferie'
          : myDate.day() === 0 || myDate.day() === 6
          ? 'dimanche'
          : 'jour'
        : 'noDate';

      result.push(
        // Numéro du jour
        <React.Fragment key={'colonne' + index + 'i' + month.month()}>
          <TableCell
            className={`${classDescription} ${styleHighlight(
              myDate,
              'gauche'
            )} largeurjour`}
            onContextMenu={(event) => handleCellClick(event, myDate)}
            onMouseDown={(event) => onMouseDown(event, myDate)}
            onMouseUp={(event) => onMouseUp(event, myDate)}
            onMouseOver={(event) => onMouseOver(event, myDate)}
          >
            {isValidDate &&
              myDate.format('DD') + ' ' + myDate.format('dd')[0].toUpperCase()}
          </TableCell>
          <TableCell
            className={`${classDescription} ${styleHighlight(
              myDate,
              'droite'
            )} largeurconges`}
            onContextMenu={(event) => handleCellClick(event, myDate)}
            onMouseDown={(event) => onMouseDown(event, myDate)}
            onMouseUp={(event) => onMouseUp(event, myDate)}
            onMouseOver={(event) => onMouseOver(event, myDate)}
          >
            {isValidDate &&
              conges.find((item) => item.date === myDate.format('YYYY-MM-DD'))
                ?.conge}
          </TableCell>
          {/* Vacances scolaires */}
          <TableCell
            className={
              (isValidDate
                ? estVacances(myDate, zone)
                  ? 'vacances'
                  : estVacances(myDate, 'A') || estVacances(myDate, 'B')
                  ? 'vacancesAutres'
                  : classDescription
                : 'noDate') + ' largeurvacances'
            }
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
  }, [highlighted, mouseDown, conges]);

  React.useEffect(() => {
    getApiData().then((data) => setConges(data));
  }, []);

  function NbMonthByYear(oneRange, year) {
    var rangeFullYear = moment.range(
      moment([year, 0, 1]),
      moment([year, 11, 31])
    );
    var rangeYear = rangeFullYear.intersect(oneRange);
    return Array.from(rangeYear.by('month')).length;
  }

  return (
    <div style={{ width: 'fit-content' }}>
      <p>{/*JSON.stringify(conges)*/}</p>
      <TableContainer component={Paper}>
        <Table style={{ borderCollapse: 'separate' }}>
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
                  <TableCell className="mois largeurmois" colSpan={3}>
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
        {MenuOptions.map((option) => (
          <MenuItem
            key={option}
            onClick={(event) => handleMenuItemClick(event, option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

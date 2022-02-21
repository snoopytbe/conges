import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment';
import { extendMoment } from 'moment-range';
moment = extendMoment(moment);
import 'moment/min/locales.min';
import { estFerie } from './joursFeries';
import { estVacances } from './vacances';
import { getApiData, putApiData, deleteApiData } from './ApiData';
import * as StyleTableCell from './styleTableCell';
import TableCellCalendrier from './TableCellCalendrier';

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

  var dateDebut = moment([annee, 8, 1]);
  var dateFin = moment([annee, 11, 31]);
  //var dateFin = moment([annee + 1, 7, 30]);
  var range = moment.range(dateDebut, dateFin);

  const zone = 'C';

  const MenuOptions = [
    { menu: 'Congés', abr: 'CA', type: 'conge' },
    { menu: 'RTT', abr: 'RTT', type: 'conge' },
    { menu: 'Formation', abr: 'FOR', type: 'conge' },
    { menu: 'Maladie', abr: 'MAL', type: 'conge' },
    { menu: 'Présent', abr: '', type: 'conge' },
    { menu: 'Télétravail', abr: 'TL', type: 'conge' },
    { menu: 'Divider', abr: '', type: 'separateur' },
    { menu: 'Journée', abr: 'J', type: 'temps' },
    { menu: 'Matin', abr: 'AM', type: 'temps' },
    { menu: 'Après-midi', abr: 'PM', type: 'temps' },
  ];

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
    setHighlighted([myDate.format('yyyy-MM-DD')]);
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

  const handleNewConge = (abreviation, type) => {
    let newConges = [];
    // on va ajouter/modifier avec le PUT tous les jours "highlighted"
    highlighted.forEach((oneHighlighted) => {
      // On ne sauvegarde les conges que pour les jours qui ne sont ni fériés, ni dimanche, ni samedi
      let date = moment(oneHighlighted, 'yyyy-MM-DD');
      let day = date.day();

      if (!estFerie(date) && !(day === 0) && !(day === 6)) {
        // On commence par chercher l'id et on le créé s'il n'existe pas
        console.log(
          conges.filter((oneConge) => oneConge.date === oneHighlighted)
        );
        let id =
          conges.filter((oneConge) => oneConge.date === oneHighlighted)?.[0]
            ?.id ?? uuidv4();

        let duree =
          type === 'temps'
            ? abreviation
            : conges.filter((oneConge) => oneConge.date === oneHighlighted)?.[0]
                ?.duree ?? 'J';

        let abr =
          type === 'temps'
            ? conges.filter((oneConge) => oneConge.date === oneHighlighted)?.[0]
                ?.abr
            : abreviation;

        let data = {
          date: oneHighlighted,
          abr: abr,
          id: id,
          duree: duree,
        };

        //console.log(data)
        if (!abr) {
          deleteApiData([data]);
        } else {
          putApiData([data]);
          newConges = [...newConges, data];
        }
      }
    });

    //on complète avec les jours présents dans "conges" qui n'étaient pas highlighted
    conges.forEach((oneConge) => {
      if (
        highlighted.filter((oneHighlighted) => oneHighlighted === oneConge.date)
          .length === 0
      )
        newConges = [...newConges, oneConge];
    });

    //console.log(conges)
    setConges(newConges);
  };

  const handleMenuItemClick = (event, abr, type) => {
    handleNewConge(abr, type);
    setActiveMenu(false);
    setHighlighted([]);
  };

  function colonnes(index) {
    const result = [];

    Array.from(range.by('month')).map((month) => {
      let myDate = moment([month.year(), month.month(), index + 1]);

      let isValidDate = myDate.isValid();

      function tableCellConge() {
        let conge = conges.find(
          (item) => item.date === myDate.format('YYYY-MM-DD')
        );

        if (!conge) {
          return (
            <TableCellCalendrier
              colspan={2}
              type=""
              myDate={myDate}
              highlighted={highlighted}
            ></TableCellCalendrier>
          );
        }

        if (conge.duree === 'J')
          return (
            <TableCellCalendrier
              colspan={2}
              type="journeeConge"
              duree="J"
              myDate={myDate}
              highlighted={highlighted}
            >
              {conge?.abr}
            </TableCellCalendrier>
          );
        else
          return (
            <>
              <TableCellCalendrier
                type={
                  conge.duree === 'AM'
                    ? 'demiJourneeConge'
                    : 'demiJourneeSansConge'
                }
                duree="AM"
                myDate={myDate}
                highlighted={highlighted}
              >
                {conge.duree === 'AM' && conge.abr}
              </TableCellCalendrier>

              <TableCellCalendrier
                type={
                  conge.duree === 'PM'
                    ? 'demiJourneeCongePM'
                    : 'demiJourneeSansCongePM'
                }
                duree="PM"
                myDate={myDate}
                highlighted={highlighted}
              >
                {conge.duree === 'PM' && conge.abr}
              </TableCellCalendrier>
            </>
          );
      }

      result.push(
        // Numéro du jour
        <React.Fragment key={'colonne' + index + 'i' + month.month()}>
          <TableCellCalendrier type="date" myDate={myDate} highlighted={highlighted}>
            {isValidDate &&
              myDate.format('DD') + ' ' + myDate.format('dd')[0].toUpperCase()}
            
          </TableCellCalendrier>

          {tableCellConge()}

          {/* Vacances scolaires */}
          <TableCell
            sx={{
              ...(isValidDate
                ? estVacances(myDate, zone)
                  ? StyleTableCell.maZone
                  : estVacances(myDate, 'A') || estVacances(myDate, 'B')
                  ? StyleTableCell.autresZones
                  : StyleTableCell.vacances
                : StyleTableCell.vacances),
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
    <div>
      <p>{/*JSON.stringify(conges)*/}</p>
      <TableContainer component={Paper} style={{ width: 'fit-content' }}>
        <Table style={{ borderCollapse: 'separate' }}>
          <TableBody>
            <TableRow>
              {Array.from(range.snapTo('year').by('year')).map((years) => (
                <React.Fragment key={years.format('Y')}>
                  <TableCell
                    sx={{ ...StyleTableCell.annee }}
                    colSpan={4 * NbMonthByYear(range, years.year())}
                  >
                    {years.format('YYYY')}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            <TableRow>
              {Array.from(range.by('month')).map((month) => (
                <React.Fragment key={month.format('M')}>
                  <TableCell sx={{ ...StyleTableCell.mois }} colSpan={4}>
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
        {MenuOptions.map((option) => {
          var result;
          if (option.menu === 'Divider') result = <Divider />;
          else
            result = (
              <MenuItem
                key={option.menu}
                onClick={(event) =>
                  handleMenuItemClick(event, option.abr, option.type)
                }
              >
                {option.menu}
              </MenuItem>
            );
          return result;
        })}
      </Menu>
    </div>
  );
}

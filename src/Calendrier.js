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

  const [highlighted, setHighlighted] = React.useState(null);

  const [conges, setConges] = React.useState([]);

  const [clicked, setClicked] = React.useState(false);

  const [startDate, setStartDate] = React.useState(null);

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

  const handleDescrClose = () => {
    setActiveMenu(false);
  };

  const onClick = React.useCallback(
    (event, myDate) => {
      event.preventDefault();

      if (!clicked) {
        setStartDate(myDate);
        setHighlighted(moment.range(myDate, myDate));
      } else {
        setHighlighted(
          moment.range(
            moment.min(startDate, myDate),
            moment.max(startDate, myDate)
          )
        );
        setMousePos({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
        setActiveMenu(true);
      }
      setClicked(!clicked);
    },
    [clicked]
  );

  function onContextMenu(event) {
    event.preventDefault();
    setMousePos({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setActiveMenu(true);
  }

  const handleMenuItemClick = (event, abr, type) => {
    handleNewConge(abr, type);
    setActiveMenu(false);
    setHighlighted(null);
  };

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
    console.log(JSON.stringify(highlighted.by('days')));
    highlighted.by('days').forEach((oneHighlighted) => {
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
      if (!highlighted.contains(moment(oneConge.date, 'YYYY-MM-DD')))
        newConges = [...newConges, oneConge];
    });

    //console.log(conges)
    setConges(newConges);
  };

  function colonnes(index) {
    const result = [];

    Array.from(range.by('month')).map((month) => {
      let myDate = moment([month.year(), month.month(), index + 1]);

      let isValidDate = myDate.isValid();

      function CommonTableCellCalendrier(params) {
        return (
          <TableCellCalendrier
            myDate={myDate}
            highlighted={highlighted}
            onContextMenu={onContextMenu}
            onClick={onClick}
            setHighlighted={setHighlighted}
            {...params}
          />
        );
      }

      function tableCellConge() {
        let conge = conges.find(
          (item) => item.date === myDate.format('YYYY-MM-DD')
        );

        if (!conge) {
          return <CommonTableCellCalendrier colSpan={2} type="sansConge" />;
        }

        if (conge.duree === 'J')
          return (
            <CommonTableCellCalendrier
              colSpan={2}
              type="journeeConge"
              duree="J"
              children={conge?.abr}
            />
          );
        else
          return (
            <>
              <CommonTableCellCalendrier
                type={
                  conge.duree === 'AM'
                    ? 'demiJourneeConge'
                    : 'demiJourneeSansConge'
                }
                duree="AM"
                children={conge.duree === 'AM' && conge.abr}
              />

              <CommonTableCellCalendrier
                type={
                  conge.duree === 'PM'
                    ? 'demiJourneeConge'
                    : 'demiJourneeSansConge'
                }
                duree="PM"
                children={conge.duree === 'PM' && conge.abr}
              />
            </>
          );
      }

      result.push(
        // Numéro du jour
        <React.Fragment key={'colonne' + index + 'i' + month.month()}>
          <CommonTableCellCalendrier
            type="date"
            children={
              isValidDate &&
              myDate.format('DD') + ' ' + myDate.format('dd')[0].toUpperCase()
            }
          />

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
  }, [clicked, conges]);

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

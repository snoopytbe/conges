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
import { estVacances } from './vacances';
import { getApiData } from './ApiData';
import * as StyleTableCell from './styleTableCell';
import TableCellCalendrier from './TableCellCalendrier';
import { handleNewConge, compteConges } from './conges';
import DateRangeDialog from './DateRangeDialog';

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

  const [startDateHighlight, setStartDateHighlight] = React.useState(null);

  const [openDialog, setOpenDialog] = React.useState(false);

  const [dateDebut, setDateDebut] = React.useState(moment([annee, 0, 1]));
  const [dateFin, setDateFin] = React.useState(moment([annee, 11, 31]));

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
        setStartDateHighlight(myDate);
        setHighlighted(moment.range(myDate, myDate));
      } else {
        setHighlighted(
          moment.range(
            moment.min(startDateHighlight, myDate),
            moment.max(startDateHighlight, myDate)
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
    event.preventDefault();
    //console.log(highlighted);
    var newConges = handleNewConge(abr, type, conges, highlighted);
    setConges(newConges);
    setActiveMenu(false);
    setHighlighted(null);
  };

  function getLignes(index) {
    const result = [];

    Array.from(moment.range(dateDebut, dateFin).by('month')).map((month) => {
      let myDate = moment([month.year(), month.month(), index + 1]);

      let isValidDate = myDate.isValid();

      function CommonTableCellCalendrier(params) {
        return (
          <TableCellCalendrier
            myDate={myDate}
            highlighted={highlighted}
            onContextMenu={onContextMenu}
            onClick={onClick}
            clicked={clicked}
            {...params}
          />
        );
      }

      function tableCellConge() {
        let conge = conges?.find(
          (item) => item.date === myDate.format('YYYY-MM-DD')
        );

        if (!conge) {
          return (
            <CommonTableCellCalendrier colSpan={2} type="sansConge" duree="J" />
          );
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
        <React.Fragment key={'ligne' + index + 'i' + month.month()}>
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
        <TableRow key={'ligne' + i}>{getLignes(i)}</TableRow>,
      ];

    setLignes(newLigne);
  }, [clicked, conges, dateDebut, dateFin]);

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
      <p>{compteConges('MAL', conges, dateDebut, dateFin)}</p>
      <TableContainer component={Paper} style={{ width: 'fit-content' }}>
        <Table style={{ borderCollapse: 'separate' }}>
          <TableBody>
            <TableRow>
              {Array.from(
                moment.range(dateDebut, dateFin).snapTo('year').by('year')
              ).map((years) => (
                <React.Fragment key={years.format('Y')}>
                  <TableCell
                    sx={{ ...StyleTableCell.annee }}
                    colSpan={
                      4 *
                      NbMonthByYear(
                        moment.range(dateDebut, dateFin),
                        years.year()
                      )
                    }
                    onClick={(event) => setOpenDialog(true)}
                  >
                    {years.format('YYYY')}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            <TableRow>
              {Array.from(moment.range(dateDebut, dateFin).by('month')).map(
                (month) => (
                  <React.Fragment key={month.format('M')}>
                    <TableCell sx={{ ...StyleTableCell.mois }} colSpan={4}>
                      {month.locale('fr-FR').format('MMMM')}
                    </TableCell>
                  </React.Fragment>
                )
              )}
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
      {openDialog && (
        <DateRangeDialog
          dateDebut={dateDebut}
          onChangeDebut={(value) => setDateDebut(value)}
          dateFin={dateFin}
          onChangeFin={(value) => setDateFin(value)}
          handleClose={() => setOpenDialog(false)}
        />
      )}
    </div>
  );
}

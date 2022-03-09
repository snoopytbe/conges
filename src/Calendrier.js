import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import "moment/min/locales.min";
import { estVacances } from "./vacances";
import { getApiData } from "./ApiData";
import * as StyleTableCell from "./styleTableCell";
import TableCellCalendrier from "./TableCellCalendrier";
import { handleNewConge } from "./conges";
import DateRangeDialog from "./DateRangeDialog";
import Fab from "@mui/material/Fab";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

moment.locale("fr-FR");

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

  const [nbMonths, setNbMonths] = React.useState(
    Math.floor(window.innerWidth / 117)
  );

  const [dateDebut, setDateDebut] = React.useState(moment([annee, 0, 1]));
  const [dateFin, setDateFin] = React.useState(moment([annee, 6, 1]));

  React.useEffect(() => {
    const handleWindowResize = () => {
      var newNbMonths = Math.floor(window.innerWidth / 117);
      var newDateFin = dateDebut
        .clone()
        .add(Math.max(newNbMonths ?? 6, 2), "months");

      setNbMonths(newNbMonths);
      setDateFin(newDateFin);
    };

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const zone = "C";

  const MenuOptions = [
    { menu: "Congés", abr: "CA", type: "conge" },
    { menu: "RTT", abr: "RTT", type: "conge" },
    { menu: "Formation", abr: "FOR", type: "conge" },
    { menu: "Maladie", abr: "MAL", type: "conge" },
    { menu: "Présent", abr: "", type: "conge" },
    { menu: "Télétravail", abr: "TL", type: "conge" },
    { menu: "Divider", abr: "", type: "separateur" },
    { menu: "Journée", abr: "J", type: "temps" },
    { menu: "Matin", abr: "AM", type: "temps" },
    { menu: "Après-midi", abr: "PM", type: "temps" },
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

    Array.from(
      moment
        .range(dateDebut, dateDebut.clone().add(nbMonths, "months"))
        .by("month")
    ).map((month) => {
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
            conges={conges}
            {...params}
          />
        );
      }

      function tableCellConge() {
        let conge = conges?.find(
          (item) => item.date === myDate.format("YYYY-MM-DD")
        );

        if (!conge) {
          return (
            <CommonTableCellCalendrier
              colSpan={2}
              type="sansConge"
              duree="J"
              abr={conge?.abr}
            />
          );
        }

        if (conge.duree === "J")
          return (
            <CommonTableCellCalendrier
              colSpan={2}
              type="journeeConge"
              duree="J"
              abr={conge?.abr}
              children={conge?.abr}
            />
          );
        else
          return (
            <>
              <CommonTableCellCalendrier
                type={
                  conge.duree === "AM"
                    ? "demiJourneeConge"
                    : "demiJourneeSansConge"
                }
                duree="AM"
                abr={conge?.abr}
                children={conge.duree === "AM" && conge.abr}
              />

              <CommonTableCellCalendrier
                type={
                  conge.duree === "PM"
                    ? "demiJourneeConge"
                    : "demiJourneeSansConge"
                }
                duree="PM"
                abr={conge?.abr}
                children={conge.duree === "PM" && conge.abr}
              />
            </>
          );
      }

      result.push(
        // Numéro du jour
        <React.Fragment
          key={"ligne" + index + "i" + month.year() + month.month()}
        >
          <CommonTableCellCalendrier
            type="date"
            children={
              isValidDate &&
              myDate.format("DD") + " " + myDate.format("dd")[0].toUpperCase()
            }
          />

          {tableCellConge()}

          {/* Vacances scolaires */}
          <TableCell
            sx={{
              ...(isValidDate
                ? estVacances(myDate, zone)
                  ? StyleTableCell.maZone
                  : estVacances(myDate, "A") || estVacances(myDate, "B")
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
        <TableRow key={"ligne" + i}>{getLignes(i)}</TableRow>,
      ];

    setLignes(newLigne);
  }, [clicked, conges, dateDebut, nbMonths]);

  React.useEffect(() => {
    getApiData().then((data) => setConges(data));
  }, []);

  function NbMonthByYear(oneRange, year) {
    //console.log('NbMonthByYear');
    //console.log(JSON.stringify(oneRange));
    //console.log(year);
    var rangeFullYear = moment.range(
      moment([year, 0, 1]),
      moment([year, 11, 31])
    );
    //console.log(JSON.stringify(rangeFullYear));
    var result = 0;

    var rangeYear = rangeFullYear.intersect(oneRange);
    //console.log(JSON.stringify(rangeYear));
    //console.log(rangeFullYear.adjacent(oneRange));

    if (!rangeYear) result = rangeFullYear.adjacent(oneRange) && 1;
    else result = Array.from(rangeYear.by("month")).length;
    //console.log(result);

    return result;
  }

  return (
    <div>
      <Typography variant="h5" align="center">
        Congés
      </Typography>
      <br />
      <Fab
        color="primary"
        size="small"
        sx={{
          position: "absolute",
          top: 5,
          left: 5,
        }}
        onClick={() => {
          setDateDebut(dateDebut.clone().add(-1, "months"));
        }}
      >
        <NavigateBeforeIcon />
      </Fab>
      <Fab
        color="primary"
        size="small"
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
        }}
        onClick={() => {
          setDateDebut(dateDebut.clone().add(1, "months"));
        }}
      >
        <NavigateNextIcon />
      </Fab>
      <TableContainer component={Paper} style={{ width: "fit-content" }}>
        <Table style={{ borderCollapse: "separate" }}>
          <TableBody>
            <TableRow>
              {Array.from(
                moment
                  .range(dateDebut, dateDebut.clone().add(nbMonths, "months"))
                  .snapTo("year")
                  .by("year")
              ).map((years) => (
                <React.Fragment key={years.format("YYYY")}>
                  <TableCell
                    sx={{ ...StyleTableCell.annee }}
                    colSpan={
                      4 *
                      NbMonthByYear(
                        moment.range(
                          dateDebut,
                          dateDebut.clone().add(nbMonths, "months")
                        ),
                        years.year()
                      )
                    }
                    onClick={() => setOpenDialog(true)}
                  >
                    {years.format("YYYY")}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            <TableRow>
              {Array.from(
                moment
                  .range(dateDebut, dateDebut.clone().add(nbMonths, "months"))
                  .by("month")
              ).map((month) => (
                <React.Fragment key={month.format("YYYY-M")}>
                  <TableCell sx={{ ...StyleTableCell.mois }} colSpan={4}>
                    {month.locale("fr-FR").format("MMMM")}
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
          if (option.menu === "Divider") result = <Divider />;
          else
            result = (
              <MenuItem
                key={option.menu}
                sx={{ fontSize: "0.8em", lineHeight: "1" }}
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
          handleClose={(result, dateMin) => {
            setOpenDialog(false);
            if (result) {
              setDateDebut(dateMin);
            }
          }}
        />
      )}
    </div>
  );
}

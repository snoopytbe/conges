import React from "react";

// Import from Material UI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Local import
import { getApiData } from "./ApiData";
import * as StyleTableCell from "./styleTableCell";
import { TableCellVacances } from "./TableCellVacances";
import { handleNewConge } from "./conges";
import DateRangeDialog from "./DateRangeDialog";
import { TableCellCalendrier } from "./TableCellCalendrier";
import { TableCellDate } from "./TableCellDate";
import { calculeSoldeCongesAtDate } from "./conges";

// Moment.js + moment-range
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import "moment/min/locales.min";
moment.locale("fr-FR");

export default function Calendrier() {
  // Permet de calculer le nombre de mois affichés en fonction de la taille de la fenêtre
  const getNbMonthsFromWindowWidth = () => {
    return Math.floor(window.innerWidth / 117);
  };

  // Permet de réajuster automatiquement le nombre de mois affichés en fonction de la taille de la fenêtre
  React.useEffect(() => {
    const handleWindowResize = () => {
      var newNbMonths = getNbMonthsFromWindowWidth();
      setNbMonths(newNbMonths);
    };

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Nombre de mois affichés
  const [nbMonths, setNbMonths] = React.useState(getNbMonthsFromWindowWidth());

  //Par défaut la date de début est 4 mois avant la date courante
  const [dateDebut, setDateDebut] = React.useState(
    moment([
      moment().add(-3, "months").year(),
      moment().add(-3, "months").month(),
      1,
    ])
  );

  const [highlighted, setHighlighted] = React.useState(null);

  const [conges, setConges] = React.useState([]);

  const [openDialog, setOpenDialog] = React.useState(false);

  const [abrSelected, setAbrSelected] = React.useState("");

  const [mousePosMenu, setMousePosMenu] = React.useState({
    mouseX: null,
    mouseY: null,
  });

  const [activeMenu, setActiveMenu] = React.useState(false);

  const MenuOptions = [
    { menu: "Congés", abr: "CA" },
    { menu: "RTT", abr: "RTT" },
    { menu: "CET", abr: "CET" },
    { menu: "Formation", abr: "FOR" },
    { menu: "Maladie", abr: "MAL" },
    { menu: "Présent", abr: "" },
    { menu: "Télétravail", abr: "TL" },
  ];

  const handleMenuItemClick = (event, abr) => {
    event.preventDefault();
    setMousePosSubMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setActiveSubMenu(true);
    setAbrSelected(abr);
  };

  const [mousePosSubMenu, setMousePosSubMenu] = React.useState({
    mouseX: null,
    mouseY: null,
  });

  const [activeSubMenu, setActiveSubMenu] = React.useState(false);

  const SubMenuOptions = [
    { menu: "Journée", duree: "J" },
    { menu: "Matin", duree: "AM" },
    { menu: "Après-midi", duree: "PM" },
  ];

  const handleDescrClose = () => {
    setActiveSubMenu(false);
    setActiveMenu(false);
    setAbrSelected("");
  };

  const handleSubMenuItemClick = (event, duree) => {
    event.preventDefault();
    var newConges = handleNewConge(abrSelected, duree, conges, highlighted);
    setConges(newConges);
    setHighlighted(null);
    handleDescrClose();
  };

  const clicked = React.useRef(false);
  const startDateHighlight = React.useRef(null);

  const onClick = React.useCallback((event, myDate) => {
    event.preventDefault();

    if (!clicked.current) {
      startDateHighlight.current = myDate;
      setHighlighted(moment.range(myDate, myDate));
    } else {
      setHighlighted(
        moment.range(
          moment.min(startDateHighlight.current, myDate),
          moment.max(startDateHighlight.current, myDate)
        )
      );
    }
    clicked.current = !clicked.current;
  }, []);

  const onContextMenu = React.useCallback(
    (event, myDate) => {
      event.preventDefault();

      if (!highlighted?.contains(myDate))
        setHighlighted(moment.range(myDate, myDate));

      clicked.current = false;

      setMousePosMenu({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
      setActiveMenu(true);
    },
    [highlighted]
  );

  const typeHighlight = (myDate, highlighted) => {
    var result = "";
    if (highlighted?.contains(myDate)) {
      result = "middle";

      var isFirstDayHighlighted = !highlighted.contains(
        myDate.clone().add(-1, "day")
      );
      if (isFirstDayHighlighted) result = "first";

      var isLastDayHighlighted = !highlighted.contains(
        myDate.clone().add(1, "day")
      );
      if (isLastDayHighlighted) result = "last";

      if (isFirstDayHighlighted && isLastDayHighlighted) result = "solo";
    }
    return result;
  };

  React.useEffect(() => {
    getApiData().then((data) => setConges(data));
  }, []);

  function NbMonthByYear(oneRange, year) {
    var rangeFullYear = moment.range(
      moment([year, 0, 1]),
      moment([year, 11, 31])
    );

    var result = 0;

    var rangeYear = rangeFullYear.intersect(oneRange);

    if (!rangeYear) result = rangeFullYear.adjacent(oneRange) && 1;
    else result = Array.from(rangeYear.by("month")).length;
    //console.log(result);

    return result;
  }

  const tooltipTitle = (myDate, conge) => {
    var result = "";

    if (
      conge?.abr.includes("CA") ||
      conge?.abr.includes("RTT") ||
      conge?.abr.includes("TL")
    ) {
      result = "Solde CA : " + calculeSoldeCongesAtDate(myDate, "CA", conges);
      result +=
        ", solde RTT : " + calculeSoldeCongesAtDate(myDate, "RTT", conges);
      result +=
        ", solde TL : " + calculeSoldeCongesAtDate(myDate, "TL", conges);
    }
    return result;
  };

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
            {Array.from(Array(31).keys()).map((day) => (
              <TableRow key={"ligne" + day}>
                {Array.from(
                  moment
                    .range(dateDebut, dateDebut.clone().add(nbMonths, "months"))
                    .by("month")
                ).map((month) => {
                  let myDate = moment([month.year(), month.month(), day + 1]);

                  const TDM = (num) => `${num <= 8 ? "0" : ""}${num + 1}`;

                  let conge = conges?.find(
                    (item) =>
                      item.date ===
                      `${month.year()}-${TDM(month.month())}-${TDM(day)}`
                  );
                  return (
                    // Numéro du jour
                    <React.Fragment
                      key={"ligne" + day + "i" + month.year() + month.month()}
                    >
                      <TableCellDate
                        myDate={myDate}
                        onContextMenu={onContextMenu}
                        onClick={onClick}
                        typeHighlight={typeHighlight(myDate, highlighted)}
                      />

                      <TableCellCalendrier
                        myDate={myDate}
                        onContextMenu={onContextMenu}
                        onClick={onClick}
                        typeHighlight={typeHighlight(myDate, highlighted)}
                        tooltipTitle={tooltipTitle(myDate, conge)}
                        conge={conge}
                      />

                      {/* Vacances scolaires */}
                      <TableCellVacances myDate={myDate} />
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        keepMounted
        open={activeMenu}
        onClose={handleDescrClose}
        anchorReference="anchorPosition"
        anchorPosition={
          mousePosMenu.mouseY !== null && mousePosMenu.mouseX !== null
            ? { top: mousePosMenu.mouseY, left: mousePosMenu.mouseX }
            : undefined
        }
      >
        {MenuOptions.map((option) => {
          return (
            <MenuItem
              key={option.menu}
              sx={{ fontSize: "0.8em", lineHeight: "1", width: "100px" }}
              onClick={(event) => handleMenuItemClick(event, option.abr)}
            >
              {option.menu}
            </MenuItem>
          );
        })}
      </Menu>
      <Menu
        keepMounted
        open={activeSubMenu}
        onClose={handleDescrClose}
        anchorReference="anchorPosition"
        anchorPosition={
          mousePosSubMenu.mouseY !== null && mousePosMenu.mouseX !== null
            ? { top: mousePosSubMenu.mouseY, left: mousePosMenu.mouseX + 100 }
            : undefined
        }
      >
        {SubMenuOptions.map((option) => {
          return (
            <MenuItem
              key={option.menu}
              sx={{ fontSize: "0.8em", lineHeight: "1" }}
              onClick={(event) => handleSubMenuItemClick(event, option.duree)}
            >
              {option.menu}
            </MenuItem>
          );
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

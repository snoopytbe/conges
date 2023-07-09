import React from "react";

// Import from Material UI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import UAParser from "ua-parser-js";

// Local import
import { getApiRangeData } from "./ApiData";
import * as StyleTableCell from "./styleTableCell";
import { TableCellVacances } from "./TableCellVacances";
import { handleNewConge, calculeDecompte, formatMoment } from "./conges";
import DateRangeDialog from "./DateRangeDialog";
import { TableCellCalendrier } from "./TableCellCalendrier";
import { TableCellDate } from "./TableCellDate";
//import { useWindowWidth } from "./useWindowWidth";
import LeftRightNav from "./LeftRightNav";
import MyMenu from "./MyMenu";

// Moment.js + moment-range
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import "moment/min/locales.min";
moment.locale("fr-FR");

// Permet de savoir si le site est accédé depuis un mobile
var parser = new UAParser();
const IS_MOBILE = parser?.getDevice()?.type === "mobile";

export default function Calendrier() {
  /* Le nombre de mois qui doivent être affichés dans le calendrier, en fonction
   * de la largeur de la fenêtre actuelle */
  const nbMonths = Math.min(12, Math.floor(window.innerWidth / 139));
  const myWidth = Math.min(nbMonths * 139, window.innerWidth);

  //La date de début est égale au minimum entre la moitié du nombre mois
  // affichés
  const [dateDebut, setDateDebut] = React.useState(
    moment()
      .add(-nbMonths / 2, "months")
      .date(1)
  );

  /* Variable où sont stockés les congés */
  const [conges, setConges] = React.useState([]);

  /* Chargement des congés au démarrage */
  React.useEffect(() => {
    // On commence à charger les données à la plus petite date nécessaire pour calculer les soldes de congés
    // C'est soit le début de l'année en cours
    // Soit le  1/5 qui précèdant
    var dateDebutData = moment.min(
      moment([dateDebut.year(), 0, 1]),
      moment([dateDebut.year() + (dateDebut.month() <= 3 && -1), 4, 1])
    );

    // On charge les données jusqu'à la fin de l'horizon de temps affiché (dateDebut + nbMonths + 1)
    getApiRangeData(
      formatMoment(dateDebutData),
      formatMoment(dateDebut.clone().add(nbMonths + 1, "months"))
    ).then((data) => setConges(data));
  }, [dateDebut]);

  /* Paramètres du menu affiché lors du click droit */
  const menuOptions = [
    { menu: "CA", value: "CA" },
    { menu: "RTT", value: "RTT" },
    //{ menu: "CET", value: "CET" },
    { menu: "Formation", value: "FOR" },
    { menu: "Maladie", value: "MAL" },
    { menu: "Présent", value: "" },
    { menu: "Télétravail", value: "TL" },
    /*{ menu: "divider", value: "-" },
    { menu: "Journée", value: "J" },
    { menu: "Matin", value: "AM" },
    { menu: "Après-midi", value: "PM" },*/
  ];

  const [mousePos, setMousePos] = React.useState({
    mouseX: null,
    mouseY: null,
  });

  const [activeMenu, setActiveMenu] = React.useState(false);

  const onMenuItemClick = (event, abr) => {
    event.preventDefault();
    setConges(handleNewConge(abr, conges, highlighted));
    setHighlighted(null);
    setActiveMenu(false);
  };

  const clicked = React.useRef(false);
  const startDateHighlight = React.useRef(null);
  const [highlighted, setHighlighted] = React.useState(null);

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
      if (IS_MOBILE) {
        setMousePos({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
        setActiveMenu(true);
      }
    }
    clicked.current = !clicked.current;
  }, []);

  const onContextMenu = React.useCallback(
    (event, myDate) => {
      event.preventDefault();

      if (!highlighted?.contains(myDate))
        setHighlighted(moment.range(myDate, myDate));

      clicked.current = false;

      setMousePos({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
      setActiveMenu(true);
    },
    [highlighted]
  );

  /**
   * Renvoie le type d'highlight :
   * Si la veille et le lendemain ne sont pas highlighted le résultat est "solo"
   * Si seulement la veille n'est pas highlighted le résultat est "first"
   * Si seulement le lendemain n'est pas highlighted le résultat est "last"
   * Sinon le résultat est "middle"
   * @param myDate - la date de la cellule
   * @param highlighted - un tableau d'objets moment comprenant les dates highlighted par l'utilisateur
   * @returns Le type d'highlight.
   */
  const giveHighlightType = (myDate, highlighted) => {
    var result = "";
    if (highlighted?.contains(myDate)) {
      var isFirstDayHighlighted = !highlighted.contains(
        myDate.clone().add(-1, "day")
      );

      var isLastDayHighlighted = !highlighted.contains(
        myDate.clone().add(1, "day")
      );

      if (isFirstDayHighlighted && isLastDayHighlighted) result = "solo";
      else if (isFirstDayHighlighted) result = "first";
      else if (isLastDayHighlighted) result = "last";
      else result = "middle";
    }
    return result;
  };

  /**
   * Renvoie le nombre de mois dans la plage qui sont dans l'année
   * @param range - la plage
   * @param year - l'année
   * @returns Le nombre de mois dans la plage qui sont dans l'année.
   */
  function NbMonthInYear(range, year) {
    var rangeFullYear = moment.range(
      moment([year, 0, 1]),
      moment([year, 11, 31])
    );

    var intersection = rangeFullYear.intersect(range);

    return Array.from(intersection?.by("month"))?.length ?? 0;
  }

  /* Variable permettant d'identifier si la fenêtre choix de date est visible ou pas */
  const [dateRangeDialogVisible, setDateRangeDialogVisible] =
    React.useState(false);

  return (
    <div>
      <Typography variant="h5" align="center" sx={{ width: myWidth }}>
        Congés
      </Typography>
      <Typography variant="h6" align="center" sx={{ width: myWidth }}>
        J-{calculeDecompte(conges)}
      </Typography>
      <br />
      <LeftRightNav
        onClickLeft={() => {
          setDateDebut(dateDebut.clone().add(-1, "months"));
        }}
        onFastClickLeft={() => {
          setDateDebut(dateDebut.clone().add(-6, "months"));
        }}
        onClickRight={() => {
          setDateDebut(dateDebut.clone().add(1, "months"));
        }}
        onFastClickRight={() => {
          setDateDebut(dateDebut.clone().add(6, "months"));
        }}
        myWidth={myWidth}
      />
      <TableContainer
        component={Paper}
        style={{ width: "fit-content", align: "center" }}
      >
        <Table style={{ borderCollapse: "separate", align: "center" }}>
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
                      NbMonthInYear(
                        moment.range(
                          dateDebut,
                          dateDebut.clone().add(nbMonths, "months")
                        ),
                        years.year()
                      )
                    }
                    onClick={() => setDateRangeDialogVisible(true)}
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

                  return (
                    // Numéro du jour
                    <React.Fragment
                      key={"ligne" + day + "i" + month.year() + month.month()}
                    >
                      <TableCellDate
                        myDate={myDate}
                        onContextMenu={onContextMenu}
                        onClick={onClick}
                        typeHighlight={giveHighlightType(myDate, highlighted)}
                      />

                      <TableCellCalendrier
                        myDate={myDate}
                        conges={conges}
                        onContextMenu={onContextMenu}
                        onClick={onClick}
                        typeHighlight={giveHighlightType(myDate, highlighted)}
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
      <MyMenu
        open={activeMenu}
        mousePos={mousePos}
        menuOptions={menuOptions}
        onClose={() => setActiveMenu(false)}
        onClick={(event, abr) => onMenuItemClick(event, abr)}
      />
      {dateRangeDialogVisible && (
        <DateRangeDialog
          dateDebut={dateDebut}
          handleClose={(result, dateMin) => {
            setDateRangeDialogVisible(false);
            if (result) {
              setDateDebut(dateMin);
            }
          }}
        />
      )}
    </div>
  );
}

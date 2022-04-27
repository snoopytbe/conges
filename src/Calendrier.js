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
import { getApiData } from "./ApiData";
import * as StyleTableCell from "./styleTableCell";
import { TableCellVacances } from "./TableCellVacances";
import { handleNewConge } from "./conges";
import DateRangeDialog from "./DateRangeDialog";
import Fab from "@mui/material/Fab";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { TableCellCalendrier } from "./TableCellCalendrier";
import { TableCellDate } from "./TableCellDate";
import { calculeSoldeCongesAtDate } from "./conges";
moment.locale("fr-FR");

export default function Calendrier(props) {
  const { annee } = props;

  const [mousePos, setMousePos] = React.useState({
    mouseX: null,
    mouseY: null,
  });
  const [activeMenu, setActiveMenu] = React.useState(false);

  const [highlighted, setHighlighted] = React.useState(null);

  const [conges, setConges] = React.useState([]);

  const [openDialog, setOpenDialog] = React.useState(false);

  const [nbMonths, setNbMonths] = React.useState(calculNbMonths());

  function calculNbMonths() {
    return Math.floor(window.innerWidth / 117);
  }

  const [dateDebut, setDateDebut] = React.useState(moment([annee, 0, 1]));

  React.useEffect(() => {
    const handleWindowResize = () => {
      var newNbMonths = calculNbMonths();
      setNbMonths(newNbMonths);
    };

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const zone = "C";

  const MenuOptions = [
    { menu: "Congés", abr: "CA", type: "conge" },
    { menu: "RTT", abr: "RTT", type: "conge" },
    { menu: "CET", abr: "CET", type: "conge" },
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

  var clicked = false;
  var startDateHighlight = null;

  const onClick = React.useCallback(
    (event, myDate) => {
      event.preventDefault();

      if (!clicked) {
        //setStartDateHighlight(myDate);
        startDateHighlight = myDate;
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
      console.log("ok");
      clicked = !clicked;
    },
    [clicked, startDateHighlight]
  );

  const onContextMenu = React.useCallback((event) => {
    event.preventDefault();
    setMousePos({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setActiveMenu(true);
  }, []);

  const handleMenuItemClick = (event, abr, type) => {
    event.preventDefault();
    //console.log(highlighted);
    var newConges = handleNewConge(abr, type, conges, highlighted);
    setConges(newConges);
    setActiveMenu(false);
    setHighlighted(null);
  };

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

  const tooltipTitle = (myDate, conges) => {
    var result = "";

    var conge = conges?.find(
      (item) => item.date === myDate.format("YYYY-MM-DD")
    );

    if (conge?.abr === "CA" || conge?.abr === "RTT") {
      result = "Solde CA : " + calculeSoldeCongesAtDate(myDate, "CA", conges);
      result +=
        ", solde RTT : " + calculeSoldeCongesAtDate(myDate, "RTT", conges);
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
                        tooltipTitle={tooltipTitle(myDate, conges)}
                        conge={conges?.find(
                          (item) => item.date === myDate.format("YYYY-MM-DD")
                        )}
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
          mousePos.mouseY !== null && mousePos.mouseX !== null
            ? { top: mousePos.mouseY, left: mousePos.mouseX }
            : undefined
        }
      >
        {MenuOptions.map((option) => {
          var result;
          if (option.menu === "Divider") result = <Divider key={1} />;
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

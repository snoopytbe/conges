/**
 * @fileoverview Composant principal du calendrier de congés
 * @module Calendrier
 */

import React, { useState } from "react";
import DotLoader from "react-spinners/DotLoader";

// Import from Material UI
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

// Local imports
import { nbMonthInYear, giveHighlightType } from "../../services";
import * as StyleTableCell from "../../styles/styleTableCell";
import { TableCellVacances, TableCellCalendrier, TableCellDate, TableCellMois } from "../cells";
import DateRangeDialog from "../dialogs/DateRangeDialog";
import { LeftRightNav, MyMenu } from "../layout";
import { MENU_OPTIONS, SUB_MENU_OPTIONS, LOADER_CONFIG, CALENDAR_CONFIG } from "../../config/calendarConfig";

// Moment.js + moment-range
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import "moment/min/locales.min";
moment.locale("fr-FR");

import { useConges, useIsMobile, useContextMenu } from "../../hooks";

/**
 * Composant principal du calendrier
 * @returns {JSX.Element} Le composant Calendrier
 */
export default function Calendrier() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  /* Le nombre de mois qui doivent être affichés dans le calendrier, en fonction
   * de la largeur de la fenêtre actuelle */
  const nbMonths = Math.min(CALENDAR_CONFIG.maxMonths, Math.floor(window.innerWidth / CALENDAR_CONFIG.cellWidth));
  const myWidth = Math.min(nbMonths * CALENDAR_CONFIG.cellWidth, window.innerWidth);

  //La date de début est égale au minimum entre la moitié du nombre mois
  // affichés
  const [dateDebut, setDateDebut] = React.useState(
    moment()
      .add(-nbMonths / 2, "months")
      .date(1)
  );

  const isMobile = useIsMobile();
  const { mousePos, activeMenu, handleContextMenu: handleMenu, closeMenu } = useContextMenu();

  const {
    conges,
    loading,
    highlighted,
    handleClick,
    handleContextMenu,
    handleModifyConges
  } = useConges(dateDebut, nbMonths, setSnackbar);

  const onMenuItemClick = (event, abr, duree) => {
    event.preventDefault();
    handleModifyConges(abr, duree);
    closeMenu();
  };

  const onContextMenu = (event, myDate) => {
    event.preventDefault();
    handleContextMenu(event, myDate);
    handleMenu(event);
  };

  const onClick = (event, myDate) => {
    event.preventDefault();
    handleClick(event, myDate);
    if (isMobile) {
      handleMenu(event);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };



  /* Variable permettant d'identifier si la fenêtre choix de date est visible ou pas */
  const [dateRangeDialogVisible, setDateRangeDialogVisible] =
    React.useState(false);

  return (
    <div>
      {loading && (
        <>
          <Typography variant="h1">
            <br />
          </Typography>
          <DotLoader
            color={LOADER_CONFIG.color}
            loading={loading}
            size={LOADER_CONFIG.size}
            cssOverride={LOADER_CONFIG.cssOverride}
          />
          <Typography variant="h6" align="center">
            Chargement en cours
          </Typography>
        </>
      )}
      {!loading && (
        <>
          <br />
          <div style={{ 
            position: 'relative', 
            width: 'fit-content', 
            margin: '0 auto' 
          }}>
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
            <div
              style={{ width: "fit-content", align: "center" }}
            >
              <Table style={{ borderCollapse: "separate", align: "center" }}>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={5 * nbMonths}>
                      <Typography variant="h5" align="center">
                        {CALENDAR_CONFIG.title}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {Array.from(
                      moment
                        .range(
                          dateDebut,
                          dateDebut.clone().add(nbMonths, "months")
                        )
                        .snapTo("year")
                        .by("year")
                    ).map((years) => (
                      <React.Fragment key={years.format("YYYY")}>
                        <TableCell
                          sx={{ ...StyleTableCell.annee }}
                          colSpan={
                            4 *
                            nbMonthInYear(
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
                        .range(
                          dateDebut,
                          dateDebut.clone().add(nbMonths, "months")
                        )
                        .by("month")
                    ).map((month) => (
                      <React.Fragment key={month.format("YYYY-M")}>
                        <TableCellMois
                          month={month}
                          conges={conges}
                          onContextMenu={onContextMenu}
                        />
                      </React.Fragment>
                    ))}
                  </TableRow>
                  {Array.from(Array(31).keys()).map((day) => (
                    <TableRow key={"ligne" + day}>
                      {Array.from(
                        moment
                          .range(
                            dateDebut,
                            dateDebut.clone().add(nbMonths, "months")
                          )
                          .by("month")
                      ).map((month) => {
                        let myDate = moment([
                          month.year(),
                          month.month(),
                          day + 1,
                        ]);

                        return (
                          // Numéro du jour
                          <React.Fragment
                            key={
                              "ligne" + day + "i" + month.year() + month.month()
                            }
                          >
                            <TableCellDate
                              myDate={myDate}
                              onContextMenu={onContextMenu}
                              onClick={onClick}
                              typeHighlight={giveHighlightType(
                                myDate,
                                highlighted
                              )}
                            />

                            <TableCellCalendrier
                              myDate={myDate}
                              conges={conges}
                              onContextMenu={onContextMenu}
                              onClick={onClick}
                              typeHighlight={giveHighlightType(
                                myDate,
                                highlighted
                              )}
                              key={`cal-${myDate.format('YYYY-MM-DD')}`}
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
            </div>
          </div>
        </>
      )}
      <MyMenu
        open={activeMenu}
        mousePos={mousePos}
        menuOptions={MENU_OPTIONS}
        subMenuOptions={SUB_MENU_OPTIONS}
        onClose={closeMenu}
        onClick={onMenuItemClick}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

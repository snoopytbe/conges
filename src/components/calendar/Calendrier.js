/**
 * @fileoverview Composant principal du calendrier de congés
 * @module Calendrier
 */

import { useState, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useConges, useContextMenu } from "../../hooks";
import { MENU_OPTIONS, SUB_MENU_OPTIONS, CALENDAR_CONFIG } from "../../config/calendarConfig";
import DateRangeDialog from "../dialogs/DateRangeDialog";
import { MyMenu } from "../layout";
import CalendarContent from "./CalendarContent";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import {
  addMonths,
  setDate
} from "date-fns";

export default function Calendrier({user}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const nbMonths = useMemo(() =>
    Math.min(CALENDAR_CONFIG.maxMonths, Math.floor(window.innerWidth / CALENDAR_CONFIG.cellWidth)),
    []
  );

  const myWidth = useMemo(() =>
    Math.min(nbMonths * CALENDAR_CONFIG.cellWidth, window.innerWidth),
    [nbMonths]
  );

  const [dateDebut, setDateDebut] = useState(() => {
    const now = new Date();
    const middle = addMonths(now, -Math.floor(nbMonths / 2));
    return setDate(middle, 1);
  });

  const { mousePos, activeMenu, handleContextMenu: handleMenu, closeMenu } = useContextMenu();

  const {
    conges,
    loading,
    highlighted,
    handleClick: handleCongesClick,
    handleContextMenu,
    handleModifyConges
  } = useConges(dateDebut, nbMonths, setSnackbar, user);

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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const [dateRangeDialogVisible, setDateRangeDialogVisible] = useState(false);

  return (
    <div>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <CalendarContent 
            dateDebut={dateDebut}
            setDateDebut={setDateDebut}
            myWidth={myWidth}
            nbMonths={nbMonths}
            conges={conges}
            onContextMenu={onContextMenu}
            handleCongesClick={handleCongesClick}
            highlighted={highlighted}
            setDateRangeDialogVisible={setDateRangeDialogVisible}
          />
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

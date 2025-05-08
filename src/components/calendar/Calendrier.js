/**
 * @fileoverview Composant principal du calendrier de congés
 * @module Calendrier
 */

import { useState, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import { Snackbar, Alert } from "@mui/material";
import { signOut } from "aws-amplify/auth";
import { useConges, useContextMenu } from "../../hooks";
import { MENU_OPTIONS, SUB_MENU_OPTIONS, CALENDAR_CONFIG } from "../../config/calendarConfig";
import DateRangeDialog from "../dialogs/DateRangeDialog";
import { MyMenu } from "../layout";
import UserMenu from "./UserMenu";
import CalendarContent from "./CalendarContent";
import Legend from "./Legend";
import LoadingIndicator from "./LoadingIndicator";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import "moment/min/locales.min";
moment.locale("fr-FR");

export default function Calendrier({ user }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la déconnexion",
        severity: "error"
      });
    }
  }, []);

  const nbMonths = useMemo(() => 
    Math.min(CALENDAR_CONFIG.maxMonths, Math.floor(window.innerWidth / CALENDAR_CONFIG.cellWidth)),
    []
  );

  const myWidth = useMemo(() => 
    Math.min(nbMonths * CALENDAR_CONFIG.cellWidth, window.innerWidth),
    [nbMonths]
  );

  const [dateDebut, setDateDebut] = useState(() =>
    moment()
      .add(-nbMonths / 2, "months")
      .date(1)
  );

  const { mousePos, activeMenu, handleContextMenu: handleMenu, closeMenu } = useContextMenu();

  const {
    conges,
    loading,
    highlighted,
    handleClick: handleCongesClick,
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
          <UserMenu user={user} onSignOut={handleSignOut} />
          <br />
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
          <Legend />
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

Calendrier.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    given_name: PropTypes.string,
    family_name: PropTypes.string,
    picture: PropTypes.string,
    sub: PropTypes.string,
  }).isRequired
};

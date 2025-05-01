/**
 * @fileoverview Composant principal du calendrier de congés
 * @module Calendrier
 */

import React, { useState } from "react";
import DotLoader from "react-spinners/DotLoader";
import PropTypes from 'prop-types';

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
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

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
import { signOut } from "aws-amplify/auth";

/**
 * Composant principal du calendrier
 * @returns {JSX.Element} Le composant Calendrier
 */
export default function Calendrier({ user }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la déconnexion",
        severity: "error"
      });
    }
  };

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
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center', 
            mb: 2, 
            px: 2 
          }}>
            <Button
              onClick={handleClick}
              sx={{
                borderRadius: '50%',
                minWidth: 'auto',
                padding: 0,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <Avatar 
                src={user?.picture} 
                alt={user?.username}
                sx={{ width: 32, height: 32 }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user?.name || user?.username || 'Utilisateur'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Déconnexion</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
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
                              onClick={handleCongesClick}
                              typeHighlight={giveHighlightType(
                                myDate,
                                highlighted
                              )}
                            />

                            <TableCellCalendrier
                              myDate={myDate}
                              conges={conges}
                              onContextMenu={onContextMenu}
                              onClick={handleCongesClick}
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

Calendrier.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    picture: PropTypes.string,
    name: PropTypes.string,
    attributes: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
      picture: PropTypes.string,
      sub: PropTypes.string
    })
  }).isRequired
};

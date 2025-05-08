import React from "react";
import PropTypes from 'prop-types';
import { Table, TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import { nbMonthInYear, giveHighlightType } from "../../services";
import * as StyleTableCell from "../../styles/styleTableCell";
import { TableCellVacances, TableCellCalendrier, TableCellDate, TableCellMois } from "../cells";
import {
  addMonths,
  eachMonthOfInterval,
  eachYearOfInterval,
  setDate,
  format
} from "date-fns";
import { fr } from "date-fns/locale";

const CalendarContent = ({
  dateDebut,
  setDateDebut,
  nbMonths,
  conges,
  onContextMenu,
  handleCongesClick,
  highlighted = [],
  setDateRangeDialogVisible
}) => {
  // Génération de la liste des mois à afficher
  const months = eachMonthOfInterval({
    start: dateDebut,
    end: addMonths(dateDebut, nbMonths - 1)
  });

  // Génération de la liste des années à afficher
  const years = eachYearOfInterval({
    start: dateDebut,
    end: addMonths(dateDebut, nbMonths - 1)
  });

  return (
    <div style={{ 
      position: 'relative', 
      width: 'fit-content', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      <div className="flex items-center gap-x-1 mb-4" style={{justifyContent: 'flex-start'}}>
        <IconButton
          aria-label="Mois précédent"
          onClick={() => setDateDebut(addMonths(dateDebut, -1))}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setDateDebut(addMonths(dateDebut, -1))}
          sx={{
            width: 36, // w-9 equivalent
            height: 36, // h-8 equivalent
            backgroundColor: 'white', // bg-gray-200
            border: '0px', 
            '&:hover': {
              backgroundColor: 'grey.300', // hover:bg-gray-300
            },
            padding: '0', // Pour un contrôle précis de la taille de l'icône
          }}
        >
          {/* Triangle noir rempli gauche */}
          <svg width="30" height="30" viewBox="0 0 20 20" aria-hidden="true" fill="black">
            <polygon points="13,5 7,10 13,15" />
          </svg>
        </IconButton>
        <IconButton
          aria-label="Mois suivant"
          onClick={() => setDateDebut(addMonths(dateDebut, 1))}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setDateDebut(addMonths(dateDebut, 1))}
          sx={{
            width: 36, // w-9 equivalent
            height: 36, // h-8 equivalent
            backgroundColor: 'white', // bg-gray-200
            border: '0px', 
            '&:hover': {
              backgroundColor: 'grey.300', // hover:bg-gray-300
            },
            padding: '0', // Pour un contrôle précis de la taille de l'icône
          }}
        >
          {/* Triangle noir rempli droite */}
          <svg width="30" height="30" viewBox="0 0 20 20" aria-hidden="true" fill="black">
            <polygon points="7,5 13,10 7,15" />
          </svg>
        </IconButton>
        <span className="ml-3 text-lg font-medium select-none">
          {` ${format(dateDebut, "MMMM yyyy", { locale: fr })} – ${format(addMonths(dateDebut, nbMonths - 1), "MMMM yyyy", { locale: fr })}`}
        </span>
      </div>
      <div style={{ width: "fit-content", align: "center" }}>
        <Table style={{ 
          borderCollapse: "separate", 
          align: "center",
          fontFamily: 'inherit'
        }}>
          <TableBody>
            <TableRow>
              {years.map((year) => (
                <React.Fragment key={format(year, "yyyy")}> 
                  <TableCell
                    sx={{ 
                      ...StyleTableCell.annee,
                      fontFamily: 'inherit'
                    }}
                    colSpan={
                      4 * nbMonthInYear({
                        start: dateDebut,
                        end: addMonths(dateDebut, nbMonths - 1)
                      }, year.getFullYear())
                    }
                    onClick={() => setDateRangeDialogVisible(true)}
                  >
                    {format(year, "yyyy")}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
            <TableRow>
              {months.map((month) => (
                <React.Fragment key={format(month, "yyyy-M")}> 
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
                {months.map((month) => {
                  let myDate = setDate(month, day + 1);
                  return (
                    <React.Fragment
                      key={"ligne" + day + "i" + format(month, "yyyy") + month.getMonth()}
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
                        key={`cal-${format(myDate, 'yyyy-MM-dd')}`}
                      />

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
  );
};

CalendarContent.propTypes = {
  dateDebut: PropTypes.instanceOf(Date).isRequired,
  setDateDebut: PropTypes.func.isRequired,
  myWidth: PropTypes.number.isRequired,
  nbMonths: PropTypes.number.isRequired,
  conges: PropTypes.array.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  handleCongesClick: PropTypes.func.isRequired,
  highlighted: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.oneOf([null])
  ]),
  setDateRangeDialogVisible: PropTypes.func.isRequired,
};

export default CalendarContent; 
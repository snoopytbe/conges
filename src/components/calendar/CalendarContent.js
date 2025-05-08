import React from "react";
import PropTypes from 'prop-types';
import { Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { nbMonthInYear, giveHighlightType } from "../../services";
import * as StyleTableCell from "../../styles/styleTableCell";
import { TableCellVacances, TableCellCalendrier, TableCellDate, TableCellMois } from "../cells";
import { LeftRightNav } from "../layout";
import { CALENDAR_CONFIG } from "../../config/calendarConfig";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import "moment/min/locales.min";
moment.locale("fr-FR");

const CalendarContent = ({
  dateDebut,
  setDateDebut,
  myWidth,
  nbMonths,
  conges,
  onContextMenu,
  handleCongesClick,
  highlighted = [],
  setDateRangeDialogVisible
}) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: 'fit-content', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
      <div style={{ width: "fit-content", align: "center" }}>
        <Table style={{ 
          borderCollapse: "separate", 
          align: "center",
          fontFamily: 'inherit'
        }}>
          <TableBody>
            <TableRow>
              <TableCell align="center" colSpan={5 * nbMonths}>
                <Typography 
                  variant="h5" 
                  align="center"
                  sx={{
                    fontFamily: 'inherit'
                  }}
                >
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
                    sx={{ 
                      ...StyleTableCell.annee,
                      fontFamily: 'inherit'
                    }}
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
  dateDebut: PropTypes.object.isRequired,
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
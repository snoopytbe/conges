import React from 'react';
import 'date-fns';
import frLocale from 'date-fns/locale/fr';
import format from 'date-fns/format';
import DateFnsUtils from '@date-io/date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import 'moment/min/locales.min';

export default function ControllerDatePicker(props) {
  const { name, label, onChangeHandler, limit, ...other } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        id={'date-picker-dialog' + name}
        label={label}
        views={['year', 'month']}
        format="dd/MM/yyyy"
        value={value}
        onChange={(date) => {
          onChange(date);
          onChangeHandler(name);
        }}
        okLabel="Valider"
        cancelLabel="Annuler"
        renderInput={(params) => <TextField {...params} helperText={null} />}
      />
    </LocalizationProvider>
  );
}

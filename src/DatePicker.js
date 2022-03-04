import React from 'react';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import 'moment/min/locales.min';

moment.locale('fr-FR');

export default function DatePicker(props) {
  const { name, label, onChangeHandler, limit, value, ...other } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
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
        {...other}
      />
    </LocalizationProvider>
  );
}

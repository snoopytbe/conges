import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import 'moment/min/locales.min';

moment.locale('fr-FR');

export default function MyDatePicker(props) {
  const { name, label, value, onChange } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} locale="fr-FR">
      <DatePicker
        id={'date-picker-dialog' + name}
        label={label}
        views={['month', 'year']}
        value={value}
        okLabel="Valider"
        cancelLabel="Annuler"
        renderInput={(params) => <TextField {...params} helperText={null} />}
        onChange={(newValue) => {
          onChange(newValue);
        }}
      />
    </LocalizationProvider>
  );
}

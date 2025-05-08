import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { fr } from 'date-fns/locale';

/**
 * Composant DatePicker personnalisé qui permet de sélectionner une date
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.name - Le nom unique du DatePicker
 * @param {string} props.label - Le label à afficher
 * @param {Date} props.value - La valeur actuelle du DatePicker (objet Date natif)
 * @param {Function} props.onChange - Fonction appelée lors du changement de date
 * @returns {JSX.Element} Le composant DatePicker
 */
export default function MyDatePicker({ name, label, value, onChange, inputProps }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
      <DatePicker
        id={`date-picker-dialog-${name}`}
        label={label}
        views={['month', 'year']}
        value={value}
        okText="Valider"
        cancelText="Annuler"
        renderInput={(params) => <TextField {...params} helperText={null} {...inputProps} />}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}

MyDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  inputProps: PropTypes.object,
};

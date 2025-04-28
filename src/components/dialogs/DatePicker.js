import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import 'moment/min/locales.min';

// Configuration de la locale française
moment.locale('fr-FR');

/**
 * Composant DatePicker personnalisé qui permet de sélectionner une date
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.name - Le nom unique du DatePicker
 * @param {string} props.label - Le label à afficher
 * @param {moment.Moment} props.value - La valeur actuelle du DatePicker
 * @param {Function} props.onChange - Fonction appelée lors du changement de date
 * @returns {JSX.Element} Le composant DatePicker
 */
export default function MyDatePicker({ name, label, value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} locale="fr-FR">
      <DatePicker
        id={`date-picker-dialog-${name}`}
        label={label}
        views={['month', 'year']}
        value={value}
        okLabel="Valider"
        cancelLabel="Annuler"
        renderInput={(params) => <TextField {...params} helperText={null} />}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}

MyDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(moment).isRequired,
  onChange: PropTypes.func.isRequired,
};

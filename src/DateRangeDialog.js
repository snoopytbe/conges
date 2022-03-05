import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DatePicker from './DatePicker';
import moment from 'moment';
import 'moment/min/locales.min';

moment.locale('fr-FR');

export default function DateRangeDialog(params) {
  const { dateDebut, onChangeDebut, dateFin, onChangeFin, handleClose } =
    params;

  return (
    <div>
      <Dialog open={true} onClose={() => handleClose()}>
        <DialogTitle>Changer les dates du calendrier</DialogTitle>
        <DialogContent>
          <DatePicker
            label="Mois de départ"
            name="debut"
            value={dateDebut}
            onChange={(value) => onChangeDebut(value)}
          />{' '}
          <DatePicker
            label="Mois de fin"
            name="fin"
            value={dateFin}
            onChange={(value) => onChangeFin(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Annuler</Button>
          <Button onClick={() => handleClose()}>Valider</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PersoDatePicker from './PersoDatePicker';
import moment from 'moment';
import 'moment/min/locales.min';

moment.locale('fr-FR');

export default function DateRangeDialog(params) {
  const { debut, onChangeDebut, fin, onChangeFin, handleClose } = params;

  return (
    <div>
      <Dialog open={true} onClose={() => handleClose()}>
        <DialogTitle>Changer les dates du calendrier</DialogTitle>
        <DialogContent>
          <PersoDatePicker
            label="Mois de départ"
            name="debut"
            value={debut}
            onChange={(value) => onChangeDebut(value)}
          />{' '}
          <PersoDatePicker
            label="Mois de fin"
            name="fin"
            value={fin}
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

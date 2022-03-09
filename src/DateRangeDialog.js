import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DatePicker from './DatePicker';
import moment from 'moment';
import 'moment/min/locales.min';

moment.locale('fr-FR');

export default function DateRangeDialog(params) {
  const { dateDebut, handleClose } = params;

  const [dateMin, setDateMin] = React.useState(dateDebut);

  return (
    <div>
      <Dialog open={true} onClose={() => handleClose(false)}>
        <DialogTitle>Changer le mois de départ du calendrier</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <br />
          </DialogContentText>
          <DatePicker
            label="Mois de départ"
            name="debut"
            value={dateMin}
            onChange={(value) => {
              setDateMin(value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Annuler</Button>
          <Button onClick={() => handleClose(true, dateMin)}>Valider</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

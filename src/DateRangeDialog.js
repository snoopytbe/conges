import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DatePicker from "./DatePicker"

export default function DateRangeDialog(params) {
  const { handleClose } = params;
  console.log('dialog');
  return (
    <div>
      <Dialog open onClose={() => handleClose()}>
        <DialogTitle>Changer les dates du calendrier</DialogTitle>
        <DialogContent>
          <DialogContentText>Test</DialogContentText>
          <DatePicker 
          label="Mois de départ" 
          name="debut"
          onChangeHandler={}
          value={moment("01012022")} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Annuler</Button>
          <Button onClick={() => handleClose()}>Valider</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

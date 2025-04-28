import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import moment from "moment";
import "moment/min/locales.min";

import { MyDatePicker } from "../../components";

// Configuration de la locale française pour moment.js
moment.locale("fr-FR");

/**
 * Composant de dialogue pour sélectionner une nouvelle date de début pour le calendrier
 * @param {Object} props - Les propriétés du composant
 * @param {Date} props.dateDebut - La date de début actuelle
 * @param {Function} props.handleClose - Fonction de callback appelée lors de la fermeture du dialogue
 * @returns {JSX.Element} Le composant de dialogue
 */
export default function DateRangeDialog({ dateDebut, handleClose }) {
  // État local pour gérer la date sélectionnée
  const [dateMin, setDateMin] = React.useState(dateDebut);

  // Gestionnaire pour la fermeture du dialogue avec validation
  const handleValidation = () => {
    if (dateMin) {
      handleClose(true, dateMin);
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={() => handleClose(false)}
      aria-labelledby="date-range-dialog-title"
    >
      <DialogTitle id="date-range-dialog-title">
        Sélectionnez le nouveau mois de départ
      </DialogTitle>
      <DialogContent>
        <MyDatePicker
          name="debut"
          value={dateMin}
          onChange={(value) => setDateMin(value)}
          inputProps={{
            "aria-label": "Sélection du mois de départ"
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => handleClose(false)}
          color="primary"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleValidation}
          color="primary"
          variant="contained"
        >
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Définition des PropTypes pour la validation des props
DateRangeDialog.propTypes = {
  dateDebut: PropTypes.instanceOf(Date).isRequired,
  handleClose: PropTypes.func.isRequired,
};

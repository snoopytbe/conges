import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Chip, FormControlLabel, Input, ListItem, Stack, Typography } from "@mui/material";
import CheckBox from "@mui/material/Checkbox";
import { CurtainsSharp } from "@mui/icons-material";

const CongeCreationDialog = () => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'yyyy-mm-dd' format

  const [open, setOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState("CA");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDuration, setSelectedDuration] = useState("journée");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState(0);
  const [endDate, setEndDate] = useState(today);
  const [frequencyUnit, setFrequencyUnit] = useState("Jour");
  const [jours, setJours] = React.useState([
    { key: 0, label: "L"},
    { key: 1, label: "M" },
    { key: 2, label: "M" },
    { key: 3, label: "J" },
    { key: 4, label: "V" },
  ]);
  const [lundi, setLundi] = React.useState(false);
  const [mardi, setMardi] = React.useState(false);
  const [mercredi, setMercredi] = React.useState(false);
  const [jeudi, setJeudi] = React.useState(false);
  const [vendredi, setVendredi] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Type de congé sélectionné :", selectedLeave);
    console.log("Date sélectionnée :", selectedDate);
    console.log("Durée sélectionnée :", selectedDuration);
    console.log("Est récurrent :", isRecurrent);
    if (isRecurrent) {
      console.log("Date de fin sélectionnée :", endDate);
      console.log("Fréquence sélectionnée :", frequencyUnit);
    }
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ouvrir la demande de congé
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          style={{ borderBottom: "2px solid #4285F4", color: "#4285F4" }}
        >
          Saisie avancée de congés
        </DialogTitle>
        <DialogContent>
          <FormControl style={{ marginBottom: 16 }}>
            <Select
              labelId="duration-label"
              value={selectedLeave}
              input={<Input />}
              sx={{ minWidth: 200, border: 0 }}
              onChange={(e) => setSelectedLeave(e.target.value)}
            >
              <MenuItem value="CA">CA</MenuItem>
              <MenuItem value="RTT">RTT</MenuItem>
              <MenuItem value="Présnt">Présent</MenuItem>
            </Select>
          </FormControl>
          <br />
          <Input
            type="date"
            style={{ marginBottom: 16, marginRight: 16 }}
            InputLabelProps={{ shrink: true }}
            defaultValue={today}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <FormControl style={{ marginBottom: 16, marginRight: 16 }}>
            <Select
              labelId="duration-label"
              value={selectedDuration}
              input={<Input />}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              <MenuItem value="matin">Matin</MenuItem>
              <MenuItem value="apres-midi">Après-midi</MenuItem>
              <MenuItem value="journée">Journée entière</MenuItem>
            </Select>
          </FormControl>
          <br />
          <FormControlLabel
            style={{ marginBottom: 16 }}
            control={
              <CheckBox
                checked={isRecurrent}
                onChange={(e) => setIsRecurrent(e.target.checked)}
              />
            }
            label="Est récurrent"
          />
          {isRecurrent && (
            <>
              <br />
              <Typography variant="body1">Répéter tou(te)s les :</Typography>
              <Input
                type="number"
                style={{ marginBottom: 16, marginRight: 16 }}
                InputLabelProps={{ shrink: true }}
                defaultValue={frequencyValue}
                onChange={(e) => setFrequencyValue(e.target.value)}
              />
              <FormControl style={{ marginBottom: 16 }}>
                <Select
                  value={frequencyUnit}
                  style={{ marginBottom: 16, marginRight: 16 }}
                  input={<Input />}
                  onChange={(e) => setFrequencyUnit(e.target.value)}
                >
                  <MenuItem value="Jour">Jour</MenuItem>
                  <MenuItem value="Semaine">Semaine</MenuItem>
                  <MenuItem value="Mois">Mois</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body1">Répéter le :</Typography>
              <Stack direction="row" spacing={1}>
                    <ListItem key="lundi">
                  <Chip label="L" variant={lundi ? 'filled':'outlined'} onClick={(e)=> setLundi(!lundi)} />
                    </ListItem>
                
              </Stack>
              <Typography variant="body1">Jusqu&apos;au :</Typography>
              <Input
                type="date"
                style={{ marginBottom: 16, marginRight: 16 }}
                InputLabelProps={{ shrink: true }}
                defaultValue={today}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions
          style={{ borderTop: "2px solid #4285F4", padding: "16px" }}
        >
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CongeCreationDialog;

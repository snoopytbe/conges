import React from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UserMenu from "../calendar/UserMenu";

interface AppBarProps {
  user: {
    email: string;
    given_name: string;
    picture: string;
  };
  onSignOut: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ user, onSignOut }) => {
  return (
    <MuiAppBar position="static" color="default" elevation={1} aria-label="Barre d'application principale">
      <Toolbar className="flex items-center min-h-[64px]">
        <div className="pl-4">
          <Typography
            variant="h6"
            className="font-bold text-lg tracking-wide"
            aria-label="Titre de l'application"
            tabIndex={0}
          >
            Calendrier des congés
          </Typography>
        </div>
        <Box sx={{ flexGrow: 1 }} />
        <div className="flex items-center pr-4">
          <UserMenu user={user} onSignOut={onSignOut} />
        </div>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar; 
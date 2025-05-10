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
        <div className="w-full">
            <MuiAppBar position="static" color="transparent" elevation={0} aria-label="Barre d'application principale" sx={{ borderBottom: '1px solid #4B5563' }}>
                <Toolbar className="flex items-center min-h-[64px]">
                    <img src="/zendays_compact.png" alt="Logo" className="w-10 h-10" style={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        backgroundColor: '#e0e0e0'
                    }} />
                    <div className="pl-4">
                        <Typography
                            variant="h6"
                            className="font-bold text-lg tracking-wide"
                            aria-label="Titre de l'application"
                            tabIndex={0}
                        >
                            ZenDays
                        </Typography>
                    </div>
                    <Box sx={{ flexGrow: 1 }} />
                    <div className="flex items-center pr-4">
                        <UserMenu user={user} onSignOut={onSignOut} />
                    </div>
                </Toolbar>
            </MuiAppBar>
            <div className="w-full h-[5px] bg-gray-600" />
        </div>
    );
};

export default AppBar; 
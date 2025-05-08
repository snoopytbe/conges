import React from "react";
import { Calendrier } from "./components";
import { Amplify } from "aws-amplify";
import CircularProgress from "@mui/material/CircularProgress";
import { config } from "./config";
import './styles/theme.css';
import { Box } from "@mui/material";
import AuthButton from "./components/AuthButton/AuthButton";
import ErrorDisplay from "./components/ErrorDisplay/ErrorDisplay";
import { useAuth } from "./hooks/useAuth";
import { ADMIN_USER_ID } from "./config/constants";
import { User } from "./types";

Amplify.configure(config);

// Définition du type pour l'erreur
interface AuthError {
  type: string;
  message: string;
  originalError?: Error;
}

export default function App(): JSX.Element {
  const { user, isLoading, error, connectUser } = useAuth() as { 
    user: User | null, 
    isLoading: boolean, 
    error: AuthError | null, 
    connectUser: () => void 
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ErrorDisplay error={error} onRetry={connectUser} />
      </Box>
    );
  }

  return (
    <Box className="App">
      {user && user.userId === ADMIN_USER_ID ? (
        <Calendrier user={user} />
      ) : (
        <AuthButton onSignIn={connectUser} />
      )}
    </Box>
  );
} 
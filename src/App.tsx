import React from "react";
import { Calendrier } from "./components";
import { Amplify } from "aws-amplify";
import { config } from "./config";
import './styles/theme.css';
import { Box } from "@mui/material";
import AuthButton from "./components/AuthButton/AuthButton";
import ErrorDisplay from "./components/ErrorDisplay/ErrorDisplay";
import { useAuth } from "./hooks/useAuth";
import { ADMIN_USER_ID } from "./config/constants";
import { User } from "./types";
import AppBar from "./components/layout/AppBar";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";
Amplify.configure(config);

// Définition du type pour l'erreur
interface AuthError {
  type: string;
  message: string;
  originalError?: Error;
}

export default function App(): JSX.Element {

  const { user, isLoading, error, connectUser, signOutUser } = useAuth() as { 
    user: User | null, 
    isLoading: boolean, 
    error: AuthError | null, 
    connectUser: () => Promise<void>;
    signOutUser: () => Promise<void>;
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error("Erreur lors de l'appel à handleSignOut:", err);
    }
  };

  if (isLoading) {
    return (
      <LoadingIndicator />
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
        <>
          <AppBar user={user} onSignOut={handleSignOut} />
          <br />
          <Calendrier user={user} />
        </>
      ) : (
        <AuthButton onSignIn={connectUser} />
      )}
    </Box>
  );
} 
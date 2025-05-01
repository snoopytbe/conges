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

Amplify.configure(config);

export default function App() {
  const { user, isLoading, error, connectUser } = useAuth();

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
      {user?.userId === ADMIN_USER_ID ? (
        <Calendrier user={user} />
      ) : (
        <AuthButton onSignIn={connectUser} />
      )}
    </Box>
  );
}

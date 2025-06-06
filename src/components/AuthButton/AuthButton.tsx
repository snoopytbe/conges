import React from 'react';
import { Box, Paper, Typography, Button } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithRedirect } from "aws-amplify/auth";

// "Google" est l'une des valeurs acceptées pour le provider
const AUTH_PROVIDER = "Google";

interface AuthButtonProps {
  onSignIn?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onSignIn }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      paddingTop: '150px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <img
        src="/zendays_logo.png"
        alt="Logo"
        style={{
          width: 200,
          height: 200,
          marginRight: 36,
        }}
      />
    </Box>
    <Paper
      elevation={3}
      sx={{
        padding: '40px 32px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'white',
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 'bold',
          color: '#222',
          marginBottom: '32px',
          textAlign: 'center',
          letterSpacing: 1
        }}
      >
        Connexion
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => {
          signInWithRedirect({ provider: AUTH_PROVIDER });
          if (onSignIn) onSignIn();
        }}
        startIcon={<GoogleIcon style={{ color: '#ea4335' }} />}
        sx={{
          backgroundColor: 'white',
          color: '#222',
          border: '1.5px solid #ddd',
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: 16,
          padding: '12px 0',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(60,60,60,0.04)',
          '&:hover': {
            backgroundColor: '#f5f5f5',
            borderColor: '#bdbdbd',
          },
        }}
      >
        Connexion avec Google
      </Button>
    </Paper>
  </Box>
);

export default AuthButton; 
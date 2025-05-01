import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, Button } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithRedirect } from "aws-amplify/auth";

const AUTH_PROVIDER = "Google";

const AuthButton = ({ onSignIn }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <img src="/Capture-2025-05-01-103443.png" alt="Logo" style={{ width: 120, height: 144, marginRight: 36, borderRadius: 16, objectFit: 'cover', boxShadow: '0 2px 8px rgba(60,60,60,0.08)' }} />
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
        borderRadius: '12px',
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
        Mon calendrier
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => signInWithRedirect({ provider: AUTH_PROVIDER })}
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

AuthButton.propTypes = {
  onSignIn: PropTypes.func.isRequired
};

export default AuthButton; 
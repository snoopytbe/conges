import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, Button } from "@mui/material";

const ErrorDisplay = ({ error, onRetry }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}
  >
    <Paper
      elevation={3}
      sx={{
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px'
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          marginBottom: '16px',
          color: '#d32f2f',
          fontWeight: 'bold'
        }}
      >
        Une erreur est survenue
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          marginBottom: '32px',
          textAlign: 'center',
          color: '#666'
        }}
      >
        {error.message}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={onRetry}
        sx={{
          padding: '12px 24px',
          borderRadius: '8px'
        }}
      >
        Réessayer
      </Button>
    </Paper>
  </Box>
);

ErrorDisplay.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    originalError: PropTypes.object
  }).isRequired,
  onRetry: PropTypes.func.isRequired
};

export default ErrorDisplay; 
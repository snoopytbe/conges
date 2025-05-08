import { Box, Typography, Grid, Chip } from "@mui/material";

const Legend = () => {
  const legendItems = [
    { code: 'CA', label: 'Congés Annuels', color: 'var(--CA)' },
    { code: 'RTT', label: 'Jours de repos', color: 'var(--RTT)' },
    { code: 'TL', label: 'Télétravail', color: 'var(--TL)' },
    { code: 'MAL', label: 'Maladie', color: 'var(--MAL)' },
    { code: 'DEP', label: 'Déplacement', color: 'var(--DEP)' },
    { code: 'FOR', label: 'Formation', color: 'var(--FOR)' },
    { code: 'CET', label: 'Congé Épargne Temps', color: 'var(--CET)' },
  ];

  return (
    <Box sx={{ 
      mt: 3, 
      p: 2, 
      backgroundColor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1,
      maxWidth: 'fit-content',
      mx: 'auto',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 1,
          fontFamily: 'inherit'
        }}
      >
        Légende
      </Typography>
      <Grid container spacing={1}>
        {legendItems.map((item) => (
          <Grid item key={item.code}>
            <Chip
              label={`${item.code} : ${item.label}`}
              size="small"
              sx={{
                backgroundColor: item.color,
                color: 'var(--text-dark)',
                '& .MuiChip-label': {
                  px: 1,
                  fontFamily: 'inherit'
                },
                border: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Legend; 
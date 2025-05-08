import { useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { Box, Button, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

const UserMenu = ({ user, onSignOut }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      alignItems: 'center', 
      mb: 2, 
      px: 2 
    }}>
      <Button
        onClick={handleClick}
        sx={{
          borderRadius: '50%',
          minWidth: 'auto',
          padding: 0,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <Avatar 
          src={user?.picture} 
          alt={user?.email}
          sx={{ 
            width: 32, 
            height: 32,
            objectFit: 'cover',
            backgroundColor: '#e0e0e0'
          }}
          onError={(e) => {
            e.target.src = 'https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png';
          }}
          imgProps={{
            crossOrigin: 'anonymous',
            referrerPolicy: 'no-referrer'
          }}
        />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {user?.given_name || 'Utilisateur'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={onSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Déconnexion</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

UserMenu.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    given_name: PropTypes.string,
    picture: PropTypes.string,
  }).isRequired,
  onSignOut: PropTypes.func.isRequired,
};

export default UserMenu; 
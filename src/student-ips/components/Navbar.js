import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar({ user: initialUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser); // update state jika prop berubah
    }
  }, [initialUser]);

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include', // kirim cookie ke backend
    });
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pramudita
        </Typography>
        <IconButton onClick={handleAvatarClick}>
          <Avatar>{user?.username?.charAt(0).toUpperCase()}</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled><strong>{user?.username}</strong></MenuItem>
          <MenuItem disabled>Asal: {user?.asal_sekolah}</MenuItem>
          <MenuItem disabled>Jurusan: {user?.jurusan}</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap>
          Pramudita
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2">Nama_user</Typography>
          <Typography variant="caption">Jurusan_user</Typography>
        </Box>
        <Avatar />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

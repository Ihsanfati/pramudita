import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box
} from '@mui/material';

const drawerWidth = 240;

const SidebarAdmin = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Rangking Mata Pelajaran
        </Typography>
        <List>
          {['Ekonomi', 'Geografi', 'Sejarah', 'Sosiologi'].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Opsi Program Studi
        </Typography>
        <List>
          {['Ekonomi', 'Geografi', 'Sejarah', 'Sosiologi'].map((text) => (
            <ListItem button key={`opsi-${text}`}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarAdmin;
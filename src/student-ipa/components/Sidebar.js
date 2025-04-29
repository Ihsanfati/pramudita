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

const Sidebar = () => {
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
          {['Biologi', 'Fisika', 'Kimia', 'Matematika'].map((text) => (
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
          {['Biologi', 'Fisika', 'Kimia', 'Matematika'].map((text) => (
            <ListItem button key={`opsi-${text}`}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
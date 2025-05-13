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
import { FaChartLine, FaGlobe, FaLandmark, FaUsers} from 'react-icons/fa';

const iconMap = {
  Ekonomi: <FaChartLine />,
  Geografi: <FaGlobe />,
  Sejarah: <FaLandmark />,
  Sosiologi: <FaUsers />
};

const drawerWidth = 240;

const SidebarBK = ({ setJurusan, setPilihan }) => {

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
          <List>
            <ListItemButton onClick={() => { setJurusan('IPA'); setPilihan('Pilihan 1'); }}>
              <ListItemText primary="IPA - Pilihan 1" />
            </ListItemButton>
            <ListItemButton onClick={() => { setJurusan('IPA'); setPilihan('Pilihan 2'); }}>
              <ListItemText primary="IPA - Pilihan 2" />
            </ListItemButton>
            <ListItemButton onClick={() => { setJurusan('IPS'); setPilihan('Pilihan 1'); }}>
              <ListItemText primary="IPS - Pilihan 1" />
            </ListItemButton>
            <ListItemButton onClick={() => { setJurusan('IPS'); setPilihan('Pilihan 2'); }}>
              <ListItemText primary="IPS - Pilihan 2" />
            </ListItemButton>
          </List>
      </Box>
    </Drawer>
  );
};

export default SidebarBK;
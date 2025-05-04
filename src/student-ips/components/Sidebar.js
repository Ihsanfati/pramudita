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
import { FaChartLine, FaGlobe, FaLandmark, FaUsers, FaListAlt} from 'react-icons/fa';

const iconMap = {
  Ekonomi: <FaChartLine />,
  Geografi: <FaGlobe />,
  Sejarah: <FaLandmark />,
  Sosiologi: <FaUsers />
};

const drawerWidth = 240;

const Sidebar = ({ onSubjectClick }) => {
  const subjects = ['Ekonomi', 'Geografi', 'Sejarah', 'Sosiologi'];

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
          Rangking Mata Pelajaran dan Opsi Program Studi
        </Typography>
        <List>
          {subjects.map((text) => (
            <ListItem button key={text} onClick={() => onSubjectClick(text)}>
              {iconMap[text]}
              <ListItemText primary={text} sx={{ pl: 2 }} />
            </ListItem>
          ))}
          <ListItem button key="All" onClick={() => onSubjectClick('All')}>
            <FaListAlt />
            <ListItemText primary="All" sx={{ pl: 2 }} />
          </ListItem>
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;

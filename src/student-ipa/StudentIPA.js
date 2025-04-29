import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Box } from '@mui/material';

const StudentIPA = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3, mt: 8 }}>
          <h2>Selamat Datang di Dashboard IPA</h2>
          <p>Silakan pilih mata pelajaran atau opsi studi di sidebar kiri.</p>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentIPA;

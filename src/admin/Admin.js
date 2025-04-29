import React, { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import NavbarAdmin from "./components/NavbarAdmin";
import SidebarAdmin from "./components/SidebarAdmin";
import { useDropzone } from 'react-dropzone';
import axios from "axios";

const Admin = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [jurusan, setJurusan] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [], 'application/vnd.ms-excel': [] },
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    }
  });

  const handleSubmit = async () => {
    if (!selectedFile || !schoolName || !jurusan) {
      alert('Semua field wajib diisi!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('schoolName', schoolName);
    formData.append('jurusan', jurusan);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-student-data-ips', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Upload gagal!');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarAdmin />
      <Box sx={{ flexGrow: 1 }}>
        <NavbarAdmin />
        <Box sx={{ p: 3, mt: 8 }}>
          <Typography variant="h4" gutterBottom>Upload Data Siswa</Typography>

          <Box {...getRootProps()} sx={{ border: '2px dashed #ccc', padding: 2, mb: 2, cursor: 'pointer' }}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the file here ...</p> : <p>Drag 'n' drop file Excel di sini, atau klik untuk pilih file</p>}
          </Box>

          <TextField
            fullWidth
            label="Nama Sekolah"
            variant="outlined"
            sx={{ mb: 2 }}
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="jurusan-label">Jurusan</InputLabel>
            <Select
              labelId="jurusan-label"
              value={jurusan}
              label="Jurusan"
              onChange={(e) => setJurusan(e.target.value)}
            >
              <MenuItem value="ipa">IPA</MenuItem>
              <MenuItem value="ips">IPS</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Upload
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;

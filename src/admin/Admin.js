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
  const [prodiFile, setProdiFile] = useState(null);
  const [prodiYear, setProdiYear] = useState("");

  const handleProdiUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", prodiFile);
    formData.append("year", prodiYear);

    try {
      const res = await fetch("http://localhost:5000/upload-prodi", {
        method: "POST",
        body: formData,
      });
    
      if (!res.ok) {
        const errorText = await res.text(); // optional: untuk debugging
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }
    
      const result = await res.json();
      alert(result.message);
      setProdiFile(null);
      setProdiYear('');
    } catch (err) {
      console.error(err);
      alert("Gagal mengupload file program studi.");
    }    
  };

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
      // RESET FORM SETELAH BERHASIL
      setSelectedFile(null);
      setSchoolName('');
      setJurusan('');
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
            {selectedFile ? (
              <p>{selectedFile.name}</p>
            ) : isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>Drag 'n' drop file Excel di sini, atau klik untuk pilih file</p>
            )}
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
        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Upload Data Program Studi
          </Typography>
          <form onSubmit={handleProdiUpload}>
            <input type="file" accept=".xlsx" onChange={(e) => setProdiFile(e.target.files[0])} required />
            <FormControl sx={{ mx: 2, minWidth: 120 }}>
              <InputLabel>Tahun</InputLabel>
              <Select
                value={prodiYear}
                label="Tahun"
                onChange={(e) => setProdiYear(e.target.value)}
                required
              >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2026}>2026</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained">Upload</Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;

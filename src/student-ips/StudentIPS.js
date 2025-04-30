// StudentIPS.js
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Box, Typography, Paper, InputBase, Select, MenuItem, FormControl, TableContainer } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';

const StudentIPS = () => {
  const location = useLocation();
  const { user } = location.state || {};

  const [selectedSubject, setSelectedSubject] = useState('');
  const [studentData, setStudentData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const handleSubjectClick = async (subject) => {
    if (!user) return;
    const tableName = (user.asal_sekolah + '_' + user.jurusan).toLowerCase().replace(/\s+/g, '_');

    let endpoint = 'http://localhost:5000/api/get-subject-data';
    let body = { tableName, subject };

    if (subject === 'All') {
      endpoint = 'http://localhost:5000/api/get-all-subjects-data-ips';
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      setStudentData(result.data);
      setSelectedSubject(subject);
      setCurrentPage(0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  let rankedData = [];
  if (selectedSubject === 'All') {
    rankedData = [...studentData]
      .map(item => ({
        ...item,
        rata_rata: (
          (Number(item.ekonomi) + Number(item.geografi) + Number(item.sejarah) + Number(item.sosiologi)) / 4
        ).toFixed(2),
      }))
      .sort((a, b) => b.rata_rata - a.rata_rata)
      .map((item, index) => ({
        ...item,
        ranking: index + 1,
      }));
  } else {
    rankedData = [...studentData]
      .sort((a, b) => b[selectedSubject] - a[selectedSubject])
      .map((item, index) => ({
        ...item,
        ranking: index + 1,
      }));
  }

  const filteredData = rankedData.filter(item =>
    item.nama_siswa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData
    .slice(currentPage * pageSize, currentPage * pageSize + pageSize)
    .map((item, index) => {
      const commonFields = {
        id: currentPage * pageSize + index + 1,
        ranking: item.ranking,
        nama_siswa: item.nama_siswa,
      };

      if (selectedSubject === 'All') {
        return {
          ...commonFields,
          ekonomi: item.ekonomi,
          geografi: item.geografi,
          sejarah: item.sejarah,
          sosiologi: item.sosiologi,
          rata_rata: item.rata_rata,
        };
      } else {
        return {
          ...commonFields,
          nilai: Number(item[selectedSubject]).toFixed(2),
        };
      }
    });

  const columns = selectedSubject === 'All'
    ? [
        { field: 'ranking', headerName: 'Ranking', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'nama_siswa', headerName: 'Nama Lengkap', flex: 1 },
        { field: 'ekonomi', headerName: 'Nilai Ekonomi', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'geografi', headerName: 'Nilai Geografi', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'sejarah', headerName: 'Nilai Sejarah', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'sosiologi', headerName: 'Nilai Sosiologi', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'rata_rata', headerName: 'Rata-rata', width: 100, headerAlign: 'center', align: 'center' },
      ]
    : [
        { field: 'ranking', headerName: 'Ranking', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'nama_siswa', headerName: 'Nama Lengkap', flex: 1 },
        { field: 'nilai', headerName: 'Nilai', width: 100, headerAlign: 'center', align: 'center' },
      ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onSubjectClick={handleSubjectClick} />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3, mt: 8, bgcolor: '#f0f0f0', minHeight: '100vh' }}>
          <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 1 }}>
            <FontAwesomeIcon icon={faGraduationCap} style={{ marginRight: 8 }} />
            Selamat Datang di Dashboard IPS
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Silakan pilih mata pelajaran atau opsi studi di sidebar kiri.
          </Typography>

          {selectedSubject && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                <FontAwesomeIcon icon={faChartBar} style={{ marginRight: 8 }} />
                {selectedSubject === 'All' ? 'Rangking Nilai Rata-rata Seluruh Mata Pelajaran' : `Rangking Nilai Mata Pelajaran ${selectedSubject}`}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControl sx={{ minWidth: 80, mr: 1 }} size="small">
                    <Select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(e.target.value);
                        setCurrentPage(0);
                      }}                      
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={200}>200</MenuItem>
                      <MenuItem value={300}>300</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2">entries per page</Typography>
                </Box>

                <InputBase
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(0);
                  }}                  
                  sx={{ border: '1px solid #ccc', px: 2, borderRadius: 2, width: 200 }}
                />
              </Box>
              <TableContainer component={Paper} elevation={3}>
              <DataGrid
                autoHeight
                rows={paginatedData}
                columns={columns}
                pageSize={pageSize}
                hideFooter
                disableColumnMenu
              />
              <Box sx={{
                mt: 2,
                px: 2,
                py: 1,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <Typography variant="body2" sx={{ mb: { xs: 1, sm: 0 } }}>
                  Showing {filteredData.length === 0 ? 0 : currentPage * pageSize + 1}
                  {" "}to{" "}
                  {Math.min((currentPage + 1) * pageSize, filteredData.length)} of {filteredData.length} entries
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    sx={{
                      mr: 1,
                      bgcolor: '#64b5f6',
                      color: 'white',
                      '&:hover': { bgcolor: '#42a5f5', transform: 'scale(1.05)' },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.ceil(filteredData.length / pageSize) }).map((_, index) => (
                    <Button
                      key={index}
                      variant={index === currentPage ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setCurrentPage(index)}
                      sx={{
                        mx: 0.5,
                        minWidth: 36,
                        bgcolor: index === currentPage ? '#64b5f6' : 'transparent',
                        color: index === currentPage ? 'white' : '#64b5f6',
                        borderColor: '#64b5f6',
                        '&:hover': {
                          bgcolor: index === currentPage ? '#42a5f5' : '#e3f2fd',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {index + 1}
                    </Button>
                  ))}

                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() =>
                      setCurrentPage(prev =>
                        (prev + 1 < Math.ceil(filteredData.length / pageSize) ? prev + 1 : prev)
                      )
                    }
                    disabled={(currentPage + 1) * pageSize >= filteredData.length}
                    sx={{
                      ml: 1,
                      bgcolor: '#64b5f6',
                      color: 'white',
                      '&:hover': { bgcolor: '#42a5f5', transform: 'scale(1.05)' },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentIPS;
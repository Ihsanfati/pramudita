// ProgramStudiList.js (refactored)
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Box, Typography, Paper, InputBase, Select, MenuItem, FormControl, TableContainer } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';

const ProgramStudiList = () => {
  const location = useLocation();
  const { user, subject } = location.state || {};
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [programStudiData, setProgramStudiData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const handleSubjectClick = async (subject, menuType) => {
    setSelectedSubject(subject);

    if (!user) return;
    const tableName = (user.asal_sekolah + '_' + user.jurusan).toLowerCase().replace(/\s+/g, '_');

    if (menuType === 'prodi') {
      try {
        const res = await fetch(`http://localhost:5000/api/program-studi/${subject}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await res.json();
        const dataArray = result.data || [];
        setProgramStudiData(dataArray);
        setCurrentPage(0);
      } catch (error) {
        console.error('Failed to fetch program studi data:', error);
      }
    } else if (menuType === 'rank' || menuType === 'All') {
      navigate('/student-ips', { state: { user, subject } });
    }
  };

  const filteredData = programStudiData.filter(item =>
    item.Program_Studi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData
    .slice(currentPage * pageSize, currentPage * pageSize + pageSize)
    .map((item, index) => ({
      id: currentPage * pageSize + index + 1,
      ...item
    }));

  const columns = [
    { field: 'Program_Studi', headerName: 'Program Studi', flex: 1 },
    { field: 'Universitas', headerName: 'Universitas', flex: 1 },
    { field: 'Jenjang', headerName: 'Jenjang', width: 100 },
    { field: 'Daya_Tampung', headerName: 'Daya Tampung', width: 120 },
    { field: 'Peminat', headerName: 'Peminat', width: 120 },
    { field: 'Jenis_Portofolio', headerName: 'Jenis Portofolio', width: 150 },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onSubjectClick={handleSubjectClick} />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3, mt: 8, bgcolor: '#f0f0f0', minHeight: '100vh' }}>
          <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
            Opsi Program Studi untuk Mata Pelajaran: {selectedSubject || 'Pilih dari Sidebar'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <FormControl sx={{ minWidth: 80 }} size="small">
              <Select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setCurrentPage(0);
                }}
              >
                {[10, 50, 100, 200, 300].map(size => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <InputBase
              placeholder="Search Program Studi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0);
              }}
              sx={{ border: '1px solid #ccc', px: 2, borderRadius: 2, width: 250 }}
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

            <Box sx={{ mt: 2, px: 2, py: 1, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Typography variant="body2">
                Showing {filteredData.length === 0 ? 0 : currentPage * pageSize + 1}
                {" "}to{" "}
                {Math.min((currentPage + 1) * pageSize, filteredData.length)} of {filteredData.length} entries
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  sx={{ mr: 1, bgcolor: '#64b5f6', '&:hover': { bgcolor: '#42a5f5' } }}
                >
                  Previous
                </Button>

                {Array.from({ length: Math.ceil(filteredData.length / pageSize) }).map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentPage ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setCurrentPage(index)}
                    sx={{ mx: 0.5, minWidth: 36 }}
                  >
                    {index + 1}
                  </Button>
                ))}

                <Button
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => setCurrentPage(prev =>
                    (prev + 1 < Math.ceil(filteredData.length / pageSize) ? prev + 1 : prev)
                  )}
                  disabled={(currentPage + 1) * pageSize >= filteredData.length}
                  sx={{ ml: 1, bgcolor: '#64b5f6', '&:hover': { bgcolor: '#42a5f5' } }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgramStudiList;
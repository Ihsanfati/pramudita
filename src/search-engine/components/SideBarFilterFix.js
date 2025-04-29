import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function SideBarFilter({ open, onClose, onApplyFilters, currentFilters }) {
  const [subjects, setSubjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [careers, setCareers] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [subject, setSubject] = useState(currentFilters?.subject || '');
  const [location, setLocation] = useState(currentFilters?.location || '');
  const [career, setCareer] = useState(currentFilters?.career || '');
  const [salary, setSalary] = useState(currentFilters?.salary || '');

  useEffect(() => {
    fetch('http://localhost:5000/api/subjects').then(res => res.json()).then(setSubjects);
    fetch('http://localhost:5000/api/locations').then(res => res.json()).then(setLocations);
    fetch('http://localhost:5000/api/careers').then(res => res.json()).then(setCareers);
    fetch('http://localhost:5000/api/salaries').then(res => res.json()).then(setSalaries);
  }, []);

  const handleApply = () => {
    onApplyFilters({ subject, location, career, salary });
    onClose();
  };

  const clearAll = () => {
    setSubject('');
    setLocation('');
    setCareer('');
    setSalary('');
    onApplyFilters({ subject: '', location: '', career: '', salary: '' });
    onClose();
  };

  return (
    <>
      <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer - 1, backdropFilter: 'blur(3px)' }} />

      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '25%',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filters (4)</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Filter Dropdowns */}
        <Box flexGrow={1}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2">Subject</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Pilih Subject</InputLabel>
                <Select value={subject} onChange={(e) => setSubject(e.target.value)} label="Pilih Subject">
                  {subjects.map((subj, idx) => (
                    <MenuItem key={idx} value={subj}>{subj}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2">Location</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Pilih Lokasi</InputLabel>
                <Select value={location} onChange={(e) => setLocation(e.target.value)} label="Pilih Lokasi">
                  {locations.map((loc, idx) => (
                    <MenuItem key={idx} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2">Careers</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Pilih Karir</InputLabel>
                <Select value={career} onChange={(e) => setCareer(e.target.value)} label="Pilih Karir">
                  {careers.map((car, idx) => (
                    <MenuItem key={idx} value={car}>{car}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2">Salary Range</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Pilih Gaji</InputLabel>
                <Select value={salary} onChange={(e) => setSalary(e.target.value)} label="Pilih Gaji">
                  {salaries.map((sal, idx) => (
                    <MenuItem key={idx} value={sal}>{sal}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>

        {/* Bottom Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button onClick={clearAll} variant="text" color="secondary">Clear All</Button>
          <Button onClick={handleApply} variant="contained" color="primary">Apply Filters</Button>
        </Box>
      </Drawer>
    </>
  );
}

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
  Backdrop,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function SideBarFilter({ onApplyFilters }) {
  const [subjects, setSubjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [careers, setCareers] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [filters, setFilters] = useState({
    subject: '',
    location: '',
    career: '',
    salary: '',
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/subjects')
      .then(res => res.json())
      .then(setSubjects);

    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(setLocations);

    fetch('http://localhost:5000/api/careers')
      .then(res => res.json())
      .then(setCareers);

    fetch('http://localhost:5000/api/salaries')
      .then(res => res.json())
      .then(setSalaries);
  }, []);


  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const clearAll = () => {
    setSubject('');
    setLocation('');
    setCareer('');
    setSalary('');
    onApply({ subject: '', location: '', career: '', salary: '' });
    onClose();
  };

  return (
    <>
      <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer - 1, backdropFilter: 'blur(3px)' }} />
      <Drawer
        anchor="left"
        open={open}
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filters (4)</Typography>
          <IconButton onClick={clearAll}><CloseIcon /></IconButton>
        </Box>

        <Box flexGrow={1}>
          <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select name="subject" value={filters.subject} onChange={handleChange}>
                  <MenuItem value="">All</MenuItem>
                  {subjects.map((subj, idx) => (
                    <MenuItem key={idx} value={subj}>{subj}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select name="location" value={filters.location} onChange={handleChange}>
                  <MenuItem value="">All</MenuItem>
                  {locations.map((loc, idx) => (
                    <MenuItem key={idx} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Career</InputLabel>
                <Select name="career" value={filters.career} onChange={handleChange}>
                  <MenuItem value="">All</MenuItem>
                  {careers.map((car, idx) => (
                    <MenuItem key={idx} value={car}>{car}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Salary</InputLabel>
                <Select name="salary" value={filters.salary} onChange={handleChange}>
                  <MenuItem value="">All</MenuItem>
                  {salaries.map((sal, idx) => (
                    <MenuItem key={idx} value={sal}>{sal}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          </Stack>
        </Box>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button 
            onClick={clearAll} 
            variant="text" 
            color="secondary">
              Clear All
          </Button>
          <Box mt={2} textAlign="center">
          <Button 
            variant="contained" 
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </Box>
        </Box>
      </Drawer>
    </>
  );
}
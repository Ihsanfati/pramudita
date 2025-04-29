import React from 'react';
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

const dummySubjects = ['Teknik Informatika', 'Teknik Elektro', 'Kedokteran', 'Psikologi', 'Hukum'];
const dummyLocations = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan'];
const dummyCareers = ['Software Engineer', 'Data Analyst', 'Dokter Umum', 'Psikolog', 'Pengacara'];
const dummySalaries = ['<5jt', '5-10jt', '10-15jt', '15-20jt', '>20jt'];

export default function SideBarFilter({ open, onClose, onApply, currentFilters }) {
  const [subject, setSubject] = React.useState(currentFilters?.subject || '');
  const [location, setLocation] = React.useState(currentFilters?.location || '');
  const [career, setCareer] = React.useState(currentFilters?.career || '');
  const [salary, setSalary] = React.useState(currentFilters?.salary || '');

  const handleApply = () => {
    onApply({ subject, location, career, salary });
  };

  const clearAll = () => {
    setSubject('');
    setLocation('');
    setCareer('');
    setSalary('');
    onClose(); // optional close on clear
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
        {/* Top Filter Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filters (4)</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Dropdown Form */}
        <Box flexGrow={1}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2">Subject</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Pilih Subject</InputLabel>
                <Select value={subject} onChange={(e) => setSubject(e.target.value)} label="Pilih Subject">
                  {dummySubjects.map((subj, idx) => (
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
                  {dummyLocations.map((loc, idx) => (
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
                  {dummyCareers.map((car, idx) => (
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
                  {dummySalaries.map((sal, idx) => (
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
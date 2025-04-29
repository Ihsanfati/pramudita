import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh', // Menjamin tinggi minimal 100vh
  padding: theme.spacing(2),
  overflowY: 'auto', // Menambahkan scroll vertical jika konten lebih tinggi dari layar
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUpBK(props) {
  const [namaLengkapError, setNamaLengkapError] = React.useState(false);
  const [namaLengkapErrorMessage, setNamaLengkapErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [asalSekolahError, setAsalSekolahError] = React.useState(false);
  const [asalSekolahErrorMessage, setAsalSekolahErrorMessage] = React.useState('');
  const [stateAsalSekolah, setAsalSekolah] = React.useState('');

  const navigate = useNavigate();

  const validateInputs = () => {
    const namaLengkap = document.getElementById('nama-lengkap');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
  
    let isValid = true;
  
    // Validasi nama lengkap
    if (!namaLengkap.value || namaLengkap.value.trim().length === 0) {
      setNamaLengkapError(true);
      setNamaLengkapErrorMessage('Nama lengkap tidak boleh kosong.');
      isValid = false;
    } else {
      setNamaLengkapError(false);
      setNamaLengkapErrorMessage('');
    }
  
    // Validasi nama pengguna (name)
    if (!name.value || name.value.trim().length === 0) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }
  
    // Validasi email
    if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
  
    // Validasi password
    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 8 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
  
    // Validasi asal sekolah
    if (!stateAsalSekolah || stateAsalSekolah.trim().length === 0) {
      setAsalSekolahError(true);
      setAsalSekolahErrorMessage('Asal sekolah tidak boleh kosong.');
      isValid = false;
    } else {
      setAsalSekolahError(false);
      setAsalSekolahErrorMessage('');
    }
    return isValid;
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateInputs()) return;
  
    const data = new FormData(event.currentTarget);
    const userData = {
      namaLengkap: data.get('nama-lengkap'),
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      asalSekolah: stateAsalSekolah
    };
  
    try {
      const res = await fetch('http://localhost:5000/api/signupbk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const result = await res.json();
      if (res.ok) {
        alert('Account created successfully!');
        navigate('/sign-in');
      } else {
        alert(result.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred while signing up.');
    }
  };  

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="nama-lengkap">Full name</FormLabel>
              <TextField
                autoComplete="nama-lengkap"
                name="nama-lengkap"
                required
                fullWidth
                id="nama-lengkap"
                placeholder="Steve Jobs"
                error={namaLengkapError}
                helperText={namaLengkapErrorMessage}
                color={namaLengkapError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">Username</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="stevejobs"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl fullWidth required error={asalSekolahError}>
              <FormLabel htmlFor="asal-sekolah">Asal Sekolah</FormLabel>
              <TextField
                select
                id="asal-sekolah"
                name="asal-sekolah"
                autoComplete="asal-sekolah"
                onChange={(e) => setAsalSekolah(e.target.value)}
                helperText={asalSekolahErrorMessage}
                color={asalSekolahError ? 'error' : 'primary'}
              >
                <MenuItem value="SMA N 5 Yogyakarta">SMA N 5 Yogyakarta</MenuItem>
                <MenuItem value="SMK N 1 Kalasan">SMK N 1 Kalasan</MenuItem>
                <MenuItem value="SMA IT Abu Bakar Yogyakarta">SMA IT Abu Bakar Yogyakarta</MenuItem>
                <MenuItem value="SMA Muhammadiyah 1 Yogyakarta">SMA Muhammadiyah 1 Yogyakarta</MenuItem>
                <MenuItem value="SMA IT Abu Bakar">SMA IT Abu Bakar</MenuItem>
              </TextField>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography 
              sx={{ textAlign: 'center' }}
              component={RouterLink}
              to="/sign-in"
            >
              Already have an account? Sign in
            </Typography>
            <Typography 
              sx={{ textAlign: 'center' }}
              component={RouterLink}
              to="/sign-up"
            >
              Sign-up for Students
            </Typography>
            <Divider>
              <Typography 
                sx={{ textAlign: 'center' }}
                component={RouterLink}
                to="/"
              >
                Back to main page
              </Typography>
            </Divider>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
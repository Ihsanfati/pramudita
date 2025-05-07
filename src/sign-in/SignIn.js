import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import ForgotPassword from './components/ForgotPassword';
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
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [jurusanLoginError, setJurusanLoginError] = React.useState(false);
  const [jurusanLoginErrorMessage, setJurusanLoginErrorMessage] = React.useState('');
  const [stateJurusanLogin, setJurusanLogin] = React.useState('');
  const [asalSekolahError, setAsalSekolahError] = React.useState(false);
  const [asalSekolahErrorMessage, setAsalSekolahErrorMessage] = React.useState('');
  const [stateAsalSekolah, setAsalSekolah] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 8 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!stateAsalSekolah || stateAsalSekolah.trim().length === 0) {
      setAsalSekolahError(true);
      setAsalSekolahErrorMessage('Asal sekolah tidak boleh kosong.');
      isValid = false;
    } else {
      setAsalSekolahError(false);
      setAsalSekolahErrorMessage('');
    }

    if (!stateJurusanLogin || stateJurusanLogin.trim().length === 0) {
      setJurusanLoginError(true);
      setJurusanLoginErrorMessage('Jurusan tidak boleh kosong.');
      isValid = false;
    } else {
      setJurusanLoginError(false);
      setJurusanLoginErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // cegah reload default browser
  
    const isValid = validateInputs();
    if (!isValid) {
      return; // hentikan jika input tidak valid
    }
  
    const data = new FormData(event.currentTarget);
    const userData = {
      email: data.get('email'),
      password: data.get('password'),
      jurusanLogin: stateJurusanLogin
    };
  
    try {
      const res = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const result = await res.json();
      const user = result.user;
      sessionStorage.setItem('user', JSON.stringify(user)); // SIMPAN DATA USER
      alert(JSON.stringify(user, null, 2));
  
      //if (res.ok) {
        //alert('Account signin successfully!');
        // Logika pengalihan berdasarkan username dan jurusan
        //if (user.username === 'admin') {
          //navigate('/admin');
        //} else if (user.jurusan && user.jurusan.toUpperCase() === 'BK') {
          //navigate('/search-engine');
        //} else {
          //navigate('/student');
        //}
        //}
        // Logika pengalihan berdasarkan username dan jurusan
      switch (true) {
        case user.username === 'admin':
          navigate('/admin');
          break;
        case user.jurusan && user.jurusan.toUpperCase() === 'BK':
          navigate('/search-engine');
          break;
          case user.jurusan && user.jurusan.toUpperCase() === 'IPS':
            navigate('/student-ips', { state: { user } });
            break;
          case user.jurusan && user.jurusan.toUpperCase() === 'IPA':
            navigate('/student-ipa', { state: { user } });
            break;          
      } 
    } catch (error) {
      console.error('Unexpected error during sign-in:', error);
      alert('Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl fullWidth required error={jurusanLoginError}>
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
                <MenuItem value="SMA N 3 Yogyakarta">SMA N 3 Yogyakarta</MenuItem>
                <MenuItem value="SMA N 4 Yogyakarta">SMA N 4 Yogyakarta</MenuItem>
                <MenuItem value="SMA N 5 Yogyakarta">SMA N 5 Yogyakarta</MenuItem>
              </TextField>
            </FormControl>
            <FormControl fullWidth required error={jurusanLoginError}>
              <FormLabel htmlFor="jurusan-login">Jurusan</FormLabel>
              <TextField
                select
                id="jurusan-login"
                name="jurusan-login"
                autoComplete="jurusan-login"
                onChange={(e) => setJurusanLogin(e.target.value)}
                helperText={jurusanLoginErrorMessage}
                color={jurusanLoginError ? 'error' : 'primary'}
              >
                <MenuItem value="ipa">IPA</MenuItem>
                <MenuItem value="ips">IPS</MenuItem>
                <MenuItem value="bk">BK</MenuItem>
              </TextField>
            </FormControl>
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography 
              sx={{ textAlign: 'center' }}
              component={RouterLink}
              to="/sign-up"
            >
              Don't have an account? Sign up
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
      </SignInContainer>
    </AppTheme>
  );
}

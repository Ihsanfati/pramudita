import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../shared-theme/AppTheme';
import SignIn from '../sign-in/SignIn';
import SignUp from '../sign-up/SignUp';
import SignUpBK from '../sign-up/SignUpBK';
import SearchEngine from '../search-engine/SearchEngine'
import StudentIPS from '../student-ips/StudentIPS';
import StudentIPA from '../student-ipa/StudentIPA';
import Admin from '../admin/Admin'
import ProgramStudiList from "../student-ips/program-studi-list-ips/ProgramStudiList";
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import {
  Routes,
  Route,
} from 'react-router-dom';

function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!authenticated) return <Navigate to="/" replace />;

  return children;
}

export default function Main(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up-bk" element={<SignUpBK/>} />
          <Route path="/search-engine" element={<RequireAuth><SearchEngine /></RequireAuth>} />
          <Route path="/student-ips" element={<RequireAuth><StudentIPS /></RequireAuth>} />
          <Route path="/student-ipa" element={<RequireAuth><StudentIPA /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/student-ips/program-studi-list-ips" element={<RequireAuth><ProgramStudiList /></RequireAuth>} />
        </Routes>
    </AppTheme>
  );
}
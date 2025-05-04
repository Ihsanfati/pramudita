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

import {
  Routes,
  Route,
} from 'react-router-dom';

export default function Main(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up-bk" element={<SignUpBK/>} />
          <Route path="/search-engine" element={<SearchEngine />} />
          <Route path="/student-ips" element={<StudentIPS />} />
          <Route path="/student-ipa" element={<StudentIPA />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/student-ips/program-studi-list-ips" element={<ProgramStudiList />} />
        </Routes>
    </AppTheme>
  );
}
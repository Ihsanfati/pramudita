import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import SignIn from '../sign-in/SignIn';
import SignUp from '../sign-up/SignUp';
import SignUpBK from '../sign-up/SignUpBK';
import SearchEngine from '../search-engine/SearchEngine'
import { useLocation } from 'react-router-dom';
import FadeInSection from '../search-engine/components/FadeInSection';
import StudentIPS from '../student-ips/StudentIPS';
import StudentIPA from '../student-ipa/StudentIPA';
import Admin from '../admin/Admin'

import {
  Routes,
  Route,
} from 'react-router-dom';

export default function MarketingPage(props) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up' || location.pathname === '/student-ips'
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {!isAuthPage && <AppAppBar />}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Divider />
                <FadeInSection>
                  <Hero />
                </FadeInSection>
                <Divider />
                <FadeInSection>
                  <Features />
                </FadeInSection>
                <FadeInSection>
                  <Footer />
                </FadeInSection>
              </>
            }
          />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up-bk" element={<SignUpBK/>} />
          <Route path="/search-engine" element={<SearchEngine />} />
          <Route path="/student-ips" element={<StudentIPS />} />
          <Route path="/student-ipa" element={<StudentIPA />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
    </AppTheme>
  );
}
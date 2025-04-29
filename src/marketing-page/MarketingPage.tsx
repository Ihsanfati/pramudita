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
import { useLocation } from 'react-router-dom';

import {
  Routes,
  Route,
} from 'react-router-dom';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up';
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {!isAuthPage && <AppAppBar />}
        <AppAppBar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Divider />
                <Hero />
                <Divider />
                <Features />
                <Footer />
              </>
            }
          />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
    </AppTheme>
  );
}
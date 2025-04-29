import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import SearchEngineBar from './components/SearchEngineBar';
import SearchEngineHeroNew from './components/SearchEngineHeroNew';
import PsychologyTest from './components/PsychologyTest';
import Footer from '../marketing-page/components/Footer';
import FadeInSection from './components/FadeInSection'; // <- import komponen animasi

export default function SearchEngine(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SearchEngineBar />
      <Divider />

      <FadeInSection>
        <SearchEngineHeroNew />
      </FadeInSection>

      <Divider />

      <FadeInSection>
        <PsychologyTest />
      </FadeInSection>

      <FadeInSection>
        <Footer />
      </FadeInSection>
    </AppTheme>
  );
}
//import * as React from 'react';
//import * as ReactDOM from 'react-dom/client';
//import CssBaseline from '@mui/material/CssBaseline';
//import { ThemeProvider } from '@mui/material/styles';
//import App from './App';
//import theme from './theme';

//const rootElement = document.getElementById('root');
//const root = ReactDOM.createRoot(rootElement!);

//root.render(
//  <ThemeProvider theme={theme}>
//    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
//    <CssBaseline />
//    <App />
//  </ThemeProvider>,
//);

//import * as React from 'react';
//import * as ReactDOM from 'react-dom/client';
//import { StyledEngineProvider } from '@mui/material/styles';
//import App from './marketing-page/MarketingPage';

//ReactDOM.createRoot(document.querySelector("#root")!).render(
  //<React.StrictMode>
    //<StyledEngineProvider injectFirst>
      //<App />
    //</StyledEngineProvider>
  //</React.StrictMode>
//);

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import App from './marketing-page/MarketingPage';

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StyledEngineProvider>
  </React.StrictMode>
);
import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ResponsiveAppBar from './ResponsiveAppBar';
import ContentGrid from './ContentGrid';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const baseURL = window.location.href;
console.log('baseURL: '+baseURL)

function App() {

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <main>
          <ResponsiveAppBar></ResponsiveAppBar>
          <ContentGrid></ContentGrid>
        </main>
      </ThemeProvider>
    </div>
  );

}

export default App;

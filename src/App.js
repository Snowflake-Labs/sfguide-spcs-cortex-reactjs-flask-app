import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Collapse } from 'react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { BeatLoader } from 'react-spinners';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ResponsiveAppBar from './ResponsiveAppBar';
import FixedBottomNavigation from './FixedBottomNavigation';
import GmailTreeView from './Inbox';
import ContentGrid from './ContentGrid';
import Container from '@mui/material/Container';

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

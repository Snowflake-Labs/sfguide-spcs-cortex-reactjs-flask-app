import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import GmailTreeView from './GmailTreeView';
import FixedBottomNavigation from './FixedBottomNavigation';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function VariableWidthGrid() {
  return (
    <div sx={{ flexGrow: 1 }}>
      <Grid container spacing={.0}>
        <Grid xs={3}>
          <Item>
            <GmailTreeView></GmailTreeView>
          </Item>
        </Grid>
        <Grid xs={6}>
          <Item><FixedBottomNavigation></FixedBottomNavigation></Item>
        </Grid>
        <Grid xs={3}>
          <Item>xs=3</Item>
        </Grid>
      </Grid>
    </div>
  );
}

export default VariableWidthGrid;
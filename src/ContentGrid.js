import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import GmailTreeView from './Inbox';
import FixedBottomNavigation from './FixedBottomNavigation';
import CustomerCard from './CustomerCard';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chat from './Chat';
import TabPanel from './TabPanel';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function ContentGrid() {
  return (
    <div>
      <Grid container spacing={.0}>
        <Grid xs sx={{ marginRight: '1px' }}>
          <Item sx={{ height: '100%', paddingLeft: '30px' }}>
            <Typography variant="h5" paragraph sx={{ textAlign: 'left' }}>
              Inbox
            </Typography>
            <GmailTreeView></GmailTreeView>
          </Item>
        </Grid>
        <Grid xs={6} sx={{ marginRight: '1px' }}>
          <Item sx={{ height: '100%' }}>
            <TabPanel></TabPanel>
          </Item>
        </Grid>
        <Grid xs>
          <Item sx={{ height: '100%', paddingLeft: '40px' }}>
            <CustomerCard></CustomerCard>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
}

export default ContentGrid;
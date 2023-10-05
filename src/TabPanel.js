import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabList from '@mui/joy/TabList';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Stack from '@mui/material/Stack';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Conversations"
        sx={{ borderRight: 1, borderColor: 'divider'}}
      >
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Hi Emily! It was great chatting with you the other day..."  sx={{textAlign: 'left'}}></Tab>
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Hi! How do you decide on the pricing? I mean what is your definition of people?..." {...a11yProps(1)} sx={{textAlign: 'left'}}/>
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Hi there! Can you help me figure out how to send a message based on an event?..." {...a11yProps(2)} sx={{textAlign: 'left'}}/>
      </Tabs>
      <TabPanel value={value} index={0}>
        <Typography variant="h5" paragraph sx={{textAlign: 'left', width: '450px'}}>
            Dash 
        </Typography>
        <Typography color="text.secondary" paragraph sx={{textAlign: 'left', width: '450px'}}>
            Thank you for submitting to speak at Data Council Austin 2024 If your talk is selected by our conference 
            committee someone from our team will get back to you. (Estimated talk confirmation date: by December 31, 2023)
        </Typography>
        <Typography color="text.secondary" paragraph sx={{textAlign: 'left', width: '450px'}}>
            Talk Title: Integrating Generative AI with Snowflake + OpenAI
       </Typography>
        <Typography color="text.secondary" paragraph sx={{textAlign: 'left', width: '450px'}}>
            Talk Abstract: Interact with OpenAI's GPT-4 model from inside Snowflake to generate SQL queries, classify sentiments on a given string, and ask general questions to get a knowledge base responses. Here's a brief overview of three different implementations we will review: - Use External Access to securely connect to the OpenAI API from Snowpark - Use AWS API Gateway as a proxy for communication between Snowflake and OpenAI - Wrap the OpenAI API in a AWS Lambda function for use in Snowflake We will also look at creating a Streamlit application in Snowflake that uses one of the implementations for interacting with OpenAI.
        </Typography>
        <Typography color="text.secondary" sx={{textAlign: 'left', width: '450px'}}>
            Please keep an eye on https://www.datacouncil.ai/austin for any updates and changes to our programming, tickets and scheduling. If you have any questions, concerns or special accommodations requests in relation to speaking at Data Council then please reach out to community@datacouncil.ai.
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1} sx={{textAlign: 'left'}}>
        <Typography variant="h5" paragraph sx={{textAlign: 'left', width: '450px'}}>
            Emily
        </Typography>
        <Typography color="text.secondary" paragraph sx={{textAlign: 'left', width: '450px'}}>
            Hi! How do you decide on the pricing? I mean what is your definition of people?
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={2} sx={{textAlign: 'left'}}>
        <Typography variant="h5" paragraph sx={{textAlign: 'left', width: '450px'}}>
            Julian
        </Typography>
        <Typography color="text.secondary" paragraph sx={{textAlign: 'left', width: '450px'}}>
            Hi there! Can you help me figure out how to send a message based on an event?
        </Typography>
      </TabPanel>
    </Box>
  );
}

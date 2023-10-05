import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabList from '@mui/joy/TabList';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import Button from '@mui/material/Button';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EmailIcon from '@mui/icons-material/Email';
import CustomerCard from './CustomerCard';
import { Skeleton } from '@mui/material';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const baseURL = window.location.href;
console.log('baseURL: '+baseURL)

function TabPanel(props) {
  const { children, value, index, ...other } = props;

    // Load data from the backend
    // useEffect(() => {
    // fetch(baseURL + 'cities')
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     const history = data.map(city => ({
    //         cityName: city.name,
    //         coords: city.coordinates
    //     }));
    //     console.log(history);
    // })
    // .catch(error => {
    //     console.log(error);
    // });
    // }, []); // Empty dependency array means this useEffect runs once when the component mounts

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

function CallerNameTypography(props){
    const { children, value, index, ...other } = props;
    return (
        <Typography variant="h5" sx={{textAlign: 'left', width: '450px'}}>{children}</Typography>
      );    
}

function CallerTypography(props){
    const { children, value, index, ...other } = props;
    return (
        <Typography color="lightblue" paragraph sx={{textAlign: 'justify', width: '550px'}}>{children}</Typography>
      );    
}

function RepTypography(props){
    const { children, value, index, ...other } = props;
    return (
        <Typography color="white" paragraph sx={{textAlign: 'justify', width: '550px', fontStyle: 'italic'}}>{children}</Typography>
      );    
}

function TranscriptTypography(props){
    const {children, value, index, ...other } = props;
    return (
        <div>
            {children ? 
                ( 
                    <div>
                        <Divider sx={{paddingTop: '40px'}}><Chip label="Call Summary"/></Divider>
                        <Typography color="grey" paragraph sx={{paddingTop: '20px', textAlign: 'justify', width: '550px'}}>
                            {children}
                        </Typography>
                    </div>
                ) : 
                ('')
            }
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

function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState(false);
//   const [summary, setSummary] = React.useState('Sure, here is a summary of the call transcript in under 100 words: A customer, Jane, calls Snow49 to express her satisfaction with a winter jacket she recently purchased. She praises the jacket is warmth, lightness, and well-designed pockets. The Snow49 representative thanks Jane for her feedback and expresses appreciation for her satisfaction.');
  const [summary, setSummary] = React.useState('')
  const transcripts = [
    {id: 1, customer: 'Jane Doe', content: 'Customer: Hello, this is Jane. I recently purchased a Snow49 winter jacket and I wanted to let you know how thrilled I am with it.\nSnow49 Representative: Hello Jane! Thank you for reaching out. We are so glad to hear that. What in particular did you like about the jacket?\nCustomer: It is incredibly warm, yet light. I wore it on a trip to the mountains and was amazed at how comfortable I felt. And the pockets are so well-designed!\nSnow49 Representative: We always aim for high quality. Your feedback is much appreciated, Jane. Enjoy your adventures in the mountains!\nCustomer: I certainly will. Thank you and kudos to the Snow49 team.'},
    {id: 2, customer: 'Lisa Doe', content: 'Customer: Hey, I am Lisa. I ordered a pair of Snow49 gloves but they arrived with a tear on one of them. I am quite disappointed.\nSnow49 Representative: Oh, I am terribly sorry to hear that, Lisa. This is not the experience we want for our customers. Let us get this sorted right away. Would you like a replacement or a refund?\nCustomer: I would prefer a replacement. I really liked the gloves, just need one without a defect.\nSnow49 Representative: Absolutely, Lisa. We will send out a replacement ASAP. Once again, I apologize for the inconvenience and thank you for bringing it to our attention.\nCustomer: Thanks for understanding. I hope the next pair will be perfect.'},
    {id: 3, customer: 'Alex Doe', content: 'Customer: Hi, I am Alex. I just wanted to check the warranty period for the Snow49 thermal wear?\nSnow49 Representative: Hello, Alex! All Snow49 thermal wear comes with a one-year warranty from the date of purchase. This covers any manufacturing defects. Do you have a specific issue or just inquiring?\nCustomer: No specific issue. I was just checking before making a purchase. Thanks for the info.\nSnow49 Representative: You are welcome, Alex. If you have any other questions, feel free to ask. Have a great day!'}
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getCallSummary = async (transcript) => {
    try {
      setLoading(true);
      const response = await axios.post(baseURL + 'llmpfs', {
        transcript: transcript
      });
      const llmpfs_response = response.data[0].llmpfs_response;
      // Do something with the summary here, like updating your component state
      setLoading(false);
      return llmpfs_response;
    } catch (error) {
      console.error('Error fetching call summary', error);
      return null;
    } 
  };  

  function TranscriptCTA(props){
    const {children, value, index, ...other } = props;
    const transcript = transcripts[children].content;
    // console.log(transcripts[children].content);
    return (
        <div>
            <Stack spacing={2} direction="row" sx={{paddingLeft: '12%', paddingTop: '20px', alignContent: 'center'}}>
                <Button variant="contained" startIcon={<ContactPhoneIcon/>}>Call</Button>
                <Button variant="contained" startIcon={<EmailIcon/>}>Email</Button> 
                <Button variant="contained" startIcon={<SummarizeIcon/>}
                onClick={ async () => {
                    const callSummary = await getCallSummary(transcript);
                    if (callSummary) {
                        // console.log(callSummary)
                        transcripts[children].summary = callSummary;
                        console.log(transcripts[children].summary);
                        setSummary(callSummary)
                    } else {
                        setSummary("Oops, I did it again. Why don't you try again? Thanks :p")
                    }
                }}
                >Call Summary</Button>
            </Stack>
            {
                loading ? (
                    <div>
                        <Skeleton animation="wave" sx={{marginTop: '50px', paddingTop: '10px', alignContent: 'center', height: '100%'}} />
                        <Skeleton animation="wave" sx={{paddingTop: '50px', alignContent: 'center', height: '100%'}} />
                        <Skeleton animation="wave" sx={{paddingTop: '50px', alignContent: 'center', height: '100%'}} />
                    </div>
                ) : (
                    <TranscriptTypography>
                        {summary}
                    </TranscriptTypography>
                )
            }
        </div>
    );
  }

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '800px'}}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Conversations"
        sx={{ borderRight: 1, borderColor: 'divider'}}
      >
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Jane Doe SkiGear Co" {...a11yProps(1)} sx={{textAlign: 'left', width: '75%'}}></Tab>
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Lisa Doe SportsGear Co" {...a11yProps(1)} sx={{textAlign: 'left', width: '75%'}}/>
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Alex Doe SnowGear Co" {...a11yProps(1)} sx={{textAlign: 'left', width: '75%'}}/>
      </Tabs>
      <TabPanel value={value} index={0}>
        <CallerNameTypography>
            Jane Doe
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left', width: '400px'}}>
            SkiGear Co
        </Typography>

        <Box sx={{minHeight: '400px'}}>
            <CallerTypography>
                Jane: Hello, this is Jane. I recently purchased a Snow49 winter jacket and I wanted to let you know how thrilled I am with it.
            </CallerTypography>
            <RepTypography>
                Snow49 Representative: Hello Jane! Thank you for reaching out. We are so glad to hear that. What in particular did you like about the jacket?
            </RepTypography>
            <CallerTypography>
                Jane: It is incredibly warm, yet light. I wore it on a trip to the mountains and was amazed at how comfortable I felt. And the pockets are so well-designed!
            </CallerTypography>
            <RepTypography>
                Snow49 Representative: We always aim for high quality. Your feedback is much appreciated, Jane. Enjoy your adventures in the mountains!
            </RepTypography>
            <CallerTypography>
                Jane: I certainly will. Thank you and kudos to the Snow49 team.
            </CallerTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{0}</TranscriptCTA>

      </TabPanel>

      <TabPanel value={value} index={1} sx={{textAlign: 'left'}}>
        <CallerNameTypography>
            Lisa Doe
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left', width: '400px'}}>
            SportsGear Co
        </Typography>

        <Box sx={{minHeight: '400px'}}>
            <CallerTypography>
                Lisa: Hey, I am Lisa. I ordered a pair of Snow49 gloves but they arrived with a tear on one of them. I am quite disappointed.
            </CallerTypography>
            <RepTypography>
                Snow49 Representative: Oh, I am terribly sorry to hear that, Lisa. This is not the experience we want for our customers. Let us get this sorted right away. Would you like a replacement or a refund?
            </RepTypography>
            <CallerTypography>
                Lisa: I would prefer a replacement. I really liked the gloves, just need one without a defect.
            </CallerTypography>
            <RepTypography>
                Snow49 Representative: Absolutely, Lisa. We will send out a replacement ASAP. Once again, I apologize for the inconvenience and thank you for bringing it to our attention.
            </RepTypography>
            <CallerTypography>
                Lisa: Thanks for understanding. I hope the next pair will be perfect.
            </CallerTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{1}</TranscriptCTA>

      </TabPanel>
      <TabPanel value={value} index={2} sx={{textAlign: 'left'}}>
        <CallerNameTypography>
            Alex Doe
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left', width: '400px'}}>
            SnowGear Co
        </Typography>

        <Box sx={{minHeight: '400px'}}>
            <CallerTypography>
            Alex: Hi, I am Alex. I just wanted to check the warranty period for the Snow49 thermal wear?
            </CallerTypography>
            <RepTypography>
                Snow49 Representative: Hello, Alex! All Snow49 thermal wear comes with a one-year warranty from the date of purchase. This covers any manufacturing defects. Do you have a specific issue or just inquiring?
            </RepTypography>
            <CallerTypography>
                Lisa: No specific issue. I was just checking before making a purchase. Thanks for the info.
            </CallerTypography>
            <RepTypography>
                Snow49 Representative: You are welcome, Alex. If you have any other questions, feel free to ask. Have a great day!
            </RepTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{2}</TranscriptCTA>

      </TabPanel>
    </Box>
  );
}

export default VerticalTabs;
import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import Button from '@mui/material/Button';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EmailIcon from '@mui/icons-material/Email';
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
                        <Box sx={{height: '150px', overflow: 'auto'}}>
                          <Typography color="white" paragraph sx={{paddingTop: '20px', textAlign: 'justify', width: '550px'}}>
                            {children}
                          </Typography>
                        </Box>
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
  const [summary, setSummary] = React.useState('')
  const transcripts = [
    {id: 1, ticket_id: 1005, customer: 'Emily Brown', content: 'Emily: Hello, this is Emily. I recently purchased a snowboard and I wanted to let you know that the snowboard layers are delaminating. I am quite disappointed.Representative: Oh, I am terribly sorry to hear that, Emily. This is not the experience we want for our customers. Let us get this sorted right away. Would you like a replacement or a refund?\nI would prefer a replacement. I really liked the Snowboard, just need one without a defect.\nAbsolutely, Emily. We will send out a replacement ASAP. Once again, I apologize for the inconvenience and thank you for bringing it to our attention.\nThanks for understanding. I hope the next Snowboard will be perfect.'},
    {id: 2, ticket_id: 1008, customer: 'Michael Green', content: 'Customer: Hey, I am Michael. I ordered a pair of gloves but they arrived with a tear on one of them. I am quite disappointed.\nRepresentative: Oh, I am terribly sorry to hear that, Michael. This is not the experience we want for our customers. Let us get this sorted right away. Would you like a replacement or a refund?\nCustomer: I would prefer a replacement. I really liked the gloves, just need one without a defect.\nRepresentative: Absolutely, Michael. We will send out a replacement ASAP. Once again, I apologize for the inconvenience and thank you for bringing it to our attention.\nCustomer: Thanks for understanding. I hope the next pair will be perfect.'},
    {id: 3, ticket_id: 1014, customer: 'Mia Perez', content: 'Customer: Hi, I am Mia. I just wanted to check the warranty period for the thermal wear?\nRepresentative: Hello, Mia! All thermal wear comes with a one-year warranty from the date of purchase. This covers any manufacturing defects. Do you have a specific issue or just inquiring?\nCustomer: No specific issue. I was just checking before making a purchase. Thanks for the info.\nRepresentative: You are welcome, Mia. If you have any other questions, feel free to ask. Have a great day!'}
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getCallSummary = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(baseURL + 'llmpfs', {
        transcript: data['transcript'],
        ticket_id: data['ticket_id']
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
    const ticket_id = transcripts[children].ticket_id
    // console.log(transcripts[children].content);
    return (
        <div>
            <Stack spacing={2} direction="row" sx={{paddingLeft: '7%', paddingTop: '20px', alignContent: 'center'}}>
                <Button variant="contained" startIcon={<ContactPhoneIcon/>}>Call</Button>
                <Button variant="contained" startIcon={<EmailIcon/>}>Email</Button> 
                <Button variant="contained" startIcon={<SummarizeIcon/>}
                onClick={ async () => {
                    const callSummary = await getCallSummary({'transcript': transcript, 'ticket_id': ticket_id});
                    if (callSummary) {
                        // console.log(callSummary)
                        transcripts[children].summary = callSummary;
                        console.log(transcripts[children].summary);
                        setSummary(callSummary)
                    } else {
                        setSummary("Oops, I did it again. Why don't you try again? Thanks :p")
                    }
                }}
                >Generate Call Summary</Button>
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
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Emily Brown SnowSense" {...a11yProps(1)} sx={{textAlign: 'left', width: '75%'}}></Tab>
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Michael Green SnowSolutions" {...a11yProps(1)} sx={{textAlign: 'left', width: '75%'}}/>
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Mia Perez SnowTech" {...a11yProps(1)} sx={{textAlign: 'left', width: '75%'}}/>
      </Tabs>
      <TabPanel value={value} index={0}>
        {/* 1005	105	Emily Brown	emily.brown@example.com	SnowSense	Snowboard Delamination	Snowboard layers delaminating.	High	In Progress	Support B	2023-10-05 13:55:00	2023-10-05 13:55:00		Investigating snowboard delamination issue reported by the customer.		Gear Quality		1 hour	24 hours							 */}
        <CallerNameTypography>
          Emily Brown
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left', width: '100%'}}>
          SnowSense
          <Typography variant="caption" paragraph sx={{textAlign: 'right', display: 'inline', marginLeft: '57%'}}>
            Ticket Status: In Progress
          </Typography>
        </Typography>

        <Box sx={{height: '400px', overflow: 'auto'}}>
            <CallerTypography>
              Emily: Hello, this is Emily. I recently purchased a Snowboard and I wanted to let you know that the snowboard layers are delaminating. I am quite disappointed.
            </CallerTypography>
            <RepTypography>
              Representative: Oh, I am terribly sorry to hear that, Emily. This is not the experience we want for our customers. Let us get this sorted right away. Would you like a replacement or a refund?
            </RepTypography>
            <CallerTypography>
              Emily: I would prefer a replacement. I really liked the Snowboard, just need one without a defect.
            </CallerTypography>
            <RepTypography>
              Representative: Absolutely, Emily. We will send out a replacement ASAP. Once again, I apologize for the inconvenience and thank you for bringing it to our attention.
            </RepTypography>
            <CallerTypography>
              Emily: Thanks for understanding. I hope the next Snowboard will be perfect.
            </CallerTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{0}</TranscriptCTA>

      </TabPanel>

      <TabPanel value={value} index={1} sx={{textAlign: 'left'}}>
        {/* 1008	108	Michael Green	michael.green@example.com	SnowSolutions	Snow Ski Quality Problem	Ski surface is rough and damaged.	High	Open	Support A	2023-10-06 14:05:00	2023-10-06 14:05:00		Customer complaining about ski surface quality.		Gear Quality		2 hours	24 hours							 */}
        <CallerNameTypography>
          Michael Green
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left'}}>
          SnowSolutions
          <Typography variant="caption" paragraph sx={{textAlign: 'right', display: 'inline', marginLeft: '59%'}}>
              Ticket Status: Open
          </Typography>
        </Typography>

        <Box sx={{height: '400px', overflow: 'auto'}}>
            <CallerTypography>
              Michael: Hey, I am Michael. I ordered a pair of gloves but they arrived with a tear on one of them. I am quite disappointed.
            </CallerTypography>
            <RepTypography>
              Representative: Oh, I am terribly sorry to hear that, Michael. This is not the experience we want for our customers. Let us get this sorted right away. Would you like a replacement or a refund?
            </RepTypography>
            <CallerTypography>
              Michael: I would prefer a replacement. I really liked the gloves, just need one without a defect.
            </CallerTypography>
            <RepTypography>
              Representative: Absolutely, Michael. We will send out a replacement ASAP. Once again, I apologize for the inconvenience and thank you for bringing it to our attention.
            </RepTypography>
            <CallerTypography>
              Michael: Thanks for understanding. I hope the next pair will be perfect.
            </CallerTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{1}</TranscriptCTA>

      </TabPanel>
      <TabPanel value={value} index={2} sx={{textAlign: 'left'}}>
        {/* 1014	114	Mia Perez	mia.perez@example.com	SnowTech	Ski Pole Defect	Ski pole is bent and unusable.	High	Closed	Support A	2023-10-08 10:45:00	2023-10-08 11:30:00	2023-10-08 11:30:00	Ski pole replaced due to manufacturing defect.		Technical Issue		2 hours	24 hours		Issue Resolved	3/5				 */}
        <CallerNameTypography>
          Mia Perez
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left'}}>
          SnowTech
          <Typography variant="caption" paragraph sx={{textAlign: 'right', display: 'inline', marginLeft: '64%'}}>
              Ticket Status: Closed
          </Typography>
        </Typography>

        <Box sx={{height: '400px', overflow: 'auto'}}>
            <CallerTypography>
              Mia: Hi, I am Alex. I just wanted to check the warranty period for the thermal wear?
            </CallerTypography>
            <RepTypography>
              Representative: Hello, Mia! All thermal wear comes with a one-year warranty from the date of purchase. This covers any manufacturing defects. Do you have a specific issue or just inquiring?
            </RepTypography>
            <CallerTypography>
              Mia: No specific issue. I was just checking before making a purchase. Thanks for the info.
            </CallerTypography>
            <RepTypography>
              Representative: You are welcome, Mia. If you have any other questions, feel free to ask. Have a great day!
            </RepTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{2}</TranscriptCTA>

      </TabPanel>
    </Box>
  );
}

export default VerticalTabs;
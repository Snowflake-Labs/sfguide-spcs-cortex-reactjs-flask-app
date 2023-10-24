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
  const { children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    const { children } = props;
    return (
        <Typography variant="h5" sx={{textAlign: 'left', width: '450px'}}>{children}</Typography>
      );    
}

function CallerTypography(props){
    const { children } = props;
    return (
        <Typography color="lightblue" paragraph sx={{textAlign: 'justify', width: '550px'}}>{children}</Typography>
      );    
}

function RepTypography(props){
    const { children } = props;
    return (
        <Typography color="white" paragraph sx={{textAlign: 'justify', width: '550px', fontStyle: 'italic'}}>{children}</Typography>
      );    
}

function TranscriptTypography(props){
    const {children } = props;
    return (
        <div>
            {children ? 
                ( 
                    <div>
                        <Divider sx={{paddingTop: '20px'}}><Chip label="Call Summary"/></Divider>
                        <Box className="blended-scrollbar">
                          <Typography color="white" paragraph sx={{paddingTop: '10px', textAlign: 'justify', width: '550px'}}>
                            {/* Product: Snowboard Defect: Delaminating layers Summary: Emily contacted the representative to report a defect in her recently purchased snowboard. The layers of the snowboard are delaminating, causing disappointment. The representative apologized and offered a replacement or refund. Emily preferred a replacement, and the representative assured her that a new snowboard would be sent out as soon as possible. */}
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
    {id: 1, ticket_id: 1005, customer: 'Emily Brown', content: "Customer: Hello there\nAgent: Hello, I hope you're having a great day. To provide you with the most help, can you please share your first and last name and the company you are calling from?\nCustomer: Hi, I'm Emily Brown from SnowSense.\nAgent: Thanks Emily, tell me what are you calling about today?\nCustomer: We recently received an order of XtremeX helmets, and some of them came in with noticeable scratches on the surface. We were hoping to get them replaced since we need them to be in pristine condition for our customers. Our order number is 21649.\nAgent: I'm sorry to hear that, Emily. I understand how having scratched helmets can affect your business image. Let me check your order details, and I'll see what we can do for you.\nCustomer: Thank you, I appreciate your help.\nAgent: I've reviewed the order Emily, and we'll be able to replace all the scratched helmets for you. To expedite this process, could you please provide the exact number of helmets with scratches, and if possible, their respective sizes?\nCustomer: Sure, we have 4 medium-sized helmets and 3 large helmets with scratches.\nAgent: Thanks for the information, Emily. I've processed the replacement for those helmets, and you should receive them within the next 3-5 business days. Additionally, I'll arrange for a courier to pick up the damaged helmets from your location. You'll be provided with pre-paid return labels in the new shipment.\nCustomer: That's great, thank you for your assistance.\nAgent: You're welcome, Emily. If you have any other questions or concerns, please let me know. Have a great day!\nCustomer: You too! Goodbye.Agent: Goodbye, Emily! Take care."},
    {id: 2, ticket_id: 1008, customer: 'Michael Green', content: "Customer: Hello!\nAgent: Hello! I hope you're having a great day. To best assist you, can you please share your first and last name and the company you're calling from?\nCustomer: Sure, I'm Michael Green from SnowSolutions.\nAgent: Thanks, Michael! What can I help you with today?\nCustomer: We recently ordered several DryProof670 jackets for our store, but when we opened the package, we noticed that half of the jackets have broken zippers. We need to replace them quickly to ensure we have sufficient stock for our customers. Our order number is 60877.\nAgent: I apologize for the inconvenience, Michael. Let me look into your order. It might take me a moment.\nCustomer: Thank you.\nAgent: Michael, I've confirmed your order and the damage. Fortunately, we currently have enough stock to replace the damaged jackets. We'll send out the replacement jackets immediately, and they should arrive within 3-5 business days.\nCustomer: That's great to hear! How should we handle returning the damaged jackets?\nAgent: We will provide you with a return shipping label so that you can send the damaged jackets back to us at no cost to you. Please place the jackets in the original packaging or a similar box.\nCustomer: Sounds good! Thanks for your help.\nAgent: You're welcome, Michael! We apologize for the inconvenience, and thank you for your patience. Please don't hesitate to contact us if you have any further questions or concerns. Have a great day!\nCustomer: Thank you! You too."},
    {id: 3, ticket_id: 1014, customer: 'Mia Perez', content: "Customer: Hello\nAgent: Hello, I hope you're having a great day. To best assist you, can you please share your first and last name and the company you are calling from?\nCustomer: Yes, I'm Mia Perez from SnowTech.\nAgent: Thanks, Mia. Tell me what you're calling about today.\nCustomer: Well, we received 40 new DryProof670 jackets that we ordered for our rental store. However, it seems that about half of them have broken zippers. Is there any way we can get these jackets replaced or repaired?\nAgent: I understand that can be quite troublesome for your business. Let me check what's going on with your order. To confirm, your order ends in 18851, correct?\nCustomer: Yes, that's the one.\nAgent: I see. It looks like this is the first time we've heard of this specific model having such poor quality, and we're genuinely sorry about that. We'd like to make this right for you. I can arrange for a new shipment containing replacement jackets in the correct size to be sent out right away. Additionally, we'll organize a pick-up for the damaged jackets at no cost to you. Would this work for you?\nCustomer: That would be great. I appreciate your help with this issue.\nAgent: You're welcome, Mia. We'll make sure to get this taken care of as soon as possible. Once again, we apologize for the inconvenience, and hope that you continue to choose our products in the future. Have a great day."}
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
      setLoading(false);
      const llmpfs_response_save = await axios.post(baseURL + 'llmpfs_save', {
        summary: llmpfs_response,
        ticket_id: data['ticket_id']
      });
      console.log(llmpfs_response_save)    
      return llmpfs_response;
    } catch (error) {
      console.error('Error fetching call summary', error);
      return null;
    } 
  };  

  function TranscriptCTA(props){
    const {children } = props;
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
                        <Skeleton animation="wave" sx={{marginTop: '30px', paddingTop: '5px', alignContent: 'center', height: '100%'}} />
                        <Skeleton animation="wave" sx={{paddingTop: '30px', alignContent: 'center', height: '100%'}} />
                        <Skeleton animation="wave" sx={{paddingTop: '40px', alignContent: 'center', height: '100%'}} />
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
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Emily Brown Mountain Gear" {...a11yProps(1)} sx={{textAlign: 'left',  fontSize: '17px', height: '250px'}}></Tab>
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Michael Green Winter Apparel" {...a11yProps(1)} sx={{textAlign: 'left', fontSize: '17px', height: '250px'}}></Tab>
        <Tab wrapped icon={<PersonPinIcon />} iconPosition="start" label="Mia Perez Outdoor Outfits" {...a11yProps(1)} sx={{textAlign: 'left', fontSize: '17px', height: '250px'}}></Tab>
      </Tabs>
      <TabPanel value={value} index={0}>
        {/* 1005	105	Emily Brown	Mountain Gear */}
        <CallerNameTypography>
          Emily Brown
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left', width: '100%'}}>
          Mountain Gear
          <Typography variant="h7" paragraph sx={{textAlign: 'right', display: 'inline', marginLeft: '46%', color: 'white'}}>
            Ticket Status: In Progress
          </Typography>
        </Typography>
        <Divider></Divider>

        <Box className="blended-scrollbar-tabpanel">
          <CallerTypography>
            Customer: Hello there
          </CallerTypography>
          <RepTypography>
            Agent: Hello, I hope you're having a great day. To provide you with the most help, can you please share your first and last name and the company you are calling from?
          </RepTypography>
          <CallerTypography>
            Customer: Hi, I'm Emily Brown from Mountain Gear.
          </CallerTypography>
          <RepTypography>
            Agent: Thanks Emily, tell me what are you calling about today?
          </RepTypography>
          <CallerTypography>
            Customer: We recently received an order of XtremeX helmets, and some of them came in with noticeable scratches on the surface. We were hoping to get them replaced since we need them to be in pristine condition for our customers. Our order number is 21649.
          </CallerTypography>
          <RepTypography>
            Agent: I'm sorry to hear that, Emily. I understand how having scratched helmets can affect your business image. Let me check your order details, and I'll see what we can do for you.
          </RepTypography>
          <CallerTypography>
            Customer: Thank you, I appreciate your help.
          </CallerTypography>
          <RepTypography>
            Agent: I've reviewed the order Emily, and we'll be able to replace all the scratched helmets for you. To expedite this process, could you please provide the exact number of helmets with scratches, and if possible, their respective sizes?
          </RepTypography>
          <CallerTypography>
            Customer: Sure, we have 4 medium-sized helmets and 3 large helmets with scratches.
          </CallerTypography>
          <RepTypography>
            Agent: Thanks for the information, Emily. I've processed the replacement for those helmets, and you should receive them within the next 3-5 business days. Additionally, I'll arrange for a courier to pick up the damaged helmets from your location. You'll be provided with pre-paid return labels in the new shipment.
          </RepTypography>
          <CallerTypography>
            Customer: That's great, thank you for your assistance.
          </CallerTypography>
          <RepTypography>
            Agent: You're welcome, Emily. If you have any other questions or concerns, please let me know. Have a great day!
          </RepTypography>
          <CallerTypography>
            Customer: You too! Goodbye.
          </CallerTypography>
          <RepTypography>
            Agent: Goodbye, Emily! Take care.
          </RepTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{0}</TranscriptCTA>
      </TabPanel>

      <TabPanel value={value} index={1} sx={{textAlign: 'left'}}>
        {/* 1008	108	Michael Green	Winter Apparel */}
        <CallerNameTypography>
          Michael Green
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left'}}>
          Winter Apparel
          <Typography variant="h7" paragraph sx={{textAlign: 'right', display: 'inline', marginLeft: '54%', color: 'white'}}>
              Ticket Status: Open
          </Typography>
        </Typography>
        <Divider></Divider>

        <Box className="blended-scrollbar-tabpanel">
          <CallerTypography>
            Customer: Hello!
          </CallerTypography>
          <RepTypography>
            Agent: Hello! I hope you're having a great day. To best assist you, can you please share your first and last name and the company you're calling from?
          </RepTypography>
          <CallerTypography>
            Customer: Sure, I'm Michael Green from Winter Apparel.
            </CallerTypography>
          <RepTypography>
            Agent: Thanks, Michael! What can I help you with today?
          </RepTypography>
          <CallerTypography>
            Customer: We recently ordered several DryProof670 jackets for our store, but when we opened the package, we noticed that half of the jackets have broken zippers. We need to replace them quickly to ensure we have sufficient stock for our customers. Our order number is 60877.
          </CallerTypography>
          <RepTypography>
            Agent: I apologize for the inconvenience, Michael. Let me look into your order. It might take me a moment.
          </RepTypography>
          <CallerTypography>
            Customer: Thank you.
          </CallerTypography>
          <RepTypography>
            Agent: Michael, I've confirmed your order and the damage. Fortunately, we currently have enough stock to replace the damaged jackets. We'll send out the replacement jackets immediately, and they should arrive within 3-5 business days.
          </RepTypography>
          <CallerTypography>
            Customer: That's great to hear! How should we handle returning the damaged jackets?
          </CallerTypography>
          <RepTypography>
            Agent: We will provide you with a return shipping label so that you can send the damaged jackets back to us at no cost to you. Please place the jackets in the original packaging or a similar box.
          </RepTypography>
          <CallerTypography>
            Customer: Sounds good! Thanks for your help.
          </CallerTypography>
          <RepTypography>
            Agent: You're welcome, Michael! We apologize for the inconvenience, and thank you for your patience. Please don't hesitate to contact us if you have any further questions or concerns. Have a great day!
          </RepTypography>
          <CallerTypography>
            Customer: Thank you! You too.
          </CallerTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{1}</TranscriptCTA>
      </TabPanel>

      <TabPanel value={value} index={2} sx={{textAlign: 'left'}}>
        {/* 1014	114	Mia Perez	Outdoor Outfits*/}
        <CallerNameTypography>
          Mia Perez
        </CallerNameTypography>
        <Typography variant="h7" paragraph sx={{textAlign: 'left'}}>
          Outdoor Outfits
          <Typography variant="h7" paragraph sx={{textAlign: 'right', display: 'inline', marginLeft: '54%', color: 'white'}}>
              Ticket Status: Open
          </Typography>
        </Typography>
        <Divider></Divider>

        <Box className="blended-scrollbar-tabpanel">
          <CallerTypography>
            Customer: Hello
          </CallerTypography>
          <RepTypography>         
            Agent: Hello, I hope you're having a great day. To best assist you, can you please share your first and last name and the company you are calling from?
          </RepTypography>         
          <CallerTypography>
            Customer: Yes, I'm Mia Perez from Outdoor Outfits.
          </CallerTypography>
          <RepTypography>
            Agent: Thanks, Mia. Tell me what you're calling about today.
          </RepTypography>         
          <CallerTypography>
            Customer: Well, we received 40 new DryProof670 jackets that we ordered for our rental store. However, it seems that about half of them have broken zippers. Is there any way we can get these jackets replaced or repaired?
          </CallerTypography>
          <RepTypography>
            Agent: I understand that can be quite troublesome for your business. Let me check what's going on with your order. To confirm, your order ends in 18851, correct?
          </RepTypography>         
          <CallerTypography>
            Customer: Yes, that's the one.
          </CallerTypography>
          <RepTypography>
            Agent: I see. It looks like this is the first time we've heard of this specific model having such poor quality, and we're genuinely sorry about that. We'd like to make this right for you. I can arrange for a new shipment containing replacement jackets in the correct size to be sent out right away. Additionally, we'll organize a pick-up for the damaged jackets at no cost to you. Would this work for you?
          </RepTypography>         
          <CallerTypography>
            Customer: That would be great. I appreciate your help with this issue. 
          </CallerTypography>
          <RepTypography>
            Agent: You're welcome, Mia. We'll make sure to get this taken care of as soon as possible. Once again, we apologize for the inconvenience, and hope that you continue to choose our products in the future. Have a great day.
          </RepTypography>
        </Box>

        <Divider></Divider>
        <TranscriptCTA>{2}</TranscriptCTA>
      </TabPanel>
    </Box>
  );
}

export default VerticalTabs;
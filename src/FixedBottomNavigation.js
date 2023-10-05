import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

function refreshMessages() {
  const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

  return Array.from(new Array(10)).map(
    () => messageExamples[getRandomInt(messageExamples.length)],
  );
}

function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const [messages, setMessages] = React.useState(() => refreshMessages());

  React.useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
    setMessages(refreshMessages());
  }, [value, setMessages]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <List>
        {messages.map(({ primary, secondary, person }, index) => (
          <ListItem button key={index + person}>
            <ListItemAvatar>
              <Avatar alt="Profile Picture" src={person} />
            </ListItemAvatar>
            <ListItemText primary={primary} secondary={secondary} />
          </ListItem>
        ))}
      </List>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

const messageExamples = [
  {
    primary: 'Transcript',
    secondary: "**Customer:** Hello, I recently booked a flight from New York to London on your website. I just realized I mistakenly selected the wrong date. It should be for the 12th of September, not the 2nd. Can you help? **Representative:** Of course, I apologize for any inconvenience. Let me check the availability on the 12th of September for you. Can you provide your booking reference number, please? **Customer:** Yes, it\'s A1B2C3. **Representative:** Thank you. I found your booking. Give me a moment to see the options for the 12th. **Customer:** No problem, thank you for the help. **Representative:** I\'m glad to inform you that we have seats available on the 12th. However, there\'s a slight difference in the fare. Would you like me to go ahead and make the change for you? **Customer:** Yes, that would be great. How much is the difference? **Representative:** The difference is $50. Would that be acceptable? **Customer:** Yes, that\'s fine. Please make the change. **Representative:** Perfect, I\'ve successfully changed your booking date to the 12th of September. You will be charged an additional $50. Is there anything else I can assist you with? **Customer:** No, that\'s it. Thank you for your help! **Representative:** You\'re welcome! Safe travels, and thank you for choosing our airline. Have a great day! **Customer:** You too! Goodbye. **Representative:** Goodbye!",
    person: '/static/images/avatar/5.jpg',
  },
  {
    primary: 'Transcript',
    secondary: "**Customer:** Hi, I booked a flight from New York to Paris for October 15th, but I didn\'t receive a confirmation email. **Representative:** I\'m sorry for the inconvenience. Can I have your booking reference number, please? **Customer:** Yes, it\'s ABCD1234. **Representative:** Thank you. I see your booking. It looks like the email was sent to john.doe@example.com. Is that the correct email address? **Customer:** Oh, I made a typo. It should be john.doe@exampel.com. **Representative:** I see. Let me update that for you and resend the confirmation email. Please check your inbox in a few minutes. **Customer:** Thank you. Also, can I request a vegetarian meal for the flight? **Representative:** Of course! I\'ve added a request for a vegetarian meal to your booking. Anything else I can assist with? **Customer:** That\'s all for now. Thank you for your help! **Representative:** You\'re welcome. Safe travels! ",
    person: '/static/images/avatar/1.jpg',
  },
  {
    primary: 'Transcript',
    secondary: 'I am try out this new BBQ recipe, I think this might be amazing',
    person: '/static/images/avatar/2.jpg',
  },
  {
    primary: 'Transcript',
    secondary: 'I have the tickets to the ReactConf for this year.',
    person: '/static/images/avatar/3.jpg',
  },
  {
    primary: "Doctor's Appointment",
    secondary: 'My appointment for the doctor was rescheduled for next Saturday.',
    person: '/static/images/avatar/4.jpg',
  },
  {
    primary: 'Discussion',
    secondary: `Menus that are generated by the bottom app bar (such as a bottom
      navigation drawer or overflow menu) open as bottom sheets at a higher elevation
      than the bar.`,
    person: '/static/images/avatar/5.jpg',
  },
  {
    primary: 'Summer BBQ',
    secondary: `Who wants to have a cookout this weekend? I just got some furniture
      for my backyard and would love to fire up the grill.`,
    person: '/static/images/avatar/1.jpg',
  },
];
export default FixedBottomNavigation;
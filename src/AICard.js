import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import customer from './customer.jpg'
import PlaceIcon from '@mui/icons-material/Place';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import TextInput from './TextInput';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

function CustomerCard() {
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <CameraFrontIcon/>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Dash"
        subheader="Lead Developer Advocate"
      />
      <CardMedia
        component="img"
        height="194"
        image={customer}
        alt="Dash"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }} paragraph>
          As a Lead Developer Advocate at Snowflake, he is passionate about evaluating new ideas, trends, 
          and helping articulate how technology can address a given business problem.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
          <PlaceIcon sx={{verticalAlign:"middle"}}/> San Francisco, CA, USA
        </Typography> 
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ textAlign: 'left' }}>
          <TextInput
          ></TextInput>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default CustomerCard;
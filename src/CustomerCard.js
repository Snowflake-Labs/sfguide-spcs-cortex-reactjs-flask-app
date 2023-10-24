import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import customer from './customer.jpg'
import PlaceIcon from '@mui/icons-material/Place';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import { Divider } from '@mui/material';

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
          // <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          //   D
          // </Avatar>
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
          When Dash is not a customer support rep at SkiGear Co., he is a Lead Developer Advocate at Snowflake.
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
      <Divider></Divider>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ textAlign: 'left' }}>
          {/* <Typography sx={{ fontSize: 14 }} gutterBottom>
            Details
          </Typography> */}
          <Typography variant="h6" paragraph>
            Details
          </Typography>
          <Typography color="text.secondary">
            Email: dash.desai@snowflake.com
          </Typography>
          <Typography color="text.secondary">
            Lead Score: 99
          </Typography>
          <Typography color="text.secondary">
            Products: All
          </Typography>
          <Typography color="text.secondary">
            Last Viewed: 1min ago
          </Typography>
          <Typography color="text.secondary">
            Last Contacted: Snowday
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default CustomerCard;
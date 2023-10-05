import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import Divider from '@mui/material/Divider';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const theme = useTheme();
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    ...other
  } = props;

  const styleProps = {
    '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
    '--tree-view-bg-color':
      theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

function GmailTreeView() {
  return (
    <TreeView
      aria-label="email"
      defaultExpanded={['5']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <Typography variant="h6" paragraph sx={{ textAlign: 'left' }}>
        Conversations
      </Typography>
      <StyledTreeItem
          nodeId="1"
          labelText="All"
          labelIcon={MailIcon}
          labelInfo="3,101"
          color="#1a73e8"
          bgColor="#e8f0fe"
          colorForDarkMode="#B8E7FB"
          bgColorForDarkMode="#071318"
          sx={{ textAlign: 'left' }}
      />
      <StyledTreeItem
          nodeId="2"
          labelText="Unassigned"
          labelIcon={SupervisorAccountIcon}
          labelInfo="90"
          color="#1a73e8"
          bgColor="#e8f0fe"
          colorForDarkMode="#B8E7FB"
          bgColorForDarkMode="#071318"
          sx={{ textAlign: 'left' }}
      />
      <StyledTreeItem
          nodeId="3"
          labelText="Sales"
          labelIcon={LocalOfferIcon}
          labelInfo="24"
          color="#e3742f"
          bgColor="#fcefe3"
          colorForDarkMode="#FFE2B7"
          bgColorForDarkMode="#191207"
          sx={{ textAlign: 'left' }}
      />
      <StyledTreeItem
          nodeId="4"
          labelText="VIP Support"
          labelIcon={InfoIcon}
          labelInfo="250"
          color="#e3742f"
          bgColor="#fcefe3"
          colorForDarkMode="#FFE2B7"
          bgColorForDarkMode="#191207"
          sx={{ textAlign: 'left' }}
      />
      <StyledTreeItem
        nodeId="5"
        labelText="Global Sales"
        labelIcon={LocalOfferIcon}
        labelInfo="733"
        color="#3c8039"
        bgColor="#e6f4ea"
        colorForDarkMode="#CCE8CD"
        bgColorForDarkMode="#0C130D"
        sx={{ textAlign: 'left' }}
      />
      <StyledTreeItem
        nodeId="6"
        labelText="Mentions"
        labelIcon={ForumIcon}
        labelInfo="13"
        color="#a250f5"
        bgColor="#f3e8fd"
        colorForDarkMode="#D9B8FB"
        bgColorForDarkMode="#100719"
        sx={{ textAlign: 'left' }}
      />
      <StyledTreeItem nodeId="7" labelText="Trash" labelIcon={DeleteIcon} labelInfo="1991" sx={{ textAlign: 'left' }} paragraph/>
      <br/>
      <Typography variant="h6" sx={{ textAlign: 'left' }} paragraph>
        Assignment rules
      </Typography>
      <Typography variant="h6" sx={{ textAlign: 'left' }} paragraph>
        Reports
      </Typography>
    </TreeView>
  );
}
export default GmailTreeView;
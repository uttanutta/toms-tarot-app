import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default function BasicTooltip(props) {
  return (
    <Tooltip title={props.innerText}>
      <IconButton>
        Words here 
      </IconButton>
    </Tooltip>
  );
}
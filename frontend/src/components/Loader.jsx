import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ size = 40, thickness = 4, message }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px',
        width: '100%',
        gap: 2,
        py: 4
      }}
    >
      <CircularProgress 
        size={size} 
        thickness={thickness}
        color="primary"
      />
      {message && (
        <Typography 
          variant="body1" 
          color="textSecondary"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;

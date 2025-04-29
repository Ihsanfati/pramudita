// src/components/FadeInSection.js
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Box } from '@mui/material';

const FadeInSection = ({ children }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {children}
    </Box>
  );
};

export default FadeInSection;
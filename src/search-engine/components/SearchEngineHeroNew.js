import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  TextField,
  Badge,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import SideBarFilterFix from './SideBarFilterFix';
import UniversityCard from './UniversityCard';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import FadeInSection from './FadeInSection';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 'auto',
  paddingBottom: theme.spacing(10),
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: '6px solid hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `url('https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard.jpg')`,
  backgroundSize: 'cover',
}));

export default function SearchEngineHero() {
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    location: '',
    career: '',
    salary: '',
  });

  const [showMoreStates, setShowMoreStates] = useState({});
  const handleApplyFilters = async (selectedFilters) => {
    setFilters(selectedFilters);

    try {
      const response = await fetch('http://localhost:5000/api/universities/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedFilters),
      });
      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const toggleShowMore = (id) => {
    setShowMoreStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fetch data awal tanpa filter (semua data)
  useEffect(() => {
    fetch('http://localhost:5000/api/universities/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    })
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error('Fetch all universities error:', err));
  }, []);

  return (
    <Box
      id="search-engine"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
          ...theme.applyStyles('dark', {
            backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
    <Container 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 14, sm: 20 },
        pb: { xs: 8, sm: 12 },
      }} 
      id="search-engine"
    >
      <Stack 
        spacing={2}
        useFlexGap
        sx={{
          alignItems: 'center', 
          width: { 
            xs: '100%', 
            sm: '70%' 
          } 
        }}
      >
        <Typography 
          variant="h1"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            fontSize: 'clamp(3rem, 10vw, 3.5rem)',
          }}
        >
          Pramudita's&nbsp;
          <Typography
            component="span"
            variant="h1"
            sx={(theme) => ({
              fontSize: 'inherit',
              color: 'primary.main',
              ...theme.applyStyles(
                'dark', {
                  color: 'primary.light',
                }
              ),
            })}
          >
            Search Engine
          </Typography>
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            width: { sm: '100%', md: '80%' },
          }}
        >
          You can search for information about the majors you are interested in, related universities, jobs, careers, and salaries.
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" width="100%">
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            sx={{ width: '300px', backgroundColor: 'white', borderRadius: 1 }}
          />
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<FilterAltIcon />}
            onClick={() => setOpenFilter(true)}
          >
            Applied Filters {Object.keys(filters).filter(key => filters[key]).length > 0 ? `(${Object.keys(filters).filter(key => filters[key]).length})` : ''}
            <Badge badgeContent={Object.values(filters).filter(f => f !== '').length} color="secondary" />
          </Button>
        </Stack>
      </Stack>
      <SideBarFilterFix
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onApplyFilters={handleApplyFilters}
      />
      {universities.length > 0 ? (
        universities.map((uni) => (
          <UniversityCard
            university={uni}
            showMore={!!showMoreStates[uni.id]}
            onToggleShowMore={() => toggleShowMore(uni.id)}
          />
        ))
      ) : (
        <Typography variant="body1" align="center">
          Tidak ada universitas yang cocok dengan filter.
        </Typography>
      )}
    </Container>
    </Box>
  );
}
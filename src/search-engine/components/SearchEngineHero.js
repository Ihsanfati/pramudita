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
} from '@mui/material';
import SideBarFilter from './SideBarFilter';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';

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

const universities = [
  {
    name: 'Universitas Teknologi Pramudita',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Roundel_of_Indonesia_Air_Force.svg',
    location: 'Jakarta',
    rank: 12,
    accreditation: 'A',
    major: 'Teknik Elektro',
    careerProspect: 'Electrical Engineer',
    salaryRange: 'IDR 8-15jt / bulan',
    companies: ['PLN', 'Schneider Electric', 'Siemens']
  },
  {
    name: 'Institut Sains Nusantara',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Emblem_of_the_Ministry_of_Research_and_Technology_of_the_Republic_of_Indonesia.svg',
    location: 'Bandung',
    rank: 20,
    accreditation: 'A',
    major: 'Teknik Elektro',
    careerProspect: 'System Designer',
    salaryRange: 'IDR 10-18jt / bulan',
    companies: ['Telkom Indonesia', 'ABB', 'Bosch']
  },
  {
    name: 'Universitas Inovasi Digital',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Logo_ITB.svg',
    location: 'Surabaya',
    rank: 5,
    accreditation: 'A',
    major: 'Teknik Elektro',
    careerProspect: 'Embedded System Engineer',
    salaryRange: 'IDR 12-20jt / bulan',
    companies: ['Samsung', 'LG', 'Panasonic']
  }
];

export default function SearchEngineHero() {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ subject: '', location: '', career: '', salary: '' });
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const toggleExpand = (index) => {
    setExpandedCardIndex(prev => (prev === index ? null : index));
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setFilterOpen(false);
  };

  const filteredUniversities = universities.filter((univ) => {
    const matchSubject = filters.subject === '' || univ.major === filters.subject;
    const matchLocation = filters.location === '' || univ.location === filters.location;
    const matchCareer = filters.career === '' || univ.careerProspect === filters.career;
    const matchSalary = filters.salary === '' || univ.salaryRange.includes(filters.salary);
    return matchSubject && matchLocation && matchCareer && matchSalary;
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      try {
        const response = await fetch(`http://localhost:5000/api/universities?${query}`);
        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error('Failed to fetch universities:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUniversities();
  }, [filters]);

  return (
    <Container sx={{ pt: 10 }} id="search-engine">
      <Stack spacing={3} alignItems="center">
        <Typography variant="h3" align="center">
          Pramudita's <Typography component="span" color="primary" variant="h3">Search Engine</Typography>
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
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
            variant="contained"
            color="primary"
            startIcon={<FilterAltIcon />}
            onClick={() => setFilterOpen(true)}
          >
            Applied Filter
            <Badge badgeContent={Object.values(filters).filter(f => f !== '').length} color="secondary" />
          </Button>
        </Stack>
      </Stack>

      <Box mt={6}>
        <Stack spacing={4} alignItems="center">
          {filteredUniversities.map((univ, index) => (
            <Card
              key={index}
              sx={{ display: 'flex', flexDirection: 'row', borderRadius: 3, overflow: 'hidden', boxShadow: 4, width: '75%' }}
            >
              <Box sx={{ backgroundColor: 'primary.main', color: 'white', width: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <Typography variant="h6">Rank</Typography>
                <Typography variant="h4" fontWeight="bold">{univ.rank}</Typography>
                <Divider sx={{ width: '60%', my: 1, borderColor: 'white' }} />
                <Typography variant="h6">Akreditasi</Typography>
                <Typography variant="h4" fontWeight="bold">{univ.accreditation}</Typography>
              </Box>

              <CardContent sx={{ width: '75%' }}>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={univ.logo} alt="Logo" sx={{ width: 56, height: 56, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">{univ.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {univ.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">{univ.major}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button size="small" variant="text" onClick={() => toggleExpand(index)} endIcon={expandedCardIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
                      {expandedCardIndex === index ? 'Show Less' : 'Show More'}
                    </Button>
                  </Grid>
                  {expandedCardIndex === index && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body2" fontWeight="medium">
                          <WorkIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {univ.careerProspect}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" fontWeight="medium">
                          <MonetizationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {univ.salaryRange}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" fontWeight="medium" mb={1}>
                          <BusinessIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          Perusahaan Penerima:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {univ.companies.map((company, idx) => (
                            <Chip key={idx} label={company} variant="outlined" />
                          ))}
                        </Stack>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
      <SideBarFilter open={filterOpen} onClose={() => setFilterOpen(false)} onApply={applyFilters} currentFilters={filters} />
    </Container>
  );
}
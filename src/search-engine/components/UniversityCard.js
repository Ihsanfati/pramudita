import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Avatar,
  Chip,
  Grid,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function UniversityCard({ university, showMore, onToggleShowMore }) {
  const companiesList = Array.isArray(university.companies)
    ? university.companies
    : [university.companies];

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: 4,
        width: '75%',
        mb: 2,
        mx: 'auto',
      }}
    >
      {/* Sisi Kiri */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          width: '25%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Typography variant="h6">Rank</Typography>
        <Typography variant="h4" fontWeight="bold">
          {university.rank}
        </Typography>
        <Divider sx={{ width: '60%', my: 1, borderColor: 'white' }} />
        <Typography variant="h6">Akreditasi</Typography>
        <Typography variant="h4" fontWeight="bold">
          {university.accreditation}
        </Typography>
      </Box>

      {/* Sisi Kanan */}
      <CardContent sx={{ width: '75%' }}>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={university.logo} alt="Logo" sx={{ width: 56, height: 56, mr: 2 }} />
              <Box>
                <Typography variant="h6">{university.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {university.location}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              {university.major}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              size="small"
              variant="text"
              onClick={onToggleShowMore}
              endIcon={showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {showMore ? 'Show Less' : 'Show More'}
            </Button>
          </Grid>
          {showMore && (
            <>
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight="medium">
                  <WorkIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {university.career_prospect}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight="medium">
                  <MonetizationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {university.salary_range}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight="medium" mb={1}>
                  <BusinessIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Perusahaan Penerima:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {companiesList.map((company, idx) => (
                    <Chip key={idx} label={company} variant="outlined" />
                  ))}
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
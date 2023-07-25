// Composant pour présenter les résultats du sondage pas encore implémenté

import {
  styled,
  Box,
  LinearProgress,
  Typography,
  useTheme, 
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

function VoteResults() {
  const pieParams = { height: 350, margin: { right: 5 } };
  const data = [
    { id: 0, value: 54, color: '#F44336', textLeft: 'Paris' },
    { id: 1, value: 26, color: '#2196F3', textLeft: 'Marseille' },
    { id: 2, value: 20, color: '#4CAF50', textLeft: 'Lyon' },
    { id: 3, value: 10, color: '#7f2f57', textLeft: 'Nice' },
  ];

  const theme = useTheme();

  const VoteResultWrapper = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
  }));

  const VoteResultContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90dvh',
    width: '100%',
    margin: '1.5rem',
    padding: '2rem 0rem',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '0.5rem',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'start',
      flexDirection: 'column',
      height: 'auto',
      margin: '0rem',
    },
  }));

  const LinearContainer = styled('div')({
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      marginLeft: '4rem',
    },
    [theme.breakpoints.down('md')]: {
      margin: '1.5rem',
      width: '80%',
    },
  });

  const PieContainer = styled('div')({
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      marginRight: '4rem',
    },
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
  });

  const ResponsiveH3 = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.2rem',
    },
  }));

  const ResponsiveH5 = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem',
    },
  }));

  return (
    <VoteResultWrapper>
      <VoteResultContainer>
        <LinearContainer>
          <ResponsiveH3
            variant="h3"
            sx={{
              color: 'info.main',
              textAlign: 'start',
              marginBottom: '2rem',
            }}
          >
            Résultats du sondage :
          </ResponsiveH3>
          <ResponsiveH5
            variant="h5"
            sx={{
              color: 'info.main',
              textAlign: 'start',
              marginBottom: '2rem',
            }}
          >
            Ou partir en vacances cet été ?
          </ResponsiveH5>
          {data.map((item) => (
            <Box key={item.id} sx={{ width: '100%', marginBottom: '2rem' }}>
              <Typography
                variant="caption"
                sx={{ color: 'info.main', fontSize: '1rem' }}
              >
                {item.textLeft} ({item.value} Votes)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  color: item.color,
                  backgroundColor: '#212121',
                  height: '2rem',
                  border: '1px solid #565656',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: item.color,
                  },
                }}
              />
            </Box>
          ))}
        </LinearContainer>
        <PieContainer>
          <PieChart
            series={[
              {
                data, // Donnée statiques définies plus haut
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30 },
                // Highlightscope et faded permettent de faire des effet sympa en survolant les camemberts
              },
            ]}
            {...pieParams} // Paramètres définis plus haut pour définir la taille du graphique
          />
        </PieContainer>
      </VoteResultContainer>
    </VoteResultWrapper>
  );
}

export default VoteResults;

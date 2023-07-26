// Composant pour présenter les résultats du sondage pas encore implémenté
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  styled,
  Box,
  LinearProgress,
  Typography,
  Button,
  Snackbar,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PieChart } from '@mui/x-charts/PieChart';

interface SurveyResponse {
  id: number;
  survey_id: string;
  title: string;
  users: unknown[];
}

interface Survey {
  id: string;
  title: string;
  public: boolean;
  author_id: number;
  multiple_responses: boolean;
  responses: SurveyResponse[];
  totalVotes: number;
}

interface ChartData {
  id: number;
  value: number;
  color: string;
  textLeft: string;
  percentage?: number;
}

const VoteResultWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
}));

const VoteResultContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  borderRadius: '1rem',
  width: '80%',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    borderRadius: '0rem',
  },
}));

const TopContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  height: '85%',
  width: '100%',
  margin: '1.5rem',
  padding: '2rem 0rem',
  borderRadius: '0.5rem',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const BottomContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  height: '15%',
  margin: '1.5rem',
  gap: '2rem',
  [theme.breakpoints.down('md')]: {
    gap: '1rem',
  },
}));

const LinearContainer = styled('div')(({ theme }) => ({
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
}));

const TotalVotesContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '1rem 2rem',
  marginTop: '2rem',
  [theme.breakpoints.down('sm')]: {
    marginTop: '1rem',
  },
}));

const PieContainer = styled('div')(({ theme }) => ({
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
}));

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

function VoteResults() {
  const pieParams = { height: 350, margin: { right: 5 } };
  const colors = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
  ];
  const { id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [info, setInfo] = useState<ChartData[]>([]);
  const token = Cookies.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) {
        console.error('ID is undefined');
        return;
      }
      try {
        const GetSurveyConfig = {
          method: 'get',
          url: `http://localhost:3000/@me/survey/${id}`,
          headers: {
            Authorization: token,
          },
        };
        const GetSurvey = await axios.get<Survey>(GetSurveyConfig.url, {
          headers: GetSurveyConfig.headers,
        });
        setSurvey(GetSurvey.data);
        console.log('Results fetched :');
        console.log(GetSurvey.data);

        // Transformer les données ici
        if (GetSurvey.data) {
          const totalVotes = GetSurvey.data.responses.reduce(
            (total, response) => total + response.users.length,
            0
          );
          const transformedData = GetSurvey.data.responses.map(
            (response, index) => ({
              id: index,
              value: response.users.length,
              color: colors[index % colors.length],
              textLeft: response.title,
              percentage: (response.users.length / totalVotes) * 100,
            })
          );
          setSurvey({ ...GetSurvey.data, totalVotes });
          setInfo(transformedData);
        } else {
          console.error('No data fetched');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des résultats', error);
      }
    };

    void fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const handleBackClick = () => {
    if (!id) {
      console.error('ID is undefined');
      return;
    }
    navigate(`/surveys/${id}/vote`);
  };

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setSnackbarMessage('URL copiée dans le presse-papiers!');
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage(
          "Échec de la copie de l'URL dans le presse-papiers."
        );
        setSnackbarOpen(true);
      });
  };

  return (
    <VoteResultWrapper>
      <VoteResultContainer>
        <TopContainer>
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
              {survey ? survey.title : 'Loading...'}
            </ResponsiveH5>
            {info.map((item: ChartData) => (
              <Box key={item.id} sx={{ width: '100%', marginBottom: '2rem' }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'info.main', fontSize: '1rem' }}
                >
                  {item.textLeft} ({item.value} Votes)
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
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
            <TotalVotesContainer>
              <Typography>
                Nombre total de votes :{' '}
                {survey ? survey.totalVotes : 'Loading...'}
              </Typography>
            </TotalVotesContainer>
          </LinearContainer>
          <PieContainer>
            <PieChart
              series={[
                {
                  data: info, // Utilisation de la variable d'état "info"
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                  // Highlightscope et faded permettent de faire des effet sympa en survolant les camemberts
                },
              ]}
              {...pieParams} // Paramètres définis plus haut pour définir la taille du graphique
            />
          </PieContainer>
        </TopContainer>
        <BottomContainer>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            sx={{ padding: '1rem' }}
            onClick={handleBackClick}
          >
            Retour au vote
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShareIcon />}
            sx={{ padding: '1rem' }}
            onClick={handleShareClick}
          >
            Partager
          </Button>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={1000}
            message={snackbarMessage}
            onClose={() => setSnackbarOpen(false)}
          />
        </BottomContainer>
      </VoteResultContainer>
    </VoteResultWrapper>
  );
}

export default VoteResults;

import axios from 'axios';
import Cookies from 'js-cookie';
import VerificationCode from '../Login/VerificationCode';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { handleLogout } from '../../store/reducers/login';
import { expiredToken } from '../../store/reducers/snackbar';
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

interface AxiosError {
  response?: {
    status?: number;
    data?: {
      message: string;
    };
  };
}

interface SurveyResponse {
  id: number;
  survey_id: string;
  title: string;
  users: {
    id: number;
  }[];
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
  flexGrow: 1,
}));

const VoteResultContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  borderRadius: '1rem',
  width: '70%',
  height: 'auto',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
  [theme.breakpoints.up('md')]: {
    transform: 'scale(0.9)',
  },
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

const CountVoteContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '0.5rem',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '0.3rem',
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
  [theme.breakpoints.down('sm')]: {
    marginTop: '2rem',
  },
}));

const ResponsiveChoose = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'start',
  marginBottom: '2rem',
  fontSize: '2.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.1rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.8rem',
  },
}));

const ResponsiveTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'start',
  marginBottom: '2rem',
  fontSize: '2rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.6rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.3rem',
  },
}));

function VoteResults() {
  const pieParams = { height: 350, margin: { right: 5 } };
  const colors = [
    '#FF0000', // Rouge
    '#FFFF00', // Jaune
    '#00FF00', // Vert
    '#00FFFF', // Cyan
    '#0000FF', // Bleu
    '#FF00FF', // Magenta
  ];
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [hasVoted, setHasVoted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [info, setInfo] = useState<ChartData[]>([]);
  const currentUserId = useAppSelector((state) => state.login.id);
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

          const currentUser = GetSurvey.data.responses.find((response) => {
            return response.users.some((user) => user.id === currentUserId);
          });

          setHasVoted(!!currentUser);
          setSurvey({ ...GetSurvey.data, totalVotes });
          setInfo(transformedData);
        } else {
          console.error('No data fetched');
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          // Si l'utilisateur n'a pas vérifié son compte, ouvrez la fenêtre modale de vérification
          if (
            axiosError.response.data?.message ===
            'User not verified, please verify your account'
          ) {
            setModalOpen(true); // Assurez-vous d'avoir une variable d'état appelée isModalOpen pour gérer cela.
          } else {
            // Sinon, déconnectez l'utilisateur, car le token est expiré ou invalide.
            dispatch(handleLogout());
            dispatch(expiredToken());
            navigate('/'); // Redirigez vers la page de connexion ou une autre page de votre choix.
          }
        }
        console.error('Erreur lors de la récupération des résultats', error);
      }
    };

    void fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, token, id]);

  const handleBackClick = () => {
    if (!id) {
      console.error('ID is undefined');
      return;
    }
    navigate(`/survey/${id}/vote`);
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
            <ResponsiveChoose>Résultats du sondage :</ResponsiveChoose>
            {hasVoted && (
              <Typography variant="body2" color="error">
                Vous avez voté pour ce sondage
              </Typography>
            )}
            <ResponsiveTitle>
              {survey ? survey.title : 'Loading...'}
            </ResponsiveTitle>
            {info.map((item: ChartData) => (
              <Box key={item.id} sx={{ width: '100%', marginBottom: '2rem' }}>
                <CountVoteContainer>
                  <Typography
                    variant="caption"
                    sx={{ color: 'info.main', fontSize: '1.1rem' }}
                  >
                    {item.textLeft}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'info.main',
                      fontSize: '1.1rem',
                    }}
                  >
                    {item.percentage} % ({item.value} Votes)
                  </Typography>
                </CountVoteContainer>
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
        </BottomContainer>
      </VoteResultContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
      {modalOpen && (
        <VerificationCode
          onClose={() => setModalOpen(false)}
          open={modalOpen}
          setOpen={setModalOpen}
          onVerified={() => {
            setSnackbarMessage('Code vérifié avec succès!');
            setSnackbarOpen(true);
            window.location.reload();
          }}
        />
      )}
    </VoteResultWrapper>
  );
}

export default VoteResults;

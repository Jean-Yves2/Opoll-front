import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import VerificationCode from '../Login/VerificationCode';
import { useAppDispatch } from '../../hooks/redux';
import { handleLogout } from '../../store/reducers/login';
import { expiredToken } from '../../store/reducers/snackbar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShareIcon from '@mui/icons-material/Share';
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  styled,
  Button,
  Checkbox,
  Typography,
  Snackbar,
} from '@mui/material';

interface AxiosError {
  response?: {
    status?: number;
    data?: {
      message: string;
    };
  };
}

interface SurveyResponse {
  id: string;
  title: string;
}

interface Survey {
  id: string;
  title: string;
  public: boolean;
  author_id: string;
  multiple_responses: boolean;
  responses: SurveyResponse[];
}

const WrapperVotingStep = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  minHeight: '100dvh',
}));

const VotingStepContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexDirection: 'column',
  marginTop: '4rem',
  padding: '2rem',
  backgroundColor: theme.palette.secondary.main,
  height: 'auto',
  borderRadius: '1rem',
  width: '50%',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
  [theme.breakpoints.down('md')]: {
    width: '75%',
  },
  [theme.breakpoints.down('sm')]: {
    height: '100vh',
    width: '100%',
    marginTop: '0rem',
    borderRadius: '0rem',
  },
}));

const VoteContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  height: 'auto',
  maxWidth: '500px',
});

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  width: '100%',
  gap: '1rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0rem',
  },
}));

const ChooseTypography = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '1.8rem',
  marginBottom: '1rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.3rem',
  },
}));

const ResponsiveTitle = styled('h1')(({ theme }) => ({
  fontSize: '2.4rem',
  color: theme.palette.primary.main,
  margin: '2rem 0rem',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'normal',

  [theme.breakpoints.down('md')]: {
    fontSize: '1.9rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

function VoteStep() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const token = Cookies.get('token') as string;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSurvey = async () => {
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
        console.log('Sondage récupéré :');
        console.log(GetSurvey.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          // Si l'utilisateur n'a pas vérifié son compte on le redirige vers la page de vérification
          if (
            axiosError.response.data?.message ===
            'User not verified, please verify your account'
          ) {
            setModalOpen(true);
          } else {
            // Sinon c'est que le token est expiré ou invalide on déconnecte l'utilisateur
            dispatch(handleLogout());
            dispatch(expiredToken());
            navigate('/');
          }
        }
        console.error('Erreur lors de la récupération du sondage', error);
      }
    };
    void fetchSurvey();
  }, [token, id]);

  const handleBackClick = () => {
    if (!id) {
      console.error('ID is undefined');
      return;
    }
    navigate(`/surveys/${id}/results`);
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

  const handleOptionChange = (responseId: string, value: boolean) => {
    setSelectedOptions((prevOptions) => {
      if (value) {
        // Si multiple_responses est false et qu'il y a déjà une réponse sélectionnée, ne rien faire
        if (!survey?.multiple_responses && prevOptions.length > 0) {
          return prevOptions;
        }
        // Sinon, ajoutez l'ID de la réponse au tableau
        return [...prevOptions, responseId];
      } else {
        // Si la case est décochée, retirez l'ID de la réponse du tableau
        return prevOptions.filter((id) => id !== responseId);
      }
    });
  };

  const handleSubmit = async () => {
    if (!id) {
      console.error('ID is undefined');
      return;
    }

    try {
      const VoteSurveyConfig = {
        method: 'post',
        url: `http://localhost:3000/@me/survey/${id}/respond`,
        headers: {
          Authorization: token,
        },
        data: { responses: selectedOptions },
      };
      const VoteSurvey = await axios(VoteSurveyConfig);
      // Gérer la logique de redirection vers les résultats en temps réel
      console.log(VoteSurvey.data);
      navigate(`/surveys/${id}/results`);
    } catch (error) {
      console.error('Erreur lors de la soumission du vote', error);
      setError('Vous avez déjà voté pour ce sondage');
    }
  };

  return (
    <WrapperVotingStep>
      <VotingStepContainer>
        <ResponsiveTitle>{survey?.title}</ResponsiveTitle>
        <VoteContainer>
          <FormControl component="fieldset">
            <ChooseTypography>Choissisez une réponse : </ChooseTypography>
            <FormGroup>
              {survey?.responses.map((response, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedOptions.includes(response.id)}
                      onChange={(e) =>
                        handleOptionChange(response.id, e.target.checked)
                      }
                      sx={{
                        color: 'primary.main',
                        transform: 'scale(1.5)',
                        marginRight: '1rem',
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: { sm: '1.4rem', md: '1.6rem' },
                        color: 'info.main',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {response.title}
                    </Typography>
                  }
                  key={index}
                  sx={{ color: 'info.main', marginBottom: '1rem' }}
                />
              ))}
            </FormGroup>
          </FormControl>
          {error && (
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleSubmit}
            sx={{ marginTop: '1rem' }}
          >
            Soumettre
          </Button>
          <ButtonContainer>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              size="large"
              onClick={handleBackClick}
              sx={{ marginTop: '1rem', width: '100%' }}
            >
              Résultats
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShareIcon />}
              size="large"
              onClick={handleShareClick}
              sx={{ marginTop: '1rem', width: '100%' }}
            >
              Partager
            </Button>
          </ButtonContainer>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={1000}
            message={snackbarMessage}
            onClose={() => setSnackbarOpen(false)}
          />
          {isModalOpen && (
            <VerificationCode
              onClose={() => setModalOpen(false)}
              open={isModalOpen}
              setOpen={setModalOpen}
              onVerified={() => {
                setSnackbarMessage('Code vérifié avec succès!');
                setSnackbarOpen(true);
                window.location.reload();
              }}
            />
          )}
        </VoteContainer>
      </VotingStepContainer>
    </WrapperVotingStep>
  );
}

export default VoteStep;

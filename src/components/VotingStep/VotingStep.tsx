import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  styled,
  Button,
  Checkbox,
  FormLabel,
  Typography,
} from '@mui/material';

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

const ResponsiveTitle = styled('h1')(({ theme }) => ({
  fontSize: '3rem',
  color: theme.palette.primary.main,
  margin: '2rem 0rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

function VoteStep() {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const token = Cookies.get('token') as string;

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
        console.error('Erreur lors de la récupération du sondage', error);
      }
    };
    fetchSurvey().catch((error) => {
      console.error('Erreur lors de la récupération du sondage', error);
    });
  }, [token, id]);

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
    } catch (error) {
      console.error('Erreur lors de la soumission du vote', error);
    }
  };

  return (
    <WrapperVotingStep>
      <VotingStepContainer>
        <ResponsiveTitle>{survey?.title}</ResponsiveTitle>
        <VoteContainer>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontSize: '2rem',
                marginBottom: '2rem',
                color: 'primary.main',
              }}
            >
              Choissisez une réponse :{' '}
            </FormLabel>
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
                        fontSize: '1.8rem',
                        color: 'info.main',
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
        </VoteContainer>
      </VotingStepContainer>
    </WrapperVotingStep>
  );
}

export default VoteStep;

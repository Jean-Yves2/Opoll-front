import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  styled,
  Button,
  Checkbox,
} from '@mui/material';

interface SurveyResponse {
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
  minHeight: '100dvh',
}));

const VotingStepContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'start',
  padding: '1.5rem 2rem',
  backgroundColor: theme.palette.secondary.main,
  height: 'auto',
  borderRadius: '0.5rem',
  margin: '2rem',
  width: '60%',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
}));

const ResponsiveTitle = styled('h1')(({ theme }) => ({
  fontSize: '3rem',
  color: theme.palette.primary.main,
  margin: '2rem 0rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
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
        const response = await axios.get<Survey>(
          `http://localhost:3000/@me/survey/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSurvey(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du sondage', error);
        // Gérez ici les erreurs
      }
    };

    fetchSurvey().catch((error) => {
      console.error('Erreur lors de la récupération du sondage', error);
    });
  }, [token, id]); // Exécutez l'effet chaque fois que l'ID change

  if (!survey) {
    return <div>Loading...</div>; // Introduire skeleton loader pour le sondage
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  const handleSubmit = () => {
    // Logique de soumission du vote
    if (!id) {
      console.error('ID is undefined');
      return;
    }
    (async () => {
      console.log(selectedOptions);
      try {
        const response = await axios.post(
          `http://localhost:3000/@me/survey/${id}/respond`,
          { responses: selectedOptions },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Vote soumis avec succès');
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la soumission du vote', error);
      }
    })().catch((error) => {
      console.error('Erreur lors de la soumission du vote', error);
    });
  };

  return (
    <WrapperVotingStep>
      <VotingStepContainer>
        <ResponsiveTitle>{survey.title}</ResponsiveTitle>
        <FormControl component="fieldset">
          <FormLabel component="legend">Choissisez une réponse : </FormLabel>
          <FormGroup>
            {' '}
            {/* Use FormGroup instead of RadioGroup */}
            {survey.responses.map((response, index) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes(response.title)}
                    onChange={handleChange}
                    value={response.title}
                  />
                }
                label={response.title}
                key={index}
              />
            ))}
          </FormGroup>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Soumettre
        </Button>
      </VotingStepContainer>
    </WrapperVotingStep>
  );
}

export default VoteStep;

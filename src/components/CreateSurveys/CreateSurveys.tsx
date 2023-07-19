/* eslint-disable @typescript-eslint/no-misused-promises */
import { FormEvent, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Switch,
  styled,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const CreateSurveyContainer = styled('div')({
  backgroundColor: '#3e3274',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'center',
});

const Title = styled(Typography)({
  margin: '1.5rem',
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '500px',
});

const CustomFormControlLabel = styled(FormControlLabel)({
  '& .MuiTypography-root': {
    color: '#F2BE22',
  },
});

const QuestionTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: '#F2BE22',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#F2BE22',
    },
    '&:hover fieldset': {
      borderColor: '#F2BE22',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#F2BE22',
    },
  },
});

type SurveyData = {
  question: string;
  options: string[];
  isPublic: boolean;
  multipleChoice: boolean;
  endDate?: string;
};

function CreateSurvey() {
  // State contenant les données du sondage
  const [surveyData, setSurveyData] = useState<SurveyData>({
    question: '',
    options: ['', ''],
    isPublic: true,
    multipleChoice: true,
    endDate: '',
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const containerClass = isSmallScreen
    ? 'container small-screen'
    : 'container large-screen';

  const handleInputChange = (field: string, value: string | boolean) => {
    setSurveyData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Logique de changement d'une option du sondage
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...surveyData.options];
    newOptions[index] = value;
    setSurveyData((prevData) => ({ ...prevData, options: newOptions }));
  };

  // Ajout d'une option au sondage (max 4)
  const handleAddOption = () => {
    if (surveyData.options.length < 4) {
      setSurveyData((prevData) => ({
        ...prevData,
        options: [...prevData.options, ''],
      }));
    }
  };

  // Logique de soumission du sondage au serveur
  const handleSurveySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // On envoie les données du sondage au serveur
      const response = await axios.post('/@me/survey', surveyData);
      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de l'envoi du sondage", error);
    }
  };

  return (
    <CreateSurveyContainer>
      <div className={containerClass}>
        <Title color="secondary" variant="h4">
          Création d'un sondage
        </Title>
        <Form onSubmit={handleSurveySubmit}>
          <QuestionTextField
            label="Question"
            value={surveyData.question}
            onChange={(e) => handleInputChange('question', e.target.value)}
            required
          />
          {surveyData.options.map((option, index) => (
            <TextField
              key={index}
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          ))}
          {surveyData.options.length < 4 && (
            <Button
              variant="contained"
              color="success"
              onClick={handleAddOption}
            >
              Ajouter une option
            </Button>
          )}
          <FormGroup>
            <CustomFormControlLabel
              control={
                <Checkbox
                  checked={surveyData.isPublic}
                  onChange={(e) =>
                    handleInputChange('isPublic', e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body1" color="inherit">
                  Rendre le sondage public
                </Typography>
              }
            />
            <CustomFormControlLabel
              control={
                <Checkbox
                  checked={surveyData.multipleChoice}
                  onChange={(e) =>
                    handleInputChange('multipleChoice', e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="body1" color="inherit">
                  Choix multiples autorisés
                </Typography>
              }
            />
          </FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={!!surveyData.endDate}
                onChange={() =>
                  handleInputChange(
                    'endDate',
                    surveyData.endDate
                      ? ''
                      : new Date().toISOString().split('T')[0]
                  )
                }
              />
            }
            label={
              <Typography variant="body1" color="inherit">
                Définir une date de fin
              </Typography>
            }
            labelPlacement="end"
            sx={{ color: '#F2BE22' }}
          />
          {surveyData.endDate && (
            <TextField
              label="Date de fin"
              type="date"
              value={surveyData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              required
            />
          )}
          <Button variant="contained" color="primary" type="submit">
            Créer
          </Button>
        </Form>
      </div>
    </CreateSurveyContainer>
  );
}

export default CreateSurvey;

/* eslint-disable @typescript-eslint/no-misused-promises */
import { FormEvent, useState } from 'react';
import { handleLogout } from '../../store/reducers/login';
import { expiredToken } from '../../store/reducers/snackbar';
import { useAppDispatch } from '../../hooks/redux';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
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
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AxiosError {
  response?: {
    status?: number;
  };
}

type ValidationErrors = {
  title: string;
  responses: string[];
};

type SurveyData = {
  title: string;
  responses: string[];
  public: boolean;
  multiple_responses: boolean;
  endDate?: string;
};

interface SurveyResponse {
  id: string;
}

const WrapperCreateSurvey = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  minHeight: '100vh',
}));

const CreateSurveyContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1.5rem 2rem',
  marginTop: '4rem',
  height: 'auto',
  borderRadius: '1rem',
  width: '60%',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
  [theme.breakpoints.down('md')]: {
    width: '80%',
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: '0rem',
    width: '100%',
    height: '100vh',
    borderRadius: '0rem',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: '1.5rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));
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

function CreateSurvey() {
  // State contenant les données du sondage
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    title: '',
    responses: ['', ''],
    public: true,
    multiple_responses: true,
    endDate: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    title: '',
    responses: [],
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setSurveyData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Logique de changement d'une option du sondage
  const handleOptionChange = (index: number, value: string) => {
    const responses = [...surveyData.responses];
    responses[index] = value;
    setSurveyData((prevData) => ({ ...prevData, responses: responses }));
  };

  // Ajout d'une option au sondage (max 6)
  const handleAddOption = () => {
    if (surveyData.responses.length < 6) {
      setSurveyData((prevData) => ({
        ...prevData,
        responses: [...prevData.responses, ''],
      }));
    }
  };

  // Logique de suppression d'une option du sondage (min 2)
  const handleRemoveOption = (index: number) => {
    if (surveyData.responses.length > 2) {
      const responses = [...surveyData.responses];
      responses.splice(index, 1);
      setSurveyData((prevData) => ({ ...prevData, responses: responses }));
    }
  };

  const MAX_TITLE_LENGTH = 30;
  const MAX_OPTION_LENGTH = 50;

  const validateInput = () => {
    const validationErrors: ValidationErrors = {
      title: '',
      responses: [],
    };

    if (surveyData.title.length > MAX_TITLE_LENGTH) {
      validationErrors.title = `Le titre du sondage doit être inférieur à ${MAX_TITLE_LENGTH} caractères.`;
    }

    for (let i = 0; i < surveyData.responses.length; i++) {
      if (surveyData.responses[i].length > MAX_OPTION_LENGTH) {
        validationErrors.responses.push(
          `La réponse ${
            i + 1
          } doit être entre inférieur à ${MAX_OPTION_LENGTH} caractères.`
        );
      }
    }

    setErrors(validationErrors);

    const isValid =
      !validationErrors.title && validationErrors.responses.length === 0;
    // isValid retournera true si toutes les erreurs sont des chaînes de caractères vides
    // Cette validation est nécessaire pour empêcher l'utilisateur d'envoyer des données invalides
    // Mais ne remplace pas la validation côté serveur

    return isValid;
  };

  // Logique de soumission du sondage au serveur
  const handleSurveySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({ title: '', responses: [] });

    if (!validateInput()) {
      return;
    }
    // On transforme les données du sondage pour qu'elles correspondent à ce que le back-end attend
    const transformedSurveyData = {
      title: surveyData.title,
      public: surveyData.public,
      multiple_responses: surveyData.multiple_responses,
      responses: surveyData.responses.map((response) => ({ title: response })),
    };
    const token = Cookies.get('token') as string;

    setIsLoading(true); // Début du chargement

    try {
      // On envoie les données du sondage au serveur
      const response = await axios.post<SurveyResponse>(
        'http://localhost:3000/@me/survey',
        transformedSurveyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/surveys/${response.data.id}/vote`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Erreur lors de l'envoi du sondage, token probablement invalide ou expiré",
        axiosError
      );
      // Si le token est invalide ou expiré, on déconnecte l'utilisateur
      if (axiosError.response && axiosError.response.status === 401) {
        dispatch(handleLogout());
        dispatch(expiredToken());
        navigate('/');
      }
    }
    setIsLoading(false); // Fin du chargement
  };

  return (
    <WrapperCreateSurvey>
      <CreateSurveyContainer>
        <Title color="primary" variant="h4">
          Création d'un sondage
        </Title>
        <Form onSubmit={handleSurveySubmit}>
          <QuestionTextField
            error={!!errors.title}
            helperText={errors.title}
            label="Question"
            value={surveyData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
          {surveyData.responses.map((response, index) => (
            <TextField
              error={!!errors.responses[index]}
              helperText={errors.responses[index]}
              label={`Réponse ${index + 1}`}
              value={response}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              InputProps={{
                endAdornment: surveyData.responses.length > 2 && (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))}
          {surveyData.responses.length < 6 && (
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
                  checked={surveyData.public}
                  onChange={(e) =>
                    handleInputChange('public', e.target.checked)
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
                  checked={surveyData.multiple_responses}
                  onChange={(e) =>
                    handleInputChange('multiple_responses', e.target.checked)
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading} // Désactiver le bouton pendant le chargement
          >
            {isLoading ? <CircularProgress size={24} /> : 'Créer'}
          </Button>
        </Form>
      </CreateSurveyContainer>
    </WrapperCreateSurvey>
  );
}

export default CreateSurvey;

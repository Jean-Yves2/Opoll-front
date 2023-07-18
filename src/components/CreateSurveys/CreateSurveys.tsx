import { FormEvent, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import useMediaQuery from '@mui/material/useMediaQuery';

const Wrapper = styled('div')({
  backgroundColor: '#3e3274',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'center',
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

function CreateSurvey() {
  const [options, setOptions] = useState<string[]>(['', '']);
  const [endDateEnabled, setEndDateEnabled] = useState(false);
  const [endDate, setEndDate] = useState('');
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Gestion du responsive ci dessous :
  const Title = styled(Typography)({
    margin: '2rem',
    fontSize: isSmallScreen
      ? theme.typography.h6.fontSize
      : theme.typography.h4.fontSize,
  });

  const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '1rem',
    padding: '1rem',
    backgroundColor: '#1b1532',
    height: '120vh',
    width: isSmallScreen ? '85%' : '65%',
    borderRadius: '0.5rem',
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique de soumission du formulaire
  };

  return (
    <Wrapper>
      <Container>
        <Title color="secondary">Création d'un sondage</Title>
        <Form onSubmit={handleSubmit}>
          <QuestionTextField label="Question" required />
          {options.map((option, index) => (
            <TextField
              key={index}
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          ))}
          {options.length < 6 && (
            <Button
              variant="contained"
              color="success"
              onClick={handleAddOption}
            >
              Ajouter une option
            </Button>
          )}
          {options.length > 2 && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemoveOption(options.length - 1)}
            >
              Supprimer une option
            </Button>
          )}
          <FormGroup>
            <CustomFormControlLabel
              control={<Checkbox defaultChecked />}
              label={
                <Typography variant="body1" color="inherit">
                  Rendre le sondage publique
                </Typography>
              }
            />
            <CustomFormControlLabel
              control={<Checkbox defaultChecked />}
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
                checked={endDateEnabled}
                onChange={() => setEndDateEnabled(!endDateEnabled)}
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
          {endDateEnabled && (
            <TextField
              label="Date de fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          )}
          <Button variant="contained" color="primary" type="submit">
            Créer
          </Button>
        </Form>
      </Container>
    </Wrapper>
  );
}

export default CreateSurvey;

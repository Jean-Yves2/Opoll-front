import { FormEvent } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#1b1532',
  height: '100vh',
});

const Title = styled(Typography)({
  margin: '0.5rem',
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
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique de soumission du formulaire
  };

  return (
    <Container>
      <Title color="secondary" variant="h4">
        Création d'un sondage
      </Title>
      <Form onSubmit={handleSubmit}>
        <QuestionTextField label="Question" required />
        <TextField label="Option 1" required />
        <TextField label="Option 2" required />
        <TextField label="Option 3" required />
        <TextField label="Option 4" required />
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
        <Button variant="contained" color="primary" type="submit">
          Créer
        </Button>
      </Form>
    </Container>
  );
}

export default CreateSurvey;

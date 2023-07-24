/* eslint-disable @typescript-eslint/no-misused-promises */
// Formulaire de contact fonctionne OK, manque juste snackbar pour afficher message de confirmation
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  styled,
  CircularProgress,
} from '@mui/material';

const WrapperContact = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
}));

const ContactContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexDirection: 'column',
  height: 'auto',
  minHeight: '100vh',
  margin: '1rem',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
  width: '50%',
  [theme.breakpoints.down('lg')]: {
    width: '65%',
  },
  [theme.breakpoints.down('md')]: {
    width: '75%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    margin: '0rem',
    borderRadius: '0rem',
  },
}));

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '600px',
});

const TitleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '1rem',
  '& h5': {
    fontSize: '2rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.5rem',
    },
  },
}));

function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/contact', { email, message });
      setEmail('');
      setMessage('');
      navigate('/');
      // Ajouter snackbar pour afficher message de confirmation
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi du formulaire de contact, veuillez réessayer",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContact>
      <ContactContainer>
        <CardContent>
          <TitleContainer>
            <Typography color="primary" gutterBottom variant="h5">
              Contactez-nous
            </Typography>
          </TitleContainer>
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  placeholder="Entrez votre email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Message"
                  multiline
                  rows={4}
                  placeholder="Renseignez votre message"
                  variant="outlined"
                  fullWidth
                  required
                  value={message}
                  onChange={handleMessageChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Envoyez'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </ContactContainer>
    </WrapperContact>
  );
}

export default Contact;

/* eslint-disable @typescript-eslint/no-misused-promises */
// Formulaire de contact fonctionne OK, manque juste snackbar pour afficher message de confirmation
import { apiUrl } from '../../config';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './Contact.scss';
import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  styled,
  CircularProgress,
} from '@mui/material';

const ContactContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexDirection: 'column',
  height: 'auto',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
  width: '40%',
  overflow: 'auto',
  [theme.breakpoints.down('lg')]: {
    width: '60%',
  },
  [theme.breakpoints.down('md')]: {
    width: '80%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginTop: '0rem',
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
    fontSize: '2.3rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.8rem',
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
      await axios.post(`${apiUrl}/contact`, { email, message });
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
    <div className='contactContainer'>
      
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
      
    </div>
  );
}

export default Contact;

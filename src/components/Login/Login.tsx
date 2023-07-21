import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  changeField,
  handleLogin,
  resetLoginState,
} from '../../store/reducers/login';
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  styled,
} from '@mui/material';

const WrapperLoginContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: '1rem',
  display: 'flex',
  justifyContent: 'center',
}));

const LoginContainer = styled('div')(({ theme }) => ({
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
  width: '55%',
  [theme.breakpoints.down('md')]: {
    width: '75%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

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

const INVALID_EMAIL_ERROR = 'Email non valide';
const INVALID_PASSWORD_ERROR =
  'Votre mot de passe doit être entre 6 et 20 caractères';

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const credentials = useAppSelector((state) => state.login.credentials);
  const isLoading = useAppSelector((state) => state.login.isLoading);
  const error = useAppSelector((state) => state.login.error);
  const isLogged = useAppSelector((state) => state.login.isLogged);

  const [errors, setErrors] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: '',
  });

  const handleChangeField =
    (name: 'email' | 'password') => (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(changeField({ value: event.target.value, name }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = {
      email: '',
      password: '',
    };

    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      validationErrors.email = INVALID_EMAIL_ERROR;
    }

    if (credentials.password.length < 6 || credentials.password.length > 20) {
      validationErrors.password = INVALID_PASSWORD_ERROR;
    }

    setErrors(validationErrors);

    const isValid = Object.values(validationErrors).every((error) => !error);
    // isValid retournera true si toutes les erreurs sont des chaînes de caractères vides
    // Cette validation est nécessaire pour empêcher l'utilisateur d'envoyer des données invalides
    // Mais ne remplace pas la validation côté serveur

    if (isValid) {
      // On envoie les données saisies par l'utilisateur au serveur
      void dispatch(handleLogin(credentials));
    }
  };

  useEffect(() => {
    return () => {
      // Réinitialisez l'état lorsque le composant est démonté
      dispatch(resetLoginState());
    };
  }, [dispatch]);

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté avec succès
    if (isLogged) {
      // Réinitialisez les états
      setErrors({ email: '', password: '' });
      // Redirigez vers la page d'accueil
      navigate('/');
    }
  }, [isLogged, dispatch, navigate]);

  return (
    <WrapperLoginContainer>
      <LoginContainer>
        <Title color="primary" variant="h4">
          Connexion
        </Title>
        <Form onSubmit={handleSubmit}>
          <TextField
            error={!!errors.email}
            helperText={errors.email}
            label="Email"
            required
            fullWidth
            margin="normal"
            variant="outlined"
            value={credentials.email}
            onChange={handleChangeField('email')}
          />

          <TextField
            error={!!errors.password}
            helperText={
              errors.password ||
              'Votre mot de passe doit être entre 6 et 20 caractères'
            }
            label="Mot de passe"
            required
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            value={credentials.password}
            onChange={handleChangeField('password')}
          />

          <Typography color="error">{error}</Typography>

          {isLoading ? (
            <Button variant="contained" color="primary" disabled>
              <CircularProgress size={24} color="inherit" />
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              Se connecter
            </Button>
          )}
        </Form>
      </LoginContainer>
    </WrapperLoginContainer>
  );
}

export default Login;

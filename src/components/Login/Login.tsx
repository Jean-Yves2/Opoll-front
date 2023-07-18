import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  changeField,
  handleLogin,
  resetLoginState,
} from '../../store/reducers/login';
import { useNavigate } from 'react-router';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

const Wrapper = styled('div')({
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

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const credentials = useAppSelector((state) => state.login.credentials);
  const isLoading = useAppSelector((state) => state.login.isLoading);
  const error = useAppSelector((state) => state.login.error);
  const isLogged = useAppSelector((state) => state.login.isLogged);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Reponsive :
  const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#1b1532',
    height: '80vh',
    width: isSmallScreen ? '100%' : '45%',
    borderRadius: '0.5rem',
    margin: '1rem',
  });

  const [errors, setErrors] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = {
      email: '',
      password: '',
    };

    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      validationErrors.email = 'Email non valide';
    }

    if (credentials.password.length < 6 || credentials.password.length > 20) {
      validationErrors.password =
        'Votre mot de passe doit être entre 6 et 20 caractères';
    }

    setErrors(validationErrors);

    const isValid = Object.values(validationErrors).every((error) => !error);

    if (isValid) {
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

  const handleChangeField =
    (name: 'email' | 'password') => (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(changeField({ value: event.target.value, name }));
    };

  return (
    <Wrapper>
      <Container>
        <Title color="secondary" variant="h4">
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
      </Container>
    </Wrapper>
  );
}

export default Login;

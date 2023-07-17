import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { changeField, handleSignup } from '../../store/reducers/signup';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { resetSignupState } from '../../store/reducers/signup';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#1b1532',
  height: '100vh',
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

function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const email = useAppSelector((state) => state.signup.credentials.email);
  const username = useAppSelector((state) => state.signup.credentials.username);
  const password = useAppSelector((state) => state.signup.credentials.password);
  const passwordConfirm = useAppSelector(
    (state) => state.signup.credentials.passwordConfirm
  );
  const isLoading = useAppSelector((state) => state.signup.isLoading);
  const error = useAppSelector((state) => state.signup.error);
  const snackbarSucess = useAppSelector((state) => state.signup.snackbarSucess);

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
    };

    if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email non valide';
    }

    if (username.length > 15) {
      validationErrors.username =
        'Votre username doit faire moins de 15 caractères';
    }

    if (password.length < 6 || password.length > 20) {
      validationErrors.password =
        'Votre mot de passe doit être entre 6 et 20 caractères';
    }

    if (passwordConfirm !== password) {
      validationErrors.passwordConfirm =
        'Les mots de passe ne correspondent pas';
    }

    setErrors(validationErrors);

    const isValid = Object.values(validationErrors).every((error) => !error);

    if (isValid) {
      void dispatch(
        handleSignup({ email, password, passwordConfirm, username })
      );
    }
  };

  useEffect(() => {
    return () => {
      // Réinitialisez l'état lorsque le composant est démonté
      dispatch(resetSignupState());
    };
  }, [dispatch]);

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté avec succès
    if (snackbarSucess) {
      // Réinitialisez les états
      setErrors({ email: '', password: '', username: '', passwordConfirm: '' });
      // Redirigez vers la page d'accueil
      navigate('/');
    }
  }, [snackbarSucess, dispatch, navigate]);

  const handleChangeField =
    (name: 'email' | 'password' | 'username' | 'passwordConfirm') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch(changeField({ value: event.target.value, name }));
    };

  return (
    <Container>
      <Title color="secondary" variant="h4">
        Inscription
      </Title>
      <Form onSubmit={handleSubmit}>
        <TextField
          error={!!errors.email}
          helperText={errors.email}
          label="Email"
          required
          value={email}
          onChange={(e) => handleChangeField('email')(e)}
          fullWidth
          margin="normal"
          variant="outlined"
          type="email"
        />

        <TextField
          error={!!errors.username}
          helperText={
            errors.username || 'Votre pseudo doit faire moins de 15 caractères'
          }
          label="Pseudo"
          required
          value={username}
          onChange={(e) => handleChangeField('username')(e)}
          fullWidth
          margin="normal"
          variant="outlined"
          type="text"
        />

        <TextField
          error={!!errors.password}
          helperText={
            errors.password ||
            'Votre mot de passe doit être entre 6 et 20 caractères'
          }
          label="Mot de passe"
          required
          value={password}
          onChange={(e) => handleChangeField('password')(e)}
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
        />

        <TextField
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm}
          label="Confirmer le mot de passe"
          required
          value={passwordConfirm}
          onChange={(e) => handleChangeField('passwordConfirm')(e)}
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
        />

        <Typography sx={{ ml: 4 }} color="error">
          {error}
        </Typography>

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
            S'inscrire
          </Button>
        )}
      </Form>
    </Container>
  );
}

export default Signup;

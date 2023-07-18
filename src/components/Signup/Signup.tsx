import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { handleSignup } from '../../store/reducers/signup';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router';
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

function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const containerClass = isSmallScreen
    ? 'container small-screen'
    : 'container large-screen';

  const isLoading = useAppSelector((state) => state.signup.isLoading);
  const error = useAppSelector((state) => state.signup.error);
  const snackbarSucess = useAppSelector((state) => state.signup.snackbarSucess);
  const isLogged = useAppSelector((state) => state.login.isLogged);
  const isSignupSuccess = useAppSelector(
    (state) => state.signup.isSignupSuccess
  );

  useEffect(() => {
    if (isSignupSuccess) {
      navigate('/'); // Redirigez l'utilisateur vers la page d'accueil après une inscription réussie
    }
  }, [isSignupSuccess, navigate]);

  useEffect(() => {
    if (isLogged) {
      // Rediriger l'utilisateur connecté vers une autre page
      // Pour l'empécher d'accéder à la page d'inscription
      navigate('/');
    }
  }, [isLogged, navigate]);

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });

  const [userInput, setUserInput] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });

  const validateInput = () => {
    const { email, username, password, passwordConfirm } = userInput;
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

    return validationErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateInput();

    setErrors(validationErrors);

    const isValid = Object.values(validationErrors).every((error) => !error);

    if (isValid) {
      void dispatch(handleSignup(userInput));
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté avec succès
    if (snackbarSucess) {
      // Réinitialisez les états
      setErrors({ email: '', password: '', username: '', passwordConfirm: '' });
      // Redirigez vers la page d'accueil
      navigate('/');
    }
  }, [snackbarSucess, dispatch, navigate]);

  return (
    <Wrapper>
      <div className={containerClass}>
        <Title color="secondary" variant="h4">
          Inscription
        </Title>
        <Form onSubmit={handleSubmit}>
          <TextField
            name="email"
            error={!!errors.email}
            helperText={errors.email}
            label="Email"
            required
            value={userInput.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type="email"
          />

          <TextField
            name="username"
            error={!!errors.username}
            helperText={
              errors.username ||
              'Votre pseudo doit faire moins de 15 caractères'
            }
            label="Pseudo"
            required
            value={userInput.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type="text"
          />

          <TextField
            name="password"
            error={!!errors.password}
            helperText={
              errors.password ||
              'Votre mot de passe doit être entre 6 et 20 caractères'
            }
            label="Mot de passe"
            required
            value={userInput.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
          />

          <TextField
            name="passwordConfirm"
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm}
            label="Confirmer le mot de passe"
            required
            value={userInput.passwordConfirm}
            onChange={handleChange}
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
      </div>
    </Wrapper>
  );
}

export default Signup;

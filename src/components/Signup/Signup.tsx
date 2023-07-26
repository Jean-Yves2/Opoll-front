import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { handleSignup, resetSignupSuccess } from '../../store/reducers/signup';
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  styled,
} from '@mui/material';

const WrapperSignupContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100dvh',
}));

const SignUpContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexDirection: 'column',
  height: 'auto',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
  width: '50%',
  [theme.breakpoints.down('md')]: {
    width: '75%',
  },
  [theme.breakpoints.down('sm')]: {
    height: '100vh',
    width: '100%',
    padding: '0.5rem 0.75rem',
    marginTop: '0rem',
    borderRadius: '0rem',
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

function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector((state) => state.signup.isLoading);
  const error = useAppSelector((state) => state.signup.error);
  const isLogged = useAppSelector((state) => state.login.isLogged);

  const snackbarSucess = useAppSelector((state) => state.signup.snackbarSucess);

  useEffect(() => {
    if (isLogged) {
      // Rediriger l'utilisateur connecté vers une autre page
      // Pour l'empécher d'accéder à la page d'inscription quand il est déjà connecté
      navigate('/');
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetSignupSuccess());
    };
  }, [dispatch]);

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    // On initialise les erreurs à une chaîne de caractères vide
  });

  const [userInput, setUserInput] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    // On initialise les valeurs à une chaîne de caractères vide
  });

  // Fonction pour valider les données saisies par l'utilisateur
  // Cette fonction retourne un objet contenant les erreurs de validation
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

    // Vérifiez si l'objet contenant les erreurs de validation est vide
    const isValid = Object.values(validationErrors).every((error) => !error);

    // isValid retournera true si toutes les erreurs sont des chaînes de caractères vides
    // Cette validation est nécessaire pour empêcher l'utilisateur d'envoyer des données invalides
    // Mais ne remplace pas la validation côté serveur
    if (isValid) {
      // On envoie les données saisies par l'utilisateur au serveur
      void dispatch(handleSignup(userInput));
    }
  };

  // HandleChange est appelée à chaque fois que l'utilisateur saisit quelque chose dans un champ de saisie
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
      // Il utilise la fonction de forme de setState, qui prend l'état précédent et renvoie le nouvel état.
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
    <WrapperSignupContainer>
      <SignUpContainer>
        <Title color="primary" variant="h4">
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
      </SignUpContainer>
    </WrapperSignupContainer>
  );
}

export default Signup;

import { FormEvent, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  handleLogin,
  changeField,
  resetLoginState,
} from '../../store/reducers/login';
import { toggleModal } from '../../store/reducers/login';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { useEffect } from 'react';

function LoginModal() {
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const password = useAppSelector((state) => state.login.credentials.password);
  const email = useAppSelector((state) => state.login.credentials.email);
  const open = useAppSelector((state) => state.login.open);
  const isLoading = useAppSelector((state) => state.login.isLoading);
  const error = useAppSelector((state) => state.login.error);
  const isLogged = useAppSelector((state) => state.login.isLogged);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (isLogged) {
      setOpenSnackbar(true);
    }
  }, [isLogged, openSnackbar]);

  const handleOpen = () => {
    dispatch(toggleModal(true));
  };

  const handleClose = () => {
    dispatch(toggleModal(false));
    // Reset login state when closing modal
    dispatch(resetLoginState());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = {
      email: '',
      password: '',
    };

    if (!email) {
      validationErrors.email = 'Champ obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email non valide';
    }

    if (!password) {
      validationErrors.password = 'Champ obligatoire';
    } else if (password.length < 6 || password.length > 20) {
      validationErrors.password =
        'Votre mot de passe doit être entre 6 et 20 caractères';
    }

    setErrors(validationErrors);

    const isValid = Object.values(validationErrors).every((error) => !error);

    if (isValid) {
      void dispatch(handleLogin({ email, password }));
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    dispatch(resetLoginState());
  };

  const handleChangeField = (name: 'email' | 'password') => (value: string) => {
    dispatch(changeField({ value, name }));
  };

  return (
    <>
      <Button
        variant="text"
        color="secondary"
        onClick={handleOpen}
        sx={{ mr: 1 }}
      >
        Se connecter
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth={!isMobile}
      >
        <DialogTitle>Connexion</DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              error={!!errors.email}
              helperText={errors.email}
              label="Email"
              value={email}
              onChange={(e) => handleChangeField('email')(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />

            <TextField
              error={!!errors.password}
              helperText={
                errors.password ||
                'Votre mot de passe doit être entre 6 et 20 caractères'
              }
              label="Mot de passe"
              value={password}
              onChange={(e) => handleChangeField('password')(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              type="password"
            />
          </DialogContent>

          <Typography sx={{ ml: 4 }} color="error">
            {error}
          </Typography>
          <DialogActions>
            <Button color="secondary" onClick={handleClose}>
              Annuler
            </Button>
            {isLoading ? (
              <Button variant="contained" color="primary" disabled>
                <CircularProgress size={24} color="inherit" />
              </Button>
            ) : (
              <Button variant="contained" color="primary" type="submit">
                Se connecter
              </Button>
            )}
          </DialogActions>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Connexion réussie !"
        />
      </Dialog>
    </>
  );
}

export default LoginModal;

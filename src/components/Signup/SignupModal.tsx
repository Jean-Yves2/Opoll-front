import { FormEvent } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleModal } from '../../store/reducers/signup';
import CircularProgress from '@mui/material/CircularProgress';
import { handleSignup, changeField } from '../../store/reducers/signup';
import { Typography } from '@mui/material';

function SignUpModal() {
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const email = useAppSelector((state) => state.signup.credentials.email);
  const username = useAppSelector((state) => state.signup.credentials.username);
  const password = useAppSelector((state) => state.signup.credentials.password);
  const passwordConfirm = useAppSelector(
    (state) => state.signup.credentials.passwordConfirm
  );
  const open = useAppSelector((state) => state.signup.open);
  const isLoading = useAppSelector((state) => state.signup.isLoading);
  const error = useAppSelector((state) => state.signup.error);

  const handleOpen = () => {
    dispatch(toggleModal(true));
  };

  const handleClose = () => {
    dispatch(toggleModal(false));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(handleSignup({ email, password, passwordConfirm, username }));
  };

  const handleChangeField =
    (name: 'email' | 'password' | 'username' | 'passwordConfirm') =>
    (value: string) => {
      dispatch(changeField({ value, name }));
    };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        sx={{ mr: 3 }}
      >
        S'inscrire
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth={!isMobile}
      >
        <DialogTitle>Inscription</DialogTitle>

        <DialogContent>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => handleChangeField('email')(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            type="email"
          />

          <TextField
            label="Username"
            value={username}
            onChange={(e) => handleChangeField('username')(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            type="text"
          />

          <TextField
            label="Mot de passe"
            value={password}
            onChange={(e) => handleChangeField('password')(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
          />

          <TextField
            label="Confirmer le mot de passe"
            value={passwordConfirm}
            onChange={(e) =>
              handleChangeField('passwordConfirm')(e.target.value)
            }
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit as () => void}
            >
              S'inscrire
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SignUpModal;

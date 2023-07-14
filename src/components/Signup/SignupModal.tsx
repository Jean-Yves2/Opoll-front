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

function SignUpModal() {
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const email = useAppSelector((state) => state.signup.credentials.email);
  const username = useAppSelector((state) => state.signup.credentials.username);
  const password = useAppSelector((state) => state.signup.credentials.password);
  const confirmPassword = useAppSelector(
    (state) => state.signup.credentials.confirmPassword
  );
  const open = useAppSelector((state) => state.signup.open);
  const isLoading = useAppSelector((state) => state.signup.isLoading);

  const handleOpen = () => {
    dispatch(toggleModal(true));
  };

  const handleClose = () => {
    dispatch(toggleModal(false));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(handleSignup({ email, password, confirmPassword, username }));
  };

  const handleChangeField =
    (name: 'email' | 'password' | 'username' | 'confirmPassword') =>
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
            value={confirmPassword}
            onChange={(e) =>
              handleChangeField('confirmPassword')(e.target.value)
            }
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
          />
        </DialogContent>

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

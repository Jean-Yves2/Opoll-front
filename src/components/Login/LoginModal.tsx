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
import { handleLogin, changeField } from '../../store/reducers/login';
import { toggleModal } from '../../store/reducers/login';

function LoginModal() {
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const password = useAppSelector((state) => state.login.credentials.password);
  const email = useAppSelector((state) => state.login.credentials.email);
  const open = useAppSelector((state) => state.login.open);

  const handleOpen = () => {
    dispatch(toggleModal(true));
  };

  const handleClose = () => {
    dispatch(toggleModal(false));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(handleLogin({ email, password }));
  };

  const handleChangeField = (name: 'email' | 'password') => (value: string) => {
    dispatch(changeField({ value, name }));
  };

  return (
    <>
      <Button variant="text" color="secondary" onClick={handleOpen}>
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

        <DialogContent>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => handleChangeField('email')(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
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
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit as () => void}
          >
            Se connecter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LoginModal;

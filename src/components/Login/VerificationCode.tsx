import { useEffect, FormEvent, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

import {
  TextField,
  Button,
  Typography,
  styled,
  CircularProgress,
  Dialog,
} from '@mui/material';
import {
  changeVerificationCode,
  handleVerification,
  resetVerificationError,
} from '../../store/reducers/login';

interface VerificationCodeProps {
  onClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onVerified: () => void;
}

const VerificationLoginContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '2rem',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: '1rem',
  fontSize: '1.5rem',
}));

const ParagraphTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.info.main,
  textAlign: 'center',
  marginBottom: '1rem',
  fontSize: '0.8rem',
}));

function VerificationCode({
  onClose,
  open,
  setOpen,
  onVerified,
}: VerificationCodeProps) {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) => state.login.isLoading);
  const isVerified = useAppSelector((state) => state.login.isVerified);
  const verificationCode = useAppSelector(
    (state) => state.login.verificationCode
  );
  const verificationError = useAppSelector(
    (state) => state.login.verificationError
  );

  const handleClose = () => {
    dispatch(resetVerificationError());
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    if (isVerified) {
      handleClose();
      onVerified();
    }
  }, [isVerified]);

  const handleChangeVerificationCode = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(changeVerificationCode(event.target.value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(handleVerification(verificationCode));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <VerificationLoginContainer>
        <TitleTypography>Vérification</TitleTypography>

        <ParagraphTypography>
          Afin de finaliser votre inscription, nous devons vérifier votre
          e-mail. Veuillez entrer le code de vérification que vous avez reçu par
          mail.
        </ParagraphTypography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Code de vérification"
            required
            fullWidth
            type="number"
            margin="normal"
            variant="outlined"
            value={verificationCode}
            onChange={handleChangeVerificationCode}
            sx={{ marginBottom: '0.5rem' }}
            error={verificationCode.length > 5}
            helperText={
              verificationCode.length > 5
                ? 'Le code ne peut excéder 5 caractères'
                : ' '
            }
          />
          <Typography color="error">{verificationError}</Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{ width: '100%' }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Vérifier'
            )}
          </Button>
        </form>
      </VerificationLoginContainer>
    </Dialog>
  );
}

export default VerificationCode;

import { useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { TextField, Button, Typography, styled } from '@mui/material';
import {
  changeVerificationCode,
  handleVerification,
} from '../../store/reducers/login';

const VerificationLoginWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  minHeight: '100vh',
}));

const VerificationLoginContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  height: 'auto',
  padding: '2rem',
  marginTop: '4rem',
  borderRadius: '1rem',
  boxShadow: '10px 20px 15px rgba(0, 0, 0, 0.4)',
  width: '30%',
  boxSizing: 'border-box',
  [theme.breakpoints.down('md')]: {
    width: '70%',
  },
  [theme.breakpoints.down('sm')]: {
    height: '100vh',
    width: '100%',
    borderRadius: '0rem',
    marginTop: '0rem',
  },
}));

function VerificationCode() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const verificationCode = useAppSelector(
    (state) => state.login.verificationCode
  );
  const isVerified = useAppSelector((state) => state.login.isVerified);
  const verificationError = useAppSelector(
    (state) => state.login.verificationError
  );

  const handleChangeVerificationCode = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(changeVerificationCode(event.target.value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(handleVerification(verificationCode));
  };

  useEffect(() => {
    if (isVerified) {
      navigate('/');
    }
  }, [isVerified, navigate]);

  return (
    <VerificationLoginWrapper>
      <VerificationLoginContainer>
        <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
          Vérification
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Code de vérification"
            required
            fullWidth
            margin="normal"
            variant="outlined"
            value={verificationCode}
            onChange={handleChangeVerificationCode}
            sx={{ marginBottom: '1rem' }}
          />
          <Typography color="error">{verificationError}</Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{ width: '100%' }}
          >
            Vérifier
          </Button>
        </form>
      </VerificationLoginContainer>
    </VerificationLoginWrapper>
  );
}

export default VerificationCode;

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { resetSnackbar } from '../../store/reducers/snackbar';
import { resetSignupState } from '../../store/reducers/signup';
import { resetLoginState } from '../../store/reducers/login';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AlertColor } from '@mui/material/Alert';

const ImageContainer = styled('div')({
  height: '100vh',
  width: '100%',
  backgroundImage:
    "url('https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
});

const PieChartContainer = styled('div')({
  height: '65vh',
  backgroundColor: '#1b1532',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '30%',
});

const PieChartWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '70%',
  marginLeft: '5%',
});

const PollContainer = styled('div')({
  height: '45vh',
  backgroundColor: '#120e21',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const ButtonPollContrainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '20%',
  width: '50%',
  marginBottom: '0.5rem',
});

const ColorContainer = styled('div')({
  height: '20vh',
  backgroundColor: '#1b1532',
});

const Title = styled(Typography)({
  color: '#F2BE22',
  fontSize: '4rem',
  textAlign: 'center',
  position: 'absolute',
  zIndex: 2,
});

function Home() {
  const dispatch = useAppDispatch();
  const snackbarLogged = useAppSelector((state) => state.snackbar.isLogged);
  const snackbarSuccessfullLogin = useAppSelector(
    (state) => state.login.snackbarSucess
  );
  const snackbarSucessSignup = useAppSelector(
    (state) => state.signup.snackbarSucess
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (!snackbarLogged) {
      setOpenSnackbar(true);
      setSnackbarMessage('Vous devez être connecté pour accéder à cette page.');
      setSnackbarSeverity('error');
      dispatch(resetSnackbar());
    } else if (snackbarSuccessfullLogin) {
      setOpenSnackbar(true);
      setSnackbarMessage('Connexion réussie !');
      setSnackbarSeverity('success');
      dispatch(resetLoginState);
    } else if (snackbarSucessSignup) {
      setOpenSnackbar(true);
      setSnackbarMessage('Inscription réussie !');
      setSnackbarSeverity('success');
      dispatch(resetSignupState);
    }
  }, [
    snackbarLogged,
    snackbarSuccessfullLogin,
    snackbarSucessSignup,
    dispatch,
  ]);

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>

      <ImageContainer>
        <Title variant="h1">O'Poll</Title>
      </ImageContainer>

      <PieChartContainer>
        <ButtonWrapper>
          <Button variant="contained" size="large" color="primary">
            Créer un sondage
          </Button>
        </ButtonWrapper>
        <PieChartWrapper>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10 },
                  { id: 1, value: 15 },
                  { id: 2, value: 20 },
                  { id: 3, value: 20 },
                ],
              },
            ]}
            width={500}
            height={250}
          />
        </PieChartWrapper>
      </PieChartContainer>

      <PollContainer>
        <ButtonPollContrainer>
          <Button variant="contained" size="large" color="primary">
            Option 1
          </Button>
        </ButtonPollContrainer>
        <ButtonPollContrainer>
          <Button variant="contained" size="large" color="primary">
            Option 2
          </Button>
        </ButtonPollContrainer>
        <ButtonPollContrainer>
          <Button variant="contained" size="large" color="primary">
            Option 3
          </Button>
        </ButtonPollContrainer>
        <ButtonPollContrainer>
          <Button variant="contained" size="large" color="primary">
            Option 4
          </Button>
        </ButtonPollContrainer>
      </PollContainer>

      <ColorContainer />
    </>
  );
}

export default Home;

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { resetSnackbar } from '../../store/reducers/snackbar';
import { resetSnackbarStatusSignup } from '../../store/reducers/signup';
import { resetSnackbarStatusLogin } from '../../store/reducers/login';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { PieChart } from '@mui/x-charts/PieChart';
import { Link as RouterLink } from 'react-router-dom';

const Wrapper = styled('div')({
  backgroundColor: '#3e3274',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  height: 'auto',
});

const Title = styled(Typography)({
  color: '#F2BE22',
  fontSize: '4rem',
  textAlign: 'center',
  position: 'absolute',
});

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

const PollExampleContainer = styled('div')({
  height: '70vh',
  width: '100%',
  backgroundColor: '#1b1532',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const LinearContainer = styled('div')({
  width: '80%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

const PieChartContainer = styled('div')({
  height: '60vh',
  width: '100%',
  backgroundColor: '#120e21',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ButtonContainer = styled('div')({
  height: '60vh',
  width: '100%',
  backgroundColor: '#1b1532',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

const ButtonPollContrainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '10vh',
});

const GetStarted = styled('div')({
  height: '40vh',
  width: '100%',
  backgroundColor: '#120e21',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
});

function Home() {
  const data = [
    { id: 0, value: 44, color: '#F44336', label: 'Réponse 1' },
    { id: 1, value: 26, color: '#2196F3', label: 'Réponse 2' },
    { id: 2, value: 20, color: '#4CAF50', label: 'Réponse 3' },
    { id: 3, value: 10, color: '#7f2f57', label: 'Réponse 4' },
  ];
  const dispatch = useAppDispatch();
  // Snackbar pour les utilisateurs non connectés
  const snackbarIsLogged = useAppSelector((state) => state.snackbar.isLogged);
  // Snackbar pour connexion réussie
  const snackbarSuccessLogin = useAppSelector(
    (state) => state.login.snackbarSucess
  );
  // Snackbar pour inscription réussie
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
    if (!snackbarIsLogged) {
      // Si je ne suis pas connecté, je veux que mon snackbar s'affiche
      setOpenSnackbar(true);
      setSnackbarMessage('Vous devez être connecté pour accéder à cette page.');
      setSnackbarSeverity('error');
      dispatch(resetSnackbar());
      // Puis je le réinitialise pour pas qu'il s'affiche à chaque fois que je reviens sur la page d'accueil
    } else if (snackbarSuccessLogin) {
      // Si ma connexion est réussie, je veux que mon snackbar s'affiche
      setOpenSnackbar(true);
      setSnackbarMessage('Connexion réussie !');
      setSnackbarSeverity('success');
      dispatch(resetSnackbarStatusLogin());
      // Puis je le réinitialise pour pas qu'il s'affiche à chaque fois que je reviens sur la page de connexion
    } else if (snackbarSucessSignup) {
      // Si mon inscription est réussie, je veux que mon snackbar s'affiche
      setOpenSnackbar(true);
      setSnackbarMessage('Inscription réussie !');
      setSnackbarSeverity('success');
      dispatch(resetSnackbarStatusSignup());
      // Puis je le réinitialise pour pas qu'il s'affiche à chaque fois que je reviens sur la page d'inscription
    }
  }, [snackbarIsLogged, snackbarSuccessLogin, snackbarSucessSignup, dispatch]);

  return (
    <Wrapper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>

      <ImageContainer>
        <Title variant="h1">O'Poll</Title>
      </ImageContainer>

      <PollExampleContainer>
        <LinearContainer>
          {data.map((item) => (
            <Box key={item.id} sx={{ width: '100%', marginBottom: '2rem' }}>
              <Typography
                variant="caption"
                sx={{ color: '#ffffff', fontSize: '1rem' }}
              >
                {item.label} ({item.value} Votes)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  color: item.color,
                  backgroundColor: '#212121',
                  height: '2rem',
                  border: '1px solid #565656',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: item.color,
                  },
                }}
              />
            </Box>
          ))}
        </LinearContainer>
      </PollExampleContainer>

      <PieChartContainer>
        <PieChart series={[{ data }]} width={500} height={300} />
      </PieChartContainer>

      <ButtonContainer>
        <ButtonPollContrainer>
          <Button variant="contained" size="large" color="primary">
            Réponse 1
          </Button>
        </ButtonPollContrainer>
        <ButtonPollContrainer>
          <Button variant="contained" size="large" color="primary">
            Réponse 2
          </Button>
        </ButtonPollContrainer>
        <ButtonPollContrainer>
          <Button variant="contained" size="large" color="primary">
            Réponse 3
          </Button>
        </ButtonPollContrainer>
        <ButtonPollContrainer>
          <Button variant="contained" size="large" color="primary">
            Réponse 4
          </Button>
        </ButtonPollContrainer>
      </ButtonContainer>
      <GetStarted>
        <Typography
          variant="h2"
          sx={{
            color: '#ffffff',
            fontSize: '2.5rem',
            textAlign: 'center',
            marginRight: '2rem',
          }}
        >
          Créez votre premier sondage !
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          component={RouterLink}
          to="/surveys/create"
          sx={{
            padding: '1rem 2rem',
          }}
        >
          Créer un sondage
        </Button>
      </GetStarted>
    </Wrapper>
  );
}

export default Home;

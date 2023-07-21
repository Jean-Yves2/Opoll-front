import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { resetSnackbar } from '../../store/reducers/snackbar';
import { resetSnackbarStatusSignup } from '../../store/reducers/signup';
import { resetSnackbarStatusLogin } from '../../store/reducers/login';
import {
  Typography,
  Button,
  Snackbar,
  Alert,
  AlertColor,
  styled,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const HomepageContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  height: 'auto',
}));

const Title = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '4rem',
  textAlign: 'center',
  position: 'absolute',
}));

const ImageContainer = styled('div')({
  height: '100vh',
  width: '100%',
  // Image de background, un peu flou coté desktop,sujet a changement
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

const PieChartContainer = styled('div')(({ theme }) => ({
  height: 'auto',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  paddingBottom: '2rem',
}));

const PollExampleContainer = styled('div')(({ theme }) => ({
  height: '80vh',
  width: '100%',
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}));

const ButtonPollContrainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'space-between',
  margin: '1rem',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    '& span': {
      fontSize: '1rem',
    },
  },
}));
0;

const GetStarted = styled('div')(({ theme }) => ({
  height: '40vh',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
}));

function Home() {
  const pieParams = { height: 350, margin: { right: 5 } };
  // Donnée statique pour le pie chart et les boutons de vote
  const data = [
    { id: 0, value: 44, color: '#F44336', textLeft: 'Paris', textRight: '44%' },
    {
      id: 1,
      value: 26,
      color: '#2196F3',
      textLeft: 'Marseille',
      textRight: '26%',
    },
    { id: 2, value: 20, color: '#4CAF50', textLeft: 'Lyon', textRight: '20%' },
    { id: 3, value: 10, color: '#7f2f57', textLeft: 'Nice', textRight: '10%' },
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
  const snackbarIsExpired = useAppSelector((state) => state.snackbar.isExpired);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Gestion d'affichage des différentes snackbar
  useEffect(() => {
    if (!snackbarIsLogged && snackbarIsExpired == false) {
      setOpenSnackbar(true);
      setSnackbarMessage('Vous devez être connecté pour accéder à cette page.');
      setSnackbarSeverity('error');
      dispatch(resetSnackbar());
    } else if (snackbarSuccessLogin) {
      setOpenSnackbar(true);
      setSnackbarMessage('Connexion réussie !');
      setSnackbarSeverity('success');
      dispatch(resetSnackbarStatusLogin());
    } else if (snackbarSucessSignup) {
      setOpenSnackbar(true);
      setSnackbarMessage('Inscription réussie !');
      setSnackbarSeverity('success');
      dispatch(resetSnackbarStatusSignup());
    } else if (snackbarIsExpired) {
      setOpenSnackbar(true);
      setSnackbarMessage('Votre session a expiré, veuillez vous reconnecter.');
      setSnackbarSeverity('error');
      dispatch(resetSnackbar());
    }
  }, [
    snackbarIsExpired,
    snackbarIsLogged,
    snackbarSuccessLogin,
    snackbarSucessSignup,
    dispatch,
  ]);

  return (
    <HomepageContainer>
      <Snackbar
        open={openSnackbar}
        // Durée d'affichage du snackbar en ms
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        {/* Type du snacker ainsi que son message */}
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>

      <ImageContainer>
        <Title>O'POLL</Title>
      </ImageContainer>

      <PieChartContainer>
        <Button
          variant="contained"
          size="large"
          color="primary"
          component={RouterLink}
          to="/surveys/create"
          sx={{ margin: '2rem 0 2rem 0' }}
        >
          Créer un sondage
        </Button>

        <Typography
          variant="h4"
          sx={{
            color: 'info.main',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Où partir en vacances cet été ?
        </Typography>

        {/* PieChart est un composant de la librairie MUI qui permet de créer des
        graphiques en camembert. Il est possible de le personnaliser en
        utilisant les props de la librairie. */}
        <PieChart
          series={[
            {
              data, // Donnée statiques définies plus haut
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30 },
              // Highlightscope et faded permettent de faire des effet sympa en survolant les camemberts
            },
          ]}
          {...pieParams} // Paramètres définis plus haut pour définir la taille du graphique
        />
      </PieChartContainer>

      {/* Bouton qui permettront de voter sur un sondage */}
      <PollExampleContainer>
        {/* boucle sur les données statiques pour créer les boutons */}
        {data.map((item) => (
          <ButtonPollContrainer key={item.id}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              style={{
                width: '80%',
                height: '6.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                // Gestion d'un texte coté gauche et coté droite
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  fontSize: '1.8rem',
                }}
              >
                {/* texte coté gauche (options du sondage) */}
                {item.textLeft}
              </span>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  color: item.color,
                  fontWeight: 'bold',
                  fontSize: '1.6rem',
                }}
              >
                {/* texte coté droit (pourcentage d'une option d'un sondage') */}
                {item.textRight}
              </span>
            </Button>
          </ButtonPollContrainer>
        ))}
      </PollExampleContainer>

      <GetStarted>
        <Typography
          variant="h2"
          sx={{
            color: 'info.main',
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
    </HomepageContainer>
  );
}

export default Home;

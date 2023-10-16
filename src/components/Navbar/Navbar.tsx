import DrawerList from './DrawerList';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { handleLogout } from '../../store/reducers/login';
import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  Grid,
  Typography,
  Button,
  Link,
  IconButton,
  Drawer,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PollIcon from '@mui/icons-material/Poll';

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const isMinMdScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isMaxMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const isLogged = useAppSelector((state) => state.login.isLogged);
  const pseudo = useAppSelector((state) => state.login.username);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Gestion de la couleur du background de la navbar
  const backgroundColor = theme.palette.background.paper;

  const menuItems = isLogged
    ? [
        { name: 'Créer un sondage', path: '/survey/create' },
        { name: 'Voir les sondages', path: '/surveys' },
        { name: 'Déconnexion', path: '/logout' },
      ]
    : [
        { name: "S'inscrire", path: '/signup' },
        { name: 'Se connecter', path: '/login' },
        { name: 'Sondages', path: '/surveys' },
      ];

  // Fonction qui gère le contenu du menu dropdown à partir du composant DrawerList
  const list = () => (
    <Box
      sx={{ width: '100%', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <DrawerList menuItems={menuItems} onLogout={handleLogoutClick} />
    </Box>
  );

  const NavbarContainer = styled('div')({
    position: 'relative',
    paddingTop: '4rem',
  });

  const LoginStateContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
  });

  const PseudoTypography = styled(Typography)({
    display: 'flex',
    alignItems: 'center',
    margin: '0 0.5rem',
  });

  // Fonction qui gère la déconnexion
  const handleLogoutClick = () => {
    dispatch(handleLogout());
    navigate('/');
  };

  // Fonction pour gérer l'ouverture et la fermeture du tiroir (drawer)
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
        // Gestion de l'accesibilité pour les personnes utilisant un clavier
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  return (
    <NavbarContainer>
      <AppBar position="fixed" sx={{ backgroundColor }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            {/* Gestion du logo  */}
            <Grid item>
              <Typography variant="h5" sx={{ ml: 3 }}>
                <Link
                  component={RouterLink}
                  to="/"
                  color="inherit"
                  underline="none"
                >
                  O'POLL
                </Link>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ ml: 0.3 }}
                >
                  <PollIcon sx={{ fontSize: 30 }} />
                </IconButton>
              </Typography>
            </Grid>

            {/* Gestion des boutons de la navbar en mode Desktop  (900px+) */}
            {isMinMdScreen && (
              <Grid item>
                <Button color="info" component={RouterLink} to="/surveys">
                  Consulter les sondages
                </Button>
              </Grid>
            )}

            {/* Si l'utilisateur est en mode Desktop (900px + de large) et il est connecté 
              affiche bouton déconnexion*/}
            {isMinMdScreen && (
              <Grid item>
                {isLogged ? (
                  // SI l'utilisateur est connecté alors bouton déconnexion affiché
                  <LoginStateContainer>
                    <PseudoTypography>Hello {pseudo}</PseudoTypography>
                    <Button
                      color="error"
                      variant="contained"
                      sx={{ ml: 2 }}
                      onClick={handleLogoutClick}
                    >
                      Déconnexion
                    </Button>
                  </LoginStateContainer>
                ) : (
                  // Sinon on l'invite à se créer un compte ou se connecter
                  <>
                    <Button
                      color="info"
                      component={RouterLink}
                      to="/login"
                      sx={{ marginRight: '0.5rem' }}
                    >
                      Se connecter
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component={RouterLink}
                      to="/signup"
                    >
                      S'inscrire
                    </Button>
                  </>
                )}
              </Grid>
            )}

            {/* Gestion de l'affichage du menu dropdown sur les écran mobile (900px-) */}
            {isMaxMdScreen && (
              <>
                {/* Icone menu dropdown */}
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={toggleDrawer(true)}
                >
                  {/* Si le menu dropdown est ouvert alors affiche l'icone close sinon affiche l'icone menu */}
                  {drawerOpen ? (
                    <CloseIcon sx={{ fontSize: 50 }} />
                  ) : (
                    <MenuIcon sx={{ fontSize: 50 }} />
                  )}
                </IconButton>
                {/* Gestion du drawer, style/transition et fonction pour ouvrir / fermer */}
                <Drawer
                  anchor="top"
                  transitionDuration={{
                    enter: 300,
                    exit: 150,
                  }}
                  open={drawerOpen}
                  onClose={toggleDrawer(false)}
                  sx={{
                    '& .MuiDrawer-paper': {
                      width: '100%',
                      height: '100vh',
                      background: 'transparent',
                      // Ajout du petit blur effect sur le drawer
                      backdropFilter: 'blur(10px)',
                    },
                  }}
                >
                  {/* Contenu du drawer qui est conenu dans le composant DrawerList */}
                  {list()}
                </Drawer>
              </>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </NavbarContainer>
  );
}

export default Navbar;

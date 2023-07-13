import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PollIcon from '@mui/icons-material/Poll';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { handleLogout } from '../../store/reducers/login';

import DarkModeToggle from './DarkModeToggle';
import LoginModal from '../Login/LoginModal';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function Navbar({ darkMode, toggleDarkMode }: DarkModeToggleProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMinMdScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isMaxMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const isLogged = useAppSelector((state) => state.login.isLogged);

  const handleLogoutClick = () => {
    dispatch(handleLogout());
  };

  const backgroundColor = darkMode
    ? theme.palette.background.paper
    : theme.palette.background.paper;

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const menuItems = [
    { name: 'Créer un sondage', path: '/surveys/create' }, // Si pas connecté, rediriger vers la page de connexion
    { name: "S'inscrire", path: '/' },
    { name: 'Se connecter', path: '/' },
  ];

  const list = () => (
    <Box
      sx={{ width: '100%', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PersonIcon sx={{ fontSize: '5em' }} />
        {menuItems.map((item) => (
          <ListItem
            key={item.name}
            component={RouterLink}
            to={item.path}
            sx={{
              padding: '40px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
            }}
          >
            <ListItemText>
              <Typography
                variant="h4"
                sx={{ textAlign: 'center' }}
                color="black"
              >
                {item.name}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 3 }}>
      <AppBar position="fixed" sx={{ backgroundColor, top: 0 }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
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
            {isMinMdScreen && (
              <Grid item>
                <Button
                  color="info"
                  component={RouterLink}
                  to="/surveys/create"
                >
                  Créer un sondage
                </Button>
              </Grid>
            )}
            {isMinMdScreen && (
              <Grid item>
                <DarkModeToggle
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
                {isLogged ? (
                  // SI l'utilisateur est connecté alors icone user (page profil par ex)
                  <>
                    <Button
                      color="error"
                      variant="contained"
                      sx={{ ml: 2 }}
                      onClick={handleLogoutClick}
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  // Sinon on l'invite à se créer un compte ou se connecter
                  <>
                    <LoginModal />
                    <Button color="primary" variant="contained" sx={{ mr: 3 }}>
                      S'inscrire
                    </Button>
                  </>
                )}
              </Grid>
            )}
            {isMaxMdScreen && (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={toggleDrawer(true)}
                >
                  {drawerOpen ? (
                    <CloseIcon sx={{ fontSize: 50 }} />
                  ) : (
                    <MenuIcon sx={{ fontSize: 50 }} />
                  )}
                </IconButton>
                <Drawer
                  anchor="top"
                  transitionDuration={{
                    enter: 500,
                    exit: 200,
                  }}
                  open={drawerOpen}
                  onClose={toggleDrawer(false)}
                  sx={{
                    '& .MuiDrawer-paper': {
                      width: '100%',
                      height: '100%',
                      background: 'transparent',
                    },
                  }}
                >
                  {list()}
                </Drawer>
              </>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

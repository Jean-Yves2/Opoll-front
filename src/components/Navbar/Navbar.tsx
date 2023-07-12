import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PollIcon from '@mui/icons-material/Poll';

function Navbar() {
  const theme = useTheme();
  const MinMdSize = useMediaQuery(theme.breakpoints.up('md'));
  const MaxMdSize = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);

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
    { name: 'S"inscrire', path: '/signup' },
    { name: 'Se connecter', path: '/login' },
  ];

  const list = () => (
    <Box
      sx={{ width: '100%', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
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
            sx={{ padding: '40px' }}
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
      <AppBar position="sticky" color="secondary">
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
                  onClick={toggleDrawer(true)}
                >
                  <PollIcon sx={{ fontSize: 30 }} />
                </IconButton>
              </Typography>
            </Grid>
            {MinMdSize && (
              <Grid item>
                <Button
                  color="primary"
                  component={RouterLink}
                  to="/surveys/create"
                >
                  Créer un sondage
                </Button>
              </Grid>
            )}
            {MinMdSize && (
              <Grid item>
                <Button color="primary" sx={{ mr: 3 }}>
                  Se connecter
                </Button>
                <Button color="primary" variant="outlined" sx={{ mr: 3 }}>
                  S'inscrire
                </Button>
              </Grid>
            )}
            {MaxMdSize && (
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

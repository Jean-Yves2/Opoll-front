import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';
import { Link as RouterLink } from 'react-router-dom';

const styles = {
  footer: {
    marginTop: 'auto',
  },
};

function Footer() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="primary" style={styles.footer}>
        <Toolbar>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ gap: '3rem' }}
              >
                <TwitterIcon />
                <FacebookIcon />
                <LinkedInIcon />
                <ShareIcon />
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box sx={{ backgroundColor: '#212121', color: '#ffffff' }}>
        <Toolbar>
          <Grid container justifyContent="space-around">
            <Grid item>
              <RouterLink to="/contact">Contactez nous</RouterLink>
            </Grid>
            <Grid item>
              <RouterLink to="/À-propos">A propos de nous</RouterLink>
            </Grid>
            <Grid item>
              <RouterLink to="/mentions-legales">Mentions légales</RouterLink>
            </Grid>
          </Grid>
        </Toolbar>
      </Box>
    </Box>
  );
}

export default Footer;

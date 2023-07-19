import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const styles = {
  footer: {
    marginTop: 'auto',
  },
};

function Footer() {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.paper;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        color="primary"
        style={{ ...styles.footer, backgroundColor }}
      >
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

        <Toolbar>
          <Grid container justifyContent="space-around">
            <Grid item>
              <StyledLink to="/contact">Contactez nous</StyledLink>
            </Grid>
            <Grid item>
              <StyledLink to="/A-propos">A propos de nous</StyledLink>
            </Grid>
            <Grid item>
              <StyledLink to="/mentions-legales">Mentions légales</StyledLink>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Footer;

import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Toolbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';

const FooterContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.info.main,
  textDecoration: 'none',
  fontSize: '1.2rem',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const SocialIconContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '3rem',
  width: '100%',
});

const LinkContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
});

function Footer() {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.paper;

  return (
    <FooterContainer>
      <AppBar position="sticky" style={{ backgroundColor }}>
        <Toolbar>
          <SocialIconContainer>
            <TwitterIcon />
            <FacebookIcon />
            <LinkedInIcon />
            <ShareIcon />
          </SocialIconContainer>
        </Toolbar>

        <Toolbar>
          <LinkContainer>
            <StyledLink to="/contact">Contacte</StyledLink>
            <StyledLink to="/a-propos">A propos</StyledLink>
            <StyledLink to="/mentions-legales">Mentions légales</StyledLink>
          </LinkContainer>
        </Toolbar>
      </AppBar>
    </FooterContainer>
  );
}

export default Footer;

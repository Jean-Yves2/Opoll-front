import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';
import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import CreateSurveys from '../CreateSurveys/CreateSurveys';
import Contact from '../Contact/Contact';
import MentionLegale from '../MentionLegale/MentionLegale';
import Apropos from '../Apropos/Apropos';
import SurveyList from '../SurveyList/SurveyList';
import Error from '../Error/Error';
import VoteResults from '../VoteResults/VoteResults';
import VotingStep from '../VotingStep/VotingStep';
import VerificationCode from '../Login/VerificationCode';

function App() {
  // Darkmode / Lightmode en standby pour le moment

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#F2BE22', // Jaune/Orange : Couleur des boutons a mettre en évidence
      },
      secondary: {
        main: '#1b1532', // Couleur des cards
      },
      info: {
        main: '#ffffff', // Blanc : Couleur du texte par défaut
      },
      error: {
        main: '#e3051e', // Rouge : Couleur pour indiquer une erreur
      },
      background: {
        paper: '#5a48a7', // Couleur navbar, footer
        default: '#3e3274', // Couleur pour le fond des pages
      },
    },
    typography: {
      fontFamily: 'Tektur, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/verification" element={<VerificationCode />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/surveys/create"
            element={<ProtectedRoutes element={CreateSurveys} />}
          />
          <Route
            path="/surveys/:id/vote"
            element={<ProtectedRoutes element={VotingStep} />}
          />

          {/* Composant pour présenter les résultats du sondage pas encore implémenté */}
          <Route path="/test" element={<VoteResults />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionLegale />} />
          <Route path="/a-propos" element={<Apropos />} />
          <Route path="/survey" element={<SurveyList />} />

          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;

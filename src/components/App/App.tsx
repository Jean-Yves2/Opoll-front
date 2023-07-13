import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

function App() {
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#D4ADFC', // Rose/Violet : Couleur des boutons a mettre en évidence
      },
      secondary: {
        main: '#000000', // A DEFINIR
      },
      info: {
        main: '#000000', // Noir : Couleur du texte par défaut
      },
      error: {
        main: '#e3051e', // Rouge : Couleur pour indiquer une erreur
      },
      background: {
        default: '#F8F6F4', // Ici mettre variante du background par ex
        paper: '#F8F6F4', // Blanc/Beige : Couleur du fond de la navbar par ex
      },
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#F2BE22', // Jaune/Orange : Couleur des boutons a mettre en évidence
      },
      secondary: {
        main: '#ffffff', // A DEFINIR
      },
      info: {
        main: '#ffffff', // Blanc : Couleur du texte par défaut
      },
      error: {
        main: '#e3051e', // Rouge : Couleur pour indiquer une erreur
      },
      background: {
        default: '#5a48a7', // Ici mettre variante du background par ex
        paper: '#5a48a7', // Violet : Couleur du fond de la navbar par ex
      },
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
    },
  });

  const [darkMode, setDarkMode] = useState(true);

  const theme = darkMode ? darkTheme : lightTheme;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes></Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;

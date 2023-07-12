import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';

function App() {
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#7289da',
      },
      secondary: {
        main: '#424549',
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
        main: '#7289da',
      },
      secondary: {
        main: '#424549',
      },
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
    },
  });

  const [darkMode, setDarkMode] = useState(false);

  const theme = darkMode ? darkTheme : lightTheme;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes></Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

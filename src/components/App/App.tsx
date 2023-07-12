import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const theme = createTheme({
    palette: {
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
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes></Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

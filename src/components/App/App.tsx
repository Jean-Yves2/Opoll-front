import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from '../Footer/Footer';

function App() {
  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Router>
        <Routes></Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

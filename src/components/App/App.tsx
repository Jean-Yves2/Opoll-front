import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Test from '../Footer/test';

function App() {
  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Router>
        <Test />
        <Routes></Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

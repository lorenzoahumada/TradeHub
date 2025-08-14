import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // tu página protegida
import ProductDetailPage from './pages/ProductDetailPage';
import PrivateRoute from './components/PrivateRoute';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


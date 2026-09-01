import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Risk from './pages/Risk';
import Users from './pages/Users';
import Settings from './pages/Settings';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f1ea' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

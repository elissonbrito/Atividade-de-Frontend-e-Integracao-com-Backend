import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PrivateRoute } from './components/ui';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Carros from './pages/Carros';
import Motos from './pages/Motos';
import MarcasRoupa from './pages/MarcasRoupa';
import Usuarios from './pages/Usuarios';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <PrivateRoute><Dashboard /></PrivateRoute>
      } />
      <Route path="/carros" element={
        <PrivateRoute><Carros /></PrivateRoute>
      } />
      <Route path="/motos" element={
        <PrivateRoute><Motos /></PrivateRoute>
      } />
      <Route path="/marcas-roupa" element={
        <PrivateRoute><MarcasRoupa /></PrivateRoute>
      } />
      <Route path="/usuarios" element={
        <PrivateRoute adminOnly><Usuarios /></PrivateRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

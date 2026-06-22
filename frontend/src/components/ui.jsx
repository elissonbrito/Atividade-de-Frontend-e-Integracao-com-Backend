import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

export const Spinner = ({ size = 'md' }) => {
  const s = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8';
  return <div className={`animate-spin rounded-full ${s} border-b-2 border-primary-600`} />;
};

export const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="text-center py-12">
    <div className="text-5xl mb-3">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    {action}
  </div>
);

export const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => (
  <Modal isOpen={isOpen} onClose={onCancel} title="Confirmar exclusão">
    <p className="text-gray-600 mb-6">{message || 'Tem certeza que deseja excluir este item?'}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onCancel} className="btn-secondary">Cancelar</button>
      <button onClick={onConfirm} className="btn-danger">Confirmar</button>
    </div>
  </Modal>
);

export const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary disabled:opacity-40 text-sm px-3 py-1"
      >← Anterior</button>
      <span className="text-sm text-gray-600">Página {page} de {pages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="btn-secondary disabled:opacity-40 text-sm px-3 py-1"
      >Próxima →</button>
    </div>
  );
};

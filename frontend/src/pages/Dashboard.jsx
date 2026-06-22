import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { carrosService, motosService, marcasRoupaService, usersService } from '../services/api';
import Layout from '../components/Layout';

const StatCard = ({ icon, label, value, to, color }) => (
  <Link to={to} className={`card hover:shadow-md transition-shadow cursor-pointer border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">
          {value === null ? <span className="text-lg text-gray-400">...</span> : value}
        </p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </Link>
);

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ carros: null, motos: null, marcas: null, users: null });

  useEffect(() => {
    const load = async () => {
      const [c, m, mr] = await Promise.allSettled([
        carrosService.list(1, 1),
        motosService.list(1, 1),
        marcasRoupaService.list(1, 1),
      ]);
      const usersRes = isAdmin ? await usersService.list().catch(() => null) : null;

      setStats({
        carros: c.status === 'fulfilled' ? c.value.data.total : '—',
        motos: m.status === 'fulfilled' ? m.value.data.total : '—',
        marcas: mr.status === 'fulfilled' ? mr.value.data.total : '—',
        users: usersRes ? usersRes.data.length : '—',
      });
    };
    load();
  }, [isAdmin]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="🚗" label="Carros cadastrados" value={stats.carros}
          to="/carros" color="border-blue-500" />
        <StatCard icon="🏍️" label="Motos cadastradas" value={stats.motos}
          to="/motos" color="border-green-500" />
        <StatCard icon="👗" label="Marcas de roupa" value={stats.marcas}
          to="/marcas-roupa" color="border-purple-500" />
        {isAdmin && (
          <StatCard icon="👥" label="Usuários" value={stats.users}
            to="/usuarios" color="border-orange-500" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { to: '/carros', icon: '🚗', label: 'Gerenciar Carros', desc: 'Cadastre e edite veículos', color: 'from-blue-500 to-blue-700' },
          { to: '/motos', icon: '🏍️', label: 'Gerenciar Motos', desc: 'Cadastre e edite motos', color: 'from-green-500 to-green-700' },
          { to: '/marcas-roupa', icon: '👗', label: 'Marcas de Roupa', desc: 'Gerencie marcas de vestuário', color: 'from-purple-500 to-purple-700' },
        ].map(({ to, icon, label, desc, color }) => (
          <Link key={to} to={to}
            className={`rounded-xl p-6 text-white bg-gradient-to-br ${color} hover:shadow-lg transition-shadow`}>
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-lg">{label}</h3>
            <p className="text-sm opacity-80 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

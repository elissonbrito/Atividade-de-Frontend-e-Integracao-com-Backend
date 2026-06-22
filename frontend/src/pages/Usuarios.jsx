import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { Modal, ConfirmDialog, Badge, EmptyState, Spinner } from '../components/ui';
import { usersService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Usuarios() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersService.list();
      setUsers(res.data);
    } catch {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (u) => {
    setEditTarget(u);
    setForm({ name: u.name, email: u.email, role: u.role, password: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;
      await usersService.update(editTarget.id, payload);
      toast.success('Usuário atualizado!');
      setEditTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await usersService.remove(deleteTarget.id);
      toast.success('Usuário removido!');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Erro ao remover usuário');
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          👥 Usuários
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Gerenciamento de usuários do sistema (somente admin)</p>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : users.length === 0 ? (
          <EmptyState icon="👥" title="Nenhum usuário encontrado" description="Cadastre usuários via registro." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="table-th">ID</th>
                  <th className="table-th">Nome</th>
                  <th className="table-th">E-mail</th>
                  <th className="table-th">Perfil</th>
                  <th className="table-th">Criado em</th>
                  <th className="table-th text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${u.id === currentUser?.id ? 'bg-blue-50/50' : ''}`}>
                    <td className="table-td text-gray-400">#{u.id}</td>
                    <td className="table-td font-medium">
                      {u.name}
                      {u.id === currentUser?.id && <span className="ml-2 text-xs text-primary-600">(você)</span>}
                    </td>
                    <td className="table-td">{u.email}</td>
                    <td className="table-td">
                      <Badge color={u.role === 'admin' ? 'purple' : 'blue'}>{u.role}</Badge>
                    </td>
                    <td className="table-td text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(u)}
                          className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={u.id === currentUser?.id}
                          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Editar Usuário">
        <form onSubmit={handleSave} className="space-y-4">
          {[
            { name: 'name', label: 'Nome', type: 'text', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            { name: 'password', label: 'Nova Senha (deixe em branco para não alterar)', type: 'password', required: false },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                className="input"
                required={f.required}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            <select name="role" value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })} className="input">
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setEditTarget(null)} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        message={`Deseja realmente excluir o usuário "${deleteTarget?.name}"?`}
      />
    </Layout>
  );
}

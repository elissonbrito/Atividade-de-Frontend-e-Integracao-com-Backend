import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { Modal, ConfirmDialog, Pagination, EmptyState, Spinner, Badge } from '../components/ui';

/**
 * CrudPage genérico — recebe configuração e renderiza lista + formulário CRUD.
 */
export default function CrudPage({ config }) {
  const { title, icon, service, fields, formatRow, badgeField } = config;

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await service.list(page, 10);
      setItems(res.data.data);
      setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total });
    } catch {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => { load(1); }, [load]);

  const initForm = () => {
    const init = {};
    fields.forEach(f => { init[f.name] = f.default ?? ''; });
    return init;
  };

  const openCreate = () => {
    setEditing(null);
    setFormData(initForm());
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    const fd = {};
    fields.forEach(f => { fd[f.name] = item[f.name] ?? f.default ?? ''; });
    setFormData(fd);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Coerce number fields
      const payload = { ...formData };
      fields.forEach(f => {
        if (f.type === 'number') payload[f.name] = Number(payload[f.name]);
      });

      if (editing) {
        await service.update(editing._id, payload);
        toast.success('Atualizado com sucesso!');
      } else {
        await service.create(payload);
        toast.success('Criado com sucesso!');
      }
      setModalOpen(false);
      load(pagination.page);
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao salvar';
      const errors = err.response?.data?.errors;
      toast.error(errors ? errors[0] : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await service.remove(deleteTarget._id);
      toast.success('Removido com sucesso!');
      setDeleteTarget(null);
      load(pagination.page);
    } catch {
      toast.error('Erro ao remover');
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>{icon}</span> {title}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: {pagination.total} registros</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <span>+</span> Novo {title.replace(/s$/, '')}
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={icon}
            title={`Nenhum ${title.toLowerCase()} encontrado`}
            description="Clique em 'Novo' para cadastrar o primeiro item."
            action={<button onClick={openCreate} className="btn-primary">Cadastrar agora</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {formatRow.headers.map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                  <th className="table-th text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    {formatRow.cells(item).map((cell, i) => (
                      <td key={i} className="table-td">
                        {badgeField && i === formatRow.badgeIndex ? (
                          <Badge color={badgeField.colorMap[cell] || 'gray'}>{cell}</Badge>
                        ) : cell}
                      </td>
                    ))}
                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                        >Editar</button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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

      <Pagination page={pagination.page} pages={pagination.pages} onChange={load} />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Editar ${title.replace(/s$/, '')}` : `Novo ${title.replace(/s$/, '')}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              {f.type === 'select' ? (
                <select name={f.name} value={formData[f.name] || ''} onChange={handleChange} className="input">
                  {f.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : f.type === 'checkbox' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name={f.name} checked={!!formData[f.name]} onChange={handleChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">{f.checkLabel || 'Ativo'}</span>
                </label>
              ) : (
                <input
                  type={f.type || 'text'}
                  name={f.name}
                  value={formData[f.name] ?? ''}
                  onChange={handleChange}
                  className="input"
                  placeholder={f.placeholder}
                  required={f.required !== false}
                  min={f.min}
                  max={f.max}
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : editing ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        message={`Deseja realmente excluir este registro? Esta ação não pode ser desfeita.`}
      />
    </Layout>
  );
}

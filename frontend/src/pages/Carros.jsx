import CrudPage from '../components/CrudPage';
import { carrosService } from '../services/api';

const ano = new Date().getFullYear();

const config = {
  title: 'Carros',
  icon: '🚗',
  service: carrosService,
  fields: [
    { name: 'marca', label: 'Marca', placeholder: 'Ex: Toyota', required: true },
    { name: 'modelo', label: 'Modelo', placeholder: 'Ex: Corolla', required: true },
    { name: 'ano', label: 'Ano', type: 'number', min: 1886, max: ano + 1, placeholder: '2023', required: true },
    { name: 'cor', label: 'Cor', placeholder: 'Ex: Prata', required: true },
    { name: 'preco', label: 'Preço (R$)', type: 'number', min: 0, placeholder: '80000', required: true },
    {
      name: 'combustivel', label: 'Combustível', type: 'select',
      default: 'flex',
      options: [
        { value: 'flex', label: 'Flex' },
        { value: 'gasolina', label: 'Gasolina' },
        { value: 'etanol', label: 'Etanol' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'eletrico', label: 'Elétrico' },
        { value: 'hibrido', label: 'Híbrido' },
      ],
    },
    { name: 'quilometragem', label: 'Quilometragem', type: 'number', min: 0, default: 0, required: false },
  ],
  formatRow: {
    headers: ['Marca', 'Modelo', 'Ano', 'Cor', 'Combustível', 'Preço', 'KM'],
    cells: (item) => [
      item.marca,
      item.modelo,
      item.ano,
      item.cor,
      item.combustivel,
      `R$ ${Number(item.preco).toLocaleString('pt-BR')}`,
      `${Number(item.quilometragem || 0).toLocaleString('pt-BR')} km`,
    ],
    badgeIndex: 4,
  },
  badgeField: {
    colorMap: { flex: 'green', gasolina: 'blue', etanol: 'yellow', diesel: 'gray', eletrico: 'purple', hibrido: 'blue' },
  },
};

export default function Carros() {
  return <CrudPage config={config} />;
}

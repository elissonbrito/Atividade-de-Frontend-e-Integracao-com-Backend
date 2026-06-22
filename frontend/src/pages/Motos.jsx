import CrudPage from '../components/CrudPage';
import { motosService } from '../services/api';

const ano = new Date().getFullYear();

const config = {
  title: 'Motos',
  icon: '🏍️',
  service: motosService,
  fields: [
    { name: 'marca', label: 'Marca', placeholder: 'Ex: Honda', required: true },
    { name: 'modelo', label: 'Modelo', placeholder: 'Ex: CB 500F', required: true },
    { name: 'ano', label: 'Ano', type: 'number', min: 1885, max: ano + 1, placeholder: '2023', required: true },
    { name: 'cilindradas', label: 'Cilindradas (cc)', type: 'number', min: 50, max: 2500, placeholder: '500', required: true },
    { name: 'cor', label: 'Cor', placeholder: 'Ex: Vermelha', required: true },
    { name: 'preco', label: 'Preço (R$)', type: 'number', min: 0, placeholder: '25000', required: true },
    {
      name: 'tipo', label: 'Tipo', type: 'select', default: 'naked',
      options: [
        { value: 'naked', label: 'Naked' },
        { value: 'esportiva', label: 'Esportiva' },
        { value: 'touring', label: 'Touring' },
        { value: 'trail', label: 'Trail' },
        { value: 'custom', label: 'Custom' },
        { value: 'scooter', label: 'Scooter' },
        { value: 'off-road', label: 'Off-Road' },
      ],
    },
  ],
  formatRow: {
    headers: ['Marca', 'Modelo', 'Ano', 'Cilindradas', 'Cor', 'Tipo', 'Preço'],
    cells: (item) => [
      item.marca,
      item.modelo,
      item.ano,
      `${item.cilindradas} cc`,
      item.cor,
      item.tipo,
      `R$ ${Number(item.preco).toLocaleString('pt-BR')}`,
    ],
    badgeIndex: 5,
  },
  badgeField: {
    colorMap: { naked: 'blue', esportiva: 'red', touring: 'green', trail: 'yellow', custom: 'purple', scooter: 'gray', 'off-road': 'yellow' },
  },
};

export default function Motos() {
  return <CrudPage config={config} />;
}

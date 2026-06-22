import CrudPage from '../components/CrudPage';
import { marcasRoupaService } from '../services/api';

const config = {
  title: 'Marcas de Roupa',
  icon: '👗',
  service: marcasRoupaService,
  fields: [
    { name: 'nome', label: 'Nome da Marca', placeholder: 'Ex: Nike', required: true },
    { name: 'pais', label: 'País de Origem', placeholder: 'Ex: Estados Unidos', required: true },
    {
      name: 'segmento', label: 'Segmento', type: 'select', default: 'casual',
      options: [
        { value: 'casual', label: 'Casual' },
        { value: 'esporte', label: 'Esporte' },
        { value: 'luxo', label: 'Luxo' },
        { value: 'streetwear', label: 'Streetwear' },
        { value: 'moda-praia', label: 'Moda Praia' },
        { value: 'plus-size', label: 'Plus Size' },
        { value: 'infantil', label: 'Infantil' },
      ],
    },
    { name: 'fundacao', label: 'Ano de Fundação', type: 'number', min: 1800, max: new Date().getFullYear(), placeholder: '1964', required: true },
    { name: 'website', label: 'Website (opcional)', placeholder: 'https://exemplo.com', required: false },
    { name: 'ativa', label: 'Ativa', type: 'checkbox', default: true, checkLabel: 'Marca ativa no mercado', required: false },
  ],
  formatRow: {
    headers: ['Nome', 'País', 'Segmento', 'Fundação', 'Ativa'],
    cells: (item) => [
      item.nome,
      item.pais,
      item.segmento,
      item.fundacao,
      item.ativa ? '✅ Sim' : '❌ Não',
    ],
    badgeIndex: 2,
  },
  badgeField: {
    colorMap: { casual: 'blue', esporte: 'green', luxo: 'purple', streetwear: 'yellow', 'moda-praia': 'blue', 'plus-size': 'gray', infantil: 'yellow' },
  },
};

export default function MarcasRoupa() {
  return <CrudPage config={config} />;
}

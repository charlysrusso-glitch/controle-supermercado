import { Sector, ChecklistItem, User, Checklist, NonConformity } from './types';

// Dados mockados para demonstração

export const SECTORS: Sector[] = [
  { id: 'padaria', name: 'Padaria', color: 'bg-amber-500', icon: 'Croissant' },
  { id: 'acougue', name: 'Açougue', color: 'bg-red-500', icon: 'Beef' },
  { id: 'hortifruti', name: 'Hortifruti', color: 'bg-green-500', icon: 'Apple' },
  { id: 'checkout', name: 'Checkout', color: 'bg-blue-500', icon: 'CreditCard' },
  { id: 'limpeza', name: 'Limpeza', color: 'bg-cyan-500', icon: 'Sparkles' },
  { id: 'camaras', name: 'Câmaras Frias', color: 'bg-indigo-500', icon: 'Snowflake' },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Padaria
  { id: 'pad_001', title: 'Limpeza dos fornos e bancadas', description: 'Higienização completa dos fornos e bancadas', isCritical: true, requiresPhoto: true, sector: 'padaria', order: 1 },
  { id: 'pad_002', title: 'Conferência da temperatura dos fornos', description: 'Verificar se temperatura está adequada', isCritical: true, requiresPhoto: true, sector: 'padaria', order: 2 },
  { id: 'pad_003', title: 'Montagem da vitrine', description: 'Organizar produtos com etiquetas de preço', isCritical: false, requiresPhoto: true, sector: 'padaria', order: 3 },
  { id: 'pad_004', title: 'Verificação de validade', description: 'Conferir validade dos produtos expostos', isCritical: true, requiresPhoto: false, sector: 'padaria', order: 4 },
  { id: 'pad_005', title: 'Registro de produção', description: 'Anotar produção e descarte do dia', isCritical: false, requiresPhoto: false, sector: 'padaria', order: 5 },

  // Açougue
  { id: 'aco_001', title: 'Temperatura da câmara fria', description: 'Conferir se está ≤ 4°C', isCritical: true, requiresPhoto: true, sector: 'acougue', order: 1 },
  { id: 'aco_002', title: 'Higienização de utensílios', description: 'Limpar facas, tábuas e balcões', isCritical: true, requiresPhoto: true, sector: 'acougue', order: 2 },
  { id: 'aco_003', title: 'Etiquetas de validade', description: 'Conferir etiquetas de validade e lote', isCritical: true, requiresPhoto: false, sector: 'acougue', order: 3 },
  { id: 'aco_004', title: 'Montagem da vitrine', description: 'Organizar carnes na vitrine refrigerada', isCritical: false, requiresPhoto: true, sector: 'acougue', order: 4 },
  { id: 'aco_005', title: 'Verificação de EPI', description: 'Conferir se funcionários estão com EPI', isCritical: true, requiresPhoto: false, sector: 'acougue', order: 5 },

  // Hortifruti
  { id: 'hor_001', title: 'Retirada de produtos estragados', description: 'Remover frutas e verduras passadas', isCritical: true, requiresPhoto: false, sector: 'hortifruti', order: 1 },
  { id: 'hor_002', title: 'Reposição FIFO', description: 'Seguir primeiro que entra, primeiro que sai', isCritical: false, requiresPhoto: false, sector: 'hortifruti', order: 2 },
  { id: 'hor_003', title: 'Higienização das bancadas', description: 'Limpar bancadas e cestos', isCritical: true, requiresPhoto: true, sector: 'hortifruti', order: 3 },
  { id: 'hor_004', title: 'Conferência de etiquetas', description: 'Verificar etiquetas de preço', isCritical: false, requiresPhoto: false, sector: 'hortifruti', order: 4 },
  { id: 'hor_005', title: 'Registro de perdas', description: 'Anotar produtos descartados', isCritical: false, requiresPhoto: false, sector: 'hortifruti', order: 5 },

  // Checkout
  { id: 'che_001', title: 'Conferência do troco', description: 'Verificar fundo de troco disponível', isCritical: true, requiresPhoto: false, sector: 'checkout', order: 1 },
  { id: 'che_002', title: 'Teste dos terminais POS', description: 'Testar funcionamento dos terminais', isCritical: true, requiresPhoto: false, sector: 'checkout', order: 2 },
  { id: 'che_003', title: 'Verificação de materiais', description: 'Conferir bobinas e materiais disponíveis', isCritical: false, requiresPhoto: false, sector: 'checkout', order: 3 },
  { id: 'che_004', title: 'Organização do caixa', description: 'Limpar e organizar área do caixa', isCritical: false, requiresPhoto: true, sector: 'checkout', order: 4 },
  { id: 'che_005', title: 'Sinalização', description: 'Verificar sinalização de fila preferencial', isCritical: false, requiresPhoto: false, sector: 'checkout', order: 5 },

  // Limpeza
  { id: 'lim_001', title: 'Higienização de banheiros', description: 'Limpeza completa dos banheiros', isCritical: true, requiresPhoto: true, sector: 'limpeza', order: 1 },
  { id: 'lim_002', title: 'Limpeza de corredores', description: 'Limpar corredores e áreas comuns', isCritical: false, requiresPhoto: false, sector: 'limpeza', order: 2 },
  { id: 'lim_003', title: 'Lixeiras', description: 'Esvaziar e higienizar lixeiras', isCritical: true, requiresPhoto: false, sector: 'limpeza', order: 3 },
  { id: 'lim_004', title: 'Depósito de limpeza', description: 'Organizar depósito de materiais', isCritical: false, requiresPhoto: false, sector: 'limpeza', order: 4 },
  { id: 'lim_005', title: 'Produtos químicos', description: 'Conferir identificação dos produtos', isCritical: true, requiresPhoto: false, sector: 'limpeza', order: 5 },

  // Câmaras Frias
  { id: 'cam_001', title: 'Conferência da temperatura', description: 'Verificar temperatura no visor', isCritical: true, requiresPhoto: true, sector: 'camaras', order: 1 },
  { id: 'cam_002', title: 'Vedação das portas', description: 'Checar se portas estão vedando bem', isCritical: true, requiresPhoto: false, sector: 'camaras', order: 2 },
  { id: 'cam_003', title: 'Produtos no chão', description: 'Garantir que não há produtos no chão', isCritical: true, requiresPhoto: false, sector: 'camaras', order: 3 },
  { id: 'cam_004', title: 'Organização interna', description: 'Organizar produtos dentro da câmara', isCritical: false, requiresPhoto: true, sector: 'camaras', order: 4 },
];

export const MOCK_USERS: User[] = [
  { id: '1', name: 'João Silva', email: 'joao@supermercado.com', role: 'admin', sector: 'administracao', shift: 'manhã' },
  { id: '2', name: 'Maria Santos', email: 'maria@supermercado.com', role: 'manager', sector: 'geral', shift: 'manhã' },
  { id: '3', name: 'Pedro Costa', email: 'pedro@supermercado.com', role: 'employee', sector: 'padaria', shift: 'manhã' },
  { id: '4', name: 'Ana Oliveira', email: 'ana@supermercado.com', role: 'employee', sector: 'acougue', shift: 'tarde' },
  { id: '5', name: 'Carlos Lima', email: 'carlos@supermercado.com', role: 'employee', sector: 'hortifruti', shift: 'manhã' },
];

// Função para obter itens do checklist por setor
export function getChecklistItemsBySector(sector: string): ChecklistItem[] {
  return CHECKLIST_ITEMS.filter(item => item.sector === sector).sort((a, b) => a.order - b.order);
}

// Função para obter setor por ID
export function getSectorById(sectorId: string): Sector | undefined {
  return SECTORS.find(sector => sector.id === sectorId);
}
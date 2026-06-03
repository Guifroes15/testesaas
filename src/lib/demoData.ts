import type { Store, MonthData } from '@/types'

function mes(label: string, chave: string, overrides: Partial<MonthData> = {}): MonthData {
  const mensagens = overrides.mensagens ?? 800
  const conversao = overrides.conversao ?? 4.5
  const qtdVendas = Math.round(mensagens * (conversao / 100))
  const ticketMedio = overrides.ticketMedio ?? 320
  const vendas = qtdVendas * ticketMedio
  const verba = overrides.verba ?? 3500
  const impressoes = Math.round(verba * 280)
  const cliques    = Math.round(impressoes * 0.018)
  const conversoes = Math.round(cliques * 0.22)

  return {
    mes: label,
    chave,
    vendas,
    faturamentoLoja: Math.round(vendas * 0.87),
    conversao,
    mensagens,
    qtdVendas,
    ticketMedio,
    pctAureFat: 8,
    verba,
    metaAds: {
      investimento: verba,
      alcance: Math.round(verba * 180),
      impressoes,
      cliques,
      conversoes,
      cpc: parseFloat((verba / cliques).toFixed(2)),
      cpm: parseFloat(((verba / impressoes) * 1000).toFixed(2)),
      ctr: parseFloat(((cliques / impressoes) * 100).toFixed(2)),
      roas: parseFloat((vendas / verba).toFixed(2)),
    },
    ...overrides,
  }
}

export const DEMO_STORES: Store[] = [
  {
    id: 'loja-centro',
    workspaceId: 'demo-workspace',
    name: 'Loja Centro',
    color: '#22c55e',
    fee: 8,
    historico: [
      mes('Jan/25', '2025-01', { mensagens: 720, conversao: 4.1, ticketMedio: 298, verba: 3200 }),
      mes('Fev/25', '2025-02', { mensagens: 680, conversao: 3.8, ticketMedio: 305, verba: 2900 }),
      mes('Mar/25', '2025-03', { mensagens: 810, conversao: 4.4, ticketMedio: 312, verba: 3600 }),
      mes('Abr/25', '2025-04', { mensagens: 870, conversao: 4.7, ticketMedio: 321, verba: 3800 }),
      mes('Mai/25', '2025-05', { mensagens: 920, conversao: 5.0, ticketMedio: 334, verba: 4100 }),
      mes('Jun/25', '2025-06', { mensagens: 980, conversao: 5.3, ticketMedio: 348, verba: 4400 }),
    ],
    planos: [
      { id: '1', tarefa: 'Criar carrossel de lançamento de coleção verão', status: 'Alta' },
      { id: '2', tarefa: 'Revisar copy dos anúncios de remarketing', status: 'Média' },
      { id: '3', tarefa: 'Testar novo criativo em formato Reels', status: 'Teste' },
      { id: '4', tarefa: 'Campanha de aniversário da loja', status: 'Sucesso' },
      { id: '5', tarefa: 'Segmentar público lookalike de compradores', status: 'Baixa' },
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loja-norte',
    workspaceId: 'demo-workspace',
    name: 'Loja Norte',
    color: '#3b82f6',
    fee: 8,
    historico: [
      mes('Jan/25', '2025-01', { mensagens: 610, conversao: 3.9, ticketMedio: 275, verba: 2800 }),
      mes('Fev/25', '2025-02', { mensagens: 590, conversao: 3.5, ticketMedio: 280, verba: 2600 }),
      mes('Mar/25', '2025-03', { mensagens: 650, conversao: 4.0, ticketMedio: 288, verba: 3000 }),
      mes('Abr/25', '2025-04', { mensagens: 700, conversao: 4.2, ticketMedio: 292, verba: 3200 }),
      mes('Mai/25', '2025-05', { mensagens: 730, conversao: 4.5, ticketMedio: 301, verba: 3400 }),
      mes('Jun/25', '2025-06', { mensagens: 760, conversao: 4.7, ticketMedio: 315, verba: 3600 }),
    ],
    planos: [
      { id: '1', tarefa: 'Aumentar frequência de posts para 5x/semana', status: 'Alta' },
      { id: '2', tarefa: 'Criar sequência de Stories de depoimentos', status: 'Média' },
      { id: '3', tarefa: 'A/B test headline no anúncio principal', status: 'Teste' },
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loja-sul',
    workspaceId: 'demo-workspace',
    name: 'Loja Sul',
    color: '#f59e0b',
    fee: 8,
    historico: [
      mes('Jan/25', '2025-01', { mensagens: 540, conversao: 3.2, ticketMedio: 260, verba: 2400 }),
      mes('Fev/25', '2025-02', { mensagens: 500, conversao: 2.9, ticketMedio: 255, verba: 2200 }),
      mes('Mar/25', '2025-03', { mensagens: 580, conversao: 3.4, ticketMedio: 268, verba: 2600 }),
      mes('Abr/25', '2025-04', { mensagens: 620, conversao: 3.6, ticketMedio: 272, verba: 2800 }),
      mes('Mai/25', '2025-05', { mensagens: 650, conversao: 3.8, ticketMedio: 278, verba: 3000 }),
      mes('Jun/25', '2025-06', { mensagens: 690, conversao: 3.9, ticketMedio: 284, verba: 3100 }),
    ],
    planos: [
      { id: '1', tarefa: 'Revisar segmentação de público do catálogo', status: 'Alta' },
      { id: '2', tarefa: 'Criar oferta relâmpago para reativar leads frios', status: 'Alta' },
      { id: '3', tarefa: 'Novo vídeo de apresentação da loja', status: 'Baixa' },
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loja-shopping',
    workspaceId: 'demo-workspace',
    name: 'Loja Shopping MG',
    color: '#8b5cf6',
    fee: 9,
    historico: [
      mes('Jan/25', '2025-01', { mensagens: 1020, conversao: 5.8, ticketMedio: 410, verba: 5200 }),
      mes('Fev/25', '2025-02', { mensagens: 980, conversao: 5.5, ticketMedio: 398, verba: 4900 }),
      mes('Mar/25', '2025-03', { mensagens: 1100, conversao: 6.0, ticketMedio: 425, verba: 5600 }),
      mes('Abr/25', '2025-04', { mensagens: 1150, conversao: 6.2, ticketMedio: 430, verba: 5800 }),
      mes('Mai/25', '2025-05', { mensagens: 1200, conversao: 6.5, ticketMedio: 445, verba: 6100 }),
      mes('Jun/25', '2025-06', { mensagens: 1280, conversao: 6.8, ticketMedio: 462, verba: 6500 }),
    ],
    planos: [
      { id: '1', tarefa: 'Campanha de Dia dos Namorados com influencer local', status: 'Alta' },
      { id: '2', tarefa: 'Criar catálogo de produtos atualizado no Meta', status: 'Sucesso' },
      { id: '3', tarefa: 'Ativar campanha de remarketing dinâmico', status: 'Sucesso' },
      { id: '4', tarefa: 'Testar formato Collection Ads', status: 'Teste' },
      { id: '5', tarefa: 'Stories com prova social da semana', status: 'Média' },
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loja-outlet',
    workspaceId: 'demo-workspace',
    name: 'Loja Outlet',
    color: '#ef4444',
    fee: 7,
    historico: [
      mes('Jan/25', '2025-01', { mensagens: 430, conversao: 2.4, ticketMedio: 198, verba: 1800 }),
      mes('Fev/25', '2025-02', { mensagens: 400, conversao: 2.2, ticketMedio: 192, verba: 1600 }),
      mes('Mar/25', '2025-03', { mensagens: 460, conversao: 2.6, ticketMedio: 205, verba: 1900 }),
      mes('Abr/25', '2025-04', { mensagens: 490, conversao: 2.7, ticketMedio: 210, verba: 2000 }),
      mes('Mai/25', '2025-05', { mensagens: 510, conversao: 2.9, ticketMedio: 215, verba: 2100 }),
      mes('Jun/25', '2025-06', { mensagens: 540, conversao: 3.1, ticketMedio: 222, verba: 2200 }),
    ],
    planos: [
      { id: '1', tarefa: 'Criar campanha específica para queima de estoque', status: 'Alta' },
      { id: '2', tarefa: 'Testar audiência de interesse em promoções', status: 'Teste' },
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
  },
]

export type CategoriaSlug = 'designer' | 'dev' | 'photo' | 'consultant' | 'maintenance' | 'other';

export interface CategoriaContrato {
  id: CategoriaSlug;
  icon: string;
  title: string;
  desc: string;
  sugestaoObjeto: string;
  clausulasBase: string[];
  camposExtras: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'enum';
    options?: string[]; // Se for enum
    placeholder?: string;
  }[];
}

// ONDA 1 - Categorias Base
export const categorias: Record<CategoriaSlug, CategoriaContrato> = {
  designer: {
    id: 'designer',
    icon: 'palette',
    title: 'Designer / Freelancer Digital',
    desc: 'Logos, UI/UX, Social Media',
    sugestaoObjeto: 'Ex: Criação de Identidade Visual contendo Logo, Tipografia, Paleta de Cores e Manual da Marca.',
    clausulasBase: [
      'Cessão de Propriedade Intelectual condicionada ao pagamento integral',
      'Direito de uso em portfólio pelo prestador',
      'Regras estritas sobre limites de alterações e revisões'
    ],
    camposExtras: [
      { id: 'limiteAprovacao', label: 'Prazo limite para o cliente aprovar/revisar (dias)?', type: 'number', placeholder: 'Ex: 5' },
      { id: 'numeroRevisoes', label: 'Número máximo de rodadas de revisão/alterações?', type: 'number', placeholder: 'Ex: 3' },
      { id: 'formatosEntrega', label: 'Formatos de arquivo entregues finais?', type: 'text', placeholder: 'Ex: PDF, PNG, Figma' }
    ]
  },
  dev: {
    id: 'dev',
    icon: 'code',
    title: 'Desenvolvedor de Software',
    desc: 'Sites, Apps, Sistemas',
    sugestaoObjeto: 'Ex: Desenvolvimento de Landing Page institucional em React/Next.js com 5 seções.',
    clausulasBase: [
      'Direitos sobre código-fonte (propriedade apenas após pagamento repassando licença não-exclusiva ou exclusiva conforme acordado)',
      'Isenção de responsabilidade sobre servidores de terceiros ou integrações que saiam do ar',
      'Garantia legal de 90 dias contra bugs críticos após a entrega'
    ],
    camposExtras: [
      { id: 'tecnologias', label: 'Principais tecnologias utilizadas?', type: 'text', placeholder: 'Ex: React, Node.js, AWS' },
      { id: 'hospedagem', label: 'Quem paga pela infraestrutura/hospedagem mensal?', type: 'enum', options: ['O Cliente', 'O Prestador', 'Público/Gratuito'] },
      { id: 'codigoAberto', label: 'O código-fonte será entregue ao cliente?', type: 'boolean' }
    ]
  },
  photo: {
    id: 'photo',
    icon: 'photo_camera',
    title: 'Fotógrafo / Videomaker',
    desc: 'Eventos, Ensaios, Edição',
    sugestaoObjeto: 'Ex: Cobertura fotográfica de evento corporativo com duração de 4 horas.',
    clausulasBase: [
      'Direito de Imagem concedido pelo cliente',
      'Cláusulas rígidas sobre intempéries (chuva) ou reagendamento de externas',
      'Retenção das fotos RAW (o cliente recebe apenas as editadas na quantidade estipulada)',
      'Condições de alimentação no local do evento (se longo)'
    ],
    camposExtras: [
      { id: 'localEvento', label: 'Local de realização da sessão/evento?', type: 'text', placeholder: 'Endereço completo' },
      { id: 'dataHoraEvento', label: 'Data e Hora (Início e Fim)?', type: 'text', placeholder: 'Ex: 25/11 das 14h às 18h' },
      { id: 'quantidadeFotos', label: 'Quantidade exata de fotos editadas a serem entregues?', type: 'number', placeholder: 'Ex: 40' }
    ]
  },
  consultant: {
    id: 'consultant',
    icon: 'school',
    title: 'Consultor / Professor',
    desc: 'Aulas, Mentorias, Estratégia',
    sugestaoObjeto: 'Ex: Mentoria online de gestão de tempo, 4 sessões de 1 hora.',
    clausulasBase: [
      'Não garantia de resultados financeiros absolutos (obrigação de meio, não de fim)',
      'Sigilo e Acordo de Não-Divulgação (NDA) sobre negócios do cliente',
      'Política clara sobre tolerância a atrasos nas sessões'
    ],
    camposExtras: [
      { id: 'formatoAulas', label: 'Formato (Online ou Presencial)?', type: 'enum', options: ['Online (Zoom/Meet)', 'Presencial', 'Híbrido'] },
      { id: 'quantidadeSessoes', label: 'Quantas sessões/horas totais no pacote?', type: 'number', placeholder: 'Ex: 10 horas' },
      { id: 'gravacaoAutorizada', label: 'As sessões poderão ser gravadas?', type: 'boolean' }
    ]
  },
  maintenance: {
    id: 'maintenance',
    icon: 'construction',
    title: 'Eletricista / Encanador',
    desc: 'Reparos e Manutenção',
    sugestaoObjeto: 'Ex: Troca de fiação no apartamento e instalação de 5 tomadas novas.',
    clausulasBase: [
      'Obrigação da compra/custo de materiais primários definida (cliente vs prestador)',
      'Responsabilidade civil apenas sobre o raio de atuação (não cobre vícios ocultos do imóvel ou da estrutura geral)',
      'Garantia legal aplicável ao serviço de mão de obra'
    ],
    camposExtras: [
      { id: 'fornecimentoMateriais', label: 'Quem comprará os materiais/peças?', type: 'enum', options: ['O Cliente', 'O Prestador', 'A Combinar'] },
      { id: 'descartes', label: 'Quem será responsável pela remoção de entulho/descarte?', type: 'enum', options: ['O Cliente', 'O Prestador'] },
      { id: 'horarioPermitido', label: 'Horário permitido para barulho/obras no local?', type: 'text', placeholder: 'Ex: 08h as 17h' }
    ]
  },
  other: {
    id: 'other',
    icon: 'more_horiz',
    title: 'Outros Serviços',
    desc: 'Personalizado',
    sugestaoObjeto: 'Descreva em detalhes o que você irá entregar ao cliente.',
    clausulasBase: [
      'Cláusula padrão de rescisão (aviso prévio 30 dias se contínuo)',
      'Sigilo padrão',
      'Foro de eleição com base no endereço do prestador'
    ],
    camposExtras: []
  }
};

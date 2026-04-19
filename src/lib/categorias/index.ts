export type CategoriaSlug = string;

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
    options?: string[];
    placeholder?: string;
  }[];
}

export interface GrupoCategoria {
  id: string;
  label: string;
  icon: string;
  items: CategoriaSlug[];
}

export const gruposCategorias: GrupoCategoria[] = [
  { id: 'tech', label: 'Tecnologia & Dados', icon: 'code', items: ['dev', 'uxui', 'data'] },
  { id: 'criacao', label: 'Design & Criatividade', icon: 'palette', items: ['designer', 'photo', 'socialmedia', 'copywriter', 'editor'] },
  { id: 'consultoria', label: 'Consultoria & Aulas', icon: 'school', items: ['consultant', 'mentor', 'professor'] },
  { id: 'servicos', label: 'Serviços & Manutenção', icon: 'construction', items: ['maintenance', 'eletricista', 'encanador', 'limpeza'] },
  { id: 'saude', label: 'Saúde & Bem-estar', icon: 'favorite', items: ['nutricionista', 'psicologo', 'personaltrainer', 'cuidador', 'esteticista'] },
  { id: 'eventos', label: 'Eventos & Mídia', icon: 'celebration', items: ['cerimonial', 'dj', 'buffet'] },
  { id: 'outros', label: 'Outros Serviços', icon: 'more_horiz', items: ['other'] }
];

// Reutilizamos constantes para as áreas comuns a fim de manter a inteligência robusta da IA
const cláusulasCriativas = [
  'Cessão de direitos de propriedade intelectual condicionada ao pagamento integral (art. 49 da Lei 9.610/98)',
  'Direito de portfólio: o prestador pode exibir o trabalho após entrega e quitação',
  'Limite de revisões: se informado, incluir número; se não informado, omitir — não inventar número',
  'Entrega dos arquivos finais somente após quitação total do valor contratado',
];

const camposCriativos: CategoriaContrato['camposExtras'] = [
  { id: 'limiteAprovacao', label: 'Prazo limite para aprovar/revisar (dias)?', type: 'number', placeholder: 'Ex: 5' },
  { id: 'numeroRevisoes', label: 'Número máximo de rodadas de revisão?', type: 'number', placeholder: 'Ex: 3' },
  { id: 'formatosEntrega', label: 'Formatos de arquivo finais entregues?', type: 'text', placeholder: 'Ex: PDF, PNG, Figma' }
];

const clausulasAulas = [
  'Obrigação de meio, não de resultado: o prestador não garante resultados específicos, apenas a qualidade técnica',
  'NDA: sigilo reforçado sobre estratégias, dados e informações',
  'Tolerância de 15 minutos para início das sessões',
  'Política de cancelamento: aviso com antecedência mínima de 24 horas antes da sessão',
];

const camposAulas: CategoriaContrato['camposExtras'] = [
  { id: 'formatoAulas', label: 'Formato (Online ou Presencial)?', type: 'enum', options: ['Online', 'Presencial', 'Híbrido'] },
  { id: 'quantidadeSessoes', label: 'Quantas sessões/horas totais no pacote?', type: 'number', placeholder: 'Ex: 10' },
  { id: 'gravacaoAutorizada', label: 'As sessões poderão ser gravadas?', type: 'boolean' }
];

const clausulasManutencao = [
  'Definição clara de responsabilidade pelo fornecimento de materiais: usar o que foi informado; se não informado, deixar "a definir"',
  'Responsabilidade civil restrita ao escopo dos serviços contratados, não cobrindo vícios ocultos da estrutura',
  'Garantia de mão de obra: incluir prazo somente se informado pelo usuário',
  'Vistoria prévia: o prestador atesta as condições do local antes do início',
];

const camposManutencao: CategoriaContrato['camposExtras'] = [
  { id: 'fornecimentoMateriais', label: 'Quem comprará os materiais/peças?', type: 'enum', options: ['O Cliente', 'O Prestador', 'A Combinar'] },
  { id: 'descartes', label: 'Quem fará a remoção de entulho/descarte?', type: 'enum', options: ['O Cliente', 'O Prestador'] },
  { id: 'horarioPermitido', label: 'Horário permitido para barulho/obras?', type: 'text', placeholder: 'Ex: 08h às 17h' }
];

const clausulasDefaultIA = [
  'Analisar o tipo de serviço e aplicar: SE presencial → cláusula de imprevistos; SE remoto/digital → entrega digital; SE criativo → propriedade intelectual; SE saúde → isenção de resultado terapêutico; SE educacional → obrigação de meio',
  'Cláusula de rescisão com aviso prévio mínimo de 30 dias para contratos de prestação contínua',
  'Sigilo padrão sobre informações e dados do contratante'
];


export const categorias: Record<CategoriaSlug, CategoriaContrato> = {
  designer: {
    id: 'designer', icon: 'palette', title: 'Designer Gráfico', desc: 'Logos, Identidade Visual, Materiais',
    sugestaoObjeto: 'Ex: Criação de Identidade Visual contendo Logo, Tipografia, Paleta de Cores e Manual da Marca.',
    clausulasBase: cláusulasCriativas,
    camposExtras: camposCriativos,
  },
  uxui: {
    id: 'uxui', icon: 'web_asset', title: 'UX/UI Designer', desc: 'Design de Interfaces e Experiência',
    sugestaoObjeto: 'Ex: Design de UI para App Mobile, contendo 15 telas feitas no Figma.',
    clausulasBase: cláusulasCriativas,
    camposExtras: camposCriativos,
  },
  dev: {
    id: 'dev', icon: 'code', title: 'Desenvolvedor de Software', desc: 'Sites, Apps, Sistemas',
    sugestaoObjeto: 'Ex: Desenvolvimento de Landing Page institucional em React com 5 seções.',
    clausulasBase: [
      'Propriedade do código-fonte transferida somente após pagamento integral do valor contratado',
      'Isenção de responsabilidade por falhas em servidores, APIs ou integrações de terceiros',
      'Garantia contra bugs críticos: incluir prazo somente se informado pelo usuário',
      'Entrega inclui código-fonte e documentação básica de uso',
    ],
    camposExtras: [
      { id: 'tecnologias', label: 'Principais tecnologias?', type: 'text', placeholder: 'Ex: React, Node.js' },
      { id: 'hospedagem', label: 'Quem paga pela infraestrutura/hospedagem?', type: 'enum', options: ['O Cliente', 'O Prestador', 'Público/Gratuito'] },
      { id: 'codigoAberto', label: 'O código-fonte será entregue?', type: 'boolean' },
    ],
  },
  data: {
    id: 'data', icon: 'bar_chart', title: 'Analista de Dados', desc: 'Dashboards, BI, Análises',
    sugestaoObjeto: 'Ex: Criação de Dashboards no PowerBI integrados com o sistema do cliente.',
    clausulasBase: ['Sigilo absoluto de dados baseados na LGPD.'],
    camposExtras: [{ id: 'ferramentas', label: 'Ferramentas de análise/DB?', type: 'text', placeholder: 'Ex: PowerBI, SQL' }],
  },
  photo: {
    id: 'photo', icon: 'photo_camera', title: 'Fotógrafo(a)', desc: 'Ensaios, Eventos, Corporativo',
    sugestaoObjeto: 'Ex: Cobertura fotográfica de evento corporativo com duração de 4 horas.',
    clausulasBase: [
      'Autorização de uso de imagem do evento/sessão concedida',
      'Direito de uso do material para portfólio profissional do prestador',
      'Política de reagendamento: imprevistos climáticos permitem reagendamento',
      'Arquivos RAW: reter salvo especificação contrária',
      'Prazo de entrega conta a partir da data da sessão',
    ],
    camposExtras: [
      { id: 'localEvento', label: 'Local da sessão/evento?', type: 'text', placeholder: 'Endereço completo' },
      { id: 'dataHoraEvento', label: 'Data e Hora (Início e Fim)?', type: 'text', placeholder: 'Ex: 25/11 das 14h às 18h' },
      { id: 'quantidadeFotos', label: 'Quantidade exata de fotos editadas a serem entregues?', type: 'number', placeholder: 'Ex: 40' },
    ],
  },
  socialmedia: {
    id: 'socialmedia', icon: 'campaign', title: 'Gestor de Redes Sociais', desc: 'Posts, Reels, Tráfego Pago',
    sugestaoObjeto: 'Ex: Gestão de Instagram com 3 posts semanais por 3 meses.',
    clausulasBase: ['Obrigação de meio: não há garantia fechada de conversões/vendas.'],
    camposExtras: [
      { id: 'verbaAnuncios', label: 'Quem pagará a verba das plataformas?', type: 'enum', options: ['O Cliente', 'O Prestador', 'Não há tráfego'] }
    ],
  },
  copywriter: {
    id: 'copywriter', icon: 'edit_document', title: 'Copywriter / Redator', desc: 'Textos, Blogs, Roteiros',
    sugestaoObjeto: 'Ex: Redação de 4 artigos de blog otimizados para SEO por mês.',
    clausulasBase: ['Os textos devem ser originais, garantindo ausência de plágio.'],
    camposExtras: [
      { id: 'limiteAprovacao', label: 'Prazo limite para aprovar/revisar (dias)?', type: 'number', placeholder: 'Ex: 5' },
    ],
  },
  editor: {
    id: 'editor', icon: 'movie', title: 'Editor de Vídeo', desc: 'Montagem, Cortes, Animações',
    sugestaoObjeto: 'Ex: Edição de 10 vídeos "Nuggets" para Instagram e TikTok.',
    clausulasBase: ['Arquivos brutos devem ser enviados com antecedência mínima estipulada.'],
    camposExtras: camposCriativos,
  },
  consultant: {
    id: 'consultant', icon: 'school', title: 'Consultor / Assessor', desc: 'Consultoria empresarial ou técnica',
    sugestaoObjeto: 'Ex: Consultoria de gestão de tempo, 4 sessões de 1 hora.',
    clausulasBase: clausulasAulas,
    camposExtras: camposAulas,
  },
  mentor: { 
    id: 'mentor', icon: 'lightbulb', title: 'Mentor', desc: 'Direcionamento 1-a-1', 
    sugestaoObjeto: 'Ex: Mentoria online.', clausulasBase: clausulasAulas, camposExtras: camposAulas 
  },
  professor: { 
    id: 'professor', icon: 'menu_book', title: 'Professor Particular', desc: 'Aulas e Cursos', 
    sugestaoObjeto: 'Aulas online. Pacote de 10 aulas', clausulasBase: clausulasAulas, camposExtras: camposAulas 
  },
  maintenance: {
    id: 'maintenance', icon: 'construction', title: 'Reformas e Obras', desc: 'Pedreiro, Marcenaria, etc',
    sugestaoObjeto: 'Ex: Reforma de banheiro com demolição e pintura.',
    clausulasBase: clausulasManutencao,
    camposExtras: camposManutencao,
  },
  eletricista: { 
    id: 'eletricista', icon: 'electric_bolt', title: 'Eletricista', desc: 'Fiação, Tomadas, Rede', 
    sugestaoObjeto: 'Ex: Troca de fiação e instalação de 5 tomadas', clausulasBase: clausulasManutencao, camposExtras: camposManutencao 
  },
  encanador: { 
    id: 'encanador', icon: 'water_drop', title: 'Encanador', desc: 'Hidráulica e Reparos', 
    sugestaoObjeto: 'Ex: Conserto de vazamentos e tubulação', clausulasBase: clausulasManutencao, camposExtras: camposManutencao 
  },
  limpeza: { 
    id: 'limpeza', icon: 'cleaning_services', title: 'Faxina / Limpeza', desc: 'Pós-obra, Limpeza profunda', 
    sugestaoObjeto: 'Ex: Limpeza pós-obra para apartamento de 50m2', 
    clausulasBase: ['Produtos de limpeza devem ser fornecidos pela parte acordada no contrato.'], 
    camposExtras: [
      { id: 'fornecimentoMateriais', label: 'Quem comprará os produtos de limpeza?', type: 'enum', options: ['O Cliente', 'O Prestador', 'A Combinar'] },
    ]
  },
  nutricionista: {
    id: 'nutricionista', icon: 'restaurant', title: 'Nutricionista', desc: 'Planos Alimentares, Assessoria',
    sugestaoObjeto: 'Acompanhamento nutricional mensal com dieta.',
    clausulasBase: ['Os resultados dependem da disciplina fisiológica do contratante.', 'Obrigação de meio (código de ética)'],
    camposExtras: [],
  },
  psicologo: { 
    id: 'psicologo', icon: 'psychology', title: 'Psicólogo(a) / Terapeuta', desc: 'Acompanhamento focado', 
    sugestaoObjeto: 'Sessão semanal de acompanhamento psicoterapêutico', 
    clausulasBase: ['Manutenção de sigilo absoluto. Política de falta nas sessões.'], camposExtras: camposAulas 
  },
  personaltrainer: { 
    id: 'personaltrainer', icon: 'fitness_center', title: 'Personal Trainer', desc: 'Condicionamento Físico', 
    sugestaoObjeto: 'Aulas 3 vezes na semana', 
    clausulasBase: ['O cliente atesta aptidão física.'], camposExtras: [
        { id: 'localEvento', label: 'Onde acontecerão os treinos?', type: 'text', placeholder: 'Ex: Academia X' }
    ] 
  },
  cuidador: { id: 'cuidador', icon: 'elderly', title: 'Cuidador(a) / Babá', desc: 'Idosos, Crianças', sugestaoObjeto: 'Acompanhamento diurno das 08h às 18h', clausulasBase: clausulasDefaultIA, camposExtras: [] },
  esteticista: { id: 'esteticista', icon: 'spa', title: 'Beleza & Estética', desc: 'Maquiagem, Sobrancelha', sugestaoObjeto: 'Procedimentos estéticos no rosto', clausulasBase: clausulasDefaultIA, camposExtras: [] },
  cerimonial: { id: 'cerimonial', icon: 'celebration', title: 'Cerimonialista / Produtor', desc: 'Casamentos e Festas', sugestaoObjeto: 'Assessoria de casamento', clausulasBase: ['Isenção de responsabilidade sobre fornecedores terceiros.'], camposExtras: [] },
  dj: { id: 'dj', icon: 'headphones', title: 'DJ / Músico', desc: 'Apresentações, Som e Iluminação', sugestaoObjeto: 'Evento de 5 horas com pista de som', clausulasBase: clausulasDefaultIA, camposExtras: [] },
  buffet: { id: 'buffet', icon: 'restaurant_menu', title: 'Buffet', desc: 'Comidas e Bebidas', sugestaoObjeto: 'Menu para 100 pessoas', clausulasBase: clausulasDefaultIA, camposExtras: [] },
  other: {
    id: 'other', icon: 'more_horiz', title: 'Outros Profissionais', desc: 'Personalizado',
    sugestaoObjeto: 'Descreva detalhadamente o que você vai reparar ou entregar.',
    clausulasBase: clausulasDefaultIA,
    camposExtras: [],
  },
};

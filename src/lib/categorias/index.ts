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

export const categorias: Record<CategoriaSlug, CategoriaContrato> = {
  designer: {
    id: 'designer', icon: 'palette', title: 'Designer Gráfico', desc: 'Logos, Identidade Visual, Materiais',
    sugestaoObjeto: 'Ex: Criação de Identidade Visual contendo Logo, Tipografia, Paleta de Cores e Manual da Marca.',
    clausulasBase: [
      'Cessão de direitos de propriedade intelectual condicionada ao pagamento integral (art. 49 da Lei 9.610/98)',
      'Direito de portfólio: o prestador pode exibir o trabalho após entrega e quitação',
      'Entrega dos arquivos finais somente após quitação total do valor contratado',
    ],
    camposExtras: [
      { id: 'limiteAprovacao', label: 'Prazo limite para o cliente aprovar/revisar (dias)?', type: 'number', placeholder: 'Ex: 5' },
      { id: 'numeroRevisoes', label: 'Número máximo de rodadas de revisão?', type: 'number', placeholder: 'Ex: 3' },
    ],
  },
  uxui: {
    id: 'uxui', icon: 'web_asset', title: 'UX/UI Designer', desc: 'Design de Interfaces e Experiência',
    sugestaoObjeto: 'Ex: Design de UI para App Mobile, contendo 15 telas feitas no Figma.',
    clausulasBase: ['Os arquivos fonte (Figma) serão entregues ao cliente após quitação total.'],
    camposExtras: [],
  },
  dev: {
    id: 'dev', icon: 'code', title: 'Desenvolvedor de Software', desc: 'Sites, Apps, Sistemas',
    sugestaoObjeto: 'Ex: Desenvolvimento de Landing Page institucional em React com 5 seções.',
    clausulasBase: [
      'Propriedade do código-fonte transferida somente após pagamento integral',
      'Isenção de responsabilidade por falhas em servidores/hospedagem de terceiros',
    ],
    camposExtras: [
      { id: 'tecnologias', label: 'Principais tecnologias?', type: 'text', placeholder: 'Ex: React, Node.js' },
      { id: 'hospedagem', label: 'Quem paga pela infraestrutura/hospedagem?', type: 'enum', options: ['O Cliente', 'O Prestador'] },
    ],
  },
  data: {
    id: 'data', icon: 'bar_chart', title: 'Analista de Dados', desc: 'Dashboards, BI, Análises',
    sugestaoObjeto: 'Ex: Criação de Dashboards no PowerBI integrados com o sistema do cliente.',
    clausulasBase: ['Sigilo absoluto de dados baseados na LGPD.'],
    camposExtras: [],
  },
  photo: {
    id: 'photo', icon: 'photo_camera', title: 'Fotógrafo(a)', desc: 'Ensaios, Eventos, Corporativo',
    sugestaoObjeto: 'Ex: Cobertura fotográfica de evento corporativo com duração de 4 horas.',
    clausulasBase: [
      'Autorização de uso de imagem concedida pelo CONTRATANTE',
      'Direito de uso do material para portfólio profissional do prestador',
    ],
    camposExtras: [
      { id: 'localEvento', label: 'Local?', type: 'text', placeholder: 'Endereço completo' },
      { id: 'quantidadeFotos', label: 'Quantidade de fotos editadas a entregar?', type: 'number', placeholder: 'Ex: 40' },
    ],
  },
  socialmedia: {
    id: 'socialmedia', icon: 'campaign', title: 'Gestor de Redes Sociais', desc: 'Posts, Reels, Tráfego Pago',
    sugestaoObjeto: 'Ex: Gestão de Instagram com 3 posts semanais por 3 meses.',
    clausulasBase: ['Obrigação de meio: não há garantia fechada de conversões/vendas.'],
    camposExtras: [
      { id: 'verbaAnuncios', label: 'Verba de anúncios (quem paga?)', type: 'enum', options: ['O Cliente', 'O Prestador', 'Não há tráfego pago'] }
    ],
  },
  copywriter: {
    id: 'copywriter', icon: 'edit_document', title: 'Copywriter / Redator', desc: 'Textos, Blogs, Roteiros',
    sugestaoObjeto: 'Ex: Redação de 4 artigos de blog otimizados para SEO por mês.',
    clausulasBase: ['Os textos devem ser originais, garantindo ausência de plágio.'],
    camposExtras: [],
  },
  editor: {
    id: 'editor', icon: 'movie', title: 'Editor de Vídeo', desc: 'Montagem, Cortes, Animações',
    sugestaoObjeto: 'Ex: Edição de 10 vídeos "Nuggets/Reels" para Instagram e TikTok.',
    clausulasBase: ['Arquivos brutos devem ser enviados pelo cliente com antecedência de X dias.'],
    camposExtras: [],
  },
  consultant: {
    id: 'consultant', icon: 'school', title: 'Consultor / Assessor', desc: 'Consultoria empresarial ou técnica',
    sugestaoObjeto: 'Ex: Consultoria de gestão de tempo, 4 sessões de 1 hora online.',
    clausulasBase: [
      'Obrigação de meio, não garantindo resultados atrelados a agentes externos',
      'NDA (Acordo de Confidencialidade) incluso por padrão sobre processos internos'
    ],
    camposExtras: [
      { id: 'formatoLocal', label: 'Remoto ou Presencial?', type: 'enum', options: ['Remoto', 'Presencial'] }
    ],
  },
  mentor: { id: 'mentor', icon: 'lightbulb', title: 'Mentor', desc: 'Direcionamento 1-a-1', sugestaoObjeto: 'Ex: Mentoria online.', clausulasBase: [], camposExtras: [] },
  professor: { id: 'professor', icon: 'menu_book', title: 'Professor Particular', desc: 'Aulas e Cursos', sugestaoObjeto: 'Aulas de idiomas online. Pacote de 10 aulas', clausulasBase: [], camposExtras: [] },
  maintenance: {
    id: 'maintenance', icon: 'construction', title: 'Reformas e Serviços Gerais', desc: 'Reparos, Pedreiro, Marcenaria',
    sugestaoObjeto: 'Ex: Reforma de banheiro com demolição, revestimento e pintura.',
    clausulasBase: [
      'Material incluído na responsabilidade de quem for acordado. Vícios estruturais pré-existentes não são cobertos.'
    ],
    camposExtras: [
      { id: 'materiais', label: 'Materiais na responsabilidade de:', type: 'enum', options: ['Cliente', 'Prestador', 'Cada um fornecerá uma parte'] }
    ],
  },
  eletricista: { id: 'eletricista', icon: 'electric_bolt', title: 'Eletricista', desc: 'Fiação, Tomadas, Rede', sugestaoObjeto: 'Instalação de rede elétrica completa', clausulasBase: [], camposExtras: [] },
  encanador: { id: 'encanador', icon: 'water_drop', title: 'Encanador', desc: 'Hidráulica e Reparos', sugestaoObjeto: 'Detecção e conserto de vazamentos', clausulasBase: [], camposExtras: [] },
  limpeza: { id: 'limpeza', icon: 'cleaning_services', title: 'Faxina / Limpeza', desc: 'Pós-obra, Limpeza profunda', sugestaoObjeto: 'Limpeza pós obra para 50m2', clausulasBase: [], camposExtras: [] },
  nutricionista: {
    id: 'nutricionista', icon: 'restaurant', title: 'Nutricionista', desc: 'Planos Alimentares, Assessoria',
    sugestaoObjeto: 'Acompanhamento nutricional mensal com dieta e bioimpedância.',
    clausulasBase: ['Os resultados dependem integralmente da disciplina e perfil fisiológico do cliente.'],
    camposExtras: [],
  },
  psicologo: { id: 'psicologo', icon: 'psychology', title: 'Psicólogo(a) / Terapeuta', desc: 'Acompanhamento focado', sugestaoObjeto: 'Sessão semanal de acompanhamento psicoterapêutico', clausulasBase: ['Manutenção de sigilo absoluto (código de ética).'], camposExtras: [] },
  personaltrainer: { id: 'personaltrainer', icon: 'fitness_center', title: 'Personal Trainer', desc: 'Condicionamento Físico', sugestaoObjeto: 'Aulas 3 vezes na semana', clausulasBase: ['O cliente atesta aptidão física para realizar exercícios.'], camposExtras: [] },
  cuidador: { id: 'cuidador', icon: 'elderly', title: 'Cuidador(a)', desc: 'Idosos, Crianças (Babá)', sugestaoObjeto: 'Acompanhamento diurno das 08h às 18h', clausulasBase: [], camposExtras: [] },
  esteticista: { id: 'esteticista', icon: 'spa', title: 'Beleza & Estética', desc: 'Maquiagem, Sobrancelha, Massagem', sugestaoObjeto: 'Procedimentos estéticos no rosto do cliente', clausulasBase: [], camposExtras: [] },
  cerimonial: { id: 'cerimonial', icon: 'celebration', title: 'Cerimonialista / Produtor', desc: 'Casamentos e Festas', sugestaoObjeto: 'Assessoria de casamento', clausulasBase: ['Limitação de responsabilidade sobre fornecedores terceiros que falharem.'], camposExtras: [] },
  dj: { id: 'dj', icon: 'headphones', title: 'DJ / Músico', desc: 'Apresentações, Som e Iluminação', sugestaoObjeto: 'Evento de 5 horas com pista de som', clausulasBase: [], camposExtras: [] },
  buffet: { id: 'buffet', icon: 'restaurant_menu', title: 'Buffet', desc: 'Comidas e Bebidas', sugestaoObjeto: 'Menu para 100 pessoas', clausulasBase: [], camposExtras: [] },
  other: {
    id: 'other', icon: 'more_horiz', title: 'Outros Profissionais', desc: 'Personalizado',
    sugestaoObjeto: 'Descreva detalhadamente o que você vai reparar ou entregar.',
    clausulasBase: [
      'Cláusula padrão de sigilo aplicável.', 'Prazo de rescisão padrão de 30 dias.'
    ],
    camposExtras: [],
  },
};

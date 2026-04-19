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
  { id: 'tech', label: 'Tecnologia & Dados', icon: 'code', items: ['dev', 'uxui', 'data', 'trafego', 'assistentevirtual'] },
  { id: 'criacao', label: 'Design & Criatividade', icon: 'palette', items: ['designer', 'photo', 'socialmedia', 'copywriter', 'editor', 'videomaker', 'ilustrador', 'tradutor'] },
  { id: 'consultoria', label: 'Consultoria & Aulas', icon: 'school', items: ['consultant', 'mentor', 'professor', 'contador', 'arquiteto'] },
  { id: 'beleza', label: 'Beleza & Estética', icon: 'face_retouching_natural', items: ['esteticista', 'manicure', 'cabeleireiro', 'maquiador', 'tatuador'] },
  { id: 'saude', label: 'Saúde & Bem-estar', icon: 'favorite', items: ['nutricionista', 'psicologo', 'personaltrainer', 'cuidador', 'baba', 'fisioterapeuta', 'massoterapeuta', 'yoga', 'fono'] },
  { id: 'servicos', label: 'Serviços & Casa', icon: 'construction', items: ['maintenance', 'eletricista', 'encanador', 'limpeza', 'montador', 'arcondicionado', 'pintor', 'jardineiro', 'automotivo'] },
  { id: 'pets', label: 'Mundo Pet', icon: 'pets', items: ['dogwalker', 'petsitter', 'adestrador'] },
  { id: 'eventos', label: 'Eventos & Produção', icon: 'celebration', items: ['cerimonial', 'dj', 'buffet', 'bartender', 'seguranca', 'decorador', 'fotocabine'] },
  { id: 'outros', label: 'Outros Serviços', icon: 'more_horiz', items: ['other'] }
];

// REUSABLES PROMPTS EXTRAS E CLAÚSULAS BLINDADAS ======

const clausulasCriativas = [
  'Cessão de direitos de propriedade intelectual condicionada ao pagamento integral (art. 49 da Lei 9.610/98)',
  'Direito de portfólio: o prestador pode exibir o trabalho após entrega e quitação',
  'Limite de revisões: se informado, incluir número exato; se não informado, omitir — não inventar quantidade',
  'Entrega de arquivos finais somente após quitação total de valores',
];
const camposCriativos: CategoriaContrato['camposExtras'] = [
  { id: 'limiteAprovacao', label: 'Prazo limite para aprovar/revisar (dias)?', type: 'number', placeholder: 'Ex: 5' },
  { id: 'numeroRevisoes', label: 'Número máximo de rodadas de revisão?', type: 'number', placeholder: 'Ex: 3' },
  { id: 'formatosEntrega', label: 'Formatos finais entregues?', type: 'text', placeholder: 'Ex: PDF, PNG, MP4' }
];

const clausulasAulas = [
  'Obrigação estrita de meio: não se garante alcance de métricas financeiras, notas ou objetivos externos à capacidade de ensino',
  'Tolerância de 15 minutos para início das sessões; após isso configura falta do cliente e perda da aula',
  'Política de cancelamento: aviso com antecedência mínima de 24h, caso contrário a sessão será descontada do pacote',
];
const camposAulas: CategoriaContrato['camposExtras'] = [
  { id: 'formatoAulas', label: 'Formato de entrega?', type: 'enum', options: ['Online', 'Presencial', 'Híbrido'] },
  { id: 'quantidadeSessoes', label: 'Quantas sessões/horas no pacote?', type: 'text', placeholder: 'Ex: 10 aulas de 1h' },
  { id: 'gravacaoAutorizada', label: 'Sessões poderão ser gravadas?', type: 'enum', options: ['Não autoriza gravação', 'Sim, por ambas as partes'] }
];

const clausulasManutencao = [
  'Definição da responsabilidade pelo fornecimento de peças. Peças incorretas ou faltantes não geram multa por atraso ao prestador',
  'Responsabilidade civil restrita às áreas operadas; vícios estruturais ocultos do imóvel isentam o prestador',
  'Direito de cobrar visita técnica caso o cliente altere as condições do local previamente à execução',
];
const camposManutencao: CategoriaContrato['camposExtras'] = [
  { id: 'fornecimentoMateriais', label: 'Quem comprará materiais/peças?', type: 'enum', options: ['O Cliente', 'O Prestador fará repasse', 'A Combinar'] },
  { id: 'descartes', label: 'Responsável pela remoção de entulhos?', type: 'enum', options: ['O Cliente', 'O Prestador', 'Não há entulhos relevantes'] },
  { id: 'horarioPermitido', label: 'Horário permitido para barulhos no local?', type: 'text', placeholder: 'Ex: 08h às 17h' }
];

const clausulasSaudeCLinica = [
  'Manutenção de sigilo absoluto (LGPD e Código de Ética Profissional)',
  'A obrigação é de meio e não de resultado garantido, respeitando a biologia / resposta do paciente',
  'Isenção de responsabilidade caso o contratante omita comorbidades ou negligencie recomendações'
];
const camposSaudeClinica: CategoriaContrato['camposExtras'] = [
  { id: 'localAtendimento', label: 'Onde será o atendimento?', type: 'text', placeholder: 'Ex: Presencial / Telemedicina' },
  { id: 'frequencia', label: 'Sessões ocorrem de quanto em quanto tempo?', type: 'enum', options: ['Semanal', 'Quinzenal', 'Mensal', 'Episódica/Avulsa'] }
];

const clausulasEstetica = [
  'A prestação de serviço cosmético possui caráter limitante da responsabilidade biológica/fisiológica individual de cada cliente',
  'Danos oriundos da inobservância nas regras de recuperação / pós-procedimento pelo cliente isentam o prestador',
  'Necessária ficha de anamnese prévia relatando eventuais alergias'
];
const camposEstetica: CategoriaContrato['camposExtras'] = [
  { id: 'anamnese', label: 'Será coletada Anamnese de Risco?', type: 'enum', options: ['Sim', 'Não (Nesse caso o risco das alergias é do cliente)'] },
  { id: 'procedimentoExato', label: 'Qual serviço/técnica exata?', type: 'text', placeholder: 'Ex: Unhas de Gel, Micropigmentação Labial...' }
];

const clausulasEventos = [
  'Prestador isenta-se da responsabilidade caso haja falta de energia ou catástrofes climáticas que inviabilizem o evento',
  'Qualquer dano ao equipamento do prestador provocado por convidados embriagados ou imprudentes será cobrado integralmente do cliente',
  'Alimentação básica deverá ser providenciada para a equipe do(s) prestador(es) em eventos com mais de 5h'
];
const camposEventos: CategoriaContrato['camposExtras'] = [
  { id: 'dataLocal', label: 'Data e Local Físico?', type: 'text', placeholder: 'Ex: 24/12, Sítio Alegria' },
  { id: 'convidadosHectare', label: 'Quantidade de Convidados e Horas?', type: 'text', placeholder: 'Ex: Para 100 pessoas por 6 horas' }
];

const clausulasPets = [
  'Acidentes ocorridos durante evasão/fuga causada por inadequação de portões ou guias originais defeituosas isentam o prestador',
  'Atestado de vacinação pleno em dia e comprovação de ausência de zoonoses são premissas',
  'Emergências veterinárias serão contornadas visando o bem estar animal e ressarcidas pelo tutor / contratante'
];
const camposPets: CategoriaContrato['camposExtras'] = [
  { id: 'animalEspecifico', label: 'Quantos e quais animais?', type: 'text', placeholder: 'Ex: 2 cachorros pequeno porte (Pug)' },
  { id: 'frequenciaPasseios', label: 'Frequência de Visitas / Passeios?', type: 'text', placeholder: 'Ex: 3 vezes na semana (45 min cada)' },
  { id: 'emergencias', label: 'Clínica parceira autorizada em caso de emergência?', type: 'text', placeholder: 'Ex: Clínica Vet XPTO - Ou A Combinar' }
];

const clausulasDefaultIA = [
  'Definição de rescisão imotivada requerendo 30 dias de aviso prévio mínimo caso contrato seja de repetição',
  'Confidencialidade padronizada'
];

export const categorias: Record<CategoriaSlug, CategoriaContrato> = {
  // === TECH ===
  dev: { id: 'dev', icon: 'code', title: 'Desenvolvedor de Software', desc: 'Sites, Apps, Sistemas', sugestaoObjeto: 'Ex: Criação de Web App em React.', clausulasBase: ['Propriedade do código-fonte transferida somente após quitação total', 'Isenção de responsabilidade por servidor de terceiros'], camposExtras: [{ id: 'tecnologias', label: 'Principais linguagens?', type: 'text', placeholder: 'Ex: Node, JS...' }, { id: 'hospedagem', label: 'Quem paga pelo Cloud/Deploy?', type: 'enum', options: ['O Cliente', 'O Programador'] }, { id: 'manutencaoMensal', label: 'Haverá fee de Manutenção Mensal?', type: 'enum', options: ['Não', 'Sim, R$ cobrados à parte'] }] },
  uxui: { id: 'uxui', icon: 'web_asset', title: 'UX/UI Designer', desc: 'Protótipos, Wireframes', sugestaoObjeto: 'Ex: Telas de UX mobile.', clausulasBase: clausulasCriativas, camposExtras: camposCriativos },
  data: { id: 'data', icon: 'bar_chart', title: 'Analista de Dados', desc: 'Dashboards, BI', sugestaoObjeto: 'Ex: Dashboards no PowerBI.', clausulasBase: ['Sigilo total garantido em adequação à LGPD.'], camposExtras: [{ id: 'ferramentas', label: 'Ferramenta?', type: 'text', placeholder: 'Ex: Looker, PowerBI' }] },
  trafego: { id: 'trafego', icon: 'trending_up', title: 'Gestor de Tráfego', desc: 'Google Ads, Meta Ads', sugestaoObjeto: 'Gestão de Orçamento de R$5 mil mensais em MetaAds.', clausulasBase: ['Ausência de compromisso por ROI absoluto.', 'Desbloqueios de cartões de anúncios são dever restrito do contratante.'], camposExtras: [{ id: 'verbaAdicional', label: 'Orçamento de Ads:', type: 'text', placeholder: 'Cliente paga via próprio cartão de crédito (Direto Plataforma)' }] },
  assistentevirtual: { id: 'assistentevirtual', icon: 'headset_mic', title: 'Secretária(o) Remota/BPO', desc: 'Assistente Administrativa', sugestaoObjeto: 'Atendimento via Whatsapp por 4h diárias.', clausulasBase: ['Não configuração de vínculo celetista, atuando com autonomia.', 'Tratamento de dados cobertos por NDA.'], camposExtras: [{ id: 'jornadaDiaria', label: 'Jornada diária/semanal?', type: 'text', placeholder: 'Ex: Geração Diária 14-18h' }] },

  // === CRIAÇÃO ===
  designer: { id: 'designer', icon: 'palette', title: 'Designer Gráfico', desc: 'Logos, Identidade', sugestaoObjeto: 'Ex: ID Visual completa.', clausulasBase: clausulasCriativas, camposExtras: camposCriativos },
  photo: { id: 'photo', icon: 'photo_camera', title: 'Fotógrafo(a)', desc: 'Sessões e Ensaios', sugestaoObjeto: 'Sessão externa corporativa.', clausulasBase: [...clausulasCriativas, 'Direitos de imagem garantidos.', 'Prazo de entrega pós edição estabelecido.'], camposExtras: [{ id: 'dataLocal', label: 'Data/Local', type: 'text' }, { id: 'totalBRUTOS', label: 'Entregará Fotos RAW originais?', type: 'enum', options: ['Não (Padrão)', 'Sim'] }, { id: 'quantidadeProntas', label: 'Quantas Fotos tratadas?', type: 'number' }] },
  socialmedia: { id: 'socialmedia', icon: 'campaign', title: 'Gestor de Social Media', desc: 'Posts Mensais', sugestaoObjeto: 'Ex: 12 posts/mês Instagram.', clausulasBase: ['Obrigação de meio no ganho de seguidores.'], camposExtras: [{ id: 'qntPosts', label: 'Quantos Posts Estáticos + Reels?', type: 'text', placeholder: 'Ex: 12 posts e 4 Reels' }] },
  copywriter: { id: 'copywriter', icon: 'edit_document', title: 'Copywriter / Redator', desc: 'Blogs, Páginas de Venda', sugestaoObjeto: 'Artigos otimizados mensais.', clausulasBase: clausulasCriativas, camposExtras: camposCriativos },
  editor: { id: 'editor', icon: 'movie', title: 'Editor de Vídeo', desc: 'Cortes, YouTube', sugestaoObjeto: 'Ex: 5 vídeos Nugget/Mês.', clausulasBase: ['Atrasos em envio do bruto resultam na postergação do praso final de devolução audiovisual.'], camposExtras: camposCriativos },
  videomaker: { id: 'videomaker', icon: 'video_camera_front', title: 'Videomaker (Filmagem)', desc: 'Projeções, Drones', sugestaoObjeto: 'Diária de Gravação 6h com equipe de 2.', clausulasBase: [...clausulasEventos, 'Voo de drones restrito à segurança meteorológica de momento.'], camposExtras: [{ id: 'quantDiarias', label: 'Quantas Diárias de Captação?', type: 'text', placeholder: 'Ex: 1 Diária das 9h as 15h' }] },
  ilustrador: { id: 'ilustrador', icon: 'draw', title: 'Ilustrador / Rigger', desc: 'Personagens, Modelagem 3D', sugestaoObjeto: 'Criação Vetorial Mascote da Marca.', clausulasBase: clausulasCriativas, camposExtras: camposCriativos },
  tradutor: { id: 'tradutor', icon: 'translate', title: 'Tradutor / Intérprete', desc: 'Documentos e Reuniões', sugestaoObjeto: 'Tradução do doc Português > Inglês de 5 mil palavras.', clausulasBase: ['Manutenção de sentido estrito ao documento original e sigilo absoluto dos relatórios corporativos traduzidos.'], camposExtras: [{ id: 'prazoFinalA', label: 'Data final para entrega do doc:', type: 'text', placeholder: 'Ex: 15/09' }] },

  // === CONSULTORIA ===
  consultant: { id: 'consultant', icon: 'school', title: 'Consultor / Assessor', desc: 'Técnico, Gestão', sugestaoObjeto: 'Consultoria Financeira.', clausulasBase: clausulasAulas, camposExtras: camposAulas },
  mentor: { id: 'mentor', icon: 'lightbulb', title: 'Mentor Executivo', desc: 'Sessões online de direcionamento', sugestaoObjeto: 'Sessões online 1-1.', clausulasBase: clausulasAulas, camposExtras: camposAulas },
  professor: { id: 'professor', icon: 'menu_book', title: 'Professor Particular', desc: 'Idiomas, Instrumento', sugestaoObjeto: 'Aulas de Espanhol', clausulasBase: clausulasAulas, camposExtras: camposAulas },
  contador: { id: 'contador', icon: 'account_balance', title: 'Assessor Contábil', desc: 'Impostos, MEI, Declaração', sugestaoObjeto: 'Declaração IRPF 2026 Anual', clausulasBase: ['Prazos estipulados de Receita Federal são absolutos. Isenção se o cliente não entregar boletos/documentos úteis à contabilidade a tempo.'], camposExtras: [{ id: 'competencias', label: 'Emissão mensal ou Serviço Único?', type: 'enum', options: ['Mensal (Recorrente)', 'Avulsa (Ex: Declaração)'] }] },
  arquiteto: { id: 'arquiteto', icon: 'architecture', title: 'Arquiteto / Interior', desc: 'Planta 3D, Projetos', sugestaoObjeto: 'Planta de Apartamento 60m', clausulasBase: ['Licenças de condomínio ou da Prefeitura são burocracias a cargo do cliente. Projetos artísticos possuem número específico de modificações de layout base.'], camposExtras: [{ id: 'numeroMetragem', label: 'Metragem do imóvel e Complexidade?', type: 'text', placeholder: 'Ex: Interior Cozinha 20m²' }, ...camposCriativos] },

  // === BELEZA E ESTÉTICA ===
  esteticista: { id: 'esteticista', icon: 'spa', title: 'Esteticista', desc: 'Pele, Corporeidade', sugestaoObjeto: 'Tratamento de 10 sessões massagem modeladora', clausulasBase: clausulasEstetica, camposExtras: camposEstetica },
  manicure: { id: 'manicure', icon: 'touch_app', title: 'Manicure / Cílios', desc: 'Nail Designer, Alongamento', sugestaoObjeto: 'Manutenção Mensal Fibra Vidro', clausulasBase: clausulasEstetica, camposExtras: [{ id: 'kitPessoal', label: 'Quem provê material alicate/esmaltes?', type: 'enum', options: ['Material profissional incluso', 'Uso material da cliente'] }, ...camposEstetica] },
  cabeleireiro: { id: 'cabeleireiro', icon: 'face', title: 'Cabeleireiro(a)', desc: 'Cores, Mechas, Químicas', sugestaoObjeto: 'Procedimento Luzes Platinum e Hidratação', clausulasBase: clausulasEstetica, camposExtras: camposEstetica },
  maquiador: { id: 'maquiador', icon: 'brush', title: 'Maquiador(a) / Make', desc: 'Festas, Noivas', sugestaoObjeto: 'Maquiagem Noiva c/ Teste + 3 madrinhas', clausulasBase: ['Quebra de agenda após teste concluído acarreta perda financeira por reserva do dia.', ...clausulasEstetica], camposExtras: [{ id: 'locomocaoMake', label: 'O Maquiador vai ao local ou é em estúdio?', type: 'enum', options: ['Estúdio (Cliente vai até lá)', 'Hotel/Casa (Cobrado frete)'] }] },
  tatuador: { id: 'tatuador', icon: 'ink_marker', title: 'Tatuador / Piercer', desc: 'Arte na pele', sugestaoObjeto: 'Tattoo Fechamento Braço Escala Cinza 4 sessões', clausulasBase: ['Expressamente livre de indenização ou remoção em caso de insatisfação subjetiva por traços validados no DECALQUE prévio com o qual o cliente anuiu assinar ou visualizar em espelho.'], camposExtras: [{ id: 'tamanhoArea', label: 'Tamanho (cm) e Área do Corpo?', type: 'text', placeholder: 'Ex: Antebraço 20cm' }, { id: 'menorIdade', label: 'O cliente confirmou ser MAIOR legalmente?', type: 'enum', options: ['Sim, maior de 18 no ato do desenho'] }] },

  // === SAÚDE ===
  nutricionista: { id: 'nutricionista', icon: 'restaurant', title: 'Nutricionista', desc: 'Dietas e Avaliações', sugestaoObjeto: 'Acompanhamento nutricional semestral.', clausulasBase: clausulasSaudeCLinica, camposExtras: camposSaudeClinica },
  psicologo: { id: 'psicologo', icon: 'psychology', title: 'Psicólogo / Terapeuta', desc: 'Psicoterapia, Análise', sugestaoObjeto: 'Sessão semanal de psicoterapia.', clausulasBase: clausulasSaudeCLinica, camposExtras: camposSaudeClinica },
  personaltrainer: { id: 'personaltrainer', icon: 'fitness_center', title: 'Personal Trainer', desc: 'Treinos focados', sugestaoObjeto: 'Treino musculação online ou cond.', clausulasBase: ['Obrigatoriedade do atestado. Isenção por omissão.', ...clausulasSaudeCLinica], camposExtras: [{ id: 'localPresencial', label: 'Local?', type: 'text' }, { id: 'atestado', label: 'Tem atestado de cardiologista?', type: 'enum', options: ['Sim, entregará cópia', 'Não (Risco de mal súbito assume o próprio)'] }] },
  cuidador: { id: 'cuidador', icon: 'elderly', title: 'Cuidador de Idosos', desc: 'Homecare, Assistência', sugestaoObjeto: 'Cuidados noturnos com idoso acamado.', clausulasBase: ['Administração de medicações restrita a receitas vivas médicas.', 'Direito preservado a refeições curtas na jornada loga.'], camposExtras: [{ id: 'diasA', label: 'Horários do Plantão:', type: 'text', placeholder: 'Ex: Noturno 12h por 36h ou Seg/Sex comercial.' }, { id: 'refeicaoCuidador', label: 'Alimentação do profissional?', type: 'enum', options: ['Familia fornece as refeições (Padrão HomeCare)', 'Profissional traz as marmitas próprias'] }] },
  baba: { id: 'baba', icon: 'child_care', title: 'Babá / Nanny', desc: 'Cuidados Infantis', sugestaoObjeto: 'Babá noturna para gêmeos pós natal.', clausulasBase: ['Proíbição de ministrar remédios não homologados verbalmente pelos pais.', 'Limitação das atividades à criança (sem limpeza de ambientes pesados gerais).'], camposExtras: [{ id: 'idadeA', label: 'Idade das Crianças', type: 'text', placeholder: 'Ex: 1 recém nascido e 1 de 2 anos' }, { id: 'fazFaxina', label: 'Faz limpeza da casa/roupas em conjunto?', type: 'enum', options: ['Sim, engloba roupas da família/casa geral', 'NÃO, Apenas demandas específicas atreladas ao bebê'] }] },
  fisioterapeuta: { id: 'fisioterapeuta', icon: 'physical_therapy', title: 'Fisioterapeuta', desc: 'Reabilitação, Postura', sugestaoObjeto: 'Reabilitação joelho pós-cirurgico', clausulasBase: clausulasSaudeCLinica, camposExtras: camposSaudeClinica },
  massoterapeuta: { id: 'massoterapeuta', icon: 'self_improvement', title: 'Massoterapeuta', desc: 'Acupuntura, Quiropraxia', sugestaoObjeto: 'Pacote 4 Drenagens Linfáticas', clausulasBase: clausulasSaudeCLinica, camposExtras: camposSaudeClinica },
  yoga: { id: 'yoga', icon: 'accessibility_new', title: 'Prof. Yoga/Pilates', desc: 'Postura, Atividade em grupo', sugestaoObjeto: '2x Semanálise Pilates Aparelho', clausulasBase: clausulasAulas, camposExtras: camposAulas },
  fono: { id: 'fono', icon: 'hearing', title: 'Fonoaudiólogo(a)', desc: 'Fala, Deglutição', sugestaoObjeto: 'Sessão 45 min infantil', clausulasBase: clausulasSaudeCLinica, camposExtras: camposSaudeClinica },

  // === SERVIÇOS & MANUTENÇÃO CASA ===
  maintenance: { id: 'maintenance', icon: 'construction', title: 'Reformas Gerais / Pedreiro', desc: 'Obras Base e Alvenaria', sugestaoObjeto: 'Reforma de Fachada de Casa.', clausulasBase: clausulasManutencao, camposExtras: camposManutencao },
  eletricista: { id: 'eletricista', icon: 'electric_bolt', title: 'Eletricista', desc: 'Fiação, Painéis', sugestaoObjeto: 'Troca de fiação geral.', clausulasBase: clausulasManutencao, camposExtras: camposManutencao },
  encanador: { id: 'encanador', icon: 'water_drop', title: 'Encanador / Bombeiro H.', desc: 'Vazamentos, Hidro', sugestaoObjeto: 'Desentupimento coluna predial', clausulasBase: clausulasManutencao, camposExtras: camposManutencao },
  limpeza: { id: 'limpeza', icon: 'cleaning_services', title: 'Diarista / Faxineira', desc: 'Limpeza Fina ou Pós Obra', sugestaoObjeto: 'Limpeza Pós Obra Ap. 70m2', clausulasBase: ['Materiais a cargo do cliente, isenções por dolo e danos acidentais à porcelana velhas'], camposExtras: [{ id: 'materialX', label: 'Quem compra Ácidos e Ceras de Obra?', type: 'enum', options: ['Cliente providencia os Litros', 'Profissional traŕa seu próprio kit Mop'] }] },
  montador: { id: 'montador', icon: 'home_repair_service', title: 'Montador Móveis', desc: 'IKEA, Marcenaria Simples', sugestaoObjeto: 'Montagem Guarda Roupa 6 Portas Retrô', clausulasBase: clausulasManutencao, camposExtras: [] },
  arcondicionado: { id: 'arcondicionado', icon: 'ac_unit', title: 'Ar Cond. / Refrigeração', desc: 'Splits, Limpeza, Gás', sugestaoObjeto: 'Instalação de 2 Splits 12000BTUs e Quebra Parede', clausulasBase: [...clausulasManutencao, 'Se o prédio não autorizar furo externo a taxa de visitação ou alteração de fachada fica por conta do Contratante'], camposExtras: [] },
  pintor: { id: 'pintor', icon: 'format_paint', title: 'Pintor(a)', desc: 'Tintas, Impermeabilização', sugestaoObjeto: 'Pintura Interna e Forro (Branca)', clausulasBase: clausulasManutencao, camposExtras: camposManutencao },
  jardineiro: { id: 'jardineiro', icon: 'park', title: 'Jardineiro / Paisagista', desc: 'Corte, Grama, Plantas', sugestaoObjeto: 'Poda Semestral de Condomínio', clausulasBase: [...clausulasManutencao], camposExtras: [] },
  automotivo: { id: 'automotivo', icon: 'directions_car', title: 'Mecânico / Lavador Auto', desc: 'Detailing, Polimento', sugestaoObjeto: 'Vitrificação Celta Prata', clausulasBase: ['Veículo assumido nas condições de pátio verificadas no CheckList visual. Falhas mecânicas motoras indetectáveis eximem prestador estético caso nada atinja a elétrica interna e vice-versa.'], camposExtras: [] },

  // === PETS ===
  dogwalker: { id: 'dogwalker', icon: 'directions_walk', title: 'Dog Walker', desc: 'Passeador e Rotina Pet', sugestaoObjeto: 'Passeio com Pitbull adulto', clausulasBase: clausulasPets, camposExtras: camposPets },
  petsitter: { id: 'petsitter', icon: 'home', title: 'Pet Sitter / Babá Animal', desc: 'Cuidados em época de viagem', sugestaoObjeto: 'Visitas diárias para trocar literbox e água Tarde.', clausulasBase: ['Obrigatoriedade do tutor (cliente) em deixar suficiente alimento, remédios basais e contatos vitais preenchidos em Ficha (WhatsApp do prédio).', ...clausulasPets], camposExtras: camposPets },
  adestrador: { id: 'adestrador', icon: 'auto_awesome', title: 'Adestrador Comportamental', desc: 'Treino, Positivo', sugestaoObjeto: 'Adestramento filhote morder móveis', clausulasBase: ['Os resultados nos animais dependem em 70% da continuidade exercida pelos donos nos dias em que o adestrador está ausente.', ...clausulasPets], camposExtras: camposPets },

  // === EVENTOS E FESTAS ===
  cerimonial: { id: 'cerimonial', icon: 'celebration', title: 'Cerimonialista / Gestor', desc: 'Noivas, Organização Geral', sugestaoObjeto: 'Gestão 15 Anos no Dia (Sem assessoria prévia)', clausulasBase: ['Gestão mitigadora de problemas; isenção de desfalques cometidos por Buffet/Som.'], camposExtras: camposEventos },
  dj: { id: 'dj', icon: 'headphones', title: 'DJ / Banda / Músico', desc: 'Música Festa/Culto', sugestaoObjeto: 'Apresentação Violão Voz 4hrs', clausulasBase: clausulasEventos, camposExtras: camposEventos },
  buffet: { id: 'buffet', icon: 'restaurant_menu', title: 'Buffet & Catering', desc: 'Salgados, Decoração, Churrasco', sugestaoObjeto: 'Feijoada Completa C/ Churrasco Copos Locação', clausulasBase: clausulasEventos, camposExtras: [{ id: 'bebidas', label: 'Bebidas inclusas?', type: 'enum', options: ['Apenas sucos e águas', 'Chopp e Alcoolicos pelo Buffet', 'Alcool é trazido pelo Contratante consignado'] }, ...camposEventos] },
  bartender: { id: 'bartender', icon: 'local_bar', title: 'Bartender / Drinks', desc: 'Carrinho Drinkeria, Garçons', sugestaoObjeto: 'Staff de 2 Barmans com insumos alcoólicos de Drinks Premium', clausulasBase: ['Exigência de ponto de torneira e esgoto livre à 5 metros do bar.'], camposExtras: camposEventos },
  seguranca: { id: 'seguranca', icon: 'security', title: 'Segurança de Eventos', desc: 'Valet, Controle Catraca', sugestaoObjeto: '2 Agentes em Terno para Festa Vips', clausulasBase: ['Ação contundente apenas em resguardo de segurança iminente do Patrimônio Privado atrelando apoio policial e chamados imediatos se houver descontrole extremo.', ...clausulasEventos], camposExtras: camposEventos },
  decorador: { id: 'decorador', icon: 'local_florist', title: 'Decorador Festas', desc: 'Balões, Temática Infantil', sugestaoObjeto: 'Decoração Tema Safári P. Mesa Provençal e Balões', clausulasBase: ['Furto ou depredação dos acessórios alugados de MESA durante o turno do evento repassam a cobrança baseada no preço de prateleira ou reposição aos moldes de contrato civil.'], camposExtras: camposEventos },
  fotocabine: { id: 'fotocabine', icon: 'camera', title: 'Totem / Foto Cabine 360', desc: 'Totens Espelho, Plataforma360', sugestaoObjeto: 'Aluguel Plataforma Spinner 360 4hrs', clausulasBase: ['Dano direto no braço mecânico ou espelho touch feito por pessoas invadindo limite da fila incorrerá em responsabilidade e ônus imediato ao dono do evento e seus convidados acionadores.'], camposExtras: [{ id: 'wiifiii', label: 'Local cede WiFI para as fotos Icloud?', type: 'enum', options: ['Sim, evento fornece senha.', 'Prestador Levará seu 4G/Internet StarLink'] }] },

  // === OUTROS GENERIC ===
  other: {
    id: 'other', icon: 'more_horiz', title: 'Outros Profissionais / Livre', desc: 'Sua Profissão Especial',
    sugestaoObjeto: 'Descreva perfeitamente seu serviço prestado.',
    clausulasBase: clausulasDefaultIA,
    camposExtras: [],
  },
};

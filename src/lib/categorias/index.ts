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
    options?: string[];
    placeholder?: string;
  }[];
}

export const categorias: Record<CategoriaSlug, CategoriaContrato> = {
  designer: {
    id: 'designer',
    icon: 'palette',
    title: 'Designer / Freelancer Digital',
    desc: 'Logos, UI/UX, Social Media',
    sugestaoObjeto: 'Ex: Criação de Identidade Visual contendo Logo, Tipografia, Paleta de Cores e Manual da Marca.',
    clausulasBase: [
      'Cessão de direitos de propriedade intelectual condicionada ao pagamento integral (art. 49 da Lei 9.610/98)',
      'Direito de portfólio: o prestador pode exibir o trabalho após entrega e quitação',
      'Limite de revisões: se informado, incluir número; se não informado, omitir — não inventar número',
      'Entrega dos arquivos finais somente após quitação total do valor contratado',
    ],
    camposExtras: [
      { id: 'limiteAprovacao', label: 'Prazo limite para o cliente aprovar/revisar (dias)?', type: 'number', placeholder: 'Ex: 5' },
      { id: 'numeroRevisoes', label: 'Número máximo de rodadas de revisão/alterações?', type: 'number', placeholder: 'Ex: 3' },
      { id: 'formatosEntrega', label: 'Formatos de arquivo entregues finais?', type: 'text', placeholder: 'Ex: PDF, PNG, Figma' },
    ],
  },
  dev: {
    id: 'dev',
    icon: 'code',
    title: 'Desenvolvedor de Software',
    desc: 'Sites, Apps, Sistemas',
    sugestaoObjeto: 'Ex: Desenvolvimento de Landing Page institucional em React/Next.js com 5 seções.',
    clausulasBase: [
      'Propriedade do código-fonte transferida somente após pagamento integral do valor contratado',
      'Isenção de responsabilidade por falhas em servidores, APIs ou integrações de terceiros',
      'Garantia contra bugs críticos: incluir prazo somente se informado pelo usuário; caso contrário, omitir',
      'Entrega inclui código-fonte e documentação básica de uso conforme acordado',
    ],
    camposExtras: [
      { id: 'tecnologias', label: 'Principais tecnologias utilizadas?', type: 'text', placeholder: 'Ex: React, Node.js, AWS' },
      { id: 'hospedagem', label: 'Quem paga pela infraestrutura/hospedagem mensal?', type: 'enum', options: ['O Cliente', 'O Prestador', 'Público/Gratuito'] },
      { id: 'codigoAberto', label: 'O código-fonte será entregue ao cliente?', type: 'boolean' },
    ],
  },
  photo: {
    id: 'photo',
    icon: 'photo_camera',
    title: 'Fotógrafo / Videomaker',
    desc: 'Eventos, Ensaios, Edição',
    sugestaoObjeto: 'Ex: Cobertura fotográfica de evento corporativo com duração de 4 horas.',
    clausulasBase: [
      'Autorização de uso de imagem do evento ou sessão concedida pelo CONTRATANTE',
      'Direito de uso do material para portfólio profissional do prestador',
      'Política de reagendamento: imprevistos climáticos ou emergências documentadas permitem reagendamento sem multa',
      'Arquivos RAW: incluir cláusula de retenção somente se o usuário não informou entrega dos RAW',
      'Prazo de entrega conta a partir da data do evento ou sessão, não da assinatura do contrato',
    ],
    camposExtras: [
      { id: 'localEvento', label: 'Local de realização da sessão/evento?', type: 'text', placeholder: 'Endereço completo' },
      { id: 'dataHoraEvento', label: 'Data e Hora (Início e Fim)?', type: 'text', placeholder: 'Ex: 25/11 das 14h às 18h' },
      { id: 'quantidadeFotos', label: 'Quantidade exata de fotos editadas a serem entregues?', type: 'number', placeholder: 'Ex: 40' },
    ],
  },
  consultant: {
    id: 'consultant',
    icon: 'school',
    title: 'Consultor / Professor / Coach',
    desc: 'Aulas, Mentorias, Estratégia',
    sugestaoObjeto: 'Ex: Mentoria online de gestão de tempo, 4 sessões de 1 hora.',
    clausulasBase: [
      'Obrigação de meio, não de resultado: o prestador não garante resultados específicos, apenas a qualidade técnica do serviço',
      'NDA: sigilo reforçado sobre estratégias, dados e informações de negócio do cliente',
      'Tolerância de 15 minutos para início das sessões; após esse período, a sessão poderá ser reagendada',
      'Política de cancelamento: aviso com antecedência mínima de 24 horas antes da sessão',
    ],
    camposExtras: [
      { id: 'formatoAulas', label: 'Formato (Online ou Presencial)?', type: 'enum', options: ['Online (Zoom/Meet)', 'Presencial', 'Híbrido'] },
      { id: 'quantidadeSessoes', label: 'Quantas sessões/horas totais no pacote?', type: 'number', placeholder: 'Ex: 10 horas' },
      { id: 'gravacaoAutorizada', label: 'As sessões poderão ser gravadas?', type: 'boolean' },
    ],
  },
  maintenance: {
    id: 'maintenance',
    icon: 'construction',
    title: 'Eletricista / Encanador / Construção',
    desc: 'Reparos, Manutenção e Obras',
    sugestaoObjeto: 'Ex: Troca de fiação no apartamento e instalação de 5 tomadas novas.',
    clausulasBase: [
      'Definição clara de responsabilidade pelo fornecimento de materiais: usar o que foi informado pelo usuário; se não informado, deixar como "a definir entre as partes"',
      'Responsabilidade civil restrita ao escopo dos serviços contratados, não cobrindo vícios ocultos da estrutura geral do imóvel',
      'Garantia de mão de obra: incluir prazo somente se informado pelo usuário; caso contrário, omitir',
      'Vistoria prévia: o prestador atesta as condições do local antes do início dos serviços',
    ],
    camposExtras: [
      { id: 'fornecimentoMateriais', label: 'Quem comprará os materiais/peças?', type: 'enum', options: ['O Cliente', 'O Prestador', 'A Combinar'] },
      { id: 'descartes', label: 'Quem será responsável pela remoção de entulho/descarte?', type: 'enum', options: ['O Cliente', 'O Prestador'] },
      { id: 'horarioPermitido', label: 'Horário permitido para barulho/obras no local?', type: 'text', placeholder: 'Ex: 08h às 17h' },
    ],
  },
  other: {
    id: 'other',
    icon: 'more_horiz',
    title: 'Outros Serviços',
    desc: 'Personalizado',
    sugestaoObjeto: 'Descreva em detalhes o que você irá entregar ao cliente.',
    clausulasBase: [
      'Analisar o tipo de serviço e aplicar: SE presencial → cláusula de local e imprevistos; SE remoto/digital → entrega digital e ferramentas; SE criativo → cessão de propriedade intelectual; SE técnico → garantia e limite de responsabilidade; SE saúde/bem-estar → isenção de resultado terapêutico; SE educacional → obrigação de meio, não de resultado',
      'Cláusula de rescisão com aviso prévio mínimo de 30 dias para contratos de prestação contínua',
      'Sigilo padrão sobre informações e dados do contratante',
      'Foro de eleição com base na comarca do prestador',
    ],
    camposExtras: [],
  },
};

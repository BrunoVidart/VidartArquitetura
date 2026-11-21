// =========================================================================
// VA. ARQUITETURA & INTERIORES — BRIEFING DIGITAL v2.1
// Dados Curatoriais, Escopo Técnico, Materialidade & Parâmetros de Dossiê
// =========================================================================

window.VA_DATA = {
  brand: {
    name: "VA. ARQUITETURA",
    fullName: "VA Arquitetura & Interiores",
    studioWhatsapp: "",
    // Hash SHA-256 da chave de acesso administrativa
    adminPinHash: "0bb7ca9c5fa96f7c95c79f405fd12d1b9ae6ec4c64d7e006c293eb759489102c"
  },

  scopeOptions: {
    typologies: [
      { id: "tip_apartamento", label: "Apartamento" },
      { id: "tip_cobertura", label: "Cobertura / Duplex" },
      { id: "tip_casa", label: "Casa Residencial" },
      { id: "tip_campo_praia", label: "Casa de Campo ou Praia" }
    ],
    stages: [
      { id: "est_planta", label: "Na Planta / Construção" },
      { id: "est_reforma", label: "Reforma Completa" },
      { id: "est_atualizacao", label: "Atualização de Interiores" }
    ],
    areas: [
      { id: "met_90", label: "< 90 m²" },
      { id: "met_180", label: "90 – 180 m²" },
      { id: "met_350", label: "180 – 350 m²" },
      { id: "met_350_plus", label: "> 350 m²" }
    ],
    rooms: [
      { id: "amb_completo", label: "Projeto Completo" },
      { id: "amb_living", label: "Living & Jantar" },
      { id: "amb_cozinha", label: "Cozinha & Gourmet" },
      { id: "amb_hall", label: "Hall & Lavabo" },
      { id: "amb_suite", label: "Suíte Master" },
      { id: "amb_closet", label: "Closet" },
      { id: "amb_banhos", label: "Salas de Banho" },
      { id: "amb_office", label: "Home Office" },
      { id: "amb_varanda", label: "Varanda & Externo" }
    ],
    household: [
      { id: "comp_individual", label: "Individual" },
      { id: "comp_casal", label: "Casal" },
      { id: "comp_filhos_pequenos", label: "Filhos Pequenos" },
      { id: "comp_filhos_adolescentes", label: "Filhos Adolescentes" },
      { id: "comp_pets", label: "Pets em Casa" },
      { id: "comp_hospedes", label: "Hóspedes Frequentes" }
    ],
    specTiers: [
      {
        id: "spec_racionalizado",
        label: "Racionalizado / Essencial",
        desc: "Soluções diretas, marcenaria limpa de alto custo-benefício e seleção criteriosa de revestimentos."
      },
      {
        id: "spec_alto_padrao",
        label: "Alto Padrão",
        desc: "Pedras naturais selecionadas, marcenaria em lâmina natural, iluminação cênica e mobiliário assinado."
      },
      {
        id: "spec_bespoke",
        label: "Bespoke / Colecionável",
        desc: "Peças exclusivas sob desenho do estúdio, mármores raros, automação integral e curadoria de arte."
      }
    ],
    timelines: [
      { id: "prz_imediato", label: "Imediato (0–3 meses)" },
      { id: "prz_planejado", label: "Planejado (3–6 meses)" },
      { id: "prz_longo", label: "Longo Prazo (6–12+ meses)" }
    ]
  },

  cards: [
    {
      id: "c_01",
      index: "01",
      env: "Estar",
      title: "Volumetria Orgânica e Estofados Curvos",
      variable: "Geometria do Mobiliário",
      desc: "Formas fluidas e estofados de silhueta curva que suavizam a arquitetura ortogonal e convidam à permanência.",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_02",
      index: "02",
      env: "Estar",
      title: "Concreto Aparente e Madeira Natural",
      variable: "Contraste Material Bruto × Quente",
      desc: "Equilíbrio entre a tectonicidade do concreto arquitetônico e o calor tátil da madeira em painéis contínuos.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_03",
      index: "03",
      env: "Estar",
      title: "Molduras Clássicas Contemporâneas",
      variable: "Linguagem Arquitetônica de Paredes",
      desc: "Boiseries contemporâneas em relevo sutil, alinhadas à proporção do pé-direito e à iluminação rasante.",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_04",
      index: "04",
      env: "Jantar",
      title: "Mesa Monolítica em Pedra Natural",
      variable: "Peça Central Escultural",
      desc: "Bloco escultórico em mármore ou quartzito natural como âncora visual e ponto de convergência do jantar.",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_05",
      index: "05",
      env: "Jantar",
      title: "Transparência Total para Paisagem",
      variable: "Abertura e Luz Natural",
      desc: "Esquadrias minimalistas piso-teto que dissolvem o limite entre a área social e a paisagem exterior.",
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_06",
      index: "06",
      env: "Cozinha",
      title: "Ilha Monolítica Aberta ao Convívio",
      variable: "Protagonismo da Ilha Gourmet",
      desc: "Bancada central contínua que integra o preparo culinário à conversa, com linhas limpas e apoio imediato.",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_07",
      index: "07",
      env: "Cozinha",
      title: "Marcenaria Oculta com Portas Escamoteáveis",
      variable: "Camuflagem de Eletros e Bancada",
      desc: "Painéis piso-teto que recolhem equipamentos e área de apoio, preservando a leitura serena do estar.",
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_08",
      index: "08",
      env: "Hall",
      title: "Hall Galeria com Pedra e Arte",
      variable: "Ritual de Chegada",
      desc: "Transição contemplativa entre o externo e o íntimo, marcada por piso mineral, luz focal e obra de arte.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_09",
      index: "09",
      env: "Lavabo",
      title: "Lavabo Cenográfico com Cuba Esculpida",
      variable: "Dramaturgia em Pequena Escala",
      desc: "Atmosfera intimista com iluminação de destaque, pedra natural esculpida e textura mineral envolvente.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_10",
      index: "10",
      env: "Home Office",
      title: "Escritório Revestido em Madeira",
      variable: "Envolvimento Acústico e Foco",
      desc: "Superfícies amadeiradas contínuas que absorvem reverberação e constroem um ambiente de concentração profunda.",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_11",
      index: "11",
      env: "Biblioteca",
      title: "Estante Arquitetônica Piso-Teto",
      variable: "Exposição de Acervo e Livros",
      desc: "Estrutura vertical modulada para abrigar livros, objetos afetivos e iluminação integrada por prateleira.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_12",
      index: "12",
      env: "Suíte Master",
      title: "Cabeceira em Marcenaria com Luz Indireta",
      variable: "Enquadramento da Cama",
      desc: "Plano horizontal de madeira e tecido com luz quente embutida, desenhando repouso visual ao redor da cama.",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_13",
      index: "13",
      env: "Suíte Master",
      title: "Refúgio Monocromático em Linho",
      variable: "Redução Visual para Descanso",
      desc: "Paleta contida e têxteis naturais lavados que reduzem estímulos visuais e privilegiam a qualidade do sono.",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_14",
      index: "14",
      env: "Closet",
      title: "Vitrine em Vidro Reflecta e LED Linear",
      variable: "Transparência e Exibição",
      desc: "Portas em vidro fumê reflexivo com perfis metálicos delgados e iluminação interna automática por sensor.",
      image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_15",
      index: "15",
      env: "Closet",
      title: "Marcenaria Lisa Piso-Teto (Fecho-Toque)",
      variable: "Ordem Visual Absoluta",
      desc: "Armários fechados sem puxadores aparentes, alinhados ao plano da parede para silêncio visual completo.",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_16",
      index: "16",
      env: "Sala de Banho",
      title: "Banheira Freestanding de Imersão",
      variable: "Experiência de SPA Particular",
      desc: "Peça de imersão solta no ambiente, valorizada por revestimentos minerais contínuos e luz regulável.",
      image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_17",
      index: "17",
      env: "Sala de Banho",
      title: "Cuba Dupla e Metais Escovados de Parede",
      variable: "Simetria e Metais Arquitetônicos",
      desc: "Bancada dupla equilibrada com bicas embutidas na parede e acabamento metálico escovado de baixa refletância.",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    },
    {
      id: "c_18",
      index: "18",
      env: "Varanda",
      title: "Terraço Gourmet com Paisagismo Integrado",
      variable: "Extensão Exterior da Sala",
      desc: "Continuidade de piso e linguagem material entre interior e terraço, com vegetação estruturada e estar ao ar livre.",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
      aspect: "4/3"
    }
  ],

  rituals: [
    { id: "rit_jantares", label: "Receber para Jantares", iconKey: "wine" },
    { id: "rit_culinaria", label: "Culinária Diária", iconKey: "utensils" },
    { id: "rit_trabalho", label: "Trabalho Remoto com Reuniões", iconKey: "laptop" },
    { id: "rit_leitura", label: "Leitura & Silêncio", iconKey: "book" },
    { id: "rit_cinema", label: "Cinema em Casa", iconKey: "film" },
    { id: "rit_pets", label: "Convivência com Pets", iconKey: "paw" },
    { id: "rit_biofilia", label: "Biofilia & Plantas", iconKey: "leaf" },
    { id: "rit_cafe", label: "Ritual do Café / Chá", iconKey: "coffee" },
    { id: "rit_banho", label: "Banho Terapêutico", iconKey: "bath" },
    { id: "rit_adega", label: "Adega & Degustação", iconKey: "bottle" },
    { id: "rit_movimento", label: "Prática de Movimento & Bem-Estar", iconKey: "activity" },
    { id: "rit_infantil", label: "Convivência Infantil", iconKey: "blocks" }
  ],

  tradeoffs: [
    {
      id: "tr_cozinha",
      label: "Cozinha",
      optionA: {
        id: "A",
        title: "Totalmente Integrada ao Living",
        spec: "Bancada contínua e permeabilidade total com o estar e jantar."
      },
      optionB: {
        id: "B",
        title: "Com Painéis de Correr para Isolamento",
        spec: "Esquadria ou painéis piso-teto para fechar o ambiente durante o preparo."
      }
    },
    {
      id: "tr_tv_suite",
      label: "TV na Suíte Master",
      optionA: {
        id: "A",
        title: "Sem TV (Refúgio Puro)",
        spec: "Ambiente dedicado ao descanso, leitura e ausência de telas."
      },
      optionB: {
        id: "B",
        title: "TV Integrada ou Oculta na Marcenaria",
        spec: "Painel limpo ou mecanismo oculto mantendo a serenidade do quarto."
      }
    },
    {
      id: "tr_iluminacao",
      label: "Iluminação",
      optionA: {
        id: "A",
        title: "2700K — Quente, Cênica e Indireta",
        spec: "Temperatura acolhedora, baixo ofuscamento e foco em atmosfera."
      },
      optionB: {
        id: "B",
        title: "3000K — Equilibrada e Funcional",
        spec: "Luz neutra-quente para leitura nítida e fidelidade cromática diária."
      }
    },
    {
      id: "tr_automacao",
      label: "Automação",
      optionA: {
        id: "A",
        title: "Comandos Táteis de Design",
        spec: "Interruptores arquitetônicos em metal ou pedra com operação direta."
      },
      optionB: {
        id: "B",
        title: "Cenas de Luz, Cortinas Motorizadas e Som Embutido",
        spec: "Automação integrada por cenas programáveis e acionamento discreto."
      }
    },
    {
      id: "tr_climatizacao",
      label: "Climatização",
      optionA: {
        id: "A",
        title: "Sistema Dutado / Grelha Linear Invisível",
        spec: "Difusão linear embutida no forro sem equipamentos aparentes."
      },
      optionB: {
        id: "B",
        title: "Aparelhos Split Discretos",
        spec: "Unidades estrategicamente posicionadas ou embutidas em marcenaria."
      }
    },
    {
      id: "tr_acustica",
      label: "Conforto Acústico",
      optionA: {
        id: "A",
        title: "Isolamento Reforçado (Janelas/Portas Acústicas)",
        spec: "Vedação perimetral, vidros laminados duplos e tratamento acústico."
      },
      optionB: {
        id: "B",
        title: "Conforto Acústico Padrão",
        spec: "Esquadrias convencionais equilibradas com absorção por têxteis e tapetes."
      }
    }
  ],

  ergonomics: {
    bedSizes: [
      { id: "cama_queen", label: "Queen" },
      { id: "cama_king", label: "King" },
      { id: "cama_super_king", label: "Super King" }
    ],
    bathBasins: [
      { id: "cuba_unica", label: "Cuba Única Ampla" },
      { id: "cuba_dupla", label: "Cuba Dupla" }
    ],
    bathShowers: [
      { id: "chuveiro_unico", label: "Chuveiro Único" },
      { id: "chuveiro_duplo", label: "Chuveiro Duplo" }
    ]
  },

  palettes: [
    {
      id: "pal_travertino",
      title: "Travertino, Linho Cru & Carvalho Natural",
      desc: "Base mineral luminosa em pedra porosa levigada, madeira clara de veios suaves e tecidos naturais sem brilho.",
      materials: {
        stone: "Travertino Romano Levigado",
        wood: "Carvalho Europeu Natural",
        fabric: "Linho Cru Lavado & Bouclé",
        metal: "Latão Champanhe Escovado"
      },
      colors: ["#F5F2EC", "#E5DDD0", "#C7B8A1", "#9E8D74", "#5E5345"],
      image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85"
    },
    {
      id: "pal_nogueira",
      title: "Nogueira, Couro Sela & Terracota Mineral",
      desc: "Acolhimento profundo com madeiras amendoadas, pigmentos terrosos minerais e couro natural de toque quente.",
      materials: {
        stone: "Quartzito Taj Mahal Fosco",
        wood: "Nogueira Americana Natural",
        fabric: "Couro Sela & Lã Virgem",
        metal: "Bronze Oxidado Matte"
      },
      colors: ["#EFE9E0", "#D1B399", "#A67658", "#6E4934", "#33241C"],
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85"
    },
    {
      id: "pal_alabastro",
      title: "Alabastro, Mármore Nero & Bronze Escovado",
      desc: "Contraste arquitetônico preciso entre superfícies claras acetinadas, pedras escuras marcantes e metais escovados.",
      materials: {
        stone: "Mármore Nero Marquina & Alabastro",
        wood: "Freijó Ebanizado",
        fabric: "Linho Chumbo & Veludo Seco",
        metal: "Bronze Escovado Arquitetônico"
      },
      colors: ["#F7F6F3", "#D8D5CE", "#8F734B", "#3B3936", "#181715"],
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
    },
    {
      id: "pal_salvia",
      title: "Cal Mineral, Sálvia & Madeira Lavada",
      desc: "Atmosfera orgânica silenciosa com pintura à cal, tons botânicos dessaturados e madeira de acabamento lavado.",
      materials: {
        stone: "Limestone Cinza & Cal Mineral",
        wood: "Freijó Lavado Fosco",
        fabric: "Algodão Orgânico & Cânhamo",
        metal: "Níquel Escovado Suave"
      },
      colors: ["#ECEEE9", "#C6CEC3", "#8E9B8C", "#5B695B", "#2F3830"],
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85"
    }
  ],

  patinaScale: [
    {
      value: 1,
      title: "Pátina Viva",
      desc: "Mármores levigados, linho puro e latão vivo que registram a passagem do tempo com autenticidade."
    },
    {
      value: 2,
      title: "Natural com Proteção Sutil",
      desc: "Materiais naturais com impermeabilização mineral invisível, mantendo o toque original com menor absorção."
    },
    {
      value: 3,
      title: "Equilíbrio entre Matéria e Uso",
      desc: "Combinação estratégica de pedras e madeiras nobres nas áreas sociais com superfícies resistentes nas zonas úmidas."
    },
    {
      value: 4,
      title: "Manutenção Otimizada",
      desc: "Prioridade para quartzitos densos, lâminas tratadas e tecidos de limpeza facilitada sem perder aspecto fosco."
    },
    {
      value: 5,
      title: "Alta Praticidade",
      desc: "Pedras sinterizadas, tecidos antimancha de alta performance e superfícies de manutenção mínima no dia a dia."
    }
  ],

  priorities: [
    { id: "prio_marcenaria", label: "Marcenaria Sob Medida", iconKey: "layers" },
    { id: "prio_pedras", label: "Mármores & Pedras Naturais", iconKey: "gem" },
    { id: "prio_luminotecnica", label: "Luminotécnica & Automação", iconKey: "sun" },
    { id: "prio_mobiliario", label: "Mobiliário Assinado", iconKey: "armchair" },
    { id: "prio_acustica", label: "Acústica & Climatização Embutida", iconKey: "sliders" },
    { id: "prio_arte", label: "Arte & Curadoria", iconKey: "frame" }
  ],

  vetos: [
    { id: "veto_porcelanato_brilho", label: "Porcelanato Alto Brilho" },
    { id: "veto_led_rgb", label: "LED Colorido / RGB" },
    { id: "veto_sancas_gesso", label: "Sancas Rebuscadas de Gesso" },
    { id: "veto_laca_brilhante", label: "Laca Brilhante" },
    { id: "veto_cromado", label: "Cromado Espelhado" },
    { id: "veto_tapetes_felpudos", label: "Tapetes Felpudos" },
    { id: "veto_cores_saturadas", label: "Cores Saturadas" },
    { id: "veto_escuros", label: "Ambientes Muito Escuros" }
  ]
};

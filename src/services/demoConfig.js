export const CONFIG_DEMO = {
  metodo: {
    nome: 'Diagnóstico RMS',
    descricao: 'Descubra os padrões invisíveis que estão bloqueando sua prosperidade, sua paz e sua evolução.',
    cta_texto: 'Quero reprogramar minha mente →',
    cta_link: '#',
  },
  areas: [
    {
      id: 'prosperidade',
      nome: 'Prosperidade',
      perguntas: [
        {
          texto: '[Nome], quando uma oportunidade financeira aparece, qual é sua reação mais honesta?',
          opcoes: [
            { texto: 'Trava e procrastino até a oportunidade passar', pontuacao: 1, crenca_revelada: 'bloqueio de merecimento' },
            { texto: 'Me animo mas logo aparecem dúvidas que me freiam', pontuacao: 2, crenca_revelada: 'medo de falhar' },
            { texto: 'Fico animado mas me saboto de formas que só percebo depois', pontuacao: 2, crenca_revelada: 'autossabotagem' },
            { texto: 'Analiso e avanço com confiança', pontuacao: 3, crenca_revelada: 'mentalidade de abundância' },
          ],
          reacoes: {
            baixo: '[Nome], esse padrão que você descreveu revela algo muito antigo — uma crença de que prosperidade não é para você.',
            medio: '[Nome], essa hesitação que você sente tem uma raiz específica. Estamos identificando ela.',
            alto: '[Nome], essa consciência que você tem de si mesmo já é um diferencial raro.',
          },
          gatilho_continuidade: 'Agora vamos olhar de onde vem esse padrão.',
        },
        {
          texto: 'Com que frequência você se sente merecedor de ganhar bem pelo que faz?',
          opcoes: [
            { texto: 'Raramente — sempre acho que poderia fazer mais', pontuacao: 1, crenca_revelada: 'síndrome do impostor' },
            { texto: 'Às vezes, depende muito do meu humor', pontuacao: 2, crenca_revelada: 'autoestima flutuante' },
            { texto: 'Na maioria das vezes sim', pontuacao: 3, crenca_revelada: 'autoconfiança em desenvolvimento' },
            { texto: 'Sempre — sei o valor do que entrego', pontuacao: 3, crenca_revelada: 'consciência de valor' },
          ],
          reacoes: {
            baixo: '[Nome], esse sentimento de "não ser suficiente" é uma das crenças mais comuns — e mais removíveis.',
            medio: 'Essa oscilação tem um padrão por trás. Vamos continuar.',
            alto: 'Esse nível de clareza sobre seu valor é raro. Vamos ver como ele se mantém nas outras áreas.',
          },
          gatilho_continuidade: 'Poucas pessoas conseguem responder isso com essa honestidade.',
        },
      ],
      perfis: {
        baixo: 'Existem bloqueios profundos de merecimento que estão limitando sua relação com a prosperidade.',
        medio: 'Você tem consciência dos seus padrões, mas ainda opera com freios automáticos que sabotam seus avanços.',
        alto: 'Sua relação com a prosperidade está alinhada. O trabalho aqui é solidificar essa base.',
      },
    },
    {
      id: 'blindagem',
      nome: 'Blindagem Emocional',
      perguntas: [
        {
          texto: 'Quando algo te frustra, quanto tempo você leva para sair do estado emocional negativo?',
          opcoes: [
            { texto: 'Dias — fico ruminando e não consigo largar', pontuacao: 1, crenca_revelada: 'aprisionamento emocional' },
            { texto: 'Horas — com esforço consciente consigo seguir', pontuacao: 2, crenca_revelada: 'regulação parcial' },
            { texto: 'Minutos — processo rápido e sigo em frente', pontuacao: 3, crenca_revelada: 'resiliência emocional' },
            { texto: 'Me adapto em tempo real sem perder o estado', pontuacao: 3, crenca_revelada: 'blindagem ativa' },
          ],
          reacoes: {
            baixo: '[Nome], essa ruminação é como um loop que a mente criou para se "proteger" — mas acaba aprisionando.',
            medio: 'Você já tem um mecanismo de saída. O próximo passo é torná-lo automático.',
            alto: 'Essa capacidade de processamento rápido é um dos pilares da performance de elite.',
          },
          gatilho_continuidade: 'Isso tem uma origem muito específica. A próxima pergunta vai ajudar a identificar.',
        },
      ],
      perfis: {
        baixo: 'Seus gatilhos emocionais ainda controlam suas reações. Há um trabalho importante de desativação a fazer.',
        medio: 'Você está desenvolvendo consciência emocional. O próximo nível é a resposta automática sem esforço.',
        alto: 'Sua blindagem emocional já é uma fortaleza. O trabalho é manter e expandir.',
      },
    },
    {
      id: 'performance',
      nome: 'Performance de Elite',
      perguntas: [
        {
          texto: '[Nome], quando precisa tomar uma decisão importante, o que acontece internamente?',
          opcoes: [
            { texto: 'Paraliso e fico analisando demais até perder o momento', pontuacao: 1, crenca_revelada: 'paralisia por análise' },
            { texto: 'Demoro, mas eventualmente decido', pontuacao: 2, crenca_revelada: 'lentidão decisória' },
            { texto: 'Decido com relativa rapidez, mas com alguma ansiedade', pontuacao: 2, crenca_revelada: 'decisão ansiosa' },
            { texto: 'Processo, decido e executo sem arrependimento', pontuacao: 3, crenca_revelada: 'decisão soberana' },
          ],
          reacoes: {
            baixo: '[Nome], essa paralisia na tomada de decisão protege de erros — mas também bloqueia avanços.',
            medio: 'Você tem capacidade decisória, mas ela ainda não está operando no piloto automático.',
            alto: 'Essa fluidez decisória é rara. Ela nasce de um sistema de crenças muito bem calibrado.',
          },
          gatilho_continuidade: '[Nome], uma peça do seu padrão acabou de se revelar.',
        },
      ],
      perfis: {
        baixo: 'A tomada de decisão ainda está sendo freada por medos subconscientes.',
        medio: 'Você decide, mas com um custo energético alto. O objetivo é tornar esse processo leve.',
        alto: 'Sua capacidade decisória já opera em alto nível.',
      },
    },
    {
      id: 'superacao',
      nome: 'Superação de Ciclos',
      perguntas: [
        {
          texto: 'Você consegue identificar um padrão que se repete na sua vida, mesmo quando tenta mudar?',
          opcoes: [
            { texto: 'Sim, claramente — e não sei como sair', pontuacao: 1, crenca_revelada: 'ciclo consciente bloqueado' },
            { texto: 'Percebo às vezes, mas não consigo nomear', pontuacao: 2, crenca_revelada: 'consciência parcial' },
            { texto: 'Já identifiquei e estou quebrando ativamente', pontuacao: 3, crenca_revelada: 'ruptura em andamento' },
            { texto: 'Quebramos ciclos — é minha maior habilidade', pontuacao: 3, crenca_revelada: 'maestria em superação' },
          ],
          reacoes: {
            baixo: '[Nome], conseguir nomear esse ciclo já é o primeiro passo para quebrá-lo. Você está mais próximo do que imagina.',
            medio: 'Estou percebendo um padrão aqui. Vamos continuar.',
            alto: 'Sua capacidade de quebrar ciclos é um dos ativos mais valiosos que uma pessoa pode desenvolver.',
          },
          gatilho_continuidade: 'Seu perfil RMS está quase completo. Mais uma área e você vai ver algo que poucas pessoas têm coragem de encarar.',
        },
      ],
      perfis: {
        baixo: 'Os ciclos repetitivos ainda têm raízes profundas. Há padrões subconscientes que precisam ser identificados e removidos.',
        medio: 'Você está no limiar da mudança. Com a ferramenta certa, esse ciclo se quebra.',
        alto: 'Você já opera em modo de superação ativa. O trabalho agora é escalar essa habilidade.',
      },
    },
  ],
  transicoes: {
    frases_progresso: [
      'Entendendo seus padrões...',
      'Identificando suas raízes...',
      'Seu perfil está se formando...',
      'Análise concluída.',
    ],
    pausa_acumulada: 'Estou percebendo um padrão aqui. Vamos continuar.',
  },
}

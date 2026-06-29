const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile'

async function groqFetch(messages) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY não configurada')

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = new Error(`[${res.status}] ${res.statusText}`)
    err.status = res.status
    throw err
  }

  const data = await res.json()
  return data.choices[0].message.content
}

// Retorna uma sessão de chat com a mesma interface do Gemini: { sendMessage(text) }
export function createGroqChatSession(systemPrompt) {
  const messages = [{ role: 'system', content: systemPrompt }]

  return {
    async sendMessage(text) {
      messages.push({ role: 'user', content: text })
      const content = await groqFetch(messages)
      messages.push({ role: 'assistant', content })
      return { response: { text: () => content } }
    },
  }
}

function buildPrompt(config, userData, respostas, scores) {
  const resumoRespostas = respostas.map(r => {
    const linha = `- Área: ${r.areaNome} | Pergunta: "${r.pergunta}" | Resposta: "${r.opcao}" | Pontuação: ${r.pontuacao}/3`
    return r.textoLivre ? `${linha} | Com suas palavras: "${r.textoLivre}"` : linha
  }).join('\n')

  const resumoScores = Object.entries(scores)
    .map(([area, val]) => `- ${area}: ${val}%`)
    .join('\n')

  const areaCritica = Object.entries(scores).reduce((menor, [area, val]) =>
    val < menor[1] ? [area, val] : menor, ['', 100])

  return `Você é o sistema de diagnóstico do método ${config.metodo.nome}.

Seu único papel é analisar as respostas do usuário e gerar um diagnóstico personalizado com base nos dados abaixo.

REGRAS ABSOLUTAS:
- NÃO faça perguntas
- NÃO ofereça conselhos além do diagnóstico
- NÃO saia do escopo do método
- Use o nome da pessoa (${userData.nome}) naturalmente no texto
- Se ela escreveu algo no campo livre, use as palavras exatas dela
- Seja direto, empático e preciso
- Responda em português brasileiro
- Não use markdown, asteriscos ou formatação especial — texto corrido

[CONFIGURAÇÃO DO MÉTODO]
Nome: ${config.metodo.nome}
Descrição: ${config.metodo.descricao}

[NOME DO USUÁRIO]
${userData.nome}

[SCORES POR ÁREA — 0 a 100]
${resumoScores}

[ÁREA CRÍTICA]
${areaCritica[0]} (${areaCritica[1]}%)

[RESPOSTAS COMPLETAS]
${resumoRespostas}

Gere o diagnóstico em 3 partes, sem títulos ou separadores — texto contínuo:
1. Observação geral do perfil (2 a 3 frases que mostrem que o sistema realmente entendeu a pessoa)
2. Área que mais precisa de atenção — aprofunde com empatia, nomeie o padrão, mostre que tem origem identificável
3. Próximo passo recomendado — conduza naturalmente para a mentoria sem soar como propaganda`
}

export async function gerarDiagnosticoGroq({ config, userData, respostas, scores }) {
  const prompt = buildPrompt(config, userData, respostas, scores)
  const messages = [{ role: 'user', content: prompt }]

  let tentativas = 0
  while (tentativas < 3) {
    try {
      return await groqFetch(messages)
    } catch (err) {
      if ((err?.status === 503 || err?.status === 429) && tentativas < 2) {
        tentativas++
        await new Promise(r => setTimeout(r, 2000 * tentativas))
        continue
      }
      throw err
    }
  }
}

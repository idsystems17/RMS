import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash'

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

export async function gerarDiagnostico({ config, userData, respostas, scores }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY não configurada')

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: MODEL })

  const prompt = buildPrompt(config, userData, respostas, scores)

  let tentativas = 0
  while (tentativas < 3) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (err) {
      // 503 = sobrecarga temporária, tenta novamente
      if (err?.status === 503 && tentativas < 2) {
        tentativas++
        await new Promise(r => setTimeout(r, 2000 * tentativas))
        continue
      }
      throw err
    }
  }
}

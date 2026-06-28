import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `Você é um assistente especializado em estruturar métodos de transformação pessoal em quizzes interativos de diagnóstico.

Sua tarefa é conduzir uma entrevista estruturada com o expert para extrair todas as informações necessárias para criar um quiz personalizado.

SEQUÊNCIA DA ENTREVISTA — siga esta ordem exata:
1. Nome do método e o que ele resolve (uma frase de impacto)
2. Quantas e quais áreas de vida o método avalia
3. Para cada área: de 3 a 5 perguntas com 4 opções (A/B/C/D), a pontuação de cada opção (1=bloqueante, 2=moderada, 3=leve) e o que cada resposta revela sobre a crença
4. Reações contextuais para cada área por nível (baixo/médio/alto): o que dizer após a resposta
5. Perfil descritivo de cada área por nível (o diagnóstico daquela área)
6. Gatilhos de continuidade: frases que abrem a próxima pergunta
7. CTA: texto exato do botão e link da mentoria

REGRAS ABSOLUTAS:
- Faça UMA pergunta por vez
- Confirme cada área antes de avançar para a próxima
- Seja direto, profissional e encorajador
- Quando tiver TODAS as informações de TODAS as áreas mais o CTA, gere o JSON
- Para encerrar, escreva exatamente "ENTREVISTA_CONCLUIDA" em uma linha e na linha seguinte o JSON completo

FORMATO DO JSON:
{
  "metodo": { "nome": "", "descricao": "", "cta_texto": "", "cta_link": "" },
  "areas": [
    {
      "id": "slug-da-area",
      "nome": "Nome da Área",
      "perguntas": [
        {
          "texto": "Pergunta aqui (use [Nome] para personalizar)",
          "opcoes": [
            { "texto": "Opção A", "pontuacao": 1, "crenca_revelada": "descrição" },
            { "texto": "Opção B", "pontuacao": 2, "crenca_revelada": "descrição" },
            { "texto": "Opção C", "pontuacao": 2, "crenca_revelada": "descrição" },
            { "texto": "Opção D", "pontuacao": 3, "crenca_revelada": "descrição" }
          ],
          "reacoes": { "baixo": "[Nome], ...", "medio": "[Nome], ...", "alto": "[Nome], ..." },
          "gatilho_continuidade": "frase que abre a próxima pergunta"
        }
      ],
      "perfis": { "baixo": "diagnóstico nível baixo", "medio": "diagnóstico nível médio", "alto": "diagnóstico nível alto" }
    }
  ],
  "transicoes": {
    "frases_progresso": ["Entendendo seus padrões...", "Identificando suas raízes...", "Seu perfil está se formando...", "Análise concluída."],
    "pausa_acumulada": "Estou percebendo um padrão aqui. Vamos continuar."
  }
}`

function extrairJSON(texto) {
  try {
    const match = texto.match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

export default function ChatInterview({ onConcluido }) {
  const [mensagens, setMensagens] = useState([])
  const [input, setInput] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [chat, setChat] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    iniciarChat()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, carregando])

  async function iniciarChat() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      setMensagens([{ role: 'assistant', texto: '⚠️ Chave da API não configurada. Verifique as variáveis de ambiente.' }])
      return
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.5-flash',
    })

    // Passa o system prompt como primeira mensagem do histórico
    const sessao = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Entendido. Estou pronto para conduzir a entrevista estruturada e gerar o JSON do quiz. Pode começar.' }] },
      ],
    })
    setChat(sessao)
    setCarregando(true)

    try {
      const result = await sessao.sendMessage('Pode começar!')
      const texto = result.response.text()
      setMensagens([{ role: 'assistant', texto }])
    } catch (err) {
      console.error('Erro ao iniciar chat:', err)
      setMensagens([{ role: 'assistant', texto: `⚠️ Erro ao conectar com a IA: ${err?.message || 'verifique a chave da API e tente novamente.'}` }])
    } finally {
      setCarregando(false)
    }
  }

  async function enviar() {
    if (!input.trim() || carregando || !chat) return

    const textoUsuario = input.trim()
    setInput('')
    setMensagens(prev => [...prev, { role: 'user', texto: textoUsuario }])
    setCarregando(true)

    try {
      const result = await chat.sendMessage(textoUsuario)
      const resposta = result.response.text()

      setMensagens(prev => [...prev, { role: 'assistant', texto: resposta }])

      if (resposta.includes('ENTREVISTA_CONCLUIDA')) {
        const config = extrairJSON(resposta)
        if (config) {
          setTimeout(() => onConcluido(config), 1200)
        }
      }
    } catch (err) {
      console.error(err)
      setMensagens(prev => [...prev, { role: 'assistant', texto: 'Ocorreu um erro. Tente novamente.' }])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0D1B2A' }}>

      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20, color: '#C9A84C' }}>◈</span>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F4F8' }}>Entrevista com IA</p>
          <p style={{ fontSize: 11, color: 'rgba(240,244,248,0.4)' }}>Respondendo suas perguntas, o sistema monta o quiz automaticamente</p>
        </div>
      </div>

      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {mensagens.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? '#1E3A5F' : 'rgba(255,255,255,0.06)',
                border: msg.role === 'assistant' ? '1px solid rgba(201,168,76,0.15)' : 'none',
              }}>
                <p style={{ fontSize: 14, color: '#F0F4F8', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                  {msg.texto.includes('ENTREVISTA_CONCLUIDA')
                    ? '✅ Entrevista concluída! Preparando sua revisão...'
                    : msg.texto}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {carregando && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 6, alignItems: 'center', paddingLeft: 4 }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A84C' }}
              />
            ))}
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }}
          placeholder="Responda aqui... (Enter para enviar)"
          rows={2}
          style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px', color: '#F0F4F8', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'none' }}
          disabled={carregando}
        />
        <button
          onClick={enviar}
          disabled={carregando || !input.trim()}
          style={{ background: '#C9A84C', border: 'none', borderRadius: 12, padding: '0 18px', cursor: 'pointer', opacity: (carregando || !input.trim()) ? 0.4 : 1, transition: 'opacity 0.2s', flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}

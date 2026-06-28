import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../../contexts/QuizContext'

const LETRAS = ['A', 'B', 'C', 'D']

export default function QuestionScreen({ perguntas, areaId, areaNome, indiceArea, totalAreas, progresso, onResponder, onConcluir }) {
  const { userData } = useQuiz()
  const [indice, setIndice] = useState(0)
  const [selecionada, setSelecionada] = useState(null)
  const [textoLivre, setTextoLivre] = useState('')
  const [mostrarReacao, setMostrarReacao] = useState(false)
  const [animando, setAnimando] = useState(false)

  const pergunta = perguntas[indice]
  const pct = progresso.base + Math.round(((indice + (selecionada ? 1 : 0)) / perguntas.length) * progresso.passo)

  const FRASES = [
    'Entendendo seus padrões...',
    'Identificando suas raízes...',
    'Seu perfil está se formando...',
    'Quase lá...',
  ]
  const frase = FRASES[Math.min(Math.floor(pct / 25), FRASES.length - 1)]

  function getNivel(pontuacao) {
    if (pontuacao <= 1) return 'baixo'
    if (pontuacao === 2) return 'medio'
    return 'alto'
  }

  function handleSelecionar(opcao) {
    if (animando) return
    setSelecionada(opcao)
    setTimeout(() => setMostrarReacao(true), 250)
  }

  function handleProxima() {
    if (!selecionada || animando) return
    setAnimando(true)

    onResponder({
      area: areaId,
      areaNome,
      pergunta: pergunta.texto,
      opcao: selecionada.texto,
      pontuacao: selecionada.pontuacao,
      crenca: selecionada.crenca_revelada || '',
      textoLivre: textoLivre.trim(),
    })

    setTimeout(() => {
      setMostrarReacao(false)
      setSelecionada(null)
      setTextoLivre('')
      setAnimando(false)

      if (indice + 1 >= perguntas.length) {
        onConcluir()
      } else {
        setIndice(i => i + 1)
      }
    }, 500)
  }

  const reacaoTexto = selecionada
    ? (pergunta.reacoes?.[getNivel(selecionada.pontuacao)] || pergunta.gatilho_continuidade || '')
    : ''

  return (
    <div style={{ background: '#F5F3EE', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header dark com progress */}
      <div style={{ background: '#0D1B2A', padding: '1rem 1.5rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }}>
            <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #2D5A8E, #C9A84C)', width: `${pct}%`, transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontSize: 11, color: '#C9A84C', fontWeight: 500, minWidth: 28, textAlign: 'right' }}>{pct}%</span>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(240,244,248,0.55)' }}>{frase}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 20, padding: '4px 10px', marginTop: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C' }} />
          <span style={{ fontSize: 11, color: '#C9A84C' }}>{areaNome} · Pergunta {indice + 1} de {perguntas.length}</span>
        </div>
      </div>

      {/* Corpo */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={indice}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* Pergunta */}
            <p style={{ fontSize: 17, fontWeight: 500, color: '#1A2332', lineHeight: 1.5 }}>
              <span style={{ color: '#1E3A5F', fontWeight: 600 }}>{userData.nome}</span>
              {pergunta.texto.replace('[Nome]', '').replace(/^,?\s*/, ', ')}
            </p>

            {/* Opções */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pergunta.opcoes.map((opcao, i) => {
                const sel = selecionada === opcao
                return (
                  <button
                    key={i}
                    onClick={() => handleSelecionar(opcao)}
                    style={{
                      background: sel ? '#EBF3FF' : '#FFFFFF',
                      border: `1.5px solid ${sel ? '#1E3A5F' : '#E2E8F0'}`,
                      borderRadius: 12,
                      padding: '13px 15px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.18s',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ minWidth: 22, height: 22, borderRadius: 6, background: sel ? '#1E3A5F' : '#E8F0FE', color: sel ? '#fff' : '#1E3A5F', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {LETRAS[i]}
                    </div>
                    <span style={{ fontSize: 14, color: '#1A2332', lineHeight: 1.45 }}>{opcao.texto}</span>
                  </button>
                )
              })}
            </div>

            {/* Reação contextual */}
            <AnimatePresence>
              {mostrarReacao && reacaoTexto && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ background: '#fff', borderRadius: 12, borderLeft: '3px solid #C9A84C', padding: '14px 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                >
                  <p style={{ fontSize: 13, color: '#1A2332', lineHeight: 1.6 }}>
                    <span style={{ color: '#1E3A5F', fontWeight: 600 }}>{userData.nome}</span>
                    {reacaoTexto.replace('[Nome]', '').replace(/^,?\s*/, ', ')}
                  </p>
                  {pergunta.gatilho_continuidade && selecionada && (
                    <p style={{ fontSize: 12, color: 'rgba(26,35,50,0.5)', marginTop: 6 }}>
                      {pergunta.gatilho_continuidade}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Campo livre */}
            {selecionada && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <p style={{ fontSize: 12, color: 'rgba(26,35,50,0.5)', marginBottom: 6 }}>
                  Quer me contar com suas palavras? <span style={{ opacity: 0.6 }}>(opcional)</span>
                </p>
                <textarea
                  value={textoLivre}
                  onChange={e => setTextoLivre(e.target.value)}
                  rows={2}
                  placeholder="Descreva com suas palavras..."
                  style={{ width: '100%', background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '12px 14px', color: '#1A2332', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none' }}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botão avançar */}
        {selecionada && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleProxima}
            disabled={animando}
            style={{ width: '100%', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: animando ? 0.5 : 1, transition: 'opacity 0.2s' }}
          >
            {indice + 1 >= perguntas.length ? 'Concluir área' : 'Próxima pergunta'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.button>
        )}
      </div>
    </div>
  )
}

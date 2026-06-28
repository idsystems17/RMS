import { useState } from 'react'
import { motion } from 'framer-motion'
import { salvarQuiz } from '../../services/supabase'

function slugify(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function ReviewPanel({ config: configInicial }) {
  const [config, setConfig] = useState(configInicial)
  const [quizId, setQuizId] = useState(() => slugify(configInicial?.metodo?.nome || 'meu-quiz'))
  const [salvando, setSalvando] = useState(false)
  const [linkGerado, setLinkGerado] = useState('')
  const [erro, setErro] = useState('')

  function atualizarMetodo(campo, valor) {
    setConfig(prev => ({ ...prev, metodo: { ...prev.metodo, [campo]: valor } }))
  }

  async function publicar() {
    if (!quizId.trim()) { setErro('Defina um ID para o quiz.'); return }
    setSalvando(true)
    setErro('')
    try {
      await salvarQuiz(quizId.trim(), config)
      const link = `${window.location.origin}/quiz/${quizId.trim()}`
      setLinkGerado(link)
    } catch (err) {
      setErro('Erro ao salvar. Tente novamente.')
      console.error(err)
    } finally {
      setSalvando(false)
    }
  }

  if (linkGerado) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <span style={{ fontSize: 48, color: '#C9A84C', marginBottom: 24 }}>◈</span>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F0F4F8', textAlign: 'center', marginBottom: 8 }}>Quiz publicado!</h2>
        <p style={{ fontSize: 14, color: 'rgba(240,244,248,0.55)', marginBottom: 32, textAlign: 'center' }}>
          Compartilhe o link abaixo com seu público.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12, padding: '14px 20px', width: '100%', maxWidth: 360, marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#C9A84C', wordBreak: 'break-all', textAlign: 'center' }}>{linkGerado}</p>
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(linkGerado) }}
          style={{ background: '#C9A84C', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}
        >
          Copiar link
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: '100vh', background: '#0D1B2A', padding: '1.5rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <span style={{ fontSize: 20, color: '#C9A84C' }}>◈</span>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#F0F4F8' }}>Revisão do Quiz</p>
          <p style={{ fontSize: 11, color: 'rgba(240,244,248,0.4)' }}>Ajuste o que precisar antes de publicar</p>
        </div>
      </div>

      {/* Método */}
      <section style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem', marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Método</p>
        {['nome', 'descricao', 'cta_texto', 'cta_link'].map(campo => (
          <div key={campo} style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: 'rgba(240,244,248,0.4)', display: 'block', marginBottom: 4, textTransform: 'capitalize' }}>
              {campo.replace('_', ' ')}
            </label>
            <input
              value={config.metodo?.[campo] || ''}
              onChange={e => atualizarMetodo(campo, e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#F0F4F8', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
        ))}
      </section>

      {/* Áreas resumo */}
      <section style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem', marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Áreas ({config.areas?.length || 0})
        </p>
        {config.areas?.map((area, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < config.areas.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <span style={{ fontSize: 14, color: '#F0F4F8' }}>{area.nome}</span>
            <span style={{ fontSize: 11, color: 'rgba(240,244,248,0.4)' }}>{area.perguntas?.length || 0} perguntas</span>
          </div>
        ))}
      </section>

      {/* ID do quiz */}
      <section style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem', marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Link do quiz</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>
          <span style={{ fontSize: 12, color: 'rgba(240,244,248,0.35)', whiteSpace: 'nowrap' }}>/quiz/</span>
          <input
            value={quizId}
            onChange={e => setQuizId(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
            style={{ flex: 1, background: 'none', border: 'none', color: '#C9A84C', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
            placeholder="id-do-quiz"
          />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(240,244,248,0.3)', marginTop: 6 }}>
          Será o link compartilhado com o público. Use letras minúsculas e hífens.
        </p>
      </section>

      {erro && <p style={{ color: '#FC8181', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{erro}</p>}

      <button
        onClick={publicar}
        disabled={salvando}
        style={{ width: '100%', background: '#C9A84C', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.6 : 1, transition: 'opacity 0.2s' }}
      >
        {salvando ? 'Publicando...' : 'Publicar quiz →'}
      </button>
    </motion.div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuiz } from '../../contexts/QuizContext'

const AREAS = [
  { icon: '✦', nome: 'Prosperidade' },
  { icon: '◈', nome: 'Blindagem emocional' },
  { icon: '◎', nome: 'Performance de elite' },
  { icon: '⟡', nome: 'Superação de ciclos' },
]

export default function WelcomeScreen({ config, onStart }) {
  const { setUserData } = useQuiz()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')

  function handleStart() {
    if (!nome.trim() || !email.trim()) {
      setErro('Preencha seu nome e e-mail para continuar.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro('Digite um e-mail válido.')
      return
    }
    setUserData({ nome: nome.trim(), email: email.trim() })
    onStart()
  }

  const metodo = config?.metodo || { nome: 'Reprogramação Mental Subjetiva', descricao: 'Descubra os padrões que controlam seus resultados — e o que está bloqueando sua transformação.' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{ background: '#0D1B2A', minHeight: '100%', padding: '2rem 1.75rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Orb */}
      <div style={{ position: 'relative', width: 72, height: 72, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.07)' }} />
        <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.15)' }} />
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
      </div>

      {/* Eyebrow */}
      <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#C9A84C', marginBottom: 10, textAlign: 'center' }}>
        Diagnóstico de perfil
      </p>

      {/* Título */}
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#F0F4F8', textAlign: 'center', lineHeight: 1.3, marginBottom: 10 }}>
        {metodo.nome}
      </h1>
      <p style={{ fontSize: 14, color: 'rgba(240,244,248,0.55)', textAlign: 'center', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 280 }}>
        {metodo.descricao}
      </p>

      {/* Chips das áreas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', marginBottom: '1.5rem' }}>
        {AREAS.map((area, i) => (
          <div key={i} style={{ background: 'rgba(30,58,95,0.5)', border: '1px solid rgba(30,58,95,0.9)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{area.icon}</div>
            <div style={{ fontSize: 12, color: 'rgba(240,244,248,0.7)' }}>{area.nome}</div>
          </div>
        ))}
      </div>

      {/* Campos */}
      <input
        type="text"
        placeholder="Seu nome"
        value={nome}
        onChange={e => { setNome(e.target.value); setErro('') }}
        style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 16px', color: '#F0F4F8', fontSize: 15, fontFamily: 'inherit', outline: 'none', marginBottom: 10, transition: 'border-color 0.2s' }}
        onFocus={e => e.target.style.borderColor = '#C9A84C'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
      />
      <input
        type="email"
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={e => { setEmail(e.target.value); setErro('') }}
        onKeyDown={e => e.key === 'Enter' && handleStart()}
        style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 16px', color: '#F0F4F8', fontSize: 15, fontFamily: 'inherit', outline: 'none', marginBottom: 4, transition: 'border-color 0.2s' }}
        onFocus={e => e.target.style.borderColor = '#C9A84C'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
      />

      {erro && <p style={{ color: '#FC8181', fontSize: 13, textAlign: 'center', marginBottom: 8 }}>{erro}</p>}

      <button
        onClick={handleStart}
        style={{ width: '100%', background: '#C9A84C', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', marginTop: 14, letterSpacing: 0.2, transition: 'opacity 0.2s' }}
        onMouseOver={e => e.target.style.opacity = '0.88'}
        onMouseOut={e => e.target.style.opacity = '1'}
      >
        Iniciar diagnóstico
      </button>

      <p style={{ fontSize: 11, color: 'rgba(240,244,248,0.3)', textAlign: 'center', marginTop: 14 }}>
        Seus dados estão protegidos · Sem spam
      </p>
    </motion.div>
  )
}

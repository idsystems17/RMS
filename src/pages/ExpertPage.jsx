import { useState } from 'react'
import { motion } from 'framer-motion'
import ChatInterview from '../components/expert/ChatInterview'
import ReviewPanel from '../components/expert/ReviewPanel'

const ETAPA = { LOGIN: 'login', ENTREVISTA: 'entrevista', REVISAO: 'revisao' }

export default function ExpertPage() {
  const [etapa, setEtapa] = useState(ETAPA.LOGIN)
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [configGerada, setConfigGerada] = useState(null)

  const SENHA = import.meta.env.VITE_EXPERT_PASSWORD || 'rms2025'

  function handleLogin(e) {
    e.preventDefault()
    if (senha === SENHA) {
      setEtapa(ETAPA.ENTREVISTA)
    } else {
      setErro('Senha incorreta.')
      setSenha('')
    }
  }

  function handleEntrevistaConcluida(config) {
    setConfigGerada(config)
    setEtapa(ETAPA.REVISAO)
  }

  if (etapa === ETAPA.ENTREVISTA) {
    return <ChatInterview onConcluido={handleEntrevistaConcluida} />
  }

  if (etapa === ETAPA.REVISAO) {
    return <ReviewPanel config={configGerada} />
  }

  // Login
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0D1B2A', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 320 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: 40, color: '#C9A84C' }}>◈</span>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#F0F4F8', marginTop: 16, marginBottom: 6 }}>Painel do Expert</h1>
          <p style={{ fontSize: 13, color: 'rgba(240,244,248,0.4)' }}>A IA vai estruturar seu método passo a passo</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            placeholder="Senha de acesso"
            value={senha}
            onChange={e => { setSenha(e.target.value); setErro('') }}
            style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 16px', color: '#F0F4F8', fontSize: 15, fontFamily: 'inherit', outline: 'none' }}
            autoFocus
          />
          {erro && <p style={{ color: '#FC8181', fontSize: 13, textAlign: 'center' }}>{erro}</p>}
          <button
            type="submit"
            style={{ width: '100%', background: '#C9A84C', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  )
}

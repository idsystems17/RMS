import { useState } from 'react'
import { motion } from 'framer-motion'
import ChatInterview from '../components/expert/ChatInterview'
import ReviewPanel from '../components/expert/ReviewPanel'
import LeadsPanel from '../components/expert/LeadsPanel'

const ETAPA = { LOGIN: 'login', PAINEL: 'painel', REVISAO: 'revisao' }
const ABA = { ENTREVISTA: 'entrevista', LEADS: 'leads' }

export default function ExpertPage() {
  const [etapa, setEtapa] = useState(ETAPA.LOGIN)
  const [aba, setAba] = useState(ABA.ENTREVISTA)
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [configGerada, setConfigGerada] = useState(null)

  const SENHA = import.meta.env.VITE_EXPERT_PASSWORD || 'rms2025'

  function handleLogin(e) {
    e.preventDefault()
    if (senha === SENHA) {
      setEtapa(ETAPA.PAINEL)
    } else {
      setErro('Senha incorreta.')
      setSenha('')
    }
  }

  function handleEntrevistaConcluida(config) {
    setConfigGerada(config)
    setEtapa(ETAPA.REVISAO)
  }

  // Tela de revisão após entrevista
  if (etapa === ETAPA.REVISAO) {
    return <ReviewPanel config={configGerada} />
  }

  // Login
  if (etapa === ETAPA.LOGIN) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0D1B2A', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 320 }}>
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
            <button type="submit" style={{ width: '100%', background: '#C9A84C', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Painel principal com abas
  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', flexDirection: 'column' }}>

      {/* Header com abas */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding: '1rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
          <span style={{ fontSize: 18, color: '#C9A84C', marginRight: 6 }}>◈</span>
          {[
            { id: ABA.ENTREVISTA, label: 'Montar quiz' },
            { id: ABA.LEADS, label: 'Leads' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAba(tab.id)}
              style={{
                background: 'none', border: 'none', padding: '8px 16px',
                fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                color: aba === tab.id ? '#F0F4F8' : 'rgba(240,244,248,0.4)',
                fontWeight: aba === tab.id ? 600 : 400,
                borderBottom: aba === tab.id ? '2px solid #C9A84C' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {aba === ABA.ENTREVISTA && (
          <ChatInterview onConcluido={handleEntrevistaConcluida} />
        )}
        {aba === ABA.LEADS && (
          <LeadsPanel />
        )}
      </div>
    </div>
  )
}

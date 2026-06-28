import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuiz } from '../../contexts/QuizContext'

const ETAPAS = [
  'Analisando seus padrões...',
  'Identificando crenças subjacentes...',
  'Mapeando suas 4 áreas...',
  'Construindo seu diagnóstico...',
  'Finalizando seu perfil RMS...',
]

const AREAS_DISPLAY = [
  { id: 'prosperidade', label: 'Prosperidade' },
  { id: 'blindagem', label: 'Blindagem emoc.' },
  { id: 'performance', label: 'Performance elite' },
  { id: 'superacao', label: 'Superação ciclos' },
]

export default function ProcessingScreen({ onConcluido }) {
  const { userData, scores } = useQuiz()
  const [etapa, setEtapa] = useState(0)
  const [barras, setBarras] = useState({ prosperidade: 0, blindagem: 0, performance: 0, superacao: 0 })

  useEffect(() => {
    const intervalo = setInterval(() => {
      setEtapa(e => Math.min(e + 1, ETAPAS.length - 1))
      setBarras(prev => {
        const novo = {}
        AREAS_DISPLAY.forEach(a => {
          const alvo = scores[a.id] || Math.floor(Math.random() * 60 + 25)
          novo[a.id] = Math.min((prev[a.id] || 0) + 18, alvo)
        })
        return novo
      })
    }, 900)

    const timer = setTimeout(() => {
      clearInterval(intervalo)
      onConcluido()
    }, ETAPAS.length * 900 + 600)

    return () => { clearInterval(intervalo); clearTimeout(timer) }
  }, [])

  return (
    <div style={{ background: '#0D1B2A', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.75rem' }}>

      {/* Anéis */}
      <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
            style={{ position: 'absolute', inset: -i * 14, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.25)' }}
          />
        ))}
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
          </svg>
        </div>
      </div>

      <p style={{ fontSize: 20, fontWeight: 600, color: '#F0F4F8', textAlign: 'center', marginBottom: 8 }}>
        Analisando seu perfil
      </p>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '0.75rem 0' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2 }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C' }}
          />
        ))}
      </div>

      <motion.p
        key={etapa}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 14, color: 'rgba(240,244,248,0.55)', textAlign: 'center', lineHeight: 1.65, maxWidth: 260, margin: '0 auto 1.75rem' }}
      >
        {ETAPAS[etapa]}
      </motion.p>

      {/* Barras das áreas */}
      <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 16 }}>
        {AREAS_DISPLAY.map(area => (
          <div key={area.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, lastChild: { marginBottom: 0 } }}>
            <span style={{ fontSize: 11, color: 'rgba(240,244,248,0.5)', minWidth: 100 }}>{area.label}</span>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
              <motion.div
                animate={{ width: `${barras[area.id] || 0}%` }}
                transition={{ duration: 0.7 }}
                style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #2D5A8E, #C9A84C)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

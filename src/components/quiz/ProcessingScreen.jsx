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

export default function ProcessingScreen({ onConcluido }) {
  const { userData } = useQuiz()
  const [etapa, setEtapa] = useState(0)
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setEtapa(e => {
        if (e < ETAPAS.length - 1) return e + 1
        clearInterval(intervalo)
        return e
      })
      setProgresso(p => Math.min(p + 20, 100))
    }, 900)

    // Aguarda animação antes de chamar IA
    const timer = setTimeout(() => {
      onConcluido()
    }, ETAPAS.length * 900 + 500)

    return () => {
      clearInterval(intervalo)
      clearTimeout(timer)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 max-w-md mx-auto"
    >
      {/* Anel pulsante */}
      <div className="relative w-24 h-24 mb-10">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full border-2 border-[#C9A84C]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
          className="absolute inset-0 rounded-full border border-[#C9A84C]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl text-[#C9A84C]">◈</span>
        </div>
      </div>

      <h2 className="text-[#F0F4F8] text-xl font-semibold text-center mb-3">
        {userData.nome}, estamos construindo<br />seu perfil RMS
      </h2>

      <motion.p
        key={etapa}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[#8BA4C0] text-sm text-center mb-10"
      >
        {ETAPAS[etapa]}
      </motion.p>

      {/* Barra de progresso */}
      <div className="w-full max-w-xs h-1 bg-[#1E3A5F] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #1E3A5F, #C9A84C)' }}
          animate={{ width: `${progresso}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </motion.div>
  )
}

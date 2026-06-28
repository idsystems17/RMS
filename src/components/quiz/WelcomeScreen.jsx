import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuiz } from '../../contexts/QuizContext'
import Button from '../ui/Button'

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

  const metodo = config?.metodo || { nome: 'RMS', descricao: 'Diagnóstico de Reprogramação Mental Subjetiva' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12 max-w-md mx-auto"
    >
      {/* Logo/Símbolo */}
      <div className="w-16 h-16 rounded-full bg-[#1E3A5F] flex items-center justify-center mb-8 shadow-lg">
        <span className="text-2xl text-[#C9A84C]">◈</span>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-[#F0F4F8] text-center mb-3 leading-tight">
        {metodo.nome}
      </h1>
      <p className="text-[#8BA4C0] text-center text-base mb-10 leading-relaxed">
        {metodo.descricao}
      </p>

      {/* Formulário */}
      <div className="w-full space-y-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={e => { setNome(e.target.value); setErro('') }}
            className="w-full bg-[#112238] border border-[#1E3A5F] rounded-xl px-5 py-4 text-[#F0F4F8] placeholder-[#4A6A8A] focus:outline-none focus:border-[#C9A84C] transition-colors text-base"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={e => { setEmail(e.target.value); setErro('') }}
            className="w-full bg-[#112238] border border-[#1E3A5F] rounded-xl px-5 py-4 text-[#F0F4F8] placeholder-[#4A6A8A] focus:outline-none focus:border-[#C9A84C] transition-colors text-base"
            onKeyDown={e => e.key === 'Enter' && handleStart()}
          />
        </div>
        {erro && (
          <p className="text-red-400 text-sm text-center">{erro}</p>
        )}
      </div>

      <Button onClick={handleStart}>
        Iniciar diagnóstico →
      </Button>

      <p className="text-[#4A6A8A] text-xs text-center mt-6">
        Seus dados são usados apenas para personalizar seu resultado.
      </p>
    </motion.div>
  )
}

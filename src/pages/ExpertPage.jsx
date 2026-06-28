import { useState } from 'react'
import { motion } from 'framer-motion'

// Placeholder — módulo expert será construído na próxima fase
export default function ExpertPage() {
  const [senha, setSenha] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [erro, setErro] = useState('')

  // Senha provisória para MVP — será configurável via env
  const SENHA_MVP = import.meta.env.VITE_EXPERT_PASSWORD || 'rms2025'

  function handleLogin(e) {
    e.preventDefault()
    if (senha === SENHA_MVP) {
      setAutenticado(true)
    } else {
      setErro('Senha incorreta.')
      setSenha('')
    }
  }

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1B2A] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <span className="text-4xl text-[#C9A84C]">◈</span>
            <h1 className="text-xl font-bold text-[#F0F4F8] mt-4">Painel do Expert</h1>
            <p className="text-[#8BA4C0] text-sm mt-2">Acesso restrito</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErro('') }}
              className="w-full bg-[#112238] border border-[#1E3A5F] rounded-xl px-5 py-4 text-[#F0F4F8] placeholder-[#4A6A8A] focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
            {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}
            <button
              type="submit"
              className="w-full py-4 bg-[#C9A84C] text-[#0D1B2A] rounded-xl font-semibold hover:brightness-110 transition-all cursor-pointer"
            >
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1B2A] px-6">
      <div className="text-center">
        <span className="text-4xl text-[#C9A84C]">◈</span>
        <h1 className="text-xl font-bold text-[#F0F4F8] mt-4">Painel do Expert</h1>
        <p className="text-[#8BA4C0] text-sm mt-2">Em construção — próxima fase</p>
      </div>
    </div>
  )
}

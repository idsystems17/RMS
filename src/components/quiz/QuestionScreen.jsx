import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../../contexts/QuizContext'
import ProgressBar from '../ui/ProgressBar'

const OPCOES_LETRA = ['A', 'B', 'C', 'D']

export default function QuestionScreen({ perguntas, areaId, areaNome, progresso, onResponder, onConcluir }) {
  const { userData } = useQuiz()
  const [indice, setIndice] = useState(0)
  const [selecionada, setSelecionada] = useState(null)
  const [textoLivre, setTextoLivre] = useState('')
  const [mostrarReacao, setMostrarReacao] = useState(false)
  const [reacaoTexto, setReacaoTexto] = useState('')
  const [animando, setAnimando] = useState(false)

  const pergunta = perguntas[indice]
  const progressoAtual = progresso.base + Math.round((indice / perguntas.length) * progresso.passo)

  function getNivelResposta(pontuacao) {
    if (pontuacao <= 1) return 'baixo'
    if (pontuacao === 2) return 'medio'
    return 'alto'
  }

  function handleSelecionar(opcao) {
    if (animando) return
    setSelecionada(opcao)

    const nivel = getNivelResposta(opcao.pontuacao)
    const reacao = pergunta.reacoes?.[nivel] || pergunta.gatilho_continuidade || ''
    setReacaoTexto(reacao)

    setTimeout(() => setMostrarReacao(true), 300)
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
      crenca: selecionada.crenca_revelada,
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
    }, 600)
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      <ProgressBar progresso={progressoAtual} nome={userData.nome} />

      <div className="flex-1 flex flex-col px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={indice}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col"
          >
            {/* Área */}
            <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-6">
              {areaNome}
            </span>

            {/* Pergunta */}
            <h2 className="text-[#F0F4F8] text-xl font-semibold leading-relaxed mb-8">
              {pergunta.texto.replace('[Nome]', userData.nome)}
            </h2>

            {/* Opções */}
            <div className="space-y-3 mb-6">
              {pergunta.opcoes.map((opcao, i) => (
                <button
                  key={i}
                  onClick={() => handleSelecionar(opcao)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm leading-relaxed cursor-pointer
                    ${selecionada === opcao
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#F0F4F8]'
                      : 'border-[#1E3A5F] bg-[#112238] text-[#8BA4C0] hover:border-[#2A4F7A] hover:text-[#F0F4F8]'
                    }`}
                >
                  <span className="font-bold text-[#C9A84C] mr-3">{OPCOES_LETRA[i]})</span>
                  {opcao.texto}
                </button>
              ))}
            </div>

            {/* Campo livre */}
            {selecionada && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <textarea
                  placeholder="💬 Quer me contar com suas palavras? (opcional)"
                  value={textoLivre}
                  onChange={e => setTextoLivre(e.target.value)}
                  rows={2}
                  className="w-full bg-[#112238] border border-[#1E3A5F] rounded-xl px-4 py-3 text-[#F0F4F8] placeholder-[#4A6A8A] focus:outline-none focus:border-[#2A4F7A] text-sm resize-none transition-colors"
                />
              </motion.div>
            )}

            {/* Reação contextual */}
            <AnimatePresence>
              {mostrarReacao && reacaoTexto && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#1E3A5F] rounded-xl px-5 py-4 mb-6"
                >
                  <p className="text-[#8BA4C0] text-sm leading-relaxed italic">
                    {reacaoTexto.replace('[Nome]', userData.nome)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Botão avançar */}
        {selecionada && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleProxima}
            disabled={animando}
            className="w-full py-4 bg-[#C9A84C] text-[#0D1B2A] rounded-xl font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            {indice + 1 >= perguntas.length ? 'Concluir área →' : 'Próxima pergunta →'}
          </motion.button>
        )}
      </div>
    </div>
  )
}
